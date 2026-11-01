import { test } from '@playwright/test';
import { TestFixtures, testData } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  let fixture: TestFixtures;

  test.beforeEach(async ({ page }) => {
    fixture = new TestFixtures(page);
  });

  test('TCS006 - สมัครทดลองใช้ไม่สำเร็จเมื่ออินเทอร์เน็ตขาดการเชื่อมต่อ', async () => {
    test.setTimeout(120000);
    const data = { ...testData.register.registration, companyName: testData.register.offline.companyName };

    // ===== Others: fill company and contact info =====
    await fixture.registerKeyword.openRegisterPage();
    await fixture.registerKeyword.selectCompanyOthers();
    await fixture.registerKeyword.fillCompanyName(data.companyName);
    await fixture.registerKeyword.selectBusinessType(data.businessType);
    await fixture.registerKeyword.selectUserAmount(data.userAmount);
    await fixture.registerKeyword.fillContactInfo(data.contactInfo);
    await fixture.registerKeyword.acceptTerms();

    // ===== Submit while offline =====
    await fixture.registerKeyword.goOffline();
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyConnectionError();
    await fixture.registerKeyword.verifyRegisterInfoFilled(data);
    await fixture.registerKeyword.verifyOtpPageNotDisplayed();
    await fixture.registerKeyword.closeErrorPopup();

    // ===== Submit again when back online =====
    await fixture.registerKeyword.goOnline();
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyOtpPage(data.contactInfo.phone);

    // ===== Verify OTP while offline =====
    await fixture.registerKeyword.fillOtp(data.otp);
    await fixture.registerKeyword.goOffline();
    await fixture.registerKeyword.clickVerifyOtp();
    await fixture.registerKeyword.verifyConnectionError();
    await fixture.registerKeyword.closeErrorPopup();
    await fixture.registerKeyword.verifyOtpPage(data.contactInfo.phone);

    // ===== Verify OTP again when back online =====
    await fixture.registerKeyword.goOnline();
    await fixture.registerKeyword.clickVerifyOtp();
    await fixture.registerKeyword.verifyCreatePasswordPage();

    // ===== Set password while offline =====
    await fixture.registerKeyword.fillPassword(data.password);
    await fixture.registerKeyword.goOffline();
    await fixture.registerKeyword.clickSetPassword();
    await fixture.registerKeyword.verifyPageNotFound();
  });
});
