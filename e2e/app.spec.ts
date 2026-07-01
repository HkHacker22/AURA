import { test, expect } from '@playwright/test';

test.describe('AURA Application', () => {

  test('Dashboard - renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(errors.length).toBe(0);
    // Greeting is time-of-day dynamic: morning / afternoon / evening
    const greetingHeading = page.locator('h2').filter({ hasText: /Good (morning|afternoon|evening)/ });
    await expect(greetingHeading).toBeVisible();
    await expect(page.getByText('Your Agents')).toBeVisible();
  });

  test('Brain Dump - renders and has input', async ({ page }) => {
    await page.goto('/brain-dump');
    await page.waitForLoadState('networkidle');

    await expect(page.getByPlaceholder('Type or speak...')).toBeVisible();
  });

  test('Save Me - renders emergency button', async ({ page }) => {
    await page.goto('/save-me');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: 'SAVE ME', exact: true })).toBeVisible();
  });

  test('Schedule - renders schedule items', async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Schedule' })).toBeVisible();
  });

  test('Focus Session - renders timer', async ({ page }) => {
    await page.goto('/focus-session');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Focus Session' })).toBeVisible();
    await expect(page.getByText('25:00')).toBeVisible();
  });

  test('Onboarding - renders welcome', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Welcome to AURA' })).toBeVisible();
  });

  test('No horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const pageWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test('No horizontal overflow on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const pageWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test('No horizontal overflow on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const pageWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 10);
  });

  test('All critical pages render without crashing', async ({ page }) => {
    const criticalPages = ['/', '/dashboard', '/brain-dump', '/tasks', '/schedule', '/save-me', '/focus-session'];

    for (const path of criticalPages) {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      const nonFaviconErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
      expect(nonFaviconErrors).toEqual([]);
    }
  });
});