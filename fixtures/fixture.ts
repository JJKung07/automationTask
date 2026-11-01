import { Page } from '@playwright/test';

// ===== Locators: add new page locator imports here =====
import { registerLocator } from '../locators/register.locator';
import { privacyPolicyLocator } from '../locators/privacyPolicy.locator';
import { termsAndConditionsLocator } from '../locators/termsAndConditions.locator';
import { loginLocator } from '../locators/login.locator';

// ===== Keywords: add new page keyword imports here =====
import { RegisterKeyword } from '../keywords/register.keyword';
import { PrivacyPolicyKeyword } from '../keywords/privacyPolicy.keyword';
import { TermsAndConditionsKeyword } from '../keywords/termsAndConditions.keyword';
import { LoginKeyword } from '../keywords/login.keyword';

// ===== Test data: add new page data imports here =====
import registerData from '../test-data/register.data.json';

// Used by specs: fixture.<page>Keyword.<keyword>()
export class TestFixtures {
    registerKeyword: RegisterKeyword;
    privacyPolicyKeyword: PrivacyPolicyKeyword;
    termsAndConditionsKeyword: TermsAndConditionsKeyword;
    loginKeyword: LoginKeyword;

    constructor(public page: Page) {
        this.registerKeyword            = new RegisterKeyword(page);
        this.privacyPolicyKeyword       = new PrivacyPolicyKeyword(page);
        this.termsAndConditionsKeyword  = new TermsAndConditionsKeyword(page);
        this.loginKeyword               = new LoginKeyword(page);
    }
}

// Used by keywords only: locator.<name> (names must be unique across pages)
export const locator = {
    ...registerLocator,
    ...privacyPolicyLocator,
    ...termsAndConditionsLocator,
    ...loginLocator,
};

// Used by specs: testData.<page>.<field>
export const testData = {
    register: registerData,
};
