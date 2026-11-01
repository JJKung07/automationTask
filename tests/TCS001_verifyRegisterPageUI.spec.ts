import { test, testData } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  test('TCS001 - ตรวจสอบการแสดงผล UI หน้าสมัคร (ภาษาไทย)', async ({ registerKeyword, privacyPolicyKeyword, termsAndConditionsKeyword }) => {
    // ===== Open page & verify UI =====
    await registerKeyword.openRegisterPage();
    await registerKeyword.verifyHeaderSection();
    await registerKeyword.verifyRegisterForm();

    // ===== Coupon =====
    await registerKeyword.clickUseCoupon();
    await registerKeyword.verifyCouponInputDisplayed();

    // ===== Switch company type =====
    await registerKeyword.selectCompanyOthers();
    await registerKeyword.verifyCompanyNameFieldDisplayed();
    await registerKeyword.selectCompanyThai();
    await registerKeyword.verifyTaxIdFieldDisplayed();

    // ===== Privacy Policy (new tab) =====
    await registerKeyword.clickPrivacyPolicy();
    await privacyPolicyKeyword.verifyPrivacyPolicyHeader();
    await privacyPolicyKeyword.closePrivacyPolicyPage();

    // ===== Terms and Conditions (new tab) =====
    await registerKeyword.clickTermAndCondition();
    await termsAndConditionsKeyword.verifyTermAndConditionHeader();
    await termsAndConditionsKeyword.closeTermAndConditionPage();

    // ===== Bottom section =====
    await registerKeyword.scrollToBottom();
    await registerKeyword.verifyBottomSection();
  });
});
