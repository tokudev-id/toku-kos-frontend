# Feature Specification: Pengeluaran & Inventaris Kamar — Expense & Room Inventory Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Pengeluaran (Expenses) & Inventaris Kamar (Room Inventory)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Pengeluaran & Inventaris Kamar** — a dual-tab page that consolidates two related operational tracking functions:
1. **Pengeluaran** (Expenses): recording and monitoring all operational costs incurred by the kos property (staff wages, utilities, maintenance, consumables).
2. **Inventaris Kamar** (Room Inventory): viewing and managing the physical inventory items assigned to each individual room (derived from the inventory template at room creation time).

### Purpose
To give landlords a single place to track money going out (expenses per property) and the physical asset condition of their rooms, complementing the income tracking done in Tagihan and Pembayaran.

### Problem It Solves
- Operational costs for kos properties (electricity, water, repairs, staff salaries) are numerous and span multiple categories; tracking them informally leads to poor financial visibility.
- Without categorized expense tracking, landlords cannot compute true net income or identify cost-reduction opportunities.
- Room inventory condition needs to be monitored over time (e.g., items damaged or lost between tenants); a centralized view per room enables accountability.
- The total expense summary gives landlords an at-a-glance number for the current period.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Pengeluaran & Inventaris" — bold heading |
| Subtitle | "Kelola biaya operasional dan inventaris kamar kost Anda." |
| "+ Tambah Pengeluaran" button | Primary CTA in teal (visible on the Pengeluaran tab); opens "Tambah Pengeluaran" modal |

### Tab Navigation
| Tab | Icon | Description |
|---|---|---|
| Pengeluaran | Document/list icon | Active tab; shows the expense list |
| Inventaris Kamar | Gear/inventory icon | Shows the per-room inventory view |

### Pengeluaran Tab

#### Search & Filter Bar
| Component | Description |
|---|---|
| Search input | Placeholder: "Cari pengeluaran..." — searches by title/description |
| Category filter dropdown | Defaults to "Semua Kategori"; lists all available expense categories |

#### Total Pengeluaran Summary Card
| Component | Description |
|---|---|
| Label | "Total Pengeluaran" |
| Value | Total sum of all expenses in the current view, displayed in teal (e.g., Rp 5.390.000) |
| Calendar icon | Top-right of the card; likely opens a date-range picker for period filtering |

#### Expense List Table
| Column | Description |
|---|---|
| Tanggal | Expense date (format: DD Mon YYYY, e.g., "01 Feb 2026") |
| Judul | Expense title (bold) with a subtitle description below |
| Kategori | Color-coded category badge |
| Properti | Property name this expense belongs to |
| Jumlah | Expense amount in Rupiah (right-aligned) |
| (Delete icon) | Trash icon to delete the expense record |

#### Expense Category Badges (from sample data)
| Category | Example |
|---|---|
| Gaji Staff / Penjaga Kost | Staff wages |
| Pembayaran Air Bulanan | Monthly water bill |
| Pembayaran Listrik Bulanan | Monthly electricity bill |
| Alat-alat Kost (Plastik Sampah, dll) | Household supplies |
| Tabung Gas Dapur | Kitchen gas cylinder |
| Renovasi / Perbaikan | Repair and renovation |

#### Sample Expense Data (from screenshot)
| Tanggal | Judul | Kategori | Properti | Jumlah |
|---|---|---|---|---|
| 01 Feb 2026 | Gaji Pak Budi - Penjaga | Gaji Staff / Penjaga Kost | Kost Harmoni Residence | Rp 2.500.000 |
| 05 Feb 2026 | PDAM Februari | Pembayaran Air Bulanan | Kost Harmoni Residence | Rp 850.000 |
| 05 Feb 2026 | PLN Februari | Pembayaran Listrik Bulanan | Kost Harmoni Residence | Rp 1.200.000 |
| 10 Feb 2026 | Plastik Sampah & Sabun | Alat-alat Kost (Plastik Sampah, dll) | Kost Harmoni Residence | Rp 150.000 |
| 12 Feb 2026 | Tabung Gas 12kg x 2 | Tabung Gas Dapur | Kost Cendana House | Rp 340.000 |
| 20 Feb 2026 | Perbaikan pipa bocor kamar B-101 | Renovasi / Perbaikan | Kost Harmoni Residence | Rp 350.000 |

### "Tambah Pengeluaran" Modal
Triggered by clicking "+ Tambah Pengeluaran". Creates a new expense record.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Kategori * | Dropdown | "Gaji Staff / Penjaga Kost" (first category) | Required | Expense category; full list in Section 5 |
| Judul * | Text input | Empty | Required | Short title/name of the expense; placeholder: "Contoh: Gaji penjaga Februari" |
| Jumlah (Rp) * | Number input | 0 | Required; non-negative integer | Expense amount in Rupiah |
| Tanggal | Date picker | Today's date | Required | Date the expense was incurred |
| Keterangan | Textarea | Empty | Optional | Detailed notes about the expense; placeholder: "Detail pengeluaran..." |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Simpan | Primary (teal) | Submits the form; saves the new expense record |

### Inventaris Kamar Tab
*(Second tab; UI not fully shown in screenshots — described based on context from Inventaris Template feature)*

The Inventaris Kamar tab shows a per-room view of all inventory items assigned during room creation. Likely includes:
- Room selector or room list
- Table of items per room: Nama Item, Qty, Kondisi, Harga Beli, Catatan
- Ability to update item condition per room (e.g., mark as "rusak ringan")

---

## 3. User Flow

### Entry Point
Accessible via "Pengeluaran" in the sidebar navigation. Defaults to the **Pengeluaran** tab.

### Step-by-Step Flow

```
1. User navigates to Pengeluaran
   → System fetches all expense records for the authenticated tenant
   → Total Pengeluaran summary is computed and displayed
   → Expense table renders sorted by date descending

2. User reviews expenses
   → Scans the list for completeness by month/category
   → Uses search or category filter to narrow view

3a. User clicks "+ Tambah Pengeluaran"
    → "Tambah Pengeluaran" modal opens
    → User selects a Kategori from the dropdown
    → Fills in Judul (title), Jumlah (amount), and Tanggal
    → Optionally adds Keterangan (notes)
    → Clicks "Simpan"
    → Modal closes; expense is added to the list
    → Total Pengeluaran updates to reflect the new amount
    → Success toast: "Pengeluaran berhasil ditambahkan."

3b. User clicks the delete (trash) icon on an expense row
    → Confirmation dialog: "Apakah Anda yakin ingin menghapus pengeluaran ini?"
    → On confirm: expense is removed from the list; Total updates
    → On cancel: dialog closes, no change

4. User switches to "Inventaris Kamar" tab
   → System loads inventory items grouped by room
   → User browses room inventory, updates condition if items are damaged/missing

5. User filters by date range (calendar icon)
   → Date picker opens; user selects start and end date
   → Table and Total Pengeluaran refresh to show only expenses in that range
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display a dual-tab layout: "Pengeluaran" and "Inventaris Kamar" |
| FR-02 | Pengeluaran tab shows a table with: Tanggal, Judul (with subtitle), Kategori badge, Properti, Jumlah, and delete action |
| FR-03 | "Total Pengeluaran" summary card must display the aggregate of all expenses in the current filtered view |
| FR-04 | Search bar must filter by expense title/description (case-insensitive, partial match) |
| FR-05 | Category filter dropdown must filter the table to show only the selected category |
| FR-06 | "+ Tambah Pengeluaran" modal must include: Kategori (required dropdown), Judul (required), Jumlah (required), Tanggal (required, defaulting to today), Keterangan (optional) |
| FR-07 | Each expense row must have a delete action with a confirmation prompt |
| FR-08 | Kategori must render as a color-coded pill/badge in the table |
| FR-09 | Calendar icon must open a date-range filter to scope the view and total by period |
| FR-10 | All expense data must be scoped to the authenticated tenant |
| FR-11 | Inventaris Kamar tab must show room inventory items sourced from `room_inventory` records |
| FR-12 | Condition of room inventory items must be editable directly from the Inventaris Kamar tab |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Expenses
```
GET /api/expenses?category=&search=&from=&to=&page=1&limit=20
Authorization: Bearer <token>

Query Params:
  category  string  optional  (expense category slug)
  search    string  optional  (title or description)
  from      date    optional  (YYYY-MM-DD)
  to        date    optional  (YYYY-MM-DD)
  page      integer optional  default: 1
  limit     integer optional  default: 20

Response 200:
{
  "totalAmount": 5390000,
  "total": 6,
  "page": 1,
  "data": [
    {
      "id": "uuid",
      "date": "2026-02-01",
      "title": "Gaji Pak Budi - Penjaga",
      "description": "Gaji bulan Februari",
      "category": "gaji_staff",
      "categoryLabel": "Gaji Staff / Penjaga Kost",
      "propertyId": "uuid",
      "propertyName": "Kost Harmoni Residence",
      "amount": 2500000,
      "createdAt": "2026-02-01T08:00:00Z"
    }
  ]
}
```

#### Create Expense
```
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "category": "gaji_staff",
  "title": "Gaji Pak Budi - Penjaga",
  "description": "Gaji bulan Februari",
  "amount": 2500000,
  "date": "2026-02-01",
  "propertyId": "uuid"
}

Response 201:
{
  "id": "uuid",
  "category": "gaji_staff",
  "title": "Gaji Pak Budi - Penjaga",
  "amount": 2500000,
  "date": "2026-02-01",
  "createdAt": "2026-03-12T09:00:00Z"
}
```

#### Delete Expense
```
DELETE /api/expenses/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Expense deleted successfully."
}
```

#### Get Expense Categories
```
GET /api/expenses/categories
Authorization: Bearer <token>

Response 200:
{
  "categories": [
    { "value": "gaji_staff", "label": "Gaji Staff / Penjaga Kost" },
    { "value": "air", "label": "Pembayaran Air Bulanan" },
    { "value": "listrik", "label": "Pembayaran Listrik Bulanan" },
    { "value": "alat_kost", "label": "Alat-alat Kost (Plastik Sampah, dll)" },
    { "value": "gas", "label": "Tabung Gas Dapur" },
    { "value": "renovasi", "label": "Renovasi / Perbaikan" },
    { "value": "lainnya", "label": "Lainnya" }
  ]
}
```

### Business Logic
- **Total Pengeluaran**: Sum of all `amount` values for expenses matching current filters (category, date range, search). Recalculated on every filter/search change.
- **Category scoping**: Categories may be a fixed enum or tenant-configurable; fixed enum is recommended for v1.
- **Property association**: Each expense is optionally linked to a specific property; the `propertyId` field associates the cost with the right kos location.
- **Deletion**: Hard delete is acceptable for expenses; consider soft delete if audit history is needed.
- **Tenant scoping**: All queries filter by `WHERE tenant_id = :currentTenantId`.

---

## 6. Data Model

### `expenses` Table
```sql
CREATE TABLE expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id   UUID REFERENCES properties(id) ON DELETE SET NULL,
  category      VARCHAR(50) NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  amount        BIGINT NOT NULL CHECK (amount >= 0),
  date          DATE NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_tenant ON expenses(tenant_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_property ON expenses(property_id);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No expenses recorded yet | Empty state: "Belum ada pengeluaran. Klik '+ Tambah Pengeluaran' untuk mencatat." |
| E-02 | Search/filter returns no results | Show: "Tidak ada pengeluaran yang cocok." |
| E-03 | Amount = 0 | Allowed (e.g., donated items); displayed as "Rp 0" |
| E-04 | Very large amount (e.g., Rp 50.000.000) | Formatted correctly; Total Pengeluaran card handles large values |
| E-05 | Delete expense that feed into dashboard cashflow | Deletion recalculates dashboard and Laporan totals accordingly |
| E-06 | Date filter: "from" > "to" | Inline validation: "Tanggal awal tidak boleh melebihi tanggal akhir." |
| E-07 | Long title text | Truncated with ellipsis in the table; description (subtitle) shows 1 line truncated |
| E-08 | No property selected during create | Allow null property_id; Properti column shows "-" for unlinked expenses |
| E-09 | Network error on save | Error toast: "Gagal menyimpan. Coba lagi." without closing the modal |
| E-10 | Confirm delete then network error | Re-show error toast; item remains in list |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant expense access | All queries filter by `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/expenses/*` endpoints require valid JWT; return `401` |
| S-03 | Delete another tenant's expense | `DELETE /api/expenses/:id` verifies ownership before deletion; return `403` otherwise |
| S-04 | Input injection in title/description | Use parameterized queries; sanitize all string inputs |
| S-05 | Negative or overflowing amount | Validate server-side: `amount >= 0` and within BIGINT range |
| S-06 | Property ID spoofing | Verify that `propertyId` belongs to the authenticated `tenant_id` before associating |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Edit expense** | Allow modifying a previously recorded expense (amount, date, category) |
| I-02 | **Recurring expense** | Mark expenses as recurring (monthly) so they auto-generate each month |
| I-03 | **Receipt image upload** | Attach a photo receipt to each expense for documentation |
| I-04 | **Per-property expense summary** | Show a subtotal per property within the list or via a filter |
| I-05 | **Custom categories** | Allow landlords to define their own expense categories beyond the default set |
| I-06 | **Export to CSV** | Download filtered expense list for external accounting |
| I-07 | **Budget tracking** | Set a monthly budget per category; alert when spending approaches the limit |
| I-08 | **Year-to-date totals** | Additional summary showing YTD expenses alongside the current-period total |
| I-09 | **Inventaris Kamar detail view** | Click into a specific room to see its full inventory with condition update UI |
| I-10 | **Damage report workflow** | From Inventaris Kamar, trigger a maintenance request when an item is marked damaged |

---

## 10. Feature Summary

The **Pengeluaran & Inventaris Kamar** page serves as the outflow tracking center of Living Kost Pro:

1. **Pengeluaran Tab** — A categorized expense ledger that captures all operational costs of the kos business: staff wages, utility bills, repairs, consumables, and more. A persistent "Total Pengeluaran" card gives landlords instant visibility into how much they've spent for the current view period. The "+ Tambah Pengeluaran" modal is a lightweight yet complete form for quick expense entry with category, title, amount, date, and optional notes.

2. **Inventaris Kamar Tab** — A room-by-room view of physical inventory items. Unlike the Template Inventaris (which is a master catalog), this tab reflects the actual items recorded per room at creation time, with current condition tracking. It enables landlords to maintain physical accountability across their property portfolio.

Together, these two tabs complete the financial picture: Tagihan tracks money owed, Pembayaran tracks money received, and Pengeluaran tracks money spent — giving landlords everything they need for accurate net income calculation (visible in Laporan).
