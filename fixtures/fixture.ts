import { test as base } from '@playwright/test';

// ===== Locators: add new page locator imports here =====
import { registerLocator } from '../locators/register.locator';
import { privacyPolicyLocator } from '../locators/privacyPolicy.locator';
import { termsAndConditionsLocator } from '../locators/termsAndConditions.locator';

// ===== Keywords: add new page keyword imports here =====
import { RegisterKeyword } from '../keywords/register.keyword';
import { PrivacyPolicyKeyword } from '../keywords/privacyPolicy.keyword';
import { TermsAndConditionsKeyword } from '../keywords/termsAndConditions.keyword';

// ===== Test data: add new page data imports here =====
import registerData from '../test-data/register.data.json';

type Fixtures = {
  registerKeyword: RegisterKeyword;
  privacyPolicyKeyword: PrivacyPolicyKeyword;
  termsAndConditionsKeyword: TermsAndConditionsKeyword;
};

// Used by specs: test('...', async ({ registerKeyword }) => { ... })
export const test = base.extend<Fixtures>({
  registerKeyword: async ({ page }, use) => {
    await use(new RegisterKeyword(page));
  },
  privacyPolicyKeyword: async ({ page }, use) => {
    await use(new PrivacyPolicyKeyword(page));
  },
  termsAndConditionsKeyword: async ({ page }, use) => {
    await use(new TermsAndConditionsKeyword(page));
  },
});

// Used by keywords only: locator.<name> (names must be unique across pages)
export const locator = {
  ...registerLocator,
  ...privacyPolicyLocator,
  ...termsAndConditionsLocator,
};

// Used by specs: testData.<page>.<field>
export const testData = {
  register: registerData,
};
