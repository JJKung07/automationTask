# Playwright UI Automation (TypeScript)

## Structure
| Folder | Contains | Not allowed |
|---|---|---|
| `locators/` | How to find elements (`getByRole`, `getByText`, xpath, ...) | Actions, test data |
| `keywords/` | One class per page with `constructor(private page: Page)`: actions (`clickX`, `fillX`) and verifications (`verifyX`, holds the `expect` + expected values), built from locators | `page.locator` / `getBy*` / xpath |
| `fixtures/` | `fixture.ts`: the only place that imports locators / keywords / test data. Exports `test` (each keyword class as a Playwright fixture), `locator` (for keywords), `testData` (per page, for specs). New page → import its 3 files, add the keyword to `Fixtures` + `base.extend`, locator to `locator`, data to `testData` | Logic, locators, data values |
| `tests/` | `TCS<no>_<whatItDoes>.spec.ts` (e.g. `TCS001_verifyRegisterPageUI.spec.ts`): `async ({ registerKeyword, ... }) => {}` calling keywords in a flat chain, sections split by comments | `expect`, locators, `test.step`, `locator` (import only `test`, `testData` from `fixtures/fixture`) |
| `test-data/` | Input data as `.json` (phone numbers, usernames, ...) | Expected results (header text, messages, ...) |

Keyword and locator names must be unique across all pages (e.g. `closePrivacyPolicyPage`, `lbl_privacyPolicyHeader`).

## Commands
```
npm install
npx playwright install chromium
npm test              # run all tests
npm run test:headed   # run with browser visible
npm run report        # open the HTML report
npm run typecheck
```

Set the site under test in `playwright.config.ts` → `use.baseURL`.

## Locator naming: `elementType_name` (camelCase name)
| Prefix | Element | Example |
|---|---|---|
| `btn_` | button | `btn_tryForFree` |
| `txt_` | text input | `txt_email` |
| `lbl_` | text / label / heading | `lbl_policyHeader` |
| `lnk_` | link | `lnk_privacyPolicy` |
| `img_` | image | `img_logo` |
| `ddl_` | dropdown | `ddl_companyType` |
| `opt_` | dropdown option | `opt_dropdown` |
| `rdo_` | radio | `rdo_companyThai` |
| `chk_` | checkbox | `chk_accept` |
| `icon_` | icon | `icon_closeVideo` |
| `iframe_` | iframe | `iframe_video` |
| `frm_` / `section_` / `field_` | form / page section / field wrapper | `frm_register` |
