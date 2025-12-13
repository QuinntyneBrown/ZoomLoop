import { expect, test } from '@playwright/test';

test.describe('App launch', () => {
  test('loads home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ZoomLoopApp/i);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(/Hello,\s*ZoomLoop.App/i);
  });
});
