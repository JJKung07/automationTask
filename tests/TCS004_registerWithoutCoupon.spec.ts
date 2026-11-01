import { test } from '@playwright/test';
import { TestFixtures, testData } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  let fixture: TestFixtures;

  test.beforeEach(async ({ page }) => {
    fixture = new TestFixtures(page);
  });

  test('TCS004 - สร้างบัญชีโดยไม่ใช้โค้ดส่วนลด', async () => {
    const data = testData.register.registration;

    // ===== Open page =====
    await fixture.registerKeyword.openRegisterPage();

    // ===== Search company by tax ID =====
    await fixture.registerKeyword.searchTaxId(data.taxId);
    await fixture.registerKeyword.verifyTaxIdSearchResult(data.taxId);
    await fixture.registerKeyword.selectTaxIdResult(data.taxId);
    await fixture.registerKeyword.verifyTaxIdSelected(data.taxId);

    // ===== Switch to Others & fill company info =====
    await fixture.registerKeyword.selectCompanyOthers();
    await fixture.registerKeyword.fillCompanyName(data.companyName);
    await fixture.registerKeyword.selectBusinessType(data.businessType);
    await fixture.registerKeyword.selectUserAmount(data.userAmount);

    // ===== Fill contact info =====
    await fixture.registerKeyword.fillContactInfo(data.contactInfo);
    await fixture.registerKeyword.verifyRegisterInfoFilled(data);

    // ===== Accept terms & submit =====
    await fixture.registerKeyword.acceptTerms();
    await fixture.registerKeyword.verifyTermsAccepted();
    await fixture.registerKeyword.clickTryForFree();

    // ===== OTP =====
    await fixture.registerKeyword.verifyOtpPage(data.contactInfo.phone);
    await fixture.registerKeyword.fillOtp(data.otp);
    await fixture.registerKeyword.clickVerifyOtp();

    // ===== Create password =====
    await fixture.registerKeyword.verifyCreatePasswordPage();
    await fixture.registerKeyword.fillPassword(data.password);
    await fixture.registerKeyword.verifySetPasswordEnabled();
    await fixture.registerKeyword.clickSetPassword();
    await fixture.registerKeyword.verifyPasswordCreated();

    // ===== Go to login =====
    await fixture.registerKeyword.clickLetsGetStarted();
    await fixture.loginKeyword.verifyLoginPage();
  });
});
