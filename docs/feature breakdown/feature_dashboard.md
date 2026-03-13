# Feature Specification: Dashboard — Operational Overview

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Dashboard
> **Analyzed From**: UI Screenshot (March 2026)

---

## 1. Feature Identification

### Main Feature
**Operational Dashboard** — a single-screen summary hub that gives kos property owners an at-a-glance view of their portfolio's financial and occupancy health, active payment reminders, cashflow trends, and per-property occupancy rates.

### Purpose
To provide landlords with a real-time command center that aggregates the most critical operational metrics across all their properties into one consolidated view, eliminating the need to navigate multiple sections just to understand the current state of their business.

### Problem It Solves
- Landlords managing multiple properties and many tenants can lose track of unpaid rent, overdue bills, and room availability.
- Without a summary view, critical tasks like following up on overdue payments are easily missed.
- Financial trends (income vs. expenses) are hard to track without a visual representation.
- The dashboard surfaces actionable alerts (payment reminders) directly, reducing response time.

---

## 2. UI Component Breakdown

### Global Navigation (Sidebar)
| Component | Description |
|---|---|
| App logo + name | "Living Kost Pro" branding with "Demo Mode" sub-label |
| Main menu items | Dashboard (active), Properti, Kamar, Penyewa, Tagihan, Pembayaran, Pengeluaran, Inventaris, Laporan, WhatsApp |
| Account section | Billing, Pengaturan |
| Logout | "Keluar" at the bottom |
| Collapse toggle | Arrow icon `<` to hide the sidebar |

### Header Bar
| Component | Description |
|---|---|
| Global search | Placeholder "Cari kamar, penyewa, invoice..." — unified search across rooms, tenants, invoices |
| Notification bell | Red badge indicating unread system notifications |
| User avatar | Initials "DM" — opens account/profile menu |

### KPI Summary Cards (Top Row — 6 cards)
| Card | Value | Icon | Description |
|---|---|---|---|
| Total Kamar | 32 | Room/grid icon | Total rooms managed across all properties |
| Occupancy Rate | 81.3% | Occupancy icon | Percentage of rooms currently occupied |
| Total Tagihan | Rp 23.100.000 | Invoice icon | Total amount billed (outstanding invoices) |
| Sudah Bayar | Rp 4.575.000 | Card/payment icon | Total amount already paid by tenants |
| Overdue | 1 | Warning/triangle icon | Number of overdue invoices requiring action |
| Pengeluaran Aktif | 2 | Key/expense icon | Number of active/recurring expense entries |

### Payment Reminder Panel
| Component | Description |
|---|---|
| Section title | "Reminder Pembayaran" with a yellow bell icon |
| Badge counter | Orange pill badge "2" showing the count of pending reminders |
| Reminder row | Tenant name — Room number, due date, and billed amount |
| "Tandai Selesai" button | Per-row action button to mark a reminder as completed/resolved |
| Overdue date label | Due date displayed in red to indicate urgency |

### Cashflow Bar Chart (Bottom-Left)
| Component | Description |
|---|---|
| Title | "Cashflow 6 Bulan Terakhir" — last 6 months cashflow |
| X-axis | Month labels: Sep, Okt, Nov, Des, Jan, Feb |
| Y-axis | Monetary scale in millions (0jt to 24jt) |
| Teal bars | "Pemasukan" (income) per month |
| Red bars | "Pengeluaran" (expenses) per month |
| Legend | Color-coded legend for Pemasukan / Pengeluaran |

### Occupancy per Property Panel (Bottom-Right)
| Component | Description |
|---|---|
| Title | "Occupancy per Properti" |
| Property row | Property name, rooms occupied / total rooms, percentage |
| Progress bar | Visual fill-bar showing occupancy ratio (teal color) |
| Visible entries | Harmoni Residence: 16/20 (80%), Cendana House: 10/12 (83%) |

---

## 3. User Flow

### Entry Point
The Dashboard is the **default landing page** after a user logs in. It is also accessible at any time via the first item in the sidebar navigation.

### Step-by-Step Flow

```
1. User logs in / navigates to Dashboard
   → System fetches aggregated metrics for the authenticated tenant
   → KPI cards, reminders, chart, and occupancy data are loaded and rendered

2. User reviews KPI cards
   → Gets instant snapshot: total rooms, occupancy %, billing totals, overdue count
   → Clicking a KPI card may navigate to the related detail page (e.g., "Overdue" → Tagihan filtered by overdue)

3. User reviews Payment Reminders
   → Sees a prioritized list of tenants with upcoming/overdue payments
   → Due dates shown in red to signal urgency
   → User follows up with tenant (via WhatsApp or phone call)

4a. User clicks "Tandai Selesai" on a reminder
    → Confirmation prompt or instant dismissal
    → Reminder is removed from the panel; badge counter decrements
    → Payment marked as acknowledged/received in the system (or linked to a payment record)

4b. User reviews Cashflow chart
    → Hovers over a bar → tooltip shows exact income/expense value for that month
    → Identifies months with unusually high expenses or low income

5. User reviews Occupancy per Properti
    → Sees fill rates for each property
    → Identifies which property has available rooms that can be marketed

6. User uses the global search
    → Types a room number, tenant name, or invoice ID
    → Navigates directly to the matching entity
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display 6 KPI summary cards with real-time counts/amounts scoped to the authenticated landlord |
| FR-02 | KPI cards must be clickable and navigate to the corresponding detail section |
| FR-03 | Display a payment reminder list showing tenants with pending/overdue payments, sorted by due date ascending |
| FR-04 | Badge on the reminder panel must reflect the live count of unresolved reminders |
| FR-05 | "Tandai Selesai" must mark an invoice/reminder as resolved and remove it from the list |
| FR-06 | Display a bar chart of income vs. expenses for the last 6 calendar months |
| FR-07 | Display occupancy rate per property as a labeled progress bar |
| FR-08 | Overall occupancy rate (KPI card) must be the aggregate across all properties |
| FR-09 | Global search must query rooms, tenants, and invoices simultaneously |
| FR-10 | All data must be scoped to the current tenant (multi-tenant isolation) |
| FR-11 | "Demo Mode" label must be shown when the account is in trial/demo status |

---

## 5. Backend Requirements

### API Endpoints

#### Get Dashboard Summary
```
GET /api/dashboard/summary
Authorization: Bearer <token>

Response 200:
{
  "totalRooms": 32,
  "occupancyRate": 81.3,
  "totalTagihan": 23100000,
  "sudahBayar": 4575000,
  "overdueCount": 1,
  "pengeluaranAktif": 2
}
```

#### Get Payment Reminders
```
GET /api/dashboard/reminders
Authorization: Bearer <token>

Response 200:
{
  "count": 2,
  "reminders": [
    {
      "id": "uuid",
      "tenantName": "Ahmad Fauzi",
      "roomCode": "A-101",
      "dueDate": "2026-03-05",
      "amount": 1500000,
      "invoiceId": "uuid"
    },
    {
      "id": "uuid",
      "tenantName": "Siti Nurhaliza",
      "roomCode": "A-102",
      "dueDate": "2026-03-05",
      "amount": 1200000,
      "invoiceId": "uuid"
    }
  ]
}
```

#### Mark Reminder as Done
```
PATCH /api/dashboard/reminders/:id/resolve
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Reminder marked as resolved."
}
```

#### Get Cashflow (Last 6 Months)
```
GET /api/dashboard/cashflow?months=6
Authorization: Bearer <token>

Response 200:
{
  "data": [
    { "month": "2025-09", "income": 18500000, "expense": 1200000 },
    { "month": "2025-10", "income": 19000000, "expense": 950000 },
    { "month": "2025-11", "income": 19500000, "expense": 1800000 },
    { "month": "2025-12", "income": 20000000, "expense": 1100000 },
    { "month": "2026-01", "income": 22500000, "expense": 900000 },
    { "month": "2026-02", "income": 23100000, "expense": 1200000 }
  ]
}
```

#### Get Occupancy per Property
```
GET /api/dashboard/occupancy
Authorization: Bearer <token>

Response 200:
{
  "properties": [
    {
      "propertyId": "uuid",
      "propertyName": "Harmoni Residence",
      "occupiedRooms": 16,
      "totalRooms": 20,
      "occupancyRate": 80.0
    },
    {
      "propertyId": "uuid",
      "propertyName": "Cendana House",
      "occupiedRooms": 10,
      "totalRooms": 12,
      "occupancyRate": 83.3
    }
  ]
}
```

### Business Logic
- **Occupancy Rate**: `(occupied rooms / total active rooms) * 100`, rounded to 1 decimal.
- **Total Tagihan**: Sum of all invoice amounts in `pending` or `overdue` status for the current billing period.
- **Sudah Bayar**: Sum of all payments received in the current month.
- **Overdue count**: Invoices where `due_date < NOW()` and `status != 'paid'`.
- **Cashflow income**: Sum of all payments received per month.
- **Cashflow expense**: Sum of all expenses recorded per month.
- **Reminders**: Invoices due within the next 7 days OR already overdue, sorted by due date ascending.

---

## 6. Data Model

Data for the dashboard is **derived/aggregated** from existing core entities. No dedicated dashboard table is needed — the backend computes summaries via queries.

### Core Entities Referenced

#### `rooms`
```sql
-- Fields used: status ('occupied' | 'vacant' | 'maintenance'), property_id, tenant_id
```

#### `invoices`
```sql
-- Fields used: amount, status ('pending' | 'paid' | 'overdue'), due_date, tenant_id, room_id
```

#### `payments`
```sql
-- Fields used: amount, paid_at, invoice_id, tenant_id
```

#### `expenses`
```sql
-- Fields used: amount, date, status ('active' | 'completed'), property_id
```

#### `properties`
```sql
-- Fields used: id, name, owner_id (tenant_id in SaaS context)
```

### Optional: Dashboard Cache Table
For performance on large datasets, a materialized/cached summary can be maintained:
```sql
CREATE TABLE dashboard_cache (
  tenant_id         UUID PRIMARY KEY,
  total_rooms       INTEGER,
  occupied_rooms    INTEGER,
  occupancy_rate    NUMERIC(5,2),
  total_tagihan     BIGINT,
  sudah_bayar       BIGINT,
  overdue_count     INTEGER,
  pengeluaran_aktif INTEGER,
  last_computed_at  TIMESTAMP DEFAULT NOW()
);
```
This cache can be invalidated and recomputed on payment/room/expense changes via event triggers or a scheduled job.

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No rooms registered yet | Dashboard shows zero values; KPI cards display "0" or "Rp 0"; a warm empty state guides the user to add their first property/room |
| E-02 | No invoices generated yet | "Total Tagihan", "Sudah Bayar", and "Overdue" all show Rp 0 and 0 respectively |
| E-03 | No payment reminders | Reminder panel shows an empty state message: "Tidak ada tagihan jatuh tempo" |
| E-04 | All rooms are vacant | Occupancy Rate shows 0%, progress bars are empty |
| E-05 | Large number of reminders | Panel is scrollable; maximum N reminders shown with a "Lihat semua" link to the full list |
| E-06 | "Tandai Selesai" clicked on an already-resolved reminder | Return `409 Conflict` or idempotent success; no duplicate state changes |
| E-07 | Cashflow data missing for a month (no income/expense) | Chart bar is zero-height for that month; no gaps in X-axis labels |
| E-08 | Single property vs. multi-property | Occupancy per Properti panel shows all properties; if only one, it still renders correctly |
| E-09 | Very high income values (e.g., 100jt+) | Y-axis auto-scales; currency formatting must handle hundreds of millions without truncation |
| E-10 | Demo Mode account | All data shown is mocked/seeded; a "Demo Mode" label is persistent in the header and sidebar |
| E-11 | Slow network / API timeout | Show skeleton loaders per section; avoid partial render states that look like real zeros |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant data leakage | All dashboard queries must include a `WHERE tenant_id = :currentTenantId` filter server-side |
| S-02 | Unauthenticated access | All `/api/dashboard/*` endpoints must require a valid JWT; return `401` if token is absent or expired |
| S-03 | "Tandai Selesai" on another tenant's reminder | The `PATCH /reminders/:id/resolve` endpoint must verify ownership of the reminder before resolving |
| S-04 | Cashflow data exposure | Aggregate financial data must never expose individual tenant/resident names or raw transactions in the summary |
| S-05 | Global search injection | Search input must be sanitized and use parameterized queries; never interpolate directly into SQL |
| S-06 | Notification bell content | Notification payloads must be scoped to the authenticated user; no cross-user notification leakage |
| S-07 | Cache poisoning | If a dashboard cache is used, it must be keyed strictly by `tenant_id` and invalidated on write operations |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Clickable KPI cards** | Each card navigates to the relevant filtered list (e.g., "Overdue" → Tagihan filtered by overdue status) |
| I-02 | **Date range selector for cashflow** | Allow switching between 3 months, 6 months, 1 year, or custom range |
| I-03 | **Tooltip on chart bars** | On hover, show exact income/expense values for that month in a tooltip |
| I-04 | **Quick action buttons** | Add shortcuts on the dashboard: "Tambah Tagihan", "Catat Pembayaran", "Tambah Kamar" |
| I-05 | **Trend indicators on KPI cards** | Show month-over-month change (↑ +5% or ↓ -2%) on each metric card |
| I-06 | **Vacancy alert** | Highlight rooms that have been vacant for more than 30 days as a separate widget |
| I-07 | **Top tenants by payment reliability** | A widget showing tenants with consistent on-time payment history |
| I-08 | **Export dashboard snapshot** | Allow downloading the dashboard summary as a PDF or image for reporting |
| I-09 | **Customizable widgets** | Let landlords rearrange or hide dashboard sections based on their priority |
| I-10 | **Net income KPI card** | Add "Laba Bersih" (net income = total payments - total expenses) as a 7th KPI card |
| I-11 | **Reminder auto-send via WhatsApp** | Add a "Kirim WhatsApp" button next to each reminder to trigger a payment reminder message directly |

---

## 10. Feature Summary

The **Dashboard** is the operational home screen of Living Kost Pro, designed to give landlords an instant, data-rich overview of their kos portfolio without any manual aggregation. It is composed of four main zones:

1. **KPI Cards** — Six metric cards across the top surface the most critical numbers: total rooms, occupancy rate, total billing, amount received, overdue count, and active expenses. These serve as navigational anchors as well as health indicators.

2. **Payment Reminder Panel** — A prioritized, actionable list of tenants whose payments are due or overdue. Each entry shows tenant name, room, due date, and amount, with a one-click "Tandai Selesai" button to resolve the reminder. The orange badge keeps the count visible at all times.

3. **Cashflow Chart** — A 6-month side-by-side bar chart of income (teal) vs. expenses (red) that lets landlords quickly spot trends, seasonal patterns, or anomalous months without generating a report.

4. **Occupancy per Property** — A per-property breakdown of room fill rates as labeled progress bars, making it easy to see which location needs marketing attention.

Together, these components transform scattered operational data into a single, actionable morning briefing — enabling landlords to make confident decisions about rent collection, vacancy management, and financial health in under a minute.
