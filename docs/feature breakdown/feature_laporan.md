# Feature Specification: Laporan — Financial & Operational Report

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Laporan (Report)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Financial Report (Laporan)** — a reporting page that aggregates and visualizes the financial performance of the landlord's kos portfolio over a rolling 6-month period. It presents three top-level KPI summary cards (total income, total expenses, net profit) and a "Tren Cashflow" bar chart comparing income vs. expenses month-by-month.

### Purpose
To give landlords a consolidated financial snapshot of their kos business health — how much came in, how much went out, and what the net profit is — without requiring them to export or manually calculate from raw transaction records.

### Problem It Solves
- Without a dedicated report view, landlords must individually review Tagihan, Pembayaran, and Pengeluaran pages to piece together financial performance.
- Month-to-month income trends are invisible without a chart, making it hard to spot seasonal patterns or anomalous months.
- True net income (Laba Bersih = income − expenses) is a critical business metric that requires aggregation across two separate data sources.
- The "Export CSV" feature bridges the in-app report with external bookkeeping tools (Excel, Google Sheets, accounting software).

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Laporan" — bold heading |
| Subtitle | "Ringkasan keuangan dan operasional." |
| "Export CSV" button | Secondary action button (outlined, with document icon); exports the report data as CSV |

### KPI Summary Cards (Top Row — 3 cards)
| Card | Value (from screenshot) | Color | Description |
|---|---|---|---|
| Total Pemasukan (6 bln) | Rp 125.200.000 | Teal/green | Sum of all payments received in the last 6 months |
| Total Pengeluaran (6 bln) | Rp 13.900.000 | Red | Sum of all recorded expenses in the last 6 months |
| Laba Bersih (6 bln) | Rp 111.300.000 | Teal/green | Net profit = Total Pemasukan − Total Pengeluaran |

### Tren Cashflow Chart
| Component | Description |
|---|---|
| Section title | "Tren Cashflow" |
| Chart type | Grouped bar chart (side-by-side bars per month) |
| X-axis | Month abbreviations: Sep, Okt, Nov, Des, Jan, Feb (last 6 calendar months) |
| Y-axis | Monetary scale in millions (0jt to 24jt+); auto-scales to data |
| Teal bars | Monthly income (Pemasukan) — sum of payments received per month |
| Red bars | Monthly expenses (Pengeluaran) — sum of expenses recorded per month |
| Grid lines | Horizontal dashed gridlines at 6jt, 12jt, 18jt, 24jt for readability |

### Sample Chart Data (inferred from screenshot)
| Month | Pemasukan (approx.) | Pengeluaran (approx.) |
|---|---|---|
| Sep 2025 | ~Rp 18.500.000 | ~Rp 1.200.000 |
| Okt 2025 | ~Rp 19.000.000 | ~Rp 950.000 |
| Nov 2025 | ~Rp 19.500.000 | ~Rp 1.800.000 |
| Des 2025 | ~Rp 20.000.000 | ~Rp 1.100.000 |
| Jan 2026 | ~Rp 22.500.000 | ~Rp 900.000 |
| Feb 2026 | ~Rp 23.100.000 | ~Rp 1.200.000 |

---

## 3. User Flow

### Entry Point
Accessible via "Laporan" in the sidebar navigation. No login-time redirect; user navigates here intentionally.

### Step-by-Step Flow

```
1. User navigates to Laporan
   → System fetches 6-month aggregated financial data for the authenticated tenant
   → KPI summary cards (Pemasukan, Pengeluaran, Laba Bersih) render with computed totals
   → Tren Cashflow bar chart renders with month-by-month bars

2. User reviews KPI cards
   → Gets an instant 6-month financial performance summary
   → Laba Bersih card confirms overall profitability at a glance

3. User reviews the Tren Cashflow chart
   → Identifies months with notably high income or high expenses
   → Spots seasonal trends (e.g., income spikes in January due to new tenant move-ins)
   → Notes months where expenses were unusually high (e.g., after a repair)

4. User hovers over a chart bar (future/improvement)
   → Tooltip shows exact income and expense values for that month

5. User clicks "Export CSV"
   → System generates a CSV file containing:
     - Monthly summary rows (month, pemasukan, pengeluaran, laba bersih)
     - Or optionally a full transaction-level breakdown
   → File downloads automatically
   → File name: "laporan-keuangan-{YYYY-MM-DD}.csv"
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display 3 KPI summary cards: Total Pemasukan (6 bln), Total Pengeluaran (6 bln), Laba Bersih (6 bln) |
| FR-02 | KPI card values must be the aggregate for the last 6 full calendar months |
| FR-03 | Laba Bersih must be computed as: `Total Pemasukan − Total Pengeluaran`; negative value shown in red |
| FR-04 | Display a "Tren Cashflow" grouped bar chart with teal (income) and red (expense) bars per month |
| FR-05 | Chart X-axis must display the last 6 calendar months in chronological order |
| FR-06 | Chart Y-axis must auto-scale to the maximum value in the dataset; labels in millions (e.g., 24jt) |
| FR-07 | "Export CSV" must download financial report data as a CSV file |
| FR-08 | All report data must be scoped to the authenticated tenant |
| FR-09 | Months with zero income or zero expense must still render on the chart (zero-height bar, no gaps) |
| FR-10 | KPI card labels must include the period indicator "(6 bln)" for clarity |

---

## 5. Backend Requirements

### API Endpoints

#### Get Financial Report Summary
```
GET /api/reports/summary?months=6
Authorization: Bearer <token>

Query Params:
  months  integer  optional  default: 6  (number of trailing months to aggregate)

Response 200:
{
  "period": "6 months",
  "from": "2025-09-01",
  "to": "2026-02-28",
  "totalIncome": 125200000,
  "totalExpense": 13900000,
  "netProfit": 111300000
}
```

#### Get Cashflow Trend (Monthly Breakdown)
```
GET /api/reports/cashflow?months=6
Authorization: Bearer <token>

Response 200:
{
  "data": [
    { "month": "2025-09", "income": 18500000, "expense": 1200000, "net": 17300000 },
    { "month": "2025-10", "income": 19000000, "expense": 950000,  "net": 18050000 },
    { "month": "2025-11", "income": 19500000, "expense": 1800000, "net": 17700000 },
    { "month": "2025-12", "income": 20000000, "expense": 1100000, "net": 18900000 },
    { "month": "2026-01", "income": 22500000, "expense": 900000,  "net": 21600000 },
    { "month": "2026-02", "income": 23100000, "expense": 1200000, "net": 21900000 }
  ]
}
```

#### Export Report as CSV
```
GET /api/reports/export?months=6
Authorization: Bearer <token>

Response 200:
Content-Type: text/csv
Content-Disposition: attachment; filename="laporan-keuangan-2026-03-12.csv"

(CSV content — monthly summary or transaction-level breakdown)
```

### Business Logic
- **Total Pemasukan**: Sum of all `payments.amount` where `payments.date` falls within the last N calendar months.
- **Total Pengeluaran**: Sum of all `expenses.amount` where `expenses.date` falls within the last N calendar months.
- **Laba Bersih**: `totalIncome − totalExpense`. May be negative if expenses exceed income (displayed in red).
- **Month range**: "Last 6 months" = the 6 most recently completed calendar months. The current partial month is typically excluded until it ends.
- **Zero-fill**: If a month has no income or no expense transactions, it is still returned in the `cashflow` array with `0` values (no gaps in the chart).
- **Tenant scoping**: All aggregation queries filter by `tenant_id`.
- **CSV export**: The export covers the same period and filters as the current report view.

---

## 6. Data Model

The Laporan page is entirely derived from existing tables — no dedicated report table is required.

### Source Tables
```sql
-- Income source
SELECT DATE_TRUNC('month', date) AS month,
       SUM(amount) AS income
FROM payments
WHERE tenant_id = :tenantId
  AND date >= :fromDate
GROUP BY 1
ORDER BY 1;

-- Expense source
SELECT DATE_TRUNC('month', date) AS month,
       SUM(amount) AS expense
FROM expenses
WHERE tenant_id = :tenantId
  AND date >= :fromDate
GROUP BY 1
ORDER BY 1;
```

### Optional: Report Cache
For large datasets, a `report_cache` table can store pre-aggregated monthly summaries:
```sql
CREATE TABLE report_monthly_cache (
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  month       VARCHAR(7) NOT NULL,   -- 'YYYY-MM'
  income      BIGINT NOT NULL DEFAULT 0,
  expense     BIGINT NOT NULL DEFAULT 0,
  net         BIGINT GENERATED ALWAYS AS (income - expense) STORED,
  computed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, month)
);
```
Cache is invalidated on payment or expense write operations.

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No payments or expenses recorded yet | KPI cards show Rp 0; chart renders with flat (zero-height) bars for all 6 months |
| E-02 | Expenses > Income (negative Laba Bersih) | Laba Bersih card value is displayed in red with a negative sign (e.g., "-Rp 500.000") |
| E-03 | Very high income values (e.g., 100jt+) | Y-axis auto-scales; labels format as "100jt", "120jt", etc. |
| E-04 | One month has zero income (no payments) | That month's teal bar is zero-height; red expense bar still renders if expenses exist |
| E-05 | One month has zero expenses | That month's red bar is zero-height; teal income bar still renders |
| E-06 | Export triggers with no data | Downloads a CSV with headers only; shows toast: "Tidak ada data untuk diekspor." |
| E-07 | Single month of data (new account) | Chart shows 5 months of empty bars + 1 month of real data; correct and expected |
| E-08 | Very large number of transactions in a month | Aggregate query must be efficient via indexed `date` column; response time < 1s |
| E-09 | Laba Bersih is exactly Rp 0 | Displayed as "Rp 0" in neutral color (neither green nor red) |
| E-10 | User changes period (future: date range picker) | KPI cards and chart re-fetch for the selected range; "Export CSV" downloads the same range |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant financial data access | All aggregation queries include `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/reports/*` endpoints require valid JWT; return `401` |
| S-03 | CSV export data scoping | Export endpoint applies the same tenant filter and period constraints as the display endpoint |
| S-04 | SQL injection in query params | `months` parameter must be validated as a positive integer; no raw string interpolation |
| S-05 | Cache key isolation | If report cache is used, cache keys must be strictly scoped to `tenant_id` + month to prevent cross-tenant cache reads |
| S-06 | Large export file DoS | Limit export period to a maximum (e.g., 24 months); paginate or stream large CSV files |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Date range selector** | Allow switching between 3 months, 6 months, 12 months, or custom date range for all report sections |
| I-02 | **Chart tooltips** | On hover over a bar, show exact income/expense value for that month in a tooltip |
| I-03 | **Per-property filtering** | Add a property dropdown to scope the report to a single kos location |
| I-04 | **Expense breakdown pie chart** | Add a pie/donut chart showing expense distribution by category |
| I-05 | **Income breakdown** | Show income breakdown by property or by room type |
| I-06 | **Month-over-month trend indicators** | Show % change vs. previous period on KPI cards (↑ +5% or ↓ -2%) |
| I-07 | **Occupancy trend chart** | Add a line chart showing occupancy rate over time alongside cashflow |
| I-08 | **Export to PDF** | Generate a print-ready PDF financial summary report (monthly or annual) |
| I-09 | **Tax summary** | Calculate and highlight the income base for tax estimation (PPh obligations) |
| I-10 | **Net income KPI on Dashboard** | Surface the Laba Bersih figure directly on the main Dashboard as a 7th KPI card |
| I-11 | **Scheduled email report** | Send a monthly financial summary email to the landlord automatically |

---

## 10. Feature Summary

The **Laporan** page is the financial reporting center of Living Kost Pro, translating raw transaction data into actionable financial intelligence. It is composed of two main sections:

1. **KPI Summary Cards** — Three large metric cards at the top: Total Pemasukan (total income from payments), Total Pengeluaran (total expenses recorded), and Laba Bersih (net profit = income − expenses). All values are computed across the rolling 6-month window, giving landlords a period-consistent financial snapshot. The Laba Bersih card is the single most important metric — it tells the landlord whether their kos business is profitable at a glance.

2. **Tren Cashflow Chart** — A grouped bar chart with teal (income) and red (expense) bars for each of the last 6 months. This visualization makes income growth trends and expense spikes immediately visible without numerical analysis. The consistent color scheme (teal = money in, red = money out) is shared with the Dashboard cashflow chart for cognitive consistency across the app.

The "Export CSV" button bridges the in-app report with external workflows — accounting software, tax preparation, or a landlord's own spreadsheet — completing the data portability loop. Together, the Laporan page empowers landlords to make data-driven decisions about pricing, expansion, and cost control without needing a separate accounting tool.
