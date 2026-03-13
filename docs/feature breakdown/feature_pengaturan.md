# Feature Specification: Pengaturan — Settings & Business Profile

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Pengaturan (Settings)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Settings & Business Profile (Pengaturan)** — a configuration page that allows kos property owners to manage their business identity and define system-wide billing rules. It is divided into two sections: **Profil Usaha** (Business Profile) and **Aturan Billing & Denda** (Billing & Late Fee Rules).

### Purpose
To centralize all account-level configuration in one place: brand identity (name, email, phone, bank account) used across invoices and WhatsApp messages, and global billing rules (billing date, late fee policy) applied automatically to all invoices.

### Problem It Solves
- Invoice and WhatsApp reminder messages need to include the landlord's business name, bank transfer details, and contact number; without a profile, these appear blank or generic.
- Different landlords have different billing dates (1st, 5th, 10th of the month) and late fee policies; a fixed system would not accommodate this variance.
- Flat vs. percentage-based late fees are both common practices; supporting both avoids forcing landlords to adapt their business to the software.
- Centralized settings eliminate the need to update business information in multiple places when it changes.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Pengaturan" — bold heading |
| Subtitle | "Kelola profil usaha dan preferensi." |

### Section 1: Profil Usaha
Displayed in a white card with a building icon and "Profil Usaha" section header.

| Field | Type | Default / Example Value | Description |
|---|---|---|---|
| Nama Brand | Text input | "Kost Harmoni Group" | Business/brand name displayed on invoices and WhatsApp messages |
| Email Kontak | Text input | "admin@harmonigroup.com" | Contact email for business correspondence; validates email format |
| No. WhatsApp | Text input | "081234567890" | WhatsApp business number used as the sender for automated reminders |
| Rekening Bank | Text input | "BCA 1234567890 a.n. Harmoni Group" | Bank account details shown on invoices for tenant payment reference |

### Section 2: Aturan Billing & Denda
Displayed below Profil Usaha within the same card.

| Field | Type | Default / Example Value | Description |
|---|---|---|---|
| Tanggal Billing | Number input | 1 | Day of month (1–28) on which invoices are auto-generated or due |
| Tipe Denda | Dropdown | "Flat (Rp/hari)" | Late fee type; options: Flat (Rp/hari), Persentase (%/hari) |
| Denda/Hari (Rp) | Number input | 50000 | Late fee amount per day; shown when Tipe Denda = "Flat"; hidden/replaced when Persentase is selected |

### "Simpan Pengaturan" Button
| Component | Description |
|---|---|
| Button | Primary teal button with a save/disk icon; label "Simpan Pengaturan" |
| Placement | Bottom-right of the settings card |
| Behavior | Saves all settings in Profil Usaha and Aturan Billing & Denda in a single submit |

---

## 3. User Flow

### Entry Point
Accessible via "Pengaturan" in the sidebar navigation under the AKUN section. Typically visited during initial onboarding and when business information changes.

### Step-by-Step Flow

```
1. User navigates to Pengaturan
   → System fetches current settings for the authenticated tenant
   → All fields are pre-filled with saved values

2. User updates Profil Usaha
   → Edits one or more fields: Nama Brand, Email Kontak, No. WhatsApp, Rekening Bank
   → Changes are held in form state until "Simpan Pengaturan" is clicked

3. User configures Aturan Billing & Denda
   → Sets Tanggal Billing (e.g., "1" = invoices are due on the 1st of each month)
   → Selects Tipe Denda from dropdown:
     → "Flat (Rp/hari)": shows "Denda/Hari (Rp)" input; user sets a fixed amount per day
     → "Persentase (%/hari)": "Denda/Hari" label changes to "Denda/Hari (%)" and accepts a percentage
   → Inputs the fine rate

4. User clicks "Simpan Pengaturan"
   → All fields are validated
   → Settings are saved to the backend
   → Success toast: "Pengaturan berhasil disimpan."

5. Settings take effect globally
   → Nama Brand and Rekening Bank now appear on new invoices
   → Tanggal Billing is used by the billing engine as the default due date for new invoices
   → Denda rules are applied when calculating overdue amounts on unpaid invoices
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display a settings page divided into two sections: "Profil Usaha" and "Aturan Billing & Denda" |
| FR-02 | Profil Usaha section must include: Nama Brand, Email Kontak, No. WhatsApp, Rekening Bank |
| FR-03 | All Profil Usaha fields must be pre-filled with saved values on page load |
| FR-04 | Aturan Billing & Denda must include: Tanggal Billing (number, 1–28), Tipe Denda (dropdown), and the corresponding fine rate field |
| FR-05 | Tipe Denda dropdown must offer: "Flat (Rp/hari)" and "Persentase (%/hari)" |
| FR-06 | When Tipe Denda = "Flat (Rp/hari)", show "Denda/Hari (Rp)" as a Rupiah amount input |
| FR-07 | When Tipe Denda = "Persentase (%/hari)", show "Denda/Hari (%)" as a percentage input |
| FR-08 | "Simpan Pengaturan" button must save all sections in a single API call |
| FR-09 | Nama Brand and Rekening Bank must propagate to invoice templates |
| FR-10 | Tanggal Billing must be used as the default due date when creating new invoices |
| FR-11 | All settings must be scoped to the authenticated tenant (each tenant has their own configuration) |
| FR-12 | Email Kontak must be validated for valid email format before saving |

---

## 5. Backend Requirements

### API Endpoints

#### Get Settings
```
GET /api/settings
Authorization: Bearer <token>

Response 200:
{
  "brandName": "Kost Harmoni Group",
  "contactEmail": "admin@harmonigroup.com",
  "whatsappNumber": "081234567890",
  "bankAccount": "BCA 1234567890 a.n. Harmoni Group",
  "billingDate": 1,
  "lateFeeType": "flat",
  "lateFeeAmount": 50000
}
```

#### Update Settings
```
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "brandName": "Kost Harmoni Group",
  "contactEmail": "admin@harmonigroup.com",
  "whatsappNumber": "081234567890",
  "bankAccount": "BCA 1234567890 a.n. Harmoni Group",
  "billingDate": 1,
  "lateFeeType": "flat",
  "lateFeeAmount": 50000
}

Response 200:
{
  "success": true,
  "message": "Settings saved successfully.",
  "updatedAt": "2026-03-12T10:00:00Z"
}
```

### Business Logic
- **Billing Date**: Stored as an integer (1–28). Day 29, 30, 31 are excluded to handle months with fewer days (February). When generating invoices, `due_date` defaults to `{current_month}-{billingDate}` or `{next_month}-{billingDate}` based on the period.
- **Late Fee — Flat**: A fixed Rp amount per day is added for each day past the `due_date` that the invoice remains unpaid. `total_late_fee = lateFeeAmount × overdue_days`.
- **Late Fee — Percentage**: A percentage of the invoice total per day is charged. `total_late_fee = (invoiceTotal × lateFeePercent / 100) × overdue_days`.
- **Late fee application**: Late fees are calculated at invoice view or export time (not stored separately unless explicitly surfaced).
- **Settings initialization**: When a new tenant registers, a default `settings` record is created with sensible defaults (billingDate: 1, lateFeeType: flat, lateFeeAmount: 0).
- **Tenant scoping**: Settings table has a 1:1 relationship with the `tenants` table.

---

## 6. Data Model

### `tenant_settings` Table
```sql
CREATE TABLE tenant_settings (
  tenant_id         UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  brand_name        VARCHAR(255),
  contact_email     VARCHAR(255),
  whatsapp_number   VARCHAR(20),
  bank_account      VARCHAR(255),
  billing_date      INTEGER NOT NULL DEFAULT 1
                      CHECK (billing_date BETWEEN 1 AND 28),
  late_fee_type     VARCHAR(15) NOT NULL DEFAULT 'flat'
                      CHECK (late_fee_type IN ('flat', 'percentage')),
  late_fee_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0
                      CHECK (late_fee_amount >= 0),
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);
```

> `late_fee_amount` is used as either a Rupiah flat rate or a percentage value (e.g., `2.5` for 2.5%/day) depending on `late_fee_type`. The interpretation is determined by the application layer.

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | User has never configured settings | Page loads with blank/default values; user is guided to fill them before creating invoices |
| E-02 | Billing date = 29, 30, 31 | Not allowed; Tanggal Billing capped at 28; inline validation: "Tanggal harus antara 1–28." |
| E-03 | Invalid email format | Inline validation error: "Format email tidak valid." save is blocked |
| E-04 | WhatsApp number with non-numeric characters | Inline validation: "No. WhatsApp hanya boleh berisi angka." |
| E-05 | Late fee amount = 0 | Allowed; means no late fee is charged (effectively disabled) |
| E-06 | Late fee percentage > 100 | Warn or block: "Persentase denda tidak boleh melebihi 100%." |
| E-07 | Switching Tipe Denda from Flat to Persentase | Input field label updates; previous value is cleared to prevent accidental large-percentage entries |
| E-08 | Nama Brand left empty | Allowed (optional for branded invoices), but invoices will show a fallback (e.g., owner's name or app name) |
| E-09 | Rekening Bank left empty | Allowed; invoices will omit the bank account section |
| E-10 | Network error on save | Error toast: "Gagal menyimpan pengaturan. Coba lagi." All edits remain in the form |
| E-11 | Changing billing date affects existing invoices | Billing date only applies to future invoice generation; existing invoices retain their original due dates |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant settings access | Settings are keyed by `tenant_id`; `GET /api/settings` returns only the authenticated tenant's settings |
| S-02 | Unauthenticated access | `/api/settings` endpoints require valid JWT; return `401` |
| S-03 | Settings update spoofing | `PUT /api/settings` uses `tenant_id` from the JWT claim, not from the request body; body-supplied `tenant_id` is ignored |
| S-04 | Input injection in text fields | All string fields use parameterized queries; sanitize before DB write |
| S-05 | WhatsApp number used in URLs | Phone number is validated (digits only, 10–15 characters) before being embedded in WhatsApp chat links |
| S-06 | Bank account data as sensitive info | Treat `bank_account` as semi-sensitive; ensure HTTPS-only transport; do not log in plain text |
| S-07 | Mass assignment | Only accept whitelisted settings fields; reject any additional fields in the request body |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Business logo upload** | Allow uploading a logo displayed on invoice PDFs and the app header |
| I-02 | **Multiple bank accounts** | Support registering multiple bank accounts (e.g., BCA + Mandiri) selectable per invoice |
| I-03 | **Late fee grace period** | Add a "grace period" setting (e.g., 3 days after due date before late fee starts accruing) |
| I-04 | **Invoice prefix customization** | Allow customizing the invoice number prefix (e.g., "KHR-" instead of "INV-") |
| I-05 | **Auto invoice generation** | Toggle to auto-generate invoices for all active tenants on the billing date each month |
| I-06 | **WhatsApp message template** | Edit the default WhatsApp reminder and payment confirmation message templates |
| I-07 | **Notification preferences** | Configure which events trigger in-app or email notifications (payment received, overdue alert, etc.) |
| I-08 | **Timezone setting** | Allow setting the business timezone for accurate billing date calculation |
| I-09 | **Account deletion** | Provide a secure account/data deletion flow compliant with data privacy regulations |
| I-10 | **Two-factor authentication** | Add 2FA for landlord accounts to protect sensitive business and financial data |
| I-11 | **Currency preference** | Support IDR as default; future-proofing for multi-currency if the app expands internationally |

---

## 10. Feature Summary

The **Pengaturan** page is the configuration backbone of Living Kost Pro — a single, form-based screen that stores the settings applied globally across the entire platform. It is composed of two sections:

1. **Profil Usaha** — The business identity of the landlord's kos operation: brand name, contact email, WhatsApp number, and bank account details. These values are embedded in generated invoices and WhatsApp reminder messages, ensuring every tenant-facing communication carries the correct business identity and payment instructions. Keeping this information accurate is essential for professional tenant communications and correct payment collection.

2. **Aturan Billing & Denda** — The financial rules engine of the platform: the day of the month on which invoices become due (Tanggal Billing), the type of late fee penalty (flat Rp/day or percentage %/day), and the corresponding rate. These rules give landlords full control over their billing policy without requiring any code changes — a flat Rp 50.000/day late fee is a single input, and it automatically flows into overdue invoice calculations across the app.

The single "Simpan Pengaturan" button saves all settings atomically, keeping the UX simple. Because settings are a 1:1 record per tenant (not a list), the entire page is a single-form PUT operation — no pagination, no complex state management, just a clean configuration screen that new landlords fill in once during onboarding and revisit only when their business details change.
