import { test, testData } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  test('TCS002 - ตรวจสอบการแสดงผล UI หน้าสมัคร (ภาษาอังกฤษ)', async ({ registerKeyword, privacyPolicyKeyword, termsAndConditionsKeyword }) => {
    // ===== Open page, switch to English & verify UI =====
    await registerKeyword.openRegisterPage();
    await registerKeyword.selectLanguage(testData.register.language);
    await registerKeyword.verifyHeaderSection(testData.register.language);
    await registerKeyword.verifyRegisterForm(testData.register.language);

    // ===== Coupon =====
    await registerKeyword.clickUseCoupon();
    await registerKeyword.verifyCouponInputDisplayed(testData.register.language);

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
    await registerKeyword.verifyBottomSection(testData.register.language);
  });
});
