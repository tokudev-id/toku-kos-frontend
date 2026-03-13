# TokuKosManagement — Implementation Gap Tracker
> **Living Document** — Updated as features are implemented.
> Last updated: 2026-03-13

---

## Legend
- ✅ Done
- 🔄 In Progress
- ❌ Missing
- ⚠️ Partial (exists but incomplete)

---

## BACKEND

### Entities & Fields

| Entity | Issue | Status |
|---|---|---|
| `Room` | Missing: `floor`, `size`, `deposit`, `electricity_included`, `water_included`, `photo_url` | ✅ Done |
| `Resident` | Missing: `emergency_contact`, `check_in_date`, `notes`, `status` (ACTIVE/CHECKOUT) | ✅ Done |
| `Property` | Missing: `notes` field | ✅ Done |
| `Expense` | Missing: `category`, `title`, `property_id` (only has `description`) | ✅ Done |
| `Invoice` | Missing: `period`, `discount`, proper number format enforcement | ✅ Done |
| `InvoiceItem` | Entity does not exist (line items: nama, qty, harga, kategori) | ✅ Done |
| `Payment` | Missing: `E_WALLET` in method enum; missing `payment_date`, `notes` columns | ✅ Done |

---

### Backend Endpoints

#### Properties Module
| Endpoint | Status |
|---|---|
| `POST /properties` | ✅ Done |
| `GET /properties` | ✅ Done |
| `GET /properties/:id` | ✅ Done |
| `PATCH /properties/:id` | ✅ Done |
| `DELETE /properties/:id` | ✅ Done |

#### Rooms Module
| Endpoint | Status |
|---|---|
| `POST /rooms` | ✅ Done |
| `GET /rooms/property/:propertyId` | ✅ Done |
| `GET /rooms` (all rooms, for dropdowns) | ✅ Done |
| `PATCH /rooms/:id` | ✅ Done |
| `DELETE /rooms/:id` | ✅ Done |

#### Residents Module
| Endpoint | Status |
|---|---|
| `POST /residents` | ✅ Done |
| `GET /residents` | ✅ Done |
| `GET /residents/:id` | ✅ Done |
| `PATCH /residents/:id` | ✅ Done |
| `POST /residents/:id/checkout` | ✅ Done |
| `GET /residents/me` (resident portal profile) | ✅ Done |
| `GET /finance/my-invoices` (resident portal invoices) | ✅ Done |

#### Finance — Invoices
| Endpoint | Status |
|---|---|
| `POST /finance/invoices` | ✅ Done |
| `GET /finance/invoices` | ✅ Done |
| `GET /finance/invoices/:id` | ✅ Done |
| `GET /finance/invoices?status=` (filter) | ✅ Done |
| `PATCH /finance/invoices/:id/verify` | ✅ Done |
| `GET /finance/invoices/export` (CSV) | ✅ Done |

#### Finance — Payments
| Endpoint | Status |
|---|---|
| `POST /finance/payments` | ✅ Done |
| `GET /finance/payments` | ✅ Done |
| `POST /finance/payments/:id/proof` (upload) | ✅ Done |

#### Finance — Expenses
| Endpoint | Status |
|---|---|
| `POST /finance/expenses` | ✅ Done |
| `GET /finance/expenses` | ✅ Done |
| `DELETE /finance/expenses/:id` | ✅ Done |

#### Dashboard Module
| Endpoint / Data | Status |
|---|---|
| `GET /dashboard/summary` (basic) | ✅ Done |
| Cashflow 6-month breakdown | ✅ Done |
| Per-property occupancy | ✅ Done |
| Payment reminders list | ✅ Done |

#### Laporan Module
| Endpoint | Status |
|---|---|
| `GET /laporan/summary` (6-month KPIs) | ✅ Done |
| `GET /laporan/cashflow` (monthly chart data) | ✅ Done |
| `GET /laporan/export` (CSV download) | ✅ Done |

#### Inventaris Module
| Endpoint | Status |
|---|---|
| `POST /inventory/templates` | ✅ Done |
| `GET /inventory/templates` | ✅ Done |
| `PATCH /inventory/templates/:id` | ✅ Done |
| `DELETE /inventory/templates/:id` | ✅ Done |
| `GET /inventory/rooms/:roomId` | ✅ Done |
| `PATCH /inventory/rooms/:roomId/items/:itemId` (update condition) | ✅ Done |

#### Pengaturan Module
| Endpoint | Status |
|---|---|
| `GET /settings` | ✅ Done |
| `PUT /settings` | ✅ Done |

#### SaaS Billing Module
| Endpoint | Status |
|---|---|
| `GET /saas/plans` | ✅ Done |
| `GET /saas/subscription` (current) | ✅ Done |
| `POST /saas/subscription/upgrade` | ✅ Done |
| `GET /saas/usage` | ✅ Done |

---

## FRONTEND

### Navigation (Sidebar)
| Nav Item | Status |
|---|---|
| Dashboard | ✅ Done |
| Properti | ✅ Done |
| Kamar | ✅ Done |
| Penghuni (Penyewa) | ✅ Done |
| Tagihan | ✅ Done |
| Pembayaran | ✅ Done |
| Pengeluaran | ✅ Done |
| Inventaris | ✅ Done |
| Laporan | ✅ Done |
| WhatsApp | ✅ Done |
| Billing | ✅ Done |
| Pengaturan | ✅ Done |

### Frontend API Services
| File | Status |
|---|---|
| `auth.service.ts` | ✅ Done |
| `dashboard.service.ts` | ✅ Done |
| `property.service.ts` (update, delete) | ✅ Done |
| `room.service.ts` (update, delete, list all) | ✅ Done |
| `resident.service.ts` (update, checkout) | ✅ Done |
| `invoice.service.ts` | ✅ Done |
| `payment.service.ts` | ✅ Done |
| `expense.service.ts` | ✅ Done |
| `report.service.ts` | ✅ Done |
| `inventory.service.ts` | ✅ Done |
| `settings.service.ts` | ✅ Done |
| `billing.service.ts` | ✅ Done |
| `whatsapp.service.ts` | ✅ Done |

### Frontend Pages (Owner)
| Page | Route | Status |
|---|---|---|
| Login | `/login` | ✅ Done |
| Register | `/register` | ✅ Done |
| Dashboard/Overview | `/` | ✅ Done (charts, reminders wired to real API) |
| Properti | `/properties` | ✅ Done |
| Property Detail / Kamar | `/properties/:id` | ✅ Done |
| Kamar (standalone list) | `/kamar` | ✅ Done |
| Penghuni / Penyewa | `/residents` | ⚠️ Missing KTP upload |
| Tagihan | `/tagihan` | ✅ Done |
| Pembayaran | `/pembayaran` | ✅ Done |
| Pengeluaran | `/pengeluaran` | ✅ Done |
| Inventaris | `/inventaris` | ✅ Done |
| Laporan | `/laporan` | ✅ Done |
| WhatsApp Manager | `/whatsapp` | ✅ Done |
| Billing & Subscription | `/billing` | ✅ Done |
| Pengaturan | `/pengaturan` | ✅ Done |

### Frontend Pages (Resident Portal)
| Page | Route | Status |
|---|---|---|
| Login | `/resident/login` | ✅ Done |
| Resident Dashboard | `/resident` | ✅ Done (real API data) |
| Tagihan / Invoices | `/resident/invoices` | ✅ Done |
| Pembayaran (upload bukti) | `/resident/invoices` | ✅ Done |
| Keluhan / Maintenance | `/resident/maintenance` | ✅ Done |
| Profil | `/resident/profile` | ✅ Done |

---

## PRD Special Features

| Feature | Status |
|---|---|
| Resident Portal self-service (view invoices, upload bukti) | ✅ Done |
| DB Migrations needed | ✅ Done — FullSchemaUpdate migration ran successfully |
| SaaS plan limits enforcement (quota per plan) | ✅ Done |
| H-3 payment reminder scheduler (automated WA) | ✅ Done |
| WhatsApp broadcast to multiple residents | ✅ Done |
| Late fee / denda auto-calculation on overdue invoices | ✅ Done |
| Invoice PDF generation | ✅ Done |
| Notification system (real unread count) | ❌ Missing |

---

## Implementation Progress Log

| Date | What was done |
|---|---|
| 2026-03-12 | Created gap tracker document |
| 2026-03-12 | Fixed Room entity: added floor, size, deposit, electricity_included, water_included, photo_url |
| 2026-03-12 | Fixed Resident entity: added emergency_contact, check_in_date, notes, status enum (ACTIVE/CHECKOUT) |
| 2026-03-12 | Fixed Property entity: added notes field |
| 2026-03-12 | Fixed Expense entity: added category (enum), title, property_id |
| 2026-03-12 | Fixed Invoice entity: added period, discount fields |
| 2026-03-12 | Created InvoiceItem entity |
| 2026-03-12 | Fixed Payment entity: added E_WALLET to enum |
| 2026-03-12 | Added PATCH/DELETE /properties/:id |
| 2026-03-12 | Added GET/all, PATCH, DELETE /rooms endpoints |
| 2026-03-12 | Added PATCH /residents/:id, POST /residents/:id/checkout |
| 2026-03-12 | Added GET /finance/invoices/:id, filter by status |
| 2026-03-12 | Added PATCH /finance/invoices/:id/verify |
| 2026-03-12 | Added POST/GET /finance/payments |
| 2026-03-12 | Added POST/GET/DELETE /finance/expenses |
| 2026-03-12 | Updated /dashboard/summary with cashflow, occupancy-per-property, payment reminders |
| 2026-03-12 | Created Laporan module (GET /laporan/summary, GET /laporan/cashflow) |
| 2026-03-12 | Created Inventaris module (template CRUD, room inventory) |
| 2026-03-12 | Created Pengaturan module (GET/PUT /settings) |
| 2026-03-12 | Wired up SaaS module (plans, subscription, usage endpoints) |
| 2026-03-12 | Updated Sidebar navigation with all 12 menu items |
| 2026-03-12 | Created invoice.service.ts, payment.service.ts, expense.service.ts |
| 2026-03-12 | Created report.service.ts, inventory.service.ts, settings.service.ts, billing.service.ts |
| 2026-03-12 | Updated property.service.ts, room.service.ts, resident.service.ts with missing operations |
| 2026-03-12 | Created Kamar page (standalone room list with edit/delete) |
| 2026-03-12 | Created Tagihan page (invoice list, create modal, status filter) |
| 2026-03-12 | Created Pembayaran page (payment history, record payment modal) |
| 2026-03-12 | Created Pengeluaran page (expense list, add expense modal) |
| 2026-03-12 | Created Inventaris page (template CRUD) |
| 2026-03-12 | Created Laporan page (KPI cards + cashflow chart) |
| 2026-03-12 | Created Pengaturan page (business profile + billing rules) |
| 2026-03-12 | Created Billing page (subscription plan cards) |
| 2026-03-13 | Fixed Payment entity: added payment_date (timestamp) + notes (text) columns |
| 2026-03-13 | Fixed finance.service: createPayment explicit fields, findAllPayments double-join, generateInvoiceNumber optional period |
| 2026-03-13 | Fixed invoice DTO: contract_id optional, added optional resident_id with auto-resolve to active contract |
| 2026-03-13 | Added GET /residents/me (resident portal profile endpoint) |
| 2026-03-13 | Added GET /finance/my-invoices (resident portal invoice list) |
| 2026-03-13 | Added LaporanModule, InventarisModule, PengaturanModule to app.module.ts imports array |
| 2026-03-13 | Updated Resident Portal Dashboard with real API data (no more mocks) |
| 2026-03-13 | Created ResidentPortal/Invoices.tsx (invoice list + detail modal) |
| 2026-03-13 | Created ResidentPortal/Profile.tsx (calls GET /residents/me) |
| 2026-03-13 | Generated and ran FullSchemaUpdate migration — all new tables and columns applied to DB |
| 2026-03-13 | Added WhatsApp backend controller (GET /whatsapp/status, POST /whatsapp/blast) |
| 2026-03-13 | Added sendTextMessage to WhatsappService |
| 2026-03-13 | Created Whatsapp.tsx page (blast UI with recipient selector) |
| 2026-03-13 | Added WhatsApp nav item to Sidebar and /whatsapp route to App.tsx |
| 2026-03-13 | Properties.tsx: added edit/delete per card with dropdown menu |
| 2026-03-13 | PropertyDetails.tsx: wired Edit Info + room edit/delete modals |
| 2026-03-13 | Residents.tsx: added dropdown with Edit Data + Checkout per row |
| 2026-03-13 | Backend: Added GET /finance/invoices/export (CSV generation) |
| 2026-03-13 | Backend: Updated payment queries to include full resident/room contract details |
| 2026-03-13 | Frontend: Updated Tagihan page with Export CSV and WhatsApp reminder integration |
| 2026-03-13 | Frontend: Refactored Invoice/Payment interfaces to match simplified backend relations |
| 2026-03-13 | Backend: Added POST /finance/payments/:id/proof (file upload) + database migration |
| 2026-03-13 | Backend: Added GET /laporan/export (CSV via LaporanService) |
| 2026-03-13 | Backend: Added POST /saas/subscription/upgrade (switch plan logic) |
