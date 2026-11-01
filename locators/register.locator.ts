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
  // the site's data-testid literally includes the single quotes
  field_phone:        (page: Page) => page.getByTestId("'input_number_registration_phone_number'"),

  // ===== Register form: coupon =====
  lnk_useCoupon:      (page: Page) => page.getByTestId('input_button_registration_register_ticket_got_coupon'),
  txt_couponCode:     (page: Page) => page.getByTestId('input_text_registration_coupon_code'),
  btn_applyCoupon:    (page: Page, text: string) => page.getByText(text, { exact: true }), // text differs per language

  // ===== Register form: consent & submit =====
  chk_accept:         (page: Page) => page.getByTestId('input_checkbox_registration_checkbox'),
  lnk_privacyPolicy:  (page: Page) => page.getByTestId('button_button_registration_privacy_policy'),
  lnk_terms:          (page: Page) => page.getByTestId('button_button_registration_terms_and_conditions'),
  btn_tryForFree:     (page: Page) => page.getByTestId('button_submit_registration_try_for_free'),

  // ===== Bottom section / floating =====
  img_preview:        (page: Page) => page.getByRole('img', { name: 'image-preview' }),
  btn_chatbot:        (page: Page) => page.getByRole('img', { name: 'Crisp Chat' }),
};
