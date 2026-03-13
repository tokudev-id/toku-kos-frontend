# Feature Specification: Tagihan — Invoice Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Tagihan (Invoice)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Invoice Management (Tagihan)** — a page that allows kos property owners to create, view, track, and manage billing invoices for their tenants. Invoices represent the formal billing record for rent and additional charges per billing period.

### Purpose
To provide landlords with a centralized hub for all tenant billing activity — creating new invoices, monitoring payment status, filtering by status, and exporting invoice data for bookkeeping.

### Problem It Solves
- Without a structured invoicing system, landlords rely on informal notes or chat messages to track who owes what, leading to missed collections.
- Multi-item billing (rent + utilities + other charges) needs to be captured in one document per tenant per month.
- Status tracking (Lunas / Jatuh Tempo / Terkirim) gives landlords instant visibility into outstanding collections without manually checking each tenant.
- Export functionality supports external accounting and legal record-keeping.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Tagihan" — bold heading |
| Subtitle | "Kelola invoice dan tagihan penyewa." |
| "Export" button | Secondary action (outlined, with document icon); exports invoice list to CSV/Excel |
| "+ Buat Invoice" button | Primary CTA in teal; opens the "Buat Invoice Baru" modal |

### Search & Filter Bar
| Component | Description |
|---|---|
| Search input | Placeholder: "Cari no invoice atau penyewa..." — searches by invoice number or tenant name |
| Status filter dropdown | Defaults to "Semua"; options: Semua, Lunas, Terkirim, Jatuh Tempo |

### Invoice List Table
| Column | Description |
|---|---|
| No. Invoice | Auto-generated invoice number (format: `INV-YYYYMM-XXXX`) |
| Penyewa | Tenant name in bold |
| Kamar | Room code (e.g., A-101) |
| Jatuh Tempo | Invoice due date (format: YYYY-MM-DD) |
| Total | Total invoice amount in Rupiah |
| Status | Color-coded status badge |
| (Action icon) | Chat/WhatsApp bubble icon per row — sends invoice reminder via WhatsApp |

### Invoice Status Badges
| Status | Badge Color | Meaning |
|---|---|---|
| Lunas | Green (teal) | Invoice has been fully paid |
| Terkirim | Light green / gray-green | Invoice sent to tenant, awaiting payment |
| Jatuh Tempo | Red/orange | Invoice is overdue (past due date, unpaid) |

### Sample Invoice Data (from screenshot)
| No. Invoice | Penyewa | Kamar | Jatuh Tempo | Total | Status |
|---|---|---|---|---|---|
| INV-202602-0001 | Ahmad Fauzi | A-101 | 2026-02-05 | Rp 1.500.000 | Lunas |
| INV-202602-0002 | Siti Nurhaliza | A-102 | 2026-02-05 | Rp 1.575.000 | Lunas |
| INV-202602-0003 | Budi Santoso | A-201 | 2026-02-05 | Rp 2.050.000 | Jatuh Tempo |
| INV-202602-0004 | Dewi Lestari | A-203 | 2026-02-05 | Rp 2.900.000 | Terkirim |
| INV-202602-0005 | Rizky Pratama | B-101 | 2026-02-05 | Rp 1.500.000 | Lunas |
| INV-202602-0006 | Maya Putri | C-101 | 2026-02-05 | Rp 1.200.000 | Terkirim |

### "Buat Invoice Baru" Modal
Triggered by clicking the "+ Buat Invoice" button. Creates a new invoice for a selected tenant.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Penyewa * | Dropdown | "Pilih penyewa aktif" | Required | Selects an active tenant; auto-populates their room |
| Periode | Month picker | Current month | Required | Billing period (month + year) |
| Jatuh Tempo | Date picker | 5th of next month (default) | Required | Invoice due date |
| Item Tagihan | Dynamic row list | 1 row pre-set to "Sewa" | At least 1 row required | Line items for the invoice |
| Diskon (Rp) | Number input | 0 | Non-negative integer | Flat discount applied to the total |
| Total | Calculated display | Rp 0 (updates live) | Read-only | Sum of all item (qty × harga) minus discount |

### Item Tagihan Row Structure
Each row in the Item Tagihan section represents one billing line item:

| Sub-field | Type | Default | Description |
|---|---|---|---|
| Nama Item | Text input | "Sewa Kam." (for first row) | Name of the charge item; placeholder "Nama item" for added rows |
| Qty | Number input | 1 | Quantity of the item |
| Harga | Number input | Empty | Unit price in Rupiah; placeholder "Harga" |
| Kategori | Dropdown | "Sewa" (first row) / "Lainnya" (added rows) | Category of the charge; options: Sewa, Listrik, Air, Internet, Lainnya |
| Delete (🗑) | Icon button | — | Removes the row from the invoice; first row cannot be deleted (or requires at least 1 row) |

### "+ Tambah Item" Link
Located above the Diskon field. Clicking it appends a new blank Item Tagihan row with defaults: empty Nama Item, Qty = 1, empty Harga, Kategori = "Lainnya".

### Modal Footer Buttons
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Buat Invoice | Primary (teal) | Validates form and creates the invoice; auto-generates invoice number |

---

## 3. User Flow

### Entry Point
Tagihan is accessible via the sidebar navigation. It is also reachable from the Dashboard by clicking the "Total Tagihan" or "Overdue" KPI cards.

### Step-by-Step Flow

```
1. User navigates to Tagihan
   → System fetches all invoices for the authenticated tenant, sorted by due date descending
   → Table renders with invoice number, tenant name, room, due date, total, and status

2. User searches or filters invoices
   → Types in search box to filter by invoice number or tenant name
   → Selects a status from the filter dropdown (e.g., "Jatuh Tempo") to view overdue invoices only
   → Table updates in real-time

3. User reviews invoice status
   → Identifies overdue invoices (Jatuh Tempo badge in red)
   → Clicks the chat icon on a row to send a WhatsApp payment reminder to that tenant

4a. User clicks "+ Buat Invoice"
    → "Buat Invoice Baru" modal opens
    → User selects a tenant from the dropdown
    → Sets billing period (month) and due date
    → Reviews the default "Sewa Kamar" line item; fills in Harga
    → Optionally clicks "+ Tambah Item" to add utility charges (Listrik, Air, Internet, etc.)
    → Optionally fills Diskon (Rp)
    → Watches "Total" update live as values are entered
    → Clicks "Buat Invoice"
    → Invoice is created with auto-generated number; modal closes
    → Table refreshes with new invoice in "Terkirim" status
    → Success toast: "Invoice berhasil dibuat."

4b. User clicks "Export"
    → System generates and downloads a CSV/Excel file of the currently filtered invoice list
    → File name: "tagihan-export-YYYY-MM-DD.csv"
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display all invoices in a table with columns: No. Invoice, Penyewa, Kamar, Jatuh Tempo, Total, Status, and a WhatsApp action icon |
| FR-02 | Invoice number must be auto-generated in the format `INV-YYYYMM-XXXX` (sequential per tenant per month) |
| FR-03 | Status filter dropdown must filter the table by: Semua, Lunas, Terkirim, Jatuh Tempo |
| FR-04 | Search bar must filter by invoice number or tenant name (case-insensitive, partial match) |
| FR-05 | "Buat Invoice" modal must include: Penyewa (required dropdown), Periode (month picker), Jatuh Tempo (date picker), dynamic Item Tagihan rows, Diskon, and live Total calculation |
| FR-06 | Item Tagihan must support dynamic add ("+Tambah Item") and delete per row |
| FR-07 | Total must be calculated live: `SUM(qty × harga for each row) - diskon` |
| FR-08 | Invoice status must transition automatically: new invoice starts as "Terkirim"; when payment is recorded it becomes "Lunas"; when due_date passes unpaid it becomes "Jatuh Tempo" |
| FR-09 | WhatsApp icon per row must trigger a pre-composed WhatsApp message with invoice details to the tenant's registered phone number |
| FR-10 | "Export" must download the currently filtered/searched invoice list as CSV |
| FR-11 | All invoices must be scoped to the authenticated tenant (multi-tenant isolation) |
| FR-12 | Kondisi dropdown in Item Tagihan must offer: Sewa, Listrik, Air, Internet, Lainnya |
| FR-13 | Diskon value must not exceed the gross total of all line items |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Invoices
```
GET /api/invoices?status=&search=&page=1&limit=20
Authorization: Bearer <token>

Query Params:
  status  string  optional  (lunas | terkirim | jatuh_tempo)
  search  string  optional  (invoice number or tenant name)
  page    integer optional  default: 1
  limit   integer optional  default: 20

Response 200:
{
  "total": 6,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-202602-0001",
      "tenantName": "Ahmad Fauzi",
      "roomCode": "A-101",
      "dueDate": "2026-02-05",
      "totalAmount": 1500000,
      "status": "lunas"
    }
  ]
}
```

#### Get Invoice Detail
```
GET /api/invoices/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "invoiceNumber": "INV-202602-0001",
  "residentId": "uuid",
  "tenantName": "Ahmad Fauzi",
  "roomCode": "A-101",
  "period": "2026-02",
  "dueDate": "2026-02-05",
  "items": [
    { "name": "Sewa Kamar", "qty": 1, "price": 1500000, "category": "sewa" }
  ],
  "discount": 0,
  "totalAmount": 1500000,
  "status": "lunas",
  "createdAt": "2026-02-01T08:00:00Z"
}
```

#### Create Invoice
```
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "residentId": "uuid",
  "period": "2026-03",
  "dueDate": "2026-03-05",
  "items": [
    { "name": "Sewa Kamar", "qty": 1, "price": 1500000, "category": "sewa" },
    { "name": "Listrik", "qty": 1, "price": 75000, "category": "listrik" }
  ],
  "discount": 0
}

Response 201:
{
  "id": "uuid",
  "invoiceNumber": "INV-202603-0001",
  "totalAmount": 1575000,
  "status": "terkirim",
  "createdAt": "2026-03-12T09:00:00Z"
}
```

#### Export Invoices
```
GET /api/invoices/export?status=&search=
Authorization: Bearer <token>

Response 200:
Content-Type: text/csv
Content-Disposition: attachment; filename="tagihan-export-2026-03-12.csv"

(CSV file with all matching invoices)
```

### Business Logic
- **Invoice number generation**: `INV-{YYYYMM}-{XXXX}` where XXXX is a zero-padded sequential counter per tenant per month (resets each month).
- **Status transitions**:
  - Created → `terkirim`
  - Payment recorded for full amount → `lunas`
  - `due_date < NOW()` AND status is not `lunas` → `jatuh_tempo` (evaluated by a scheduled job or on-read)
- **Total calculation**: `SUM(item.qty × item.price) - discount`; discount must not make total negative (floor at 0).
- **Penyewa dropdown**: Only active residents (currently assigned to a room) are listed.
- **WhatsApp trigger**: Composing a message URL with invoice number, amount, and due date using the resident's saved phone number.

---

## 6. Data Model

### `invoices` Table
```sql
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  resident_id     UUID NOT NULL REFERENCES residents(id),
  room_id         UUID NOT NULL REFERENCES rooms(id),
  invoice_number  VARCHAR(20) NOT NULL UNIQUE,
  period          VARCHAR(7) NOT NULL,             -- 'YYYY-MM'
  due_date        DATE NOT NULL,
  discount        BIGINT NOT NULL DEFAULT 0,
  total_amount    BIGINT NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'terkirim'
                    CHECK (status IN ('terkirim', 'lunas', 'jatuh_tempo')),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_resident ON invoices(resident_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

### `invoice_items` Table
```sql
CREATE TABLE invoice_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 1,
  price       BIGINT NOT NULL,
  category    VARCHAR(20) NOT NULL DEFAULT 'lainnya'
                CHECK (category IN ('sewa', 'listrik', 'air', 'internet', 'lainnya')),
  subtotal    BIGINT GENERATED ALWAYS AS (qty * price) STORED
);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No invoices exist yet | Empty state: "Belum ada tagihan. Klik '+ Buat Invoice' untuk membuat tagihan pertama." |
| E-02 | Search returns no results | Show: "Tidak ada invoice yang cocok dengan pencarian Anda." |
| E-03 | All Item Tagihan rows deleted | Require at least 1 row; "Tambah Item" CTA is emphasized; "Buat Invoice" is disabled |
| E-04 | Harga left empty on submit | Inline validation: "Harga tidak boleh kosong." |
| E-05 | Diskon > gross total | Inline validation: "Diskon tidak boleh melebihi total tagihan." Total floors at Rp 0 |
| E-06 | Tenant has no phone number for WhatsApp | Show a warning tooltip: "Nomor WhatsApp belum terdaftar untuk penyewa ini." |
| E-07 | Duplicate invoice for same tenant + period | System warns: "Invoice untuk periode ini sudah ada." but allows creation with confirmation |
| E-08 | Invoice already paid — status update race condition | Payment recording sets status to `lunas` atomically; duplicate payment attempts return 409 |
| E-09 | Very long tenant name in table | Truncated with ellipsis; full name visible on hover |
| E-10 | Export with no invoices visible (filtered) | Downloads an empty CSV with headers only; shows toast: "Tidak ada data untuk diekspor." |
| E-11 | Due date is in the past when creating | Allow creation but warn: "Tanggal jatuh tempo sudah lewat. Invoice akan langsung berstatus Jatuh Tempo." |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant invoice access | All queries filter by `WHERE tenant_id = :currentTenantId` server-side |
| S-02 | Unauthenticated access | All `/api/invoices/*` endpoints require valid JWT; return `401` if absent or expired |
| S-03 | Invoice number predictability | Sequential numbers are fine for UX; no sensitive data exposed via the number format |
| S-04 | Input injection in item names | All string inputs use parameterized queries; sanitize before DB write |
| S-05 | Negative price or quantity | Validate server-side: `qty >= 1`, `price >= 0`; reject with `400 Bad Request` |
| S-06 | Resident ownership verification | On create, verify that `residentId` belongs to the authenticated `tenant_id` |
| S-07 | WhatsApp URL injection | Phone numbers must be validated (digits only, valid length) before embedding in WhatsApp URL |
| S-08 | Export data exposure | Export endpoint must apply the same tenant scoping and status/search filters as the list endpoint |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Invoice detail/view page** | Clicking a row navigates to a full invoice detail page with printable PDF layout |
| I-02 | **Bulk invoice generation** | Generate invoices for all active tenants in one click at the start of each month |
| I-03 | **Recurring invoice templates** | Save a tenant's billing items as a template that auto-fills on next month's invoice |
| I-04 | **Send invoice via WhatsApp** | Direct "Kirim Invoice" button that sends a formatted message with all line items |
| I-05 | **Partial payment tracking** | Track partial payments against an invoice; show remaining balance |
| I-06 | **Invoice PDF download** | Generate a printable PDF invoice per entry for sharing with tenants |
| I-07 | **Date range filter** | Filter invoices by creation date or due date range |
| I-08 | **Column sorting** | Allow sorting table by Due Date, Total, or Status |
| I-09 | **Auto status refresh** | Real-time status update when a payment is recorded from the Pembayaran page |
| I-10 | **Invoice edit** | Allow editing an unsent/unpaid invoice (before `lunas`) to correct item errors |

---

## 10. Feature Summary

The **Tagihan** page is the invoicing engine of Living Kost Pro, enabling landlords to formalize their rent collection process. It consists of two main surfaces:

1. **Invoice List** — A searchable, filterable table of all tenant invoices showing invoice number, tenant, room, due date, total, and status at a glance. Status badges (Lunas, Terkirim, Jatuh Tempo) provide instant collection health visibility. A WhatsApp icon per row allows one-click follow-ups.

2. **Buat Invoice Modal** — A structured form to create new invoices with flexible multi-item billing. Landlords select a tenant, set the billing period and due date, and compose line items (rent, utilities, other charges) with individual categories, quantities, and prices. A live-calculated total with optional discount gives immediate feedback before submission.

The auto-generated invoice numbering (`INV-YYYYMM-XXXX`) provides a traceable paper trail, and the export feature bridges the app with external accounting workflows.
