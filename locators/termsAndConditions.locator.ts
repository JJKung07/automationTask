import { Page } from '@playwright/test';

// Locators only: Terms and Conditions page (opens in a new tab from the Register page).
export const termsAndConditionsLocator = {
  // ===== Header =====
  lbl_termAndConditionHeader: (page: Page) => page.locator('h2'),
};
