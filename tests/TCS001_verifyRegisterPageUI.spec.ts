import { test } from '@playwright/test';
import { TestFixtures } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  let fixture: TestFixtures;

  test.beforeEach(async ({ page }) => {
    fixture = new TestFixtures(page);
  });

  test('TCS001 - ตรวจสอบการแสดงผล UI หน้าสมัคร (ภาษาไทย)', async () => {
    // ===== Open page & verify UI =====
    await fixture.registerKeyword.openRegisterPage();
    await fixture.registerKeyword.verifyHeaderSection();
    await fixture.registerKeyword.verifyRegisterForm();

    // ===== Coupon =====
    await fixture.registerKeyword.clickUseCoupon();
    await fixture.registerKeyword.verifyCouponInputDisplayed();

    // ===== Switch company type =====
    await fixture.registerKeyword.selectCompanyOthers();
    await fixture.registerKeyword.verifyCompanyNameFieldDisplayed();
    await fixture.registerKeyword.selectCompanyThai();
    await fixture.registerKeyword.verifyTaxIdFieldDisplayed();

    // ===== Privacy Policy (new tab) =====
    await fixture.registerKeyword.clickPrivacyPolicy();
    await fixture.privacyPolicyKeyword.verifyPrivacyPolicyHeader();
    await fixture.privacyPolicyKeyword.closePrivacyPolicyPage();

    // ===== Terms and Conditions (new tab) =====
    await fixture.registerKeyword.clickTermAndCondition();
    await fixture.termsAndConditionsKeyword.verifyTermAndConditionHeader();
    await fixture.termsAndConditionsKeyword.closeTermAndConditionPage();

    // ===== Bottom section =====
    await fixture.registerKeyword.scrollToBottom();
    await fixture.registerKeyword.verifyBottomSection();
  });
});
