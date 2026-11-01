import { Page, expect } from '@playwright/test';
import { locator } from '../fixtures/fixture';

// Keywords: Terms and Conditions page (new tab). Opening it is a Register page action (clickTermAndCondition).
export class TermsAndConditionsKeyword {
  constructor(private page: Page) {}

  // the terms page opens as the newest tab of this browser context
  private get tab(): Page {
    return this.page.context().pages().at(-1)!;
  }

  // ===== Actions =====
  async closeTermAndConditionPage() {
    await this.tab.close();
  }

  // ===== Verifications =====
  async verifyTermAndConditionHeader() {
    await expect(locator.lbl_termAndConditionHeader(this.tab)).toContainText('ข้อตกลงและเงื่อนไขทั่วไปในการใช้บริการผลิตภัณฑ์และบริการ');
  }
}
