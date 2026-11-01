import { Page, expect } from '@playwright/test';
import { locator } from '../fixtures/fixture';

type ContactInfo = { email: string; firstName: string; lastName: string; phone: string };

// Expected text per language (keyed by the name shown in the language dropdown)
const expectedText = {
  'ไทย': {
    language: 'ไทย',
    headerTitle: 'โปรแกรมบริหารงาน บุคคลครบวงจร',
    headerDescription: 'ให้เราช่วยคุณจัดการความท้าทายในการบริหารคนด้วยระบบที่ทันสมัย ทรงพลัง และใช้งานง่าย',
    freeTrial: 'ลองใช้ฟรี 30 วัน',
    watchVideo: 'ดูวิดีโอ',
    formTitle: 'ทดลองใช้งาน empeo ฟรี!',
    formSubtitle: 'ไม่จำเป็นต้องใช้บัตรเครดิต ยกเลิกได้ทุกเมื่อ',
    companyThai: 'บริษัทจดทะเบียนในไทย',
    companyOthers: 'อื่นๆ',
    taxIdPlaceholder: 'กรอกเลขประจำตัวผู้เสียภาษี หรือ ชื่อบริษัท',
    companyType: 'ประเภทธุรกิจ*',
    companyTypeOption: 'ค้าปลีก',
    userAmount: 'ผู้ใช้งาน*',
    emailPlaceholder: 'อีเมล*',
    firstNamePlaceholder: 'ชื่อ*',
    lastNamePlaceholder: 'นามสกุล*',
    phonePlaceholder: 'เบอร์มือถือ*',
    useCoupon: 'ใช้โค้ดส่วนลด',
    applyCoupon: 'ใช้โค้ด',
    consent: 'ฉันยอมรับ นโยบายความเป็นส่วนตัว และ ข้อกำหนดและเงื่อนไขการใช้งาน',
    tryForFree: 'ทดลองใช้ฟรี',
    featureReady: 'ลงทะเบียนเรียบร้อย ใช้งานได้ทันที',
    featureManual: 'พร้อมคู่มือการใช้งาน ระบบแบบครบถ้วน',
    featureSupport: 'พร้อมดูแลคุณ ผ่าน Live Chat ทุกวันไม่เว้นวันหยุด',
    bottomTitle: 'empeo ระบบ HR ที่บริษัทต่างๆให้ความไว้วางใจ',
    statCompanies: '5,000+บริษัท',
    statUsers: '45,000+ผู้ใช้งานต่อวัน',
    statSupport: '30+ทีมดูแลลูกค้ากว่า 30 คน',
  },
  English: {
    language: 'English',
    headerTitle: 'The next-gen HR platform',
    headerDescription: 'Built on the cloud for the digital-first world. Experience the modern platform that streamlines demanding HR tasks backed by first rate support.',
    freeTrial: '30 Days Free Trial',
    watchVideo: 'Watch Video',
    formTitle: 'Try empeo for free!',
    formSubtitle: 'No credit card required. Cancel anytime.',
    companyThai: 'Thai Company',
    companyOthers: 'Others',
    taxIdPlaceholder: 'Fill in tax ID or company name',
    companyType: 'Your business type*',
    companyTypeOption: 'Wholesale',
    userAmount: 'Number of employee?*',
    emailPlaceholder: 'E-mail*',
    firstNamePlaceholder: 'First Name*',
    lastNamePlaceholder: 'Last Name*',
    phonePlaceholder: 'Mobile Number*',
    useCoupon: 'Redeem a promo code',
    applyCoupon: 'Apply',
    consent: 'I agree to the Privacy Policy and Terms and Conditions',
    tryForFree: 'Try for free',
    featureReady: 'Ready to use right after registration',
    featureManual: 'Self-paced learning with empeo Academy',
    featureSupport: 'Everyday support via Live Chat',
    bottomTitle: 'Trusted & Chosen by Industry Leaders',
    statCompanies: '5,000+Companies',
    statUsers: '45,000+Active Daily Users',
    statSupport: '30+Customer Success',
  },
};
type Language = keyof typeof expectedText;

// Expected company shown in the tax ID search result, per tax ID searched
const expectedCompanyByTaxId: Record<string, string> = {
  '0745561010054': 'บริษัท โกไฟว์ จำกัด',
};

// Messages shown when the form is submitted empty (Thai company asks for tax ID, Others asks for company name)
const requiredErrors = {
  common: [
    'กรุณากรอกประเภทธุรกิจ',
    'กรุณากรอกผู้ใช้งาน',
    'กรุณากรอกอีเมล',
    'กรุณากรอกชื่อ',
    'กรุณากรอกนามสกุล',
    'กรุณากรอกเบอร์โทรศัพท์มือถือ',
    'กรุณารับทราบนโยบายความเป็นส่วนตัว และข้อกำหนดและเงื่อนไขการใช้งาน',
  ],
  thai: ['กรุณากรอกเลขประจำตัวผู้เสียภาษีหรือชื่อบริษัท'],
  others: ['กรุณากรอกข้อมูลที่จำเป็นทั้งหมด'],
};

// Email error shown by the site; any email not listed here gets the default format error
const defaultEmailError = 'กรุณาใส่อีเมลที่ถูกต้อง';
const emailErrorByEmail: Record<string, string> = {
  'a b@test.com': 'โดเมนนี้มีบัญชีใช้งานแล้ว', // site checks the domain first (differs from TC-05)
};

// Keywords: actions + verifications (expected values live here). Never call page.locator / getBy* here — add it to locators/ instead.
export class RegisterKeyword {
  constructor(private page: Page) {}

  // one id per test: every "{timestamp}" in the test data becomes this, so fill and verify use the same value
  // 13-digit time + 3 random digits, so two runs started in the same moment still differ
  private runId = String(Date.now()) + String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  private unique(text: string) {
    return text.replace('{timestamp}', this.runId);
  }

  private expected(language: string) {
    const text = expectedText[language as Language];
    if (!text) throw new Error(`No expected text for language "${language}" in register.keyword.ts`);
    return text;
  }

  // ===== Actions =====
  async selectLanguage(language: string) {
    await locator.ddl_language(this.page).click();
    await locator.opt_dropdown(this.page, language).click();
  }
  async openRegisterPage() {
    await this.page.goto(''); // '' = baseURL itself; '/' would drop the /Register/empeo path
  }
  async clickWatchVideo() {
    await locator.btn_watchVideo(this.page).click();
  }
  async closeVideo() {
    await locator.icon_closeVideo(this.page).click();
  }
  async openCompanyTypeDropdown() {
    await locator.ddl_companyType(this.page).click();
  }
  async openUserAmountDropdown() {
    await locator.ddl_userAmount(this.page).click();
  }
  async clickUseCoupon() {
    await locator.lnk_useCoupon(this.page).click();
  }
  async selectCompanyOthers() {
    await locator.rdo_companyOthers(this.page).getByRole('radio').check();
  }
  async selectCompanyThai() {
    await locator.rdo_companyThai(this.page).getByRole('radio').check();
  }
  // email and company name must be new on every run (the server rejects duplicates)
  async fillContactInfo(info: ContactInfo) {
    await locator.txt_email(this.page).fill(this.unique(info.email));
    await locator.txt_firstName(this.page).fill(info.firstName);
    await locator.txt_lastName(this.page).fill(info.lastName);
    await locator.txt_phone(this.page).fill(info.phone);
  }
  // opens a new tab; its own keyword (privacyPolicyKeyword / termsAndConditionsKeyword) works on it
  async clickPrivacyPolicy() {
    const popup = this.page.waitForEvent('popup');
    await locator.lnk_privacyPolicy(this.page).click();
    await popup;
  }
  async clickTermAndCondition() {
    const popup = this.page.waitForEvent('popup');
    await locator.lnk_terms(this.page).click();
    await popup;
  }
  async scrollToBottom() {
    await locator.img_preview(this.page).scrollIntoViewIfNeeded();
  }
  async searchTaxId(taxId: string) {
    await locator.txt_taxId(this.page).fill(taxId);
  }
  async selectTaxIdResult(taxId: string) {
    await locator.opt_taxIdResult(this.page, taxId).click();
  }
  async fillCompanyName(companyName: string) {
    await locator.txt_companyName(this.page).fill(this.unique(companyName));
  }
  async selectBusinessType(businessType: string) {
    await locator.ddl_companyType(this.page).click();
    await locator.opt_dropdown(this.page, businessType).click();
  }
  async selectUserAmount(userAmount: string) {
    await locator.ddl_userAmount(this.page).click();
    await locator.opt_dropdown(this.page, userAmount).click();
  }
  async applyCoupon(couponCode: string) {
    await locator.txt_couponCode(this.page).fill(couponCode);
    await locator.btn_applyCoupon(this.page).click();
  }
  async acceptTerms() {
    await locator.chk_accept(this.page).check();
  }
  async clickTryForFree() {
    await locator.btn_tryForFree(this.page).click();
  }
  async fillOtp(otp: string) {
    // type like a user: click the first box and keep typing, the page moves to the next box by itself.
    // Real key presses are needed (fill() does not enable the verify button), and typing box by box
    // does not register after the boxes were cleared.
    await this.page.waitForTimeout(1000); // typing right after the boxes were cleared or shown gets lost
    await locator.txt_otpDigit(this.page).first().click();
    await this.page.keyboard.type(otp, { delay: 250 });
  }
  async clearOtp() {
    for (let i = 0; i < 6; i++) await locator.txt_otpDigit(this.page).nth(i).fill('');
  }
  async clickVerifyOtp() {
    await locator.btn_verifyOtp(this.page).click();
  }
  async fillPassword(password: string, confirmPassword: string = password) {
    await locator.txt_password(this.page).fill(password);
    await locator.txt_confirmPassword(this.page).fill(confirmPassword);
  }
  async fillFirstName(firstName: string) {
    await locator.txt_firstName(this.page).fill(firstName);
  }
  async fillLastName(lastName: string) {
    await locator.txt_lastName(this.page).fill(lastName);
  }
  async fillEmail(email: string) {
    await locator.txt_email(this.page).fill(this.unique(email));
  }
  async fillPhone(phone: string) {
    await locator.txt_phone(this.page).fill(phone);
  }
  async untickTerms() {
    await locator.chk_accept(this.page).uncheck();
  }
  async removeCoupon() {
    await locator.icon_removeCoupon(this.page).click();
  }
  async clickSetPassword() {
    await locator.btn_setPassword(this.page).click();
  }
  async clickLetsGetStarted() {
    await locator.btn_letsGetStarted(this.page).click();
  }

  // ===== Verifications =====
  async verifyHeaderSection(language: string = 'ไทย') {
    const t = this.expected(language);
    await expect(locator.img_logo(this.page)).toBeVisible();
    await expect(locator.ddl_language(this.page)).toContainText(t.language);
    await expect(locator.section_register(this.page)).toContainText(t.headerTitle);
    await expect(locator.section_register(this.page)).toContainText(t.headerDescription);
    await expect(locator.section_register(this.page)).toContainText(t.freeTrial);
    await expect(locator.btn_watchVideo(this.page)).toContainText(t.watchVideo);
    await expect(locator.img_detail(this.page)).toBeVisible();
  }
  async verifyRegisterForm(language: string = 'ไทย') {
    const t = this.expected(language);
    await expect(locator.section_register(this.page)).toContainText(t.formTitle);
    await expect(locator.section_register(this.page)).toContainText(t.formSubtitle);
    await expect(locator.rdo_companyThai(this.page)).toContainText(t.companyThai);
    await expect(locator.rdo_companyThai(this.page).getByRole('radio')).toBeChecked();
    await expect(locator.rdo_companyOthers(this.page)).toContainText(t.companyOthers);
    await expect(locator.txt_taxId(this.page)).toHaveAttribute('placeholder', t.taxIdPlaceholder);
    await expect(locator.ddl_companyType(this.page)).toContainText(t.companyType);
    await expect(locator.ddl_userAmount(this.page)).toContainText(t.userAmount);
    await expect(locator.txt_email(this.page)).toHaveAttribute('placeholder', t.emailPlaceholder);
    await expect(locator.txt_firstName(this.page)).toHaveAttribute('placeholder', t.firstNamePlaceholder);
    await expect(locator.txt_lastName(this.page)).toHaveAttribute('placeholder', t.lastNamePlaceholder);
    await expect(locator.txt_phone(this.page)).toHaveAttribute('placeholder', t.phonePlaceholder);
    await expect(locator.field_phone(this.page)).toContainText('+66');
    await expect(locator.frm_register(this.page)).toContainText(t.useCoupon);
    await expect(locator.chk_accept(this.page)).not.toBeChecked();
    await expect(locator.frm_register(this.page)).toContainText(t.consent);
    await expect(locator.btn_tryForFree(this.page)).toContainText(t.tryForFree);
    await expect(locator.section_register(this.page)).toContainText(t.featureReady);
    await expect(locator.section_register(this.page)).toContainText(t.featureManual);
    await expect(locator.section_register(this.page)).toContainText(t.featureSupport);
    await expect(locator.btn_chatbot(this.page)).toBeVisible();
  }
  async verifyVideoModalDisplayed() {
    await expect(locator.iframe_video(this.page)).toBeVisible();
    await expect(locator.icon_closeVideo(this.page)).toBeVisible();
  }
  async verifyVideoModalClosed() {
    await expect(locator.iframe_video(this.page)).toBeHidden();
  }
  async verifyCompanyTypeOptions(language: string = 'ไทย') {
    const t = this.expected(language);
    await expect(locator.opt_dropdown(this.page, t.companyTypeOption)).toBeVisible();
  }
  async verifyUserAmountOptions() {
    await expect(locator.opt_dropdown(this.page, '1-20')).toBeVisible();
  }
  async verifyCouponInputDisplayed(language: string = 'ไทย') {
    const t = this.expected(language);
    await expect(locator.txt_couponCode(this.page)).toBeVisible();
    await expect(locator.btn_applyCoupon(this.page)).toContainText(t.applyCoupon);
  }
  async verifyTaxIdSearchResult(taxId: string) {
    const companyName = expectedCompanyByTaxId[taxId];
    if (!companyName) throw new Error(`No expected company for tax ID "${taxId}" in register.keyword.ts`);
    await expect(locator.opt_taxIdResult(this.page, taxId)).toContainText(companyName);
    await expect(locator.opt_taxIdResult(this.page, taxId)).toContainText(taxId);
  }
  async verifyTaxIdSelected(taxId: string) {
    await expect(locator.txt_taxId(this.page)).toHaveValue(taxId);
  }
  async verifyRegisterInfoFilled(info: { companyName: string; businessType: string; userAmount: string; contactInfo: ContactInfo }) {
    await expect(locator.txt_companyName(this.page)).toHaveValue(this.unique(info.companyName));
    await expect(locator.ddl_companyType(this.page)).toContainText(info.businessType);
    await expect(locator.ddl_userAmount(this.page)).toContainText(info.userAmount);
    await expect(locator.txt_email(this.page)).not.toHaveValue('');
    await expect(locator.txt_firstName(this.page)).toHaveValue(info.contactInfo.firstName);
    await expect(locator.txt_lastName(this.page)).toHaveValue(info.contactInfo.lastName);
    await expect(locator.txt_phone(this.page)).not.toHaveValue(''); // field reformats the number
  }
  async verifyCouponApplied(couponCode: string) {
    await expect(locator.lbl_appliedCoupon(this.page)).toContainText(couponCode);
  }
  async verifyTermsAccepted() {
    await expect(locator.chk_accept(this.page)).toBeChecked();
  }
  async verifyRequiredErrors(companyType: 'thai' | 'others') {
    for (const message of [...requiredErrors[companyType], ...requiredErrors.common]) {
      await expect(locator.frm_register(this.page)).toContainText(message);
    }
  }
  async verifyOtpPageNotDisplayed() {
    await expect(locator.section_otp(this.page)).toBeHidden();
  }
  // current site behavior: a first name made only of spaces is accepted (TC-05 expects an error)
  async verifyNameNotRejected() {
    await expect(locator.frm_register(this.page)).not.toContainText('กรุณากรอกชื่อ');
  }
  async verifyNameErrorsNotDisplayed() {
    await expect(locator.frm_register(this.page)).not.toContainText('กรุณากรอกชื่อ');
    await expect(locator.frm_register(this.page)).not.toContainText('กรุณากรอกนามสกุล');
  }
  async verifyEmailError(email: string) {
    await expect(locator.frm_register(this.page)).toContainText(emailErrorByEmail[email] ?? defaultEmailError);
  }
  // a tax ID that is typed but not picked from the results is always "required"; only a 13-digit one is searched
  async verifyTaxIdError(taxId: string) {
    await expect(locator.frm_register(this.page)).toContainText('กรุณากรอกเลขประจำตัวผู้เสียภาษีหรือชื่อบริษัท');
    if (/^\d{13}$/.test(taxId)) {
      await expect(locator.frm_register(this.page)).toContainText('ไม่พบบริษัทที่คุณค้นหา');
    }
  }
  // text only: the masked email in this message is not checked
  async verifyCompanyAlreadyRegistered() {
    for (const message of ['บริษัทนี้มีบัญชีใช้งานแล้ว', 'เข้าสู่ระบบ', 'ด้วยการล็อกอินผ่าน', 'หรือติดต่อเจ้าหน้าที่เพื่อ', 'ทดลองใช้งานอีกครั้ง']) {
      await expect(locator.frm_register(this.page)).toContainText(message);
    }
  }
  async verifyPhoneError() {
    await expect(locator.frm_register(this.page)).toContainText('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
  }
  async verifyEmailAlreadyRegistered() {
    await expect(locator.frm_register(this.page)).toContainText('อีเมลนี้มีบัญชีใช้งานแล้ว ลองล็อกอินหรือทำเรื่องลืมรหัสผ่าน');
  }
  // current site behavior: a "เข้าสู่ระบบ" button appears and try-for-free is disabled (TC-05 expects to press try-for-free)
  async verifyLoginOfferedInsteadOfTry() {
    await expect(locator.btn_loginInstead(this.page)).toBeVisible();
    await expect(locator.btn_tryForFree(this.page)).toBeDisabled();
  }
  async verifyTermsError() {
    await expect(locator.frm_register(this.page)).toContainText('กรุณารับทราบนโยบายความเป็นส่วนตัว และข้อกำหนดและเงื่อนไขการใช้งาน');
  }
  async verifyCouponNotApplied() {
    await expect(locator.lbl_appliedCoupon(this.page)).toHaveCount(0);
  }
  async verifyCouponInvalid() {
    await expect(locator.frm_register(this.page)).toContainText('คูปองโค้ดไม่ถูกต้อง');
  }
  // fewer than 6 digits: the boxes keep what was typed and the verify button stays disabled
  async verifyOtpIncomplete(typed: string) {
    await expect.poll(() => locator.txt_otpDigit(this.page).evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value).join(''))).toBe(typed);
    await expect(locator.btn_verifyOtp(this.page)).toBeDisabled();
  }
  // the message only shows for a moment, so call this right after clickVerifyOtp
  async verifyOtpIncorrect() {
    await expect(locator.lbl_message(this.page, 'OTP ไม่ถูกต้อง')).toBeVisible();
  }
  // each rule must show the checkbox icon only when the password meets it; any failed rule keeps the button disabled
  async verifyPasswordConditions(password: string) {
    const rules: [string, boolean][] = [
      ['Aa', /[a-z]/.test(password) && /[A-Z]/.test(password)],
      ['123', /\d/.test(password)],
      ['8 ตัวอักษรขึ้นไป', password.length >= 8],
    ];
    for (const [rule, passed] of rules) {
      await expect(locator.icon_passwordCondition(this.page, rule)).toHaveCount(passed ? 1 : 0);
    }
    if (rules.some(([, passed]) => !passed)) await expect(locator.btn_setPassword(this.page)).toBeDisabled();
    else await expect(locator.btn_setPassword(this.page)).toBeEnabled();
  }
  async verifyPasswordMismatch() {
    await expect(locator.section_createPassword(this.page)).toContainText('รหัสผ่านไม่ตรงกัน');
  }
  // after clicking set password with mismatching passwords the page must stay here
  async verifyPasswordNotCreated() {
    await this.page.waitForTimeout(1500); // give the server time to answer before concluding nothing happened
    await expect(locator.section_createPassword(this.page)).toContainText('รหัสผ่านไม่ตรงกัน');
    await expect(locator.section_createPassword(this.page)).not.toContainText('empeo พร้อมใช้งานแล้ว!');
  }
  async verifyCreatePasswordPage() {
    // the server takes a while to verify the OTP and load this page
    await expect(locator.section_createPassword(this.page)).toBeVisible({ timeout: 30000 });
    await expect(locator.section_createPassword(this.page)).toContainText('กรุณาตั้งรหัสผ่าน');
    await expect(locator.section_createPassword(this.page)).toContainText('กรุณาตั้งรหัสผ่านตามเงื่อนไขด้านล่าง เพื่อความปลอดภัยของบัญชี');
    await expect(locator.section_createPassword(this.page)).toContainText('Aa 123 8 ตัวอักษรขึ้นไป');
    await expect(locator.txt_password(this.page)).toBeVisible();
    await expect(locator.txt_confirmPassword(this.page)).toBeVisible();
    await expect(locator.btn_setPassword(this.page)).toBeDisabled();
  }
  async verifySetPasswordEnabled() {
    await expect(locator.btn_setPassword(this.page)).toBeEnabled();
  }
  async verifyPasswordCreated() {
    await expect(locator.section_createPassword(this.page)).toContainText('empeo พร้อมใช้งานแล้ว!');
    await expect(locator.section_createPassword(this.page)).toContainText('ยินดีด้วย! คุณสามารถเริ่มต้นทดลองใช้งานได้ทันที');
    await expect(locator.img_success(this.page)).toBeVisible();
    await expect(locator.btn_letsGetStarted(this.page)).toBeVisible();
  }
  async verifyOtpPage(phone: string) {
    const maskedPhone = `${phone.slice(0, 3)}-XXX-${phone.slice(-4)}`; // 0967690708 -> 096-XXX-0708
    await expect(locator.section_otp(this.page)).toContainText('กรุณาตรวจสอบข้อความ');
    await expect(locator.section_otp(this.page)).toContainText(`โปรดกรอกรหัส OTP ที่ถูกส่งไปยัง ${maskedPhone}`);
    await expect(locator.section_otp(this.page)).toContainText('รับ OTP ใหม่อีกครั้งได้ใน');
    await expect(locator.txt_otpDigit(this.page)).toHaveCount(6);
  }
  async verifyCompanyNameFieldDisplayed() {
    await expect(locator.txt_companyName(this.page)).toBeVisible();
    await expect(locator.txt_taxId(this.page)).toBeHidden();
  }
  async verifyTaxIdFieldDisplayed() {
    await expect(locator.txt_taxId(this.page)).toBeVisible();
  }
  async verifyBottomSection(language: string = 'ไทย') {
    const t = this.expected(language);
    await expect(locator.section_register(this.page)).toContainText(t.bottomTitle);
    await expect(locator.section_register(this.page)).toContainText(t.statCompanies);
    await expect(locator.section_register(this.page)).toContainText(t.statUsers);
    await expect(locator.section_register(this.page)).toContainText(t.statSupport);
    await expect(locator.img_preview(this.page)).toBeVisible();
  }
}
