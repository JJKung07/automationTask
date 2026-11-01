import { Page } from '@playwright/test';

// Locators only: Privacy Policy page (opens in a new tab from the Register page).
export const privacyPolicyLocator = {
  // ===== Header =====
  lbl_privacyPolicyHeader: (page: Page) => page.locator('h2'),
};
