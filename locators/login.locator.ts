import { Page } from '@playwright/test';

// Locators only: Login page.
export const loginLocator = {
  // ===== Header =====
  lbl_loginTitle:           (page: Page) => page.locator('#login-title'),
  lbl_loginSubtitle:        (page: Page) => page.locator('#login-subtitle'),
};
