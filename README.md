# empeo Register – Playwright UI Automation (TypeScript)

ชุดทดสอบอัตโนมัติสำหรับหน้าสมัครทดลองใช้ empeo (UAT) ด้วย Playwright + TypeScript
เว็บที่ทดสอบ: `https://portal.uat.gofive.co.th/Register/empeo` (ตั้งค่าใน `playwright.config.ts` → `use.baseURL`)

## Test cases
| ไฟล์ | รายละเอียด |
|---|---|
| `TCS001_verifyRegisterPageUI.spec.ts` | ตรวจสอบการแสดงผล UI หน้าสมัคร (ภาษาไทย) |
| `TCS002_verifyRegisterPageUIEnglish.spec.ts` | ตรวจสอบการแสดงผล UI หน้าสมัคร (ภาษาอังกฤษ) |
| `TCS003_registerWithCoupon.spec.ts` | สมัครทดลองใช้ด้วยโค้ดส่วนลด |
| `TCS004_registerWithoutCoupon.spec.ts` | สร้างบัญชีโดยไม่ใช้โค้ดส่วนลด |
| `TCS005_validateRegisterFields.spec.ts` | ตรวจสอบ validation และ error handling ของการสมัคร |
| `TCS006_registerOffline.spec.ts` | สมัครไม่สำเร็จเมื่ออินเทอร์เน็ตขาดการเชื่อมต่อ |

รายละเอียด test case แบบ manual (ขั้นตอน, ผลลัพธ์ที่คาดหวัง, priority) อยู่ใน `Book 1(Sheet1).csv`

## การติดตั้งและรัน
ต้องมี Node.js

```
npm install
npx playwright install chromium
npm test                                   # รันทั้งหมด
npx playwright test tests/TCS003_registerWithCoupon.spec.ts   # รันไฟล์เดียว
npx playwright test --workers=1            # รันทีละ test ไม่ขนานกัน
npm run test:headed                        # รันแบบเห็น browser
npm run report                             # เปิด HTML report
npm run typecheck                          # ตรวจ type
```

- รันบนเครื่อง: เปิด browser ให้เห็น (headed) / บน CI (`CI` env): headless และ retry 2 ครั้ง
- `actionTimeout` 15 วินาที, เก็บ screenshot เมื่อ fail และ trace เมื่อ retry

## โครงสร้างโปรเจกต์
| Folder | เก็บอะไร | ห้ามมี |
|---|---|---|
| `locators/` | วิธีหา element (`getByRole`, `getByText`, xpath, ...) | action, test data |
| `keywords/` | 1 class ต่อ 1 หน้า `constructor(private page: Page)`: action (`clickX`, `fillX`) และ verification (`verifyX` ที่มี `expect` + ค่าที่คาดหวัง) สร้างจาก locator | `page.locator` / `getBy*` / xpath |
| `fixtures/` | `fixture.ts`: ที่เดียวที่ import locator / keyword / test data. Export `TestFixtures` (สร้าง keyword ทุกตัว ใช้ใน spec), `locator` (ใช้ใน keyword), `testData` (แยกตามหน้า ใช้ใน spec) | logic, locator, ค่า data |
| `tests/` | `TCS<no>_<whatItDoes>.spec.ts`: สร้าง `fixture = new TestFixtures(page)` ใน `beforeEach` แล้วเรียก `fixture.<page>Keyword.<keyword>()` เรียงกันตรงๆ แบ่ง section ด้วย comment | `expect`, locator, `test.step` (import แค่ `TestFixtures`, `testData` จาก `fixtures/fixture`) |
| `test-data/` | ข้อมูล input เป็น `.json` (เบอร์โทร, email, ...) | ผลลัพธ์ที่คาดหวัง (header, message, ...) |

`{timestamp}` ใน `test-data/register.data.json` จะถูกแทนด้วยเวลาปัจจุบันตอนรัน เพื่อให้ email / ชื่อบริษัทไม่ซ้ำกัน

### เพิ่มหน้าใหม่
1. สร้าง `locators/<page>.locator.ts`, `keywords/<page>.keyword.ts` และ (ถ้ามี) `test-data/<page>.data.json`
2. ใน `fixtures/fixture.ts`: import ทั้ง 3 ไฟล์, เพิ่ม keyword เป็น property + `new` ใน constructor ของ `TestFixtures`, เพิ่ม locator ใน `locator`, data ใน `testData`

## การตั้งชื่อ locator: `elementType_name` (name เป็น camelCase)
ชื่อ locator ต้องไม่ซ้ำกันทุกหน้า (เช่น `lbl_privacyPolicyHeader`)

| Prefix | Element | ตัวอย่าง |
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
