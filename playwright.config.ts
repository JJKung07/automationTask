import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'https://portal.uat.gofive.co.th/Register/empeo',
    headless: !!process.env.CI, // show the browser locally; CI has no display
    actionTimeout: 15000, // a stuck click fails in 15s with its line instead of hanging until the test timeout
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
