# Feature Specification: Kamar — Room Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Kamar (Room)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Room Management (Kamar)** — a page that allows kos property owners to register, view, edit, and delete rooms across all their properties. Each room represents a rentable unit within a property, with its own code, type, floor, dimensions, price, deposit, utility inclusions, and an optional photo.

### Purpose
To serve as the master registry of all rentable units in the landlord's portfolio. Room data is referenced by residents (Penyewa), invoices (Tagihan), and occupancy metrics (Dashboard, Laporan). Managing room details centrally ensures pricing, status, and physical specs are always up to date.

### Problem It Solves
- Tracking dozens of rooms across multiple properties manually leads to inconsistencies in rental prices and availability info.
- Landlords need to quickly look up a room's price, type, and current status (occupied, vacant, maintenance) without asking tenants or checking invoices.
- Room-level details (floor, size, utility inclusions) are needed when communicating with prospective tenants.
- The add/edit modal ensures landlords can onboard new rooms as they expand their property portfolio.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Kamar" — bold heading |
| Subtitle | "X kamar terdaftar" — live count of all registered rooms |
| "+ Tambah Kamar" button | Primary CTA in teal; opens the "Tambah Kamar" modal |

### Search & Filter Bar
| Component | Description |
|---|---|
| Search input | Placeholder: "Cari kode kamar atau properti..." — searches by room code or property name |
| Property filter dropdown | Defaults to "Semua"; allows filtering by a specific property |

### Room List Table
| Column | Description |
|---|---|
| Kode | Room code (e.g., A-101, B-102) |
| Properti | Property name the room belongs to |
| Tipe | Room type (e.g., Standard) — visible only in the full table view, absent in modal |
| Harga/Bulan | Monthly rental price in Rupiah |
| Status | Color-coded status badge |
| Aksi | Per-row actions: edit (pencil icon) and delete (trash icon, red) |

### Room Status Badges
| Status | Badge Color | Meaning |
|---|---|---|
| Terisi | Teal/green | Room is currently occupied by a tenant |
| Kosong | Gray/neutral | Room is vacant and available |
| Perbaikan | Orange/yellow | Room is under maintenance, not available |

### Sample Room Data (from screenshot)
| Kode | Properti | Harga/Bulan | Status |
|---|---|---|---|
| A-101 | Kost Harmoni Residence | Rp 1.500.000 | Terisi |
| A-102 | Kost Harmoni Residence | Rp 1.500.000 | Terisi |
| A-103 | Kost Harmoni Residence | Rp 2.000.000 | Kosong |
| A-201 | Kost Harmoni Residence | Rp 2.000.000 | Terisi |
| A-202 | Kost Harmoni Residence | Rp 1.500.000 | Terisi |
| A-203 | Kost Harmoni Residence | Rp 3.000.000 | Terisi |
| B-101 | Kost Harmoni Residence | Rp 1.500.000 | Terisi |
| B-102 | Kost Harmoni Residence | Rp 1.500.000 | Kosong |
| C-101 | Kost Cendana House | Rp 1.200.000 | Terisi |
| C-102 | Kost Cendana House | Rp 1.200.000 | Terisi |

### "Tambah Kamar" Modal (Add Flow)
Triggered by clicking "+ Tambah Kamar". All fields start empty/default.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Properti * | Dropdown | "Pilih properti" | Required | Links room to one of the landlord's registered properties |
| Kode Kamar * | Text input | "A-101" (placeholder) | Required; unique per property | Room identifier code; placeholder: "A-101" |
| Lantai | Number input | 1 | Optional; positive integer | Floor number the room is on |
| Tipe | Dropdown | "Standard" | Optional | Room type; options: Standard, Deluxe, VIP, dll. |
| Ukuran | Text input | "3x4m" (placeholder) | Optional | Room dimensions as a free-text string (e.g., "3x4m") |
| Harga/Bulan (Rp) * | Number input | 1500000 (placeholder) | Required; positive integer | Monthly rental price in Rupiah |
| Deposit (Rp) | Number input | 1500000 (placeholder) | Optional; non-negative integer | Security deposit amount |
| Listrik termasuk | Toggle switch | OFF | Optional | Whether electricity bill is included in the monthly rent |
| Air termasuk | Toggle switch | OFF | Optional | Whether water bill is included in the monthly rent |
| Foto Kamar | Image upload | Empty | Optional; JPEG/PNG/WebP, max 5MB | Dashed-border upload zone with image icon; room photo |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Tambah | Primary (teal) | Validates and submits the form; creates the new room |

### "Edit Kamar" Modal (Edit Flow)
Triggered by clicking the pencil icon on a room row. Fields are pre-filled with existing values.

| Field | Pre-filled Example | Notes |
|---|---|---|
| Properti * | "Kost Harmoni Residence" | Dropdown, pre-selected; editable |
| Kode Kamar * | "A-101" | Editable; must remain unique per property |
| Lantai | 1 | Editable |
| Tipe | "Standard" | Dropdown, pre-selected |
| Ukuran | "3x4m" | Editable |
| Harga/Bulan (Rp) * | 1500000 | Editable |
| Deposit (Rp) | 1500000 | Editable |
| Listrik termasuk | OFF (customizable) | Toggle reflects current setting |
| Air termasuk | ON (customizable) | Toggle reflects current setting — screenshot shows this as enabled in Edit |
| Foto Kamar | Existing photo or empty zone | Retains previously uploaded photo; user can replace it |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Simpan | Primary (teal) | Saves the updated room details |

> **Note**: The primary action button label is **"Tambah"** for the add modal and **"Simpan"** for the edit modal.

---

## 3. User Flow

### Entry Point
Accessible via "Kamar" in the sidebar navigation. Also navigable from a property card on the Properti page.

### Step-by-Step Flow

```
1. User navigates to Kamar
   → System fetches all rooms for the authenticated tenant
   → Table renders with room code, property, price, status
   → Room count in subtitle updates

2. User searches or filters rooms
   → Types a room code (e.g., "A-10") or property name
   → Select a property from the filter dropdown to narrow to one location
   → Table filters in real-time

3a. User clicks "+ Tambah Kamar"
    → "Tambah Kamar" modal opens
    → User selects a property from the dropdown
    → Fills Kode Kamar (must be unique for that property)
    → Optionally fills: Lantai, Tipe, Ukuran
    → Sets Harga/Bulan (required) and Deposit
    → Toggles Listrik termasuk and/or Air termasuk as needed
    → Optionally uploads Foto Kamar
    → Clicks "Tambah"
    → Modal closes; new room appears in the table with status "Kosong"
    → Room count in subtitle increments
    → Success toast: "Kamar berhasil ditambahkan."

3b. User clicks Edit (pencil) on a room row
    → "Edit Kamar" modal opens pre-filled with that room's data
    → User modifies desired fields (e.g., increases Harga/Bulan, toggles utility inclusions)
    → Clicks "Simpan"
    → Modal closes; table row updates with new values
    → Success toast: "Kamar berhasil diperbarui."

3c. User clicks Delete (trash) on a room row
    → Confirmation dialog: "Apakah Anda yakin ingin menghapus kamar ini?"
    → On confirm (if room is vacant): room is deleted
    → On confirm (if room is occupied): block with warning: "Kamar ini sedang ditempati. Lakukan checkout penyewa terlebih dahulu."
    → On cancel: dialog closes, no change

4. Room status updates automatically
   → When a tenant is assigned to this room (via Penyewa), status changes to "Terisi"
   → When tenant checks out, status reverts to "Kosong"
   → Status can be manually set to "Perbaikan" for rooms under maintenance
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display all rooms in a table with columns: Kode, Properti, Tipe, Harga/Bulan, Status, Aksi |
| FR-02 | Subtitle must display the live total room count ("X kamar terdaftar") |
| FR-03 | Status badges must be color-coded: Terisi (teal), Kosong (gray), Perbaikan (orange) |
| FR-04 | "Tambah Kamar" modal must include all fields: Properti, Kode Kamar, Lantai, Tipe, Ukuran, Harga/Bulan, Deposit, Listrik termasuk, Air termasuk, Foto Kamar |
| FR-05 | "Edit Kamar" modal must pre-fill all fields with current room data including toggle states and existing photo |
| FR-06 | Kode Kamar must be unique within the same property; server-side uniqueness validation |
| FR-07 | Listrik termasuk and Air termasuk must be toggle switches (boolean) |
| FR-08 | Foto Kamar upload must accept JPEG, PNG, WebP; max 5MB; show preview after upload |
| FR-09 | Delete action must be blocked if room status is "Terisi"; show a warning |
| FR-10 | Search must filter by room code or property name |
| FR-11 | Property filter dropdown must scope the table to a single property |
| FR-12 | Primary button label: "Tambah" for add, "Simpan" for edit |
| FR-13 | All rooms must be scoped to the authenticated tenant |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Rooms
```
GET /api/rooms?propertyId=&status=&search=&page=1&limit=20
Authorization: Bearer <token>

Query Params:
  propertyId  uuid    optional
  status      string  optional  (terisi | kosong | perbaikan)
  search      string  optional  (room code or property name)
  page        integer optional  default: 1
  limit       integer optional  default: 20

Response 200:
{
  "total": 10,
  "page": 1,
  "data": [
    {
      "id": "uuid",
      "code": "A-101",
      "propertyId": "uuid",
      "propertyName": "Kost Harmoni Residence",
      "floor": 1,
      "type": "standard",
      "size": "3x4m",
      "pricePerMonth": 1500000,
      "deposit": 1500000,
      "electricityIncluded": false,
      "waterIncluded": false,
      "photoUrl": null,
      "status": "terisi",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Room
```
POST /api/rooms
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
  propertyId            uuid     required
  code                  string   required
  floor                 integer  optional  (default: 1)
  type                  string   optional  (default: 'standard')
  size                  string   optional
  pricePerMonth         integer  required
  deposit               integer  optional  (default: 0)
  electricityIncluded   boolean  optional  (default: false)
  waterIncluded         boolean  optional  (default: false)
  photo                 file     optional  (JPEG/PNG/WebP, max 5MB)

Response 201:
{
  "id": "uuid",
  "code": "A-103",
  "propertyId": "uuid",
  "pricePerMonth": 2000000,
  "status": "kosong",
  "createdAt": "2026-03-12T09:00:00Z"
}
```

#### Update Room
```
PATCH /api/rooms/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields (all optional for partial update):
  propertyId            uuid
  code                  string
  floor                 integer
  type                  string
  size                  string
  pricePerMonth         integer
  deposit               integer
  electricityIncluded   boolean
  waterIncluded         boolean
  photo                 file     (send empty to remove existing photo)

Response 200:
{
  "id": "uuid",
  "code": "A-101",
  "pricePerMonth": 1750000,
  "waterIncluded": true,
  "updatedAt": "2026-03-12T10:00:00Z"
}
```

#### Delete Room
```
DELETE /api/rooms/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Room deleted successfully."
}

Response 409 (if room is occupied):
{
  "error": "ROOM_OCCUPIED",
  "message": "Cannot delete an occupied room."
}
```

#### Get Vacant Rooms (for Penyewa dropdown)
```
GET /api/rooms?status=kosong
Authorization: Bearer <token>

Response 200:
{ ...same structure with rooms filtered to status = 'kosong' }
```

### Business Logic
- **Room code uniqueness**: Enforced at the DB level with a unique constraint on `(property_id, code)`.
- **Status transitions**:
  - New room → `kosong`
  - Resident assigned → `terisi` (atomic with resident creation)
  - Resident checkout → `kosong` (atomic with resident checkout)
  - Manual override → `perbaikan` (landlord sets manually)
- **Room type enum**: Default types: `standard`, `deluxe`, `vip`; open to extension.
- **Photo storage**: Stored in object storage; UUID-based filename; `photo_url` saved in DB.
- **Electricity/water included**: Boolean flags; used as context when generating invoices (landlord may add line items for utilities only if not included).
- **Tenant scoping**: `propertyId` must belong to the authenticated tenant; all room queries filter by joins through the property.

---

## 6. Data Model

### `rooms` Table
```sql
CREATE TABLE rooms (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id           UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  code                  VARCHAR(20) NOT NULL,
  floor                 INTEGER NOT NULL DEFAULT 1,
  type                  VARCHAR(20) NOT NULL DEFAULT 'standard',
  size                  VARCHAR(20),
  price_per_month       BIGINT NOT NULL CHECK (price_per_month > 0),
  deposit               BIGINT NOT NULL DEFAULT 0 CHECK (deposit >= 0),
  electricity_included  BOOLEAN NOT NULL DEFAULT FALSE,
  water_included        BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url             TEXT,
  status                VARCHAR(15) NOT NULL DEFAULT 'kosong'
                          CHECK (status IN ('kosong', 'terisi', 'perbaikan')),
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, code)
);

CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_rooms_status ON rooms(status);
```

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No rooms registered yet | Empty table with message: "Belum ada kamar. Klik '+ Tambah Kamar' untuk memulai." |
| E-02 | No properties registered | "Properti" dropdown is empty; user is directed to add a property first |
| E-03 | Duplicate room code in same property | Server returns `409`; inline error: "Kode kamar ini sudah ada di properti tersebut." |
| E-04 | Delete occupied room | Block deletion; toast: "Kamar ini sedang ditempati. Lakukan checkout penyewa terlebih dahulu." |
| E-05 | Delete vacant room with past history | Allow deletion; room_inventory records are preserved via `ON DELETE SET NULL` or soft delete |
| E-06 | Foto Kamar > 5MB | Inline error: "Ukuran file terlalu besar. Maksimal 5MB." |
| E-07 | Unsupported image format | Inline error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP." |
| E-08 | Harga/Bulan = 0 | Block with validation: "Harga per bulan harus lebih dari 0." |
| E-09 | Unsaved form in modal — click Batal | Prompt: "Perubahan belum disimpan. Keluar?" if any field was modified |
| E-10 | Search with no matches | Show: "Tidak ada kamar yang cocok dengan pencarian." |
| E-11 | Price edited while room is occupied | Allowed; new price takes effect from the next invoice; current active invoice is not retroactively changed |
| E-12 | Edit changes property of an occupied room | Block or warn: "Kamar ini sedang ditempati. Properti tidak dapat diubah." |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant room access | Rooms are accessed through `property_id`; all properties are verified to belong to `currentTenantId` |
| S-02 | Unauthenticated access | All `/api/rooms/*` endpoints require valid JWT; return `401` |
| S-03 | Edit/delete another tenant's room | Verify room ownership via `property.tenant_id == currentTenantId`; return `403` |
| S-04 | Malicious file upload (room photo) | Validate MIME type and extension server-side; generate UUID filename; never execute uploaded files |
| S-05 | Negative or zero price | Validate server-side: `pricePerMonth > 0`, `deposit >= 0`; reject with `400` |
| S-06 | Mass assignment via PATCH | Only allow whitelisted fields; reject unknown fields |
| S-07 | Path traversal via filename | Ignore client-supplied filename; generate UUID-based filename server-side |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Room detail page** | Click a room row to navigate to a full detail page with current tenant, invoice history, and inventory |
| I-02 | **Room status manual override** | Add a dedicated "Set Perbaikan" action button to toggle a room into maintenance mode |
| I-03 | **Multiple room photos** | Support a photo gallery per room (not just a single image) |
| I-04 | **Room type management** | Allow landlords to define custom room types beyond Standard/Deluxe/VIP |
| I-05 | **Vacancy duration tracking** | Show how many days a room has been vacant to prioritize marketing efforts |
| I-06 | **Pricing history** | Track historical price changes per room for audit/analysis |
| I-07 | **Room sorting** | Sort table by price (low/high), status, or floor |
| I-08 | **Bulk room creation** | Add multiple rooms at once (e.g., 10 standard rooms with shared settings) |
| I-09 | **Room numbering auto-suggest** | Auto-suggest next room code based on existing pattern (e.g., A-101 → A-102) |
| I-10 | **Preview room photo in table** | Show a small thumbnail of the room photo in the table row for quick visual identification |
| I-11 | **Floor plan view** | An optional visual grid view of rooms organized by floor instead of a flat table |

---

## 10. Feature Summary

The **Kamar** page is the room registry of Living Kost Pro — the direct operational unit between a property and a tenant. It is composed of:

1. **Room List Table** — A searchable, filterable table listing all registered rooms across all properties. Each row shows the room code, property, monthly price, and a color-coded status badge (Terisi / Kosong / Perbaikan). Landlords can quickly scan the table to identify available rooms, pricing, and maintenance status.

2. **Tambah/Edit Kamar Modals** — A rich modal form for creating and updating rooms. Beyond basic details (code, property, floor, size), it captures pricing and deposit values, utility inclusion toggles (Listrik termasuk / Air termasuk), and an optional room photo. The utility toggles are a practical detail — they inform both the landlord and future invoice generation whether electricity and water are bundled into rent or billed separately.

The room data maintained here is fundamental to the entire platform: `Penyewa` references rooms for tenant assignment, `Tagihan` uses `pricePerMonth` as the default rent line item, `Dashboard` aggregates room counts for occupancy metrics, and `Laporan` relies on room data to cross-reference income per property. Keeping room records accurate and up to date is therefore essential to the integrity of all downstream features.
