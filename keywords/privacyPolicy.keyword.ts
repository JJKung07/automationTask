import { Page, expect } from '@playwright/test';
import { locator } from '../fixtures/fixture';

// Keywords: Privacy Policy page (new tab). Opening it is a Register page action (clickPrivacyPolicy).
export class PrivacyPolicyKeyword {
  constructor(private page: Page) {}

  // the policy page opens as the newest tab of this browser context
  private get tab(): Page {
    return this.page.context().pages().at(-1)!;
  }

  // ===== Actions =====
  async closePrivacyPolicyPage() {
    await this.tab.close();
  }

  // ===== Verifications =====
  async verifyPrivacyPolicyHeader() {
    await expect(locator.lbl_privacyPolicyHeader(this.tab)).toContainText('นโยบายความเป็นส่วนตัว และ คุ้มครองข้อมูลส่วนบุคคล');
  }
}
