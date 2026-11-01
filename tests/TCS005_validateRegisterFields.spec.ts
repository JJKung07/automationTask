import { test } from '@playwright/test';
import { TestFixtures, testData } from '../fixtures/fixture';

test.describe('Register empeo', () => {
  let fixture: TestFixtures;

  test.beforeEach(async ({ page }) => {
    fixture = new TestFixtures(page);
  });

  test('TCS005 - ตรวจสอบ validation และ error handling ของการสมัคร', async () => {
    test.setTimeout(180000); // long scenario: about 100 steps including the OTP and password pages
    const data = testData.register.registration;
    const invalid = testData.register.validation;

    // ===== Thai company: submit without any data =====
    await fixture.registerKeyword.openRegisterPage();
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyRequiredErrors('thai');
    await fixture.registerKeyword.verifyOtpPageNotDisplayed();

    // ===== First name with only spaces =====
    await fixture.registerKeyword.fillFirstName(invalid.spaces);
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyNameNotRejected();

    // ===== Invalid emails =====
    for (const email of invalid.invalidEmails) {
      await fixture.registerKeyword.fillEmail(email);
      await fixture.registerKeyword.clickTryForFree();
      await fixture.registerKeyword.verifyEmailError(email);
    }

    // ===== Valid first name and last name =====
    await fixture.registerKeyword.fillFirstName(data.contactInfo.firstName);
    await fixture.registerKeyword.fillLastName(data.contactInfo.lastName);
    await fixture.registerKeyword.verifyNameErrorsNotDisplayed();

    // ===== Company search with wrong tax IDs =====
    for (const taxId of invalid.taxIds) {
      await fixture.registerKeyword.searchTaxId(taxId);
      await fixture.registerKeyword.clickTryForFree();
      await fixture.registerKeyword.verifyTaxIdError(taxId);
    }

    // ===== Thai company that already has an account =====
    await fixture.registerKeyword.searchTaxId(data.taxId);
    await fixture.registerKeyword.verifyTaxIdSearchResult(data.taxId);
    await fixture.registerKeyword.selectTaxIdResult(data.taxId);
    await fixture.registerKeyword.verifyTaxIdSelected(data.taxId);
    await fixture.registerKeyword.verifyCompanyAlreadyRegistered();

    // ===== Others: submit without any data =====
    await fixture.registerKeyword.openRegisterPage();
    await fixture.registerKeyword.selectCompanyOthers();
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyRequiredErrors('others');
    await fixture.registerKeyword.verifyOtpPageNotDisplayed();

    // ===== Invalid phone numbers =====
    for (const phone of invalid.phones) {
      await fixture.registerKeyword.fillPhone(phone);
      await fixture.registerKeyword.clickTryForFree();
      await fixture.registerKeyword.verifyPhoneError();
    }

    // ===== Valid data with an email that already has an account =====
    await fixture.registerKeyword.fillContactInfo({ ...data.contactInfo, email: invalid.registeredEmail });
    await fixture.registerKeyword.acceptTerms();
    await fixture.registerKeyword.verifyEmailAlreadyRegistered();
    await fixture.registerKeyword.fillCompanyName(data.companyName);
    await fixture.registerKeyword.selectBusinessType(data.businessType);
    await fixture.registerKeyword.selectUserAmount(data.userAmount);
    await fixture.registerKeyword.verifyLoginOfferedInsteadOfTry();
    await fixture.registerKeyword.verifyOtpPageNotDisplayed();

    // ===== New email, terms not accepted =====
    await fixture.registerKeyword.untickTerms();
    await fixture.registerKeyword.fillEmail(data.contactInfo.email);
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyTermsError();

    // ===== Coupon: empty and invalid codes =====
    await fixture.registerKeyword.clickUseCoupon();
    await fixture.registerKeyword.applyCoupon('');
    await fixture.registerKeyword.verifyCouponNotApplied();
    for (const coupon of invalid.invalidCoupons) {
      await fixture.registerKeyword.applyCoupon(coupon);
      await fixture.registerKeyword.verifyCouponInvalid();
      await fixture.registerKeyword.verifyCouponNotApplied();
    }

    // ===== Coupon: valid code, then remove it =====
    await fixture.registerKeyword.applyCoupon(data.couponCode);
    await fixture.registerKeyword.verifyCouponApplied(data.couponCode);
    await fixture.registerKeyword.removeCoupon();
    await fixture.registerKeyword.verifyCouponNotApplied();

    // ===== Submit =====
    await fixture.registerKeyword.acceptTerms();
    await fixture.registerKeyword.clickTryForFree();
    await fixture.registerKeyword.verifyOtpPage(data.contactInfo.phone);

    // ===== OTP: incomplete code =====
    await fixture.registerKeyword.fillOtp(invalid.incompleteOtp);
    await fixture.registerKeyword.verifyOtpIncomplete(invalid.incompleteOtp);

    // ===== OTP: wrong code =====
    await fixture.registerKeyword.clearOtp();
    await fixture.registerKeyword.fillOtp(invalid.wrongOtp);
    await fixture.registerKeyword.clickVerifyOtp();
    await fixture.registerKeyword.verifyOtpIncorrect();

    // ===== OTP: correct code =====
    await fixture.registerKeyword.clearOtp();
    await fixture.registerKeyword.fillOtp(data.otp);
    await fixture.registerKeyword.clickVerifyOtp();

    // ===== Password rules =====
    await fixture.registerKeyword.verifyCreatePasswordPage();
    for (const password of invalid.invalidPasswords) {
      await fixture.registerKeyword.fillPassword(password);
      await fixture.registerKeyword.verifyPasswordConditions(password);
    }

    // ===== Password and confirm password do not match =====
    await fixture.registerKeyword.fillPassword(invalid.mismatchPassword.password, invalid.mismatchPassword.confirmPassword);
    await fixture.registerKeyword.verifyPasswordMismatch();
    await fixture.registerKeyword.clickSetPassword();
    await fixture.registerKeyword.verifyPasswordNotCreated();
  });
});
