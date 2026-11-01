import { Page } from '@playwright/test';

// Locators only: how to find elements on the Register page. No actions, no data.
export const registerLocator = {
  // ===== Page container =====
  section_register:   (page: Page) => page.locator('app-register'),
  frm_register:       (page: Page) => page.locator('form'),

  // ===== Header (logo / language) =====
  img_logo:           (page: Page) => page.getByRole('img', { name: 'logo' }),
  ddl_language:       (page: Page) => page.getByTestId('setting_language'),

  // ===== Banner (left side) =====
  img_detail:         (page: Page) => page.getByRole('img', { name: 'detail-image' }),
  btn_watchVideo:     (page: Page) => page.getByTestId('button_button'),

  // ===== Video modal =====
  iframe_video:       (page: Page) => page.locator('iframe[title="video"]'),
  icon_closeVideo:    (page: Page) => page.getByTestId('icon_close_video'),

  // ===== Register form: company =====
  rdo_companyThai:    (page: Page) => page.getByTestId('input_radio_registration_company_thai'),
  rdo_companyOthers:  (page: Page) => page.getByTestId('input_radio_registration_company_others'),
  txt_taxId:          (page: Page) => page.getByTestId('input_textfield_input_registration_tax_id'),
  // search result item that matches the tax ID searched
  opt_taxIdResult:    (page: Page, taxId: string) => page.locator('.go5-dropdown-item').filter({ hasText: taxId }),
  txt_companyName:    (page: Page) => page.getByTestId('input_textfield_input_register_company_name'),
  ddl_companyType:    (page: Page) => page.getByTestId('dropdown_selection_registration_company_type'),
  ddl_userAmount:     (page: Page) => page.getByTestId('dropdown_selection_registration_user_amount'),
  // dropdown list is rendered in a popup outside the dropdown element
  opt_dropdown:       (page: Page, name: string) => page.locator('[class*="go5-dropdown-item"]').getByText(name, { exact: true }),

  // ===== Register form: contact =====
  txt_email:          (page: Page) => page.getByTestId('input_textfield_input_registration_email'),
  txt_firstName:      (page: Page) => page.getByTestId('input_textfield_input_register_first_name'),
  txt_lastName:       (page: Page) => page.getByTestId('input_textfield_input_register_last_name'),
  txt_phone:          (page: Page) => page.locator('#phone'), // same id in every language
  field_phone:        (page: Page) => page.getByTestId('input_number_registration_phone_number'),
  // ===== Register form: coupon =====
  lnk_useCoupon:      (page: Page) => page.getByTestId('input_button_registration_register_ticket_got_coupon'),
  txt_couponCode:     (page: Page) => page.getByTestId('input_text_registration_coupon_code'),
  btn_applyCoupon:    (page: Page) => page.getByTestId('input_button_registration_btn_apply'),
  // the test id is on the ticket icon; its parent row holds the applied code
  lbl_appliedCoupon:  (page: Page) => page.getByTestId('input_button_registration_register_ticket').locator('..'),
  icon_removeCoupon:  (page: Page) => page.getByTestId('input_button_registration_register_ticket').locator('..').locator('.gf-icon-close'),

  // ===== Register form: consent & submit =====
  chk_accept:         (page: Page) => page.getByTestId('input_checkbox_registration_checkbox'),
  lnk_privacyPolicy:  (page: Page) => page.getByTestId('button_button_registration_privacy_policy'),
  lnk_terms:          (page: Page) => page.getByTestId('button_button_registration_terms_and_conditions'),
  btn_tryForFree:     (page: Page) => page.getByTestId('button_submit_registration_try_for_free'),
  btn_loginInstead:   (page: Page) => page.locator('form').getByRole('button', { name: 'เข้าสู่ระบบ' }),

  // ===== OTP step =====
  // OTP modal content (taken from the recorded flow; it renders outside app-register)
  section_otp:        (page: Page) => page.locator('#e-content-tab-registration-empeo_3'),
  txt_otpDigit:       (page: Page) => page.locator('input[id^="otp_"]'),
  btn_verifyOtp:      (page: Page) => page.getByTestId('button_button_registration_verify'),

  // any message on the page that may show outside the form (e.g. a short-lived OTP error)
  lbl_message:        (page: Page, text: string) => page.getByText(text).first(),

  // ===== Create password =====
  section_createPassword: (page: Page) => page.locator('app-create-password'),
  txt_password:       (page: Page) => page.getByTestId('input_textfield_input_input_password_crate_password_password'),
  txt_confirmPassword: (page: Page) => page.getByTestId('input_textfield_input_input_password_crate_password_confirm_password'),
  btn_setPassword:    (page: Page) => page.getByTestId('button_button_create_password_btn_next'),
  img_success:        (page: Page) => page.getByRole('img', { name: 'success' }),
  btn_letsGetStarted: (page: Page) => page.getByTestId('button_button_create_password_btn_lets_get_started'),
  icon_passwordCondition: (page: Page, rule: string) => page.locator('.condition-item').filter({ hasText: rule }).locator('.gf-icon-checkbox'),

  // ===== Bottom section / floating =====
  img_preview:        (page: Page) => page.getByRole('img', { name: 'image-preview' }),
  btn_chatbot:        (page: Page) => page.getByRole('img', { name: 'Crisp Chat' }),
};
