import { Page, expect } from '@playwright/test';
import { locator } from '../fixtures/fixture';

// Keywords: Login page. Never call page.locator / getBy* here — add it to locators/ instead.
export class LoginKeyword {
  constructor(private page: Page) {}

  // ===== Verifications =====
  async verifyLoginPage() {
    await expect(locator.lbl_loginTitle(this.page)).toContainText('Welcome!');
    await expect(locator.lbl_loginSubtitle(this.page)).toContainText('Sign in to your account');
  }
}
