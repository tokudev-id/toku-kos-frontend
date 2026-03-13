# Feature Specification: Pembayaran — Payment Recording & History

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Pembayaran (Payment)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Payment Recording & History (Pembayaran)** — a page that serves as the official log of all rent and invoice payments received from tenants, categorized by payment method. It is the collection-side ledger that updates invoice statuses to "Lunas" and feeds into cashflow reporting.

### Purpose
To provide landlords with a structured, chronological record of every payment received — who paid, which invoice was settled, when it was paid, and via which payment method (Transfer, E-Wallet, Tunai). This history is the source of truth for income data used in Laporan.

### Problem It Solves
- Without a formal payment log, landlords rely on chat messages or handwritten receipts to confirm payments, which are easily lost or disputed.
- Multi-method payments (bank transfer, e-wallet, cash) need to be tracked consistently to reconcile with bank statements.
- Recording a payment automatically updates the linked invoice status to "Lunas", eliminating manual double-entry.
- The payment history feeds directly into income totals on the Dashboard and Laporan pages.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Pembayaran" — bold heading |
| Subtitle | "Riwayat pencatatan pembayaran." |
| "+ Catat Pembayaran" button | Primary CTA in teal; opens the "Catat Pembayaran" modal to record a new payment |

### Payment History Table
| Column | Description |
|---|---|
| Tanggal | Date the payment was received (format: D/M/YYYY, e.g., "3/2/2026") |
| Penyewa | Tenant name in bold |
| No. Invoice | Invoice number the payment applies to (links to that invoice) |
| Metode | Payment method badge (color-coded) |
| Jumlah | Payment amount in Rupiah (right-aligned) |

### Payment Method Badges
| Method | Badge Color | Description |
|---|---|---|
| Transfer | Green (teal) | Bank transfer / RTGS / SKN |
| E-Wallet | Green (light) | GoPay, OVO, DANA, ShopeePay, etc. |
| Tunai | Green (muted) | Cash payment |

### Sample Payment Data (from screenshot)
| Tanggal | Penyewa | No. Invoice | Metode | Jumlah |
|---|---|---|---|---|
| 3/2/2026 | Ahmad Fauzi | INV-202602-0001 | Transfer | Rp 1.500.000 |
| 4/2/2026 | Siti Nurhaliza | INV-202602-0002 | E-Wallet | Rp 1.575.000 |
| 5/2/2026 | Rizky Pratama | INV-202602-0005 | Tunai | Rp 1.500.000 |

### "Catat Pembayaran" Modal
*(Not shown in screenshot but inferred from the "+ Catat Pembayaran" CTA and data structure)*

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Penyewa * | Dropdown | "Pilih penyewa" | Required | Select the tenant making the payment |
| No. Invoice * | Dropdown | "Pilih invoice" | Required | Invoice to be settled; filtered by selected tenant, shows only unpaid invoices |
| Jumlah (Rp) * | Number input | Invoice total amount | Required; positive integer | Amount received; defaults to the invoice total for full payment |
| Metode Pembayaran * | Dropdown/radio | "Transfer" | Required | Options: Transfer, E-Wallet, Tunai |
| Tanggal Pembayaran | Date picker | Today | Required | Date the payment was actually received |
| Catatan | Text input | Empty | Optional | Notes (e.g., reference number, e-wallet transaction ID) |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Simpan | Primary (teal) | Records the payment; updates invoice status to "Lunas" |

---

## 3. User Flow

### Entry Point
Accessible via "Pembayaran" in the sidebar navigation. Also reachable by clicking a payment action from the Tagihan page.

### Step-by-Step Flow

```
1. User navigates to Pembayaran
   → System fetches all payment records for the authenticated tenant
   → Table renders with date, tenant, invoice number, method, and amount
   → Sorted by date descending (most recent payments first)

2. User reviews payment history
   → Confirms which tenants have paid and via which method
   → Cross-references with bank statement or e-wallet record

3. User clicks "+ Catat Pembayaran"
   → "Catat Pembayaran" modal opens
   → User selects a tenant from the dropdown
   → System filters available invoices to that tenant's unpaid/pending invoices
   → User selects the invoice to settle
   → Amount auto-populates with the invoice total; user can override for partial payment
   → User selects payment method (Transfer, E-Wallet, Tunai)
   → Sets payment date (defaults to today)
   → Optionally adds a note (e.g., transaction reference number)
   → Clicks "Simpan"
   → Payment record is created
   → Linked invoice status is updated to "Lunas"
   → Modal closes; payment table refreshes with the new record
   → Dashboard cashflow and "Sudah Bayar" KPI update accordingly
   → Success toast: "Pembayaran berhasil dicatat."

4. (Optional) User scrolls to find a specific payment
   → Future: search/filter by tenant or date range
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display all payment records in a table with columns: Tanggal, Penyewa, No. Invoice, Metode, Jumlah |
| FR-02 | Payment method must render as a color-coded badge (Transfer, E-Wallet, Tunai) |
| FR-03 | "+ Catat Pembayaran" button opens a modal to record a new payment |
| FR-04 | Catat Pembayaran modal must require: Penyewa, No. Invoice (filtered by tenant), Jumlah, Metode, Tanggal |
| FR-05 | On saving a payment, the linked invoice's status must be updated to "Lunas" |
| FR-06 | Invoice dropdown in modal must only show unpaid invoices (status: terkirim or jatuh_tempo) for the selected tenant |
| FR-07 | Jumlah must default to the selected invoice's total amount but be editable for partial payments |
| FR-08 | Table must be sorted by date descending by default |
| FR-09 | All payment records must be scoped to the authenticated tenant |
| FR-10 | Payment history feeds into the Dashboard "Sudah Bayar" KPI and Laporan income totals |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Payments
```
GET /api/payments?page=1&limit=20
Authorization: Bearer <token>

Response 200:
{
  "total": 3,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "uuid",
      "date": "2026-02-03",
      "residentName": "Ahmad Fauzi",
      "invoiceNumber": "INV-202602-0001",
      "invoiceId": "uuid",
      "method": "transfer",
      "amount": 1500000,
      "notes": null,
      "createdAt": "2026-02-03T10:00:00Z"
    },
    {
      "id": "uuid",
      "date": "2026-02-04",
      "residentName": "Siti Nurhaliza",
      "invoiceNumber": "INV-202602-0002",
      "invoiceId": "uuid",
      "method": "e_wallet",
      "amount": 1575000,
      "notes": null,
      "createdAt": "2026-02-04T09:00:00Z"
    }
  ]
}
```

#### Record Payment
```
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "invoiceId": "uuid",
  "amount": 1500000,
  "method": "transfer",
  "date": "2026-03-05",
  "notes": "BCA ref #123456"
}

Response 201:
{
  "id": "uuid",
  "invoiceId": "uuid",
  "invoiceNumber": "INV-202603-0001",
  "residentName": "Ahmad Fauzi",
  "amount": 1500000,
  "method": "transfer",
  "date": "2026-03-05",
  "createdAt": "2026-03-05T11:00:00Z"
}
```

#### Get Unpaid Invoices for a Resident (for modal dropdown)
```
GET /api/residents/:residentId/invoices/unpaid
Authorization: Bearer <token>

Response 200:
{
  "invoices": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-202603-0002",
      "period": "2026-03",
      "dueDate": "2026-03-05",
      "totalAmount": 1575000
    }
  ]
}
```

### Business Logic
- **Invoice status update**: When a payment is recorded for the full invoice amount, the invoice status transitions to `lunas` atomically (within the same DB transaction).
- **Partial payment**: If `amount < invoice.totalAmount`, the invoice remains in `terkirim` or `jatuh_tempo` status; a partial payment record is stored. Full settlement requires the remaining balance to be covered by a subsequent payment.
- **Method enum**: Accepted values are `transfer`, `e_wallet`, `tunai`.
- **Tenant scoping**: Payment creation verifies the referenced `invoiceId` belongs to the authenticated tenant.
- **Dashboard impact**: The `sudah_bayar` KPI on the dashboard aggregates all payment amounts received in the current calendar month.

---

## 6. Data Model

### `payments` Table
```sql
CREATE TABLE payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  invoice_id  UUID NOT NULL REFERENCES invoices(id),
  resident_id UUID NOT NULL REFERENCES residents(id),
  amount      BIGINT NOT NULL CHECK (amount > 0),
  method      VARCHAR(20) NOT NULL
                CHECK (method IN ('transfer', 'e_wallet', 'tunai')),
  date        DATE NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_resident ON payments(resident_id);
CREATE INDEX idx_payments_date ON payments(date);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No payments recorded yet | Empty state: "Belum ada pembayaran yang dicatat." |
| E-02 | Tenant has no unpaid invoices | Invoice dropdown in modal shows "Tidak ada invoice yang belum dibayar." ; "Simpan" disabled |
| E-03 | Payment amount exceeds invoice total | Warn: "Jumlah melebihi total tagihan. Kelebihan tidak akan dikembalikan otomatis." |
| E-04 | Duplicate payment on same invoice | If invoice is already `lunas`, warn: "Invoice ini sudah lunas." and block re-payment |
| E-05 | Partial payment | Allowed; invoice stays unpaid until cumulative payments reach the total |
| E-06 | Payment date in the future | Allow (post-dated recording) but show a soft warning |
| E-07 | Payment date more than 1 year ago | Allow (historical entry) with no error |
| E-08 | Network error on save | Error toast: "Gagal mencatat pembayaran. Coba lagi." without closing modal |
| E-09 | Concurrent payment recording for same invoice | Use DB transaction + optimistic locking; second request fails gracefully with 409 |
| E-10 | Long list of payments (100+) | Table must paginate; default page size: 20 |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant payment access | All queries filter by `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/payments/*` endpoints require valid JWT; return `401` |
| S-03 | Record payment for another tenant's invoice | Verify `invoice.tenant_id == currentTenantId` before creating payment; return `403` |
| S-04 | Negative or zero payment amount | Validate server-side: `amount > 0`; reject with `400 Bad Request` |
| S-05 | SQL injection in notes field | Use parameterized queries for all DB operations |
| S-06 | Race condition on invoice status update | Wrap payment creation and invoice status update in a single DB transaction |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Search & filter** | Add search by tenant name and filter by payment method or date range |
| I-02 | **Payment receipt generation** | Generate a PDF receipt per payment for sharing with tenants |
| I-03 | **Payment deletion / void** | Allow voiding a mistakenly recorded payment (with reason) |
| I-04 | **Partial payment progress bar** | Show how much of an invoice has been paid vs. remaining balance |
| I-05 | **WhatsApp payment confirmation** | After recording, offer "Kirim konfirmasi WhatsApp" to notify the tenant automatically |
| I-06 | **Bank reconciliation view** | Import bank statement CSV and auto-match transactions to invoices |
| I-07 | **Monthly income summary card** | Add a "Total Diterima Bulan Ini" summary above the table |
| I-08 | **Per-tenant payment history** | From a tenant's profile, view all their historical payments in one place |
| I-09 | **Export to CSV** | Download payment history for accounting or audit purposes |
| I-10 | **E-wallet deep links** | Add quick-pay links (GoPay, OVO) per invoice for faster tenant self-payment |

---

## 10. Feature Summary

The **Pembayaran** page is the income recording hub of Living Kost Pro — the formal ledger entry point for all rent and invoice payments received from tenants. It is composed of:

1. **Payment History Table** — A chronological, read-only log of every recorded payment showing date, tenant, invoice reference, payment method (Transfer, E-Wallet, Tunai as color-coded badges), and amount. This provides a clean audit trail for the landlord and is the authoritative source for income data fed into the Dashboard ("Sudah Bayar" KPI) and Laporan (cashflow totals).

2. **Catat Pembayaran Modal** — A focused data-entry form for recording incoming payments. The landlord selects the tenant and the specific invoice to settle, confirms the amount (defaulting to the invoice total), and selects the payment method and date. Upon saving, the linked invoice is atomically marked as "Lunas", ensuring consistent state across the Tagihan and Pembayaran pages without manual cross-page updates.

The design deliberately keeps the payment history read-only (no inline editing) to preserve financial record integrity, with any corrections handled via void/delete workflows.
