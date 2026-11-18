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
    await expect(page.getByRole('heading', { name: 'Leave a comment' })).toBeVisible();
    await expect(page.locator('#contact a[href="https://github.com/Jokitugasbykay"]')).toBeVisible();
    const canvas = page.locator('canvas[aria-label*="lanyard"]');
    await expect(canvas).toBeVisible();
    expect(await canvas.evaluate((e: HTMLCanvasElement) => !!e.getContext('webgl2'))).toBe(true);
    const box = (await canvas.boundingBox())!;
    const cardX = isMobile ? box.x + box.width * 0.5 : box.x + box.width * 0.73;
    const cardY = isMobile ? box.y + box.height * 0.65 : box.y + box.height * 0.55;
    await page.mouse.dblclick(cardX, cardY);
    await page.waitForTimeout(300);
    await page.mouse.move(cardX, cardY);
    await page.mouse.down();
    await page.mouse.move(cardX - 120, cardY - 20, { steps: 5 });
    await page.mouse.up();
    if (isMobile) {
        await canvas.scrollIntoViewIfNeeded();
        const b = (await canvas.boundingBox())!;
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.width / 2, y: b.y + b.height * 0.65 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: b.x + b.width / 2 + 30, y: b.y + b.height * 0.65 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await cdp.detach();
        await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
        await page.getByRole('link', { name: 'Contact', exact: true }).first().click();
    }
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
test('fallback remains usable', async ({ page }) => {
    await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
            if (type.includes('webgl'))
                return null;
            return Reflect.apply(original, this, [type, ...args]);
        } as typeof original;
    });
    await page.goto('/');
    const fallback = page.locator('canvas[aria-label="Interactive physics lanyard for Kayla Gabrielle"]');
    await expect(fallback).toBeVisible();
    await fallback.scrollIntoViewIfNeeded();
    const box = (await fallback.boundingBox())!;
    await page.mouse.move(box.x + 4, box.y + 4);
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height * 0.5);
    await page.waitForTimeout(300);
});

test('capture dynamic physics interaction states', async ({ page, isMobile }) => {
    await page.goto('/');
    const canvas = page.locator('canvas[aria-label*="lanyard"]');
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(600);

    const box = (await canvas.boundingBox())!;
    const cardX = isMobile ? box.x + box.width * 0.5 : box.x + box.width * 0.73;
    const cardY = isMobile ? box.y + box.height * 0.65 : box.y + box.height * 0.55;
    const startX = cardX + 35;
    const startY = cardY + 20;

    const w = page.viewportSize()?.width || 1440;
    const dragDist = isMobile ? 140 : 560;

    // 1. Off-center drag producing torque and dynamic tilt towards the text
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - dragDist, startY - 25, { steps: 15 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `review/lanyard-dragged-torque-${w}.png` });
    await page.screenshot({ path: 'review/lanyard-dragged-torque.png' });

    // Release pointer to allow natural pendulum oscillation
    await page.mouse.up();
    await page.waitForTimeout(700);

    // 2. Flip badge to reverse side by double-clicking
    await page.mouse.dblclick(cardX, cardY);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `review/lanyard-flipped-back-${w}.png` });
    await page.screenshot({ path: 'review/lanyard-flipped-back.png' });
});

test('hero rotates its typing text', async ({ page }) => {
    await page.goto('/');
    const text = page.locator('[aria-label="Curious about physics, AI, and building software."]');
    await expect(text).toBeVisible();
    await expect(text).toContainText('Curious about how the universe works.');
    await expect(text).toContainText('Exploring physics, one question at a time.', { timeout: 12000 });
});

test('scroll reveals cards and respects reduced motion', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#education article').first();
    await expect(card).toHaveCSS('opacity', '0.25');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(card).toHaveCSS('opacity', '1');
});

test('navigation tracks the section in view', async ({ page }) => {
    await page.goto('/');
    const compact = (page.viewportSize()?.width ?? 1440) <= 960;
    if (compact) await page.getByRole('button', { name: /menu/i }).click();
    const nav = compact ? page.locator('header') : page.getByRole('navigation', { name: 'Main Navigation' });
    const home = nav.getByRole('link', { name: 'Home', exact: true }).last();
    await expect(home).toHaveAttribute('aria-current', 'location');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(nav.getByRole('link', { name: 'Contact', exact: true }).last()).toHaveAttribute('aria-current', 'location');
});

test('contact form sends the expected fields to the configured endpoint', async ({ page }) => {
    let posted = '';
    await page.route('https://formsubmit.co/kaylafisika24@gmail.com', async route => {
        posted = route.request().postData() || '';
        await route.fulfill({ status: 200, contentType: 'text/html', body: 'Test received' });
    });
    await page.goto('/');
    await page.locator('#contact-name').fill('Test Visitor');
    await page.locator('#contact-email').fill('visitor@example.com');
    await page.locator('#contact-message').fill('Hello Kayla');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Test received')).toBeVisible();
    expect(new URLSearchParams(posted).get('message')).toBe('Hello Kayla');
    expect(new URLSearchParams(posted).get('email')).toBe('visitor@example.com');
});


test('guestbook sends and displays a visitor comment', async ({ page }) => {
    let submitted = false;
    await page.route('https://aelagbiyhsblqjxittlw.supabase.co/rest/v1/**', async route => {
        if (route.request().url().includes('/rpc/')) {
            const data = route.request().postDataJSON();
            expect(data.p_author).toBe('Visitor');
            expect(data.p_message).toBe('Hello Kayla');
            submitted = true;
            await route.fulfill({ status: 204 });
        } else {
            await route.fulfill({ json: submitted ? [{ id: '1', author: 'Visitor', message: 'Hello Kayla', avatar: null, created_at: '2026-11-17T00:00:00Z' }] : [] });
        }
    });
    await page.goto('/');
    await page.locator('#comment-name').fill('Visitor');
    await page.getByLabel('Comment', { exact: true }).fill('Hello Kayla');
    await page.getByRole('button', { name: 'Send comment' }).click();
    await expect(page.getByText('Comment sent.')).toBeVisible();
    await expect(page.getByText('Hello Kayla')).toBeVisible();
});

test('header scrolls without changing the home URL', async ({ page, viewport }) => {
    await page.goto('/home/');
    await expect(page).toHaveURL(/\/home$/);
    await expect(page.locator('h1')).toContainText('Kayla Gabrielle');
    const initial = page.url();
    const compact = viewport!.width <= 960;
    if (compact) await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
    const link = compact ? page.locator('header').getByRole('link', { name: 'About', exact: true }) : page.getByRole('navigation', { name: 'Main Navigation' }).getByRole('link', { name: 'About' });
    await link.click();
    await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('#about')!.getBoundingClientRect().top))).toBeLessThan(180);
    expect(page.url()).toBe(initial);
    await page.reload();
    await expect(page).toHaveURL(/\/home$/);
    await expect(page.locator('h1')).toContainText('Kayla Gabrielle');
});

test('JOKI.IN case study switches experiences and restores focus', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('[data-project="jokiin"]');
    const trigger = card.getByRole('button', { name: /explore case study/i });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: /one ecosystem/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /digital store/i }).click();
    await expect(dialog.getByText(/redirects to sign-in/i)).toBeVisible();
    await expect(dialog.getByRole('button', { name: /digital store/i })).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
});
