import { test, expect } from '@playwright/test';
test('safe public content, loaded assets and usable interactions', async ({ page, context, isMobile }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error')
        errors.push(m.text()); });
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Kayla Gabrielle');
    for (const img of await page.locator('img').all())
        expect(await img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/\bNIM\b|SECURE ID|STUDENT ID|Malaysian|citizen|researcher|[\u2013\u2014]/i);
    await expect(page.getByText('No local notes yet.')).toBeVisible();
    await expect(page.locator('#contact a[href="https://github.com/Jokitugasbykay"]')).toBeVisible();
    const canvas = page.locator('canvas[aria-label*="lanyard"]');
    await expect(canvas).toBeVisible();
    expect(await canvas.evaluate((e: HTMLCanvasElement) => !!e.getContext('webgl2'))).toBe(true);
    await page.getByRole('button', { name: 'Flip lanyard badge' }).click();
    await expect(page.getByRole('button', { name: 'Flip lanyard badge' })).toHaveText('Show Front');
    await page.getByRole('button', { name: 'Nudge physical card' }).click();
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .65, box.y + box.height * .4, { steps: 5 });
    await page.mouse.up();
    if (isMobile) {
        await canvas.scrollIntoViewIfNeeded();
        const b = (await canvas.boundingBox())!;
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height / 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: b.x + b.width / 2 + 30, y: b.y + b.height / 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await cdp.detach();
        await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
        await page.getByRole('link', { name: 'Contact', exact: true }).first().click();
    }
    await page.getByLabel('Your Name *').fill('Local test visitor');
    await page.getByLabel('Message *').fill('A browser-local note.');
    await page.getByRole('button', { name: 'Save locally' }).click();
    await expect(page.getByRole('status')).toHaveText('Saved on this browser only.');
    await page.reload();
    await expect(page.getByText('A browser-local note.')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
});
test('responsive visual review and reduced motion', async ({ page, viewport }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator('main section').all())
        await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `review/after-${viewport!.width}-hero.png` });
    await page.screenshot({ path: `review/after-${viewport!.width}-full.png`, fullPage: true });
    await testInfo.attach('Full page', { path: `review/after-${viewport!.width}-full.png`, contentType: 'image/png' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('fallback remains usable and storage failure is truthful', async ({ page }) => {
    await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
            if (type.includes('webgl'))
                return null;
            return Reflect.apply(original, this, [type, ...args]);
        } as typeof original;
        Storage.prototype.setItem = () => { throw new Error('Storage disabled for test'); };
    });
    await page.goto('/');
    const fallback = page.locator('canvas[aria-label="Interactive physics lanyard for Kayla Gabrielle"]');
    await expect(fallback).toBeVisible();
    const box = (await fallback.boundingBox())!;
    await page.mouse.move(box.x + 4, box.y + 4);
    await page.mouse.down();
    await expect(page.getByText('Holding card / Release to swing')).toHaveCount(0);
    await page.mouse.up();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.5);
    await page.mouse.down();
    await expect(page.getByText('Holding card / Release to swing')).toBeVisible();
    await page.mouse.up();
    await page.getByRole('button', { name: 'Flip lanyard badge' }).click();
    await expect(page.getByRole('button', { name: 'Flip lanyard badge' })).toHaveText('Show Front');
    await page.getByLabel('Your Name *').fill('Local visitor');
    await page.getByLabel('Message *').fill('Unsaved note');
    await page.getByRole('button', { name: 'Save locally' }).click();
    await expect(page.getByRole('status')).toContainText('Storage is unavailable');
});
