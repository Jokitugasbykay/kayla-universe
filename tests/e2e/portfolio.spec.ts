import { test, expect } from '@playwright/test';

test.describe('Kayla Universe Portfolio E2E & Visual Verification', () => {
  test('loads home page, hero, authentic identity, and 3D lanyard', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // 1. Verify title and brand
    await expect(page).toHaveTitle(/Kayla Gabrielle/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Kayla');
    await expect(heroTitle).toContainText('Gabrielle');

    // 2. Verify Foto 1 is loaded in Hero and About
    const heroThumb = page.locator('img[alt*="Portrait of Kayla Gabrielle"]').first();
    await expect(heroThumb).toBeVisible();

    const aboutPortrait = page.locator('img[alt*="Foto 1"]').first();
    await expect(aboutPortrait).toBeVisible();

    // 3. Verify 3D / Canvas Lanyard is rendered
    const lanyardCanvas = page.locator('canvas[aria-label*="lanyard"]').first();
    await expect(lanyardCanvas).toBeVisible();

    // 4. Test Lanyard Interaction Buttons
    const flipButton = page.locator('button[aria-label="Flip lanyard badge"]');
    await expect(flipButton).toBeVisible();
    await flipButton.click();
    await page.waitForTimeout(300);

    const nudgeButton = page.locator('button[aria-label="Nudge physical card"]');
    await expect(nudgeButton).toBeVisible();
    await nudgeButton.click();
    await page.waitForTimeout(300);

    // 5. Verify Navigation Links
    const aboutLink = page.locator('nav a[href="#about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForTimeout(400);
    }

    // 6. Verify Chapters and Content Exist
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#education')).toBeVisible();
    await expect(page.locator('#projects')).toBeVisible();
    await expect(page.locator('#research')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();

    // 7. Verify Projects: JOKI.IN & Kayla Finance
    await expect(page.locator('text=JOKI.IN').first()).toBeVisible();
    await expect(page.locator('text=Kayla Finance').first()).toBeVisible();

    // 8. Verify Quantum Simulator Canvas
    const simCanvas = page.locator('canvas[aria-label*="Quantum wave packet"]');
    await expect(simCanvas).toBeVisible();

    // 9. Verify absence of em dash and en dash in page text
    const pageText = await page.innerText('body');
    const hasEmDash = pageText.includes('\u2014');
    const hasEnDash = pageText.includes('\u2013');
    expect(hasEmDash, 'Public-facing text must not contain em dash').toBe(false);
    expect(hasEnDash, 'Public-facing text must not contain en dash').toBe(false);

    // 10. Check horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow, 'Page should not have unwanted horizontal scroll overflow').toBe(false);

    // Filter ignorable console warnings or WebGL canvas info
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('WebGL') &&
        !err.includes('THREE.WebGLRenderer')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('captures full-page and hero screenshots across viewports', async ({ page, viewport }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);

    const width = viewport?.width || 1440;
    const screenshotPath = `test-results/kayla-universe-${width}px.png`;

    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    testInfo.annotations.push({
      type: 'screenshot',
      description: `Screenshot captured at ${width}px: ${screenshotPath}`
    });
  });
});
