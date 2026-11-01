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

// Keywords: actions + verifications (expected values live here). Never call page.locator / getBy* here — add it to locators/ instead.
export class RegisterKeyword {
  constructor(private page: Page) {}

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
  async fillContactInfo(info: ContactInfo) {
    await locator.txt_email(this.page).fill(info.email);
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
    await expect(locator.btn_applyCoupon(this.page, t.applyCoupon)).toBeVisible();
  }
  async verifyCompanyNameFieldDisplayed() {
    await expect(locator.txt_companyName(this.page)).toBeVisible();
    await expect(locator.txt_taxId(this.page)).toBeHidden();
  }
  async verifyTaxIdFieldDisplayed() {
    await expect(locator.txt_taxId(this.page)).toBeVisible();
  }
  async verifyContactInfoKept(info: ContactInfo) {
    await expect(locator.txt_email(this.page)).toHaveValue(info.email);
    await expect(locator.txt_firstName(this.page)).toHaveValue(info.firstName);
    await expect(locator.txt_lastName(this.page)).toHaveValue(info.lastName);
    await expect(locator.txt_phone(this.page)).not.toHaveValue(''); // field reformats the number
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
