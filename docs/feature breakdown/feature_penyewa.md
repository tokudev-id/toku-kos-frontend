# Feature Specification: Penyewa — Tenant Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Penyewa (Tenant)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Tenant Management (Penyewa)** — a page that allows kos property owners to register, view, and manage all tenants (residents) across their portfolio. Tenants are split into two status groups: **Penyewa Aktif** (actively renting a room) and **Selesai / Checkout** (former tenants who have moved out).

### Purpose
To serve as the central resident registry — capturing tenant identity information (name, phone, KTP/ID), their assigned room, check-in date, and tenure duration. The two-column layout provides instant visibility into active vs. churned tenants, while the KTP upload feature supports legal compliance and identity verification.

### Problem It Solves
- Manually tracking tenant data in spreadsheets or chat is error-prone and lacks searchability.
- Landlords need to quickly look up a tenant's phone number, room, or check-in date without navigating multiple pages.
- KTP identity documents need to be stored digitally per tenant for legal and liability purposes.
- Differentiating active tenants from checked-out ones helps with occupancy tracking and historical record-keeping.
- Emergency contact information is important for situations where the tenant cannot be reached directly.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Penyewa" — bold heading |
| Subtitle | "X penyewa aktif • Y selesai" — live count of active and churned tenants |
| "+ Tambah Penyewa" button | Primary CTA in teal; opens the "Tambah Penyewa" modal |

### Search Bar
| Component | Description |
|---|---|
| Search input | Placeholder: "Cari nama atau kode kamar..." — filters by tenant name or room code |

### Two-Column Layout

#### Left Column — Penyewa Aktif
| Element | Description |
|---|---|
| Section header | "📌 Penyewa Aktif" with a help/info icon (?) and count badge |
| Tenant cards | List of all currently active tenants, each in a card |

#### Right Column — Selesai / Checkout
| Element | Description |
|---|---|
| Section header | "✅ Selesai / Checkout" with a count badge |
| Checkout cards | List of tenants who have completed their stay and checked out |

### Penyewa Aktif — Tenant Card Structure
| Element | Description |
|---|---|
| Avatar circle | Initials-based colored circle (e.g., "AF" for Ahmad Fauzi) |
| Tenant name | Bold name text |
| Room + Property | Room code and property name (e.g., "A-101 • Kost Harmoni Residence") |
| Status badge | "Aktif" — teal pill badge |
| Phone number | 📞 Phone number link |
| Email | ✉ Email address |
| Check-in date | 📅 "Masuk: DD Mon YYYY" |
| Tenure duration | 🕐 "Sudah X bln Y hr" — duration since check-in |
| "Lihat KTP" button | Expandable row at the bottom of the card; shows the uploaded KTP image |
| "Upload KTP" button | Shown when no KTP has been uploaded; allows uploading the tenant's ID photo |

### Selesai / Checkout — Tenant Card Structure
| Element | Description |
|---|---|
| Avatar circle | Initials-based circle (grayed out or different style) |
| Tenant name | Name text |
| Room + Property | Last assigned room (may show "-" or grayed-out text) |
| "Selesai" badge | Gray/neutral pill indicating checkout status |
| Phone number | 📞 Phone number |
| "Upload KTP" button | Allows uploading a KTP post-checkout if not yet uploaded |

### Sample Penyewa Aktif Data (from screenshot)
| Tenant | Room | Phone | Check-in | Tenure |
|---|---|---|---|---|
| Ahmad Fauzi | A-101 • Kost Harmoni Residence | 08123456789 | 15 Jan 2025 | ~14 bln 1 hr |
| Siti Nurhaliza | A-102 • Kost Harmoni Residence | 08134567890 | 01 Feb 2025 | ~13 bln 14 hr |
| Budi Santoso | A-201 • Kost Harmoni Residence | 08145678901 | 01 Nov 2024 | ~16 bln 16 hr |
| Dewi Lestari | A-203 • Kost Harmoni Residence | 08156789012 | 01 Dec 2024 | ~15 bln 16 hr |
| Rizky Pratama | B-101 • Kost Harmoni Residence | 08167890123 | 01 Jan 2025 | ~14 bln 15 hr |
| Maya Putri | C-101 • Kost Cendana House | 08178901234 | 10 Jan 2025 | ~14 bln 6 hr |
| Andi Wijaya | C-102 • Kost Cendana House | 08189012345 | 01 Feb 2025 | ~13 bln 14 hr |

### Sample Selesai / Checkout Data (from screenshot)
| Tenant | Room | Phone |
|---|---|---|
| Rina Susanti | (last room) | 08190123456 |

### "Tambah Penyewa" Modal
Triggered by clicking "+ Tambah Penyewa". All fields start empty/default.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Nama Lengkap * | Text input | Empty | Required | Full legal name of the tenant; placeholder: "Nama lengkap" |
| No. Telepon * | Text input | Empty | Required; numeric | Phone number; placeholder: "08xxxxxxxxx" |
| Email | Text input | Empty | Optional; valid email format | Email address; placeholder: "email@contoh.com" |
| No. KTP/Identitas | Text input | Empty | Optional; numeric | National ID number; placeholder: "317Xxxxxxxxx" |
| Kontak Darurat | Text input | Empty | Optional | Emergency contact name and phone; placeholder: "Nama & no. telp" |
| Pilih Kamar (Kosong) * | Dropdown | "Pilih kamar kosong..." | Required | Shows only vacant rooms; auto-links tenant to selected room |
| Tanggal Masuk Kost * | Date picker | Empty | Required | Move-in date; calendar picker |
| Foto KTP | File upload | Empty | Optional; image file (JPEG/PNG/JPG) | Upload zone with upload icon; note: "Klik untuk upload foto KTP (Maks 5MB, JPG/PNG)" |
| Catatan | Textarea | Empty | Optional | Additional notes about the tenant; placeholder: "Catatan tambahan..." |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Tambah | Primary (teal) | Submits the form and registers the new tenant |

> When a tenant is added and a room is assigned, that room's status automatically changes from `vacant` to `occupied`.

---

## 3. User Flow

### Entry Point
Accessible via "Penyewa" in the sidebar navigation. This page is a core daily-use page for landlords to check on tenants and manage check-ins/check-outs.

### Step-by-Step Flow

```
1. User navigates to Penyewa
   → System fetches all residents for the authenticated tenant
   → Left column: Penyewa Aktif — sorted by check-in date or name
   → Right column: Selesai / Checkout — sorted by checkout date descending

2. User searches for a tenant
   → Types a name or room code in the search bar
   → Both columns filter in real-time to show matching results

3a. User clicks "+ Tambah Penyewa"
    → "Tambah Penyewa" modal opens with empty fields
    → User fills in: Nama Lengkap (required), No. Telepon (required)
    → Optionally fills: Email, No. KTP/Identitas, Kontak Darurat
    → Selects a vacant room from the "Pilih Kamar" dropdown
    → Sets Tanggal Masuk Kost
    → Optionally uploads Foto KTP
    → Optionally adds Catatan
    → Clicks "Tambah"
    → Tenant is registered; their room status changes to "occupied"
    → New tenant card appears in the Penyewa Aktif column
    → Success toast: "Penyewa berhasil ditambahkan."

3b. User clicks "Lihat KTP" on an active tenant card
    → Card expands (or modal opens) to display the uploaded KTP image

3c. User clicks "Upload KTP" on a tenant card without a KTP
    → File picker opens; user selects a JPEG/PNG image (max 5MB)
    → Image is uploaded and stored; "Upload KTP" button changes to "Lihat KTP"

3d. Tenant checks out
    → (Via a checkout action button not visible in main screenshot)
    → Tenant card moves from Penyewa Aktif to Selesai / Checkout column
    → Room status changes back to "vacant"

4. User clicks a tenant card (or "Edit" action)
    → Navigate to tenant detail page or opens an edit modal
    → Can update contact info, emergency contact, notes
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display a two-column layout: "Penyewa Aktif" (left) and "Selesai / Checkout" (right) |
| FR-02 | Subtitle counter must show live active count and checkout count ("X penyewa aktif • Y selesai") |
| FR-03 | Each active tenant card must show: avatar initials, name, room + property, "Aktif" badge, phone, email, check-in date, tenure duration |
| FR-04 | Tenure duration must be computed dynamically from check-in date to current date ("Sudah X bln Y hr") |
| FR-05 | Each tenant card must have a "Lihat KTP" or "Upload KTP" button depending on KTP upload status |
| FR-06 | "Tambah Penyewa" modal must include all fields: Nama Lengkap, No. Telepon, Email, No. KTP/Identitas, Kontak Darurat, Pilih Kamar (vacant only), Tanggal Masuk Kost, Foto KTP, Catatan |
| FR-07 | "Pilih Kamar" dropdown must only show rooms with status = "vacant" (kosong); occupied rooms are excluded |
| FR-08 | When a tenant is added with a room, the room status must update to "occupied" atomically |
| FR-09 | Foto KTP upload must accept JPEG/PNG, max 5MB; generate a thumbnail/preview after upload |
| FR-10 | Search must filter both columns by tenant name or room code |
| FR-11 | Checkout tenants must remain in the system (Selesai column) for historical reference |
| FR-12 | All resident data must be scoped to the authenticated tenant (multi-tenant isolation) |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Residents
```
GET /api/residents?status=&search=
Authorization: Bearer <token>

Query Params:
  status  string  optional  (aktif | selesai)
  search  string  optional  (tenant name or room code)

Response 200:
{
  "activeCount": 7,
  "checkoutCount": 1,
  "residents": [
    {
      "id": "uuid",
      "name": "Ahmad Fauzi",
      "phone": "08123456789",
      "email": "ahmad@email.com",
      "ktpNumber": "317xxxxxxxxx",
      "emergencyContact": null,
      "roomId": "uuid",
      "roomCode": "A-101",
      "propertyName": "Kost Harmoni Residence",
      "checkInDate": "2025-01-15",
      "checkOutDate": null,
      "status": "aktif",
      "ktpPhotoUrl": "https://cdn.example.com/ktp/uuid.jpg",
      "notes": null,
      "createdAt": "2025-01-15T08:00:00Z"
    }
  ]
}
```

#### Create Resident
```
POST /api/residents
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
  name              string  required
  phone             string  required
  email             string  optional
  ktpNumber         string  optional
  emergencyContact  string  optional
  roomId            uuid    required
  checkInDate       date    required  (YYYY-MM-DD)
  ktpPhoto          file    optional  (JPEG/PNG, max 5MB)
  notes             string  optional

Response 201:
{
  "id": "uuid",
  "name": "Ahmad Fauzi",
  "roomCode": "A-101",
  "checkInDate": "2025-01-15",
  "status": "aktif",
  "createdAt": "2026-03-12T09:00:00Z"
}
```

#### Upload KTP Photo
```
POST /api/residents/:id/ktp
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
  ktpPhoto  file  required  (JPEG/PNG, max 5MB)

Response 200:
{
  "ktpPhotoUrl": "https://cdn.example.com/ktp/uuid.jpg"
}
```

#### Get KTP Photo URL
```
GET /api/residents/:id/ktp
Authorization: Bearer <token>

Response 200:
{
  "ktpPhotoUrl": "https://cdn.example.com/ktp/uuid.jpg"
}
```

#### Checkout Resident
```
PATCH /api/residents/:id/checkout
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "checkOutDate": "2026-03-12"
}

Response 200:
{
  "id": "uuid",
  "status": "selesai",
  "checkOutDate": "2026-03-12"
}
```

#### Update Resident
```
PATCH /api/residents/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body (partial):
{
  "phone": "08123456799",
  "emergencyContact": "Budi - 0812345678",
  "notes": "Penyewa model kost eksklusif"
}

Response 200:
{
  "id": "uuid",
  "name": "Ahmad Fauzi",
  "phone": "08123456799",
  "updatedAt": "2026-03-12T10:00:00Z"
}
```

### Business Logic
- **Tenure duration**: Computed client-side or server-side: `currentDate − checkInDate`; rendered as "X bln Y hr". If `checkOutDate` is set, duration = `checkOutDate − checkInDate`.
- **Room assignment**: When a resident is created with a `roomId`, the room's `status` must update to `'occupied'` atomically within the same DB transaction.
- **Checkout**: Setting `checkOutDate` and `status = 'selesai'` must atomically set the room's `status` back to `'vacant'`.
- **Active residents only in room dropdown**: The `GET /api/rooms?status=vacant` endpoint filters rooms for the Pilih Kamar dropdown.
- **KTP photo storage**: Stored in object storage (S3-compatible); a UUID-based filename is generated server-side.
- **Tenant scoping**: All queries filter by `WHERE tenant_id = :currentTenantId`.

---

## 6. Data Model

### `residents` Table
```sql
CREATE TABLE residents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  room_id           UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name              VARCHAR(255) NOT NULL,
  phone             VARCHAR(20) NOT NULL,
  email             VARCHAR(255),
  ktp_number        VARCHAR(20),
  emergency_contact VARCHAR(255),
  check_in_date     DATE NOT NULL,
  check_out_date    DATE,
  status            VARCHAR(10) NOT NULL DEFAULT 'aktif'
                      CHECK (status IN ('aktif', 'selesai')),
  ktp_photo_url     TEXT,
  notes             TEXT,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_residents_tenant ON residents(tenant_id);
CREATE INDEX idx_residents_room ON residents(room_id);
CREATE INDEX idx_residents_status ON residents(status);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No tenants registered yet | Left column: "Belum ada penyewa aktif."; Right column: "Belum ada penyewa yang checkout." |
| E-02 | No vacant rooms available | "Pilih Kamar" dropdown shows "Tidak ada kamar kosong tersedia." and form cannot be submitted |
| E-03 | KTP photo exceeds 5MB | Inline error: "Ukuran file terlalu besar. Maksimal 5MB." Upload not submitted |
| E-04 | Invalid file format for KTP | Inline error: "Format file tidak didukung. Gunakan JPG atau PNG." |
| E-05 | Check-in date set in the future | Allow but show a soft warning: "Tanggal masuk di masa depan." |
| E-06 | Tenant checkout with unpaid invoice | Warn: "Penyewa ini masih memiliki tagihan yang belum lunas." Allow override with confirmation |
| E-07 | Search yields no results | Show: "Tidak ada penyewa yang cocok dengan pencarian." |
| E-08 | Unsaved form changes — click Batal | Prompt: "Perubahan belum disimpan. Keluar?" if any field was filled |
| E-09 | Phone number already registered | Soft warning: "Nomor telepon ini sudah terdaftar untuk penyewa lain." but allow creation |
| E-10 | Very long tenant name | Truncated with ellipsis on the card; full name shown in modal or tooltip |
| E-11 | Tenant re-registration after checkout | A former tenant can be re-added as a new entry (new check-in date, new room) |
| E-12 | Network error on KTP upload | Toast: "Gagal mengupload KTP. Coba lagi." without losing other form data |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant resident data access | All queries filter by `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/residents/*` endpoints require valid JWT; return `401` |
| S-03 | KTP photo access by other tenants | KTP photo URLs must be pre-signed (time-limited) or served through an authenticated proxy; never publicly accessible |
| S-04 | Malicious file upload (KTP photo) | Validate MIME type and extension server-side; generate UUID filename; never execute uploaded files |
| S-05 | PII data exposure (KTP number, phone) | KTP number and phone are PII; ensure HTTPS-only transport; consider field-level encryption at rest for KTP numbers |
| S-06 | Path traversal via filename | Ignore client-supplied filename; use UUID-based naming in object storage |
| S-07 | Edit/checkout another tenant's resident | `PATCH /api/residents/:id` and checkout endpoint verify `resident.tenant_id == currentTenantId` |
| S-08 | Phone number as PII | Treat phone numbers as sensitive data; do not log in plain text; mask in error responses |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Tenant detail page** | Clicking a tenant card navigates to a full profile page with all invoices, payment history, and notes |
| I-02 | **Checkout flow modal** | A dedicated checkout modal to confirm check-out date, note reason, and handle deposit refund tracking |
| I-03 | **WhatsApp quick contact** | A WhatsApp icon on each card that opens a pre-composed message to the tenant's phone number |
| I-04 | **Tenant document management** | Support multiple documents per tenant (KTP, KK, surat perjanjian sewa) |
| I-05 | **Rental agreement upload** | Attach a signed rental contract PDF per tenant alongside the KTP |
| I-06 | **Tenant avatar photo** | Allow uploading a profile photo in addition to KTP for visual identification |
| I-07 | **Pending KTP alert** | Surface a badge or alert count for tenants who have not yet uploaded their KTP |
| I-08 | **Lease expiry tracking** | Track lease end dates and send automatic alerts when a lease is approaching its end |
| I-09 | **Tenant history per room** | From a room's detail, view the full historical list of tenants who occupied it |
| I-10 | **Bulk checkout** | Select multiple tenants for simultaneous checkout (e.g., end of academic year) |
| I-11 | **Search by KTP number** | Include KTP number in the search scope for identity verification lookups |

---

## 10. Feature Summary

The **Penyewa** page is the resident management hub of Living Kost Pro, organized around a two-column split view that separates active tenants from those who have checked out. It is composed of:

1. **Penyewa Aktif (Left Column)** — A card-based list of all currently renting tenants. Each card surfaces the key operational data a landlord needs daily: name, room, phone number, email, check-in date, and live tenure duration. The "Upload KTP" / "Lihat KTP" button at the bottom of each card addresses the critical legal requirement of storing tenant identity documents.

2. **Selesai / Checkout (Right Column)** — A historical archive of former tenants. Keeping checkouts visible (rather than deleting them) preserves data integrity for financial reports and enables re-registration if a tenant moves back in.

3. **Tambah Penyewa Modal** — A comprehensive intake form capturing all tenant information at the point of check-in: personal details (name, phone, email), identity (KTP number), emergency contact, room assignment (vacant rooms only), move-in date, KTP photo upload, and notes. The atomic room assignment ensures that adding a tenant immediately marks the room as occupied, keeping occupancy metrics consistent across the app.

The live tenure counter ("Sudah X bln Y hr") is a small but meaningful UX detail — it surfaces how long each resident has been staying at a glance, useful for renewal conversations and loyalty recognition.
