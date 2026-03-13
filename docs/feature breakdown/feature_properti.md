# Feature Specification: Properti — Property Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Properti (Property)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**Property Management (Properti)** — a page that allows kos property owners to register, view, and manage their physical kos properties. Each property represents a building or location under the landlord's portfolio, containing multiple rooms.

### Purpose
To serve as the top-level organizational unit of the kos management system. All rooms, expenses, and occupancy data are linked to a property. The Properti page gives landlords a visual, card-based overview of each location's key metrics and provides entry points for editing property details.

### Problem It Solves
- Landlords managing multiple kos buildings need a clear registry of each property with address, room count, and occupancy status.
- Without a property abstraction, rooms, expenses, and reports cannot be scoped per location, making multi-property management impossible.
- Visual occupancy progress bars provide instant fill-rate awareness without navigating into room-level details.
- Edit capability allows landlords to keep property information current (e.g., address corrections, notes updates).

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Properti" — bold heading |
| Subtitle | "Kelola semua properti kost Anda." |
| "+ Tambah Properti" button | Primary CTA in teal; opens the "Tambah Properti" modal |

### Property Card Grid
Properties are displayed in a responsive card grid layout. Each card represents one property.

#### Property Card Structure
| Element | Description |
|---|---|
| Building icon | Teal building/apartment icon in the top-left of the card |
| Occupancy badge | Top-right corner; teal pill badge showing "XX% terisi" (percentage occupied) |
| Edit icon (✏) | Pencil icon in the top-right next to the occupancy badge; opens "Edit Properti" modal |
| Property name | Bold, prominent text (e.g., "Kost Harmoni Residence") |
| Address | Location pin icon + address text (e.g., "JL. Harmoni No. 42, Menteng, Jakarta Pusat") |
| Room count | "Kamar: 16/20" — occupied rooms / total rooms |
| Occupancy bar | Horizontal teal progress bar showing the fill ratio |

#### Sample Property Data (from screenshot)
| Property | Address | Rooms | Occupancy |
|---|---|---|---|
| Kost Harmoni Residence | JL. Harmoni No. 42, Menteng, Jakarta Pusat | 16/20 | 80% terisi |
| Kost Cendana House | JL. Cendana Raya No. 15, Bandung | 10/12 | 83% terisi |

### "Tambah Properti" Modal (Add Flow)
Triggered by clicking "+ Tambah Properti". All fields start empty/default.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Nama Properti * | Text input | Empty | Required | Property name; placeholder: "Contoh: Kost Harmoni" |
| Alamat * | Text input | Empty | Required | Street address; placeholder: "Jl. Contoh No. 1" |
| Kota * | Text input | "Jakarta" (suggested) | Required | City name |
| Catatan | Textarea | Empty | Optional | Additional notes about the property; placeholder: "Catatan tambahan..." |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Tambah | Primary (teal) | Submits the form; creates a new property |

### "Edit Properti" Modal (Edit Flow)
Triggered by clicking the pencil (✏) icon on a property card. Fields are pre-filled with existing values.

| Field | Pre-filled Example | Notes |
|---|---|---|
| Nama Properti * | "Kost Cendana House" | Editable; required |
| Alamat * | "Jl. Cendana Raya No. 15" | Editable; required |
| Kota * | "Bandung" | Editable; required |
| Catatan | "Kost mahasiswa dekat ITB" | Editable; optional |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving |
| Simpan | Primary (teal) | Saves the updated property details |

> **Note**: Button label is **"Tambah"** in the add modal and **"Simpan"** in the edit modal.

---

## 3. User Flow

### Entry Point
Accessible via "Properti" in the sidebar navigation. This is typically one of the first pages a new landlord visits to set up their portfolio.

### Step-by-Step Flow

```
1. User navigates to Properti
   → System fetches all properties for the authenticated tenant
   → Properties render as cards sorted by creation date (or alphabetically)

2. User reviews property cards
   → Each card shows occupancy %, room count, and address at a glance
   → Identifies which property has available rooms (lower %)

3a. User clicks "+ Tambah Properti"
    → "Tambah Properti" modal opens with empty fields
    → User fills in: Nama Properti (required), Alamat (required), Kota (required)
    → Optionally adds Catatan
    → Clicks "Tambah"
    → Modal closes; new property card appears in the grid
    → Success toast: "Properti berhasil ditambahkan."

3b. User clicks the edit (✏) icon on an existing property card
    → "Edit Properti" modal opens pre-filled with that property's data
    → User modifies the desired fields (e.g., updates address or adds a note)
    → Clicks "Simpan"
    → Modal closes; property card updates with new values
    → Success toast: "Properti berhasil diperbarui."

3c. User clicks on a property card (non-edit area)
    → Navigates to that property's detail/room list page
    → (or triggers a filter on Kamar page scoped to that property)

4. Occupancy bar updates automatically
   → As rooms are added/occupied/vacated via the Kamar page,
     each property card's bar, count, and % badge update in real-time (or on refresh)
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display all properties as responsive cards with: building icon, occupancy badge (% terisi), edit icon, property name, address, room count (occupied/total), and occupancy progress bar |
| FR-02 | Occupancy percentage badge must update based on actual room data |
| FR-03 | "+ Tambah Properti" opens a modal with: Nama Properti (required), Alamat (required), Kota (required), Catatan (optional) |
| FR-04 | Edit (✏) icon on card opens a pre-filled "Edit Properti" modal with same fields |
| FR-05 | Primary button label must be "Tambah" for add and "Simpan" for edit |
| FR-06 | Both modals must have a "Batal" button that closes without saving |
| FR-07 | Occupancy progress bar must visually represent occupied/total rooms ratio |
| FR-08 | Room count format must be "Kamar: X/Y" where X = occupied rooms, Y = total rooms |
| FR-09 | Clicking a property card (non-edit) must navigate to that property's room list |
| FR-10 | All properties must be scoped to the authenticated tenant |
| FR-11 | Empty state when no properties exist must guide user to add their first property |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Properties
```
GET /api/properties
Authorization: Bearer <token>

Response 200:
{
  "properties": [
    {
      "id": "uuid",
      "name": "Kost Harmoni Residence",
      "address": "JL. Harmoni No. 42, Menteng",
      "city": "Jakarta Pusat",
      "notes": null,
      "totalRooms": 20,
      "occupiedRooms": 16,
      "occupancyRate": 80.0,
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Kost Cendana House",
      "address": "JL. Cendana Raya No. 15",
      "city": "Bandung",
      "notes": "Kost mahasiswa dekat ITB",
      "totalRooms": 12,
      "occupiedRooms": 10,
      "occupancyRate": 83.3,
      "createdAt": "2026-01-10T00:00:00Z"
    }
  ]
}
```

#### Create Property
```
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Kost Melati",
  "address": "Jl. Melati No. 7",
  "city": "Surabaya",
  "notes": "Dekat kampus UNAIR"
}

Response 201:
{
  "id": "uuid",
  "name": "Kost Melati",
  "address": "Jl. Melati No. 7",
  "city": "Surabaya",
  "notes": "Dekat kampus UNAIR",
  "totalRooms": 0,
  "occupiedRooms": 0,
  "occupancyRate": 0.0,
  "createdAt": "2026-03-12T09:00:00Z"
}
```

#### Update Property
```
PATCH /api/properties/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body (partial update supported):
{
  "name": "Kost Cendana House",
  "address": "Jl. Cendana Raya No. 15",
  "city": "Bandung",
  "notes": "Kost mahasiswa dekat ITB"
}

Response 200:
{
  "id": "uuid",
  "name": "Kost Cendana House",
  "address": "Jl. Cendana Raya No. 15",
  "city": "Bandung",
  "notes": "Kost mahasiswa dekat ITB",
  "updatedAt": "2026-03-12T10:00:00Z"
}
```

#### Delete Property
```
DELETE /api/properties/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Property deleted successfully."
}
```

### Business Logic
- **Occupancy Rate**: `(occupiedRooms / totalRooms) * 100`, rounded to 1 decimal. If `totalRooms = 0`, rate is `0.0`.
- **occupiedRooms**: Count of rooms with `status = 'occupied'` linked to this property.
- **totalRooms**: Count of all active rooms linked to this property (excluding archived/deleted rooms).
- **Deletion safety**: A property with existing rooms or active residents should warn the landlord before deletion; cascade strategy must be defined (refuse deletion until rooms are cleared, or cascade-delete).
- **Tenant scoping**: All queries filter by `WHERE tenant_id = :currentTenantId`.

---

## 6. Data Model

### `properties` Table
```sql
CREATE TABLE properties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  address     VARCHAR(500) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_tenant ON properties(tenant_id);
```

> **Note**: `totalRooms`, `occupiedRooms`, and `occupancyRate` are computed fields — derived at query time by joining with the `rooms` table. They are not stored in the `properties` table directly.

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No properties registered yet | Empty state: "Belum ada properti. Klik '+ Tambah Properti' untuk memulai." |
| E-02 | Property has 0 rooms | Room count shows "Kamar: 0/0"; occupancy bar is empty; badge shows "0% terisi" |
| E-03 | All rooms occupied (100%) | Occupancy bar is fully filled; badge shows "100% terisi" |
| E-04 | Delete property with active rooms/residents | Block deletion with warning: "Properti ini masih memiliki kamar aktif. Kosongkan kamar terlebih dahulu." |
| E-05 | Duplicate property name | Warn: "Properti dengan nama ini sudah terdaftar." but do NOT block creation |
| E-06 | Very long property name or address | Truncated with ellipsis on the card; full text visible in edit modal |
| E-07 | Unsaved edits in modal — click Batal | Show confirmation: "Perubahan belum disimpan. Keluar?" if any field was modified |
| E-08 | Network error during save | Error toast: "Gagal menyimpan. Coba lagi." without closing the modal |
| E-09 | Many properties (10+) | Cards wrap into responsive multi-column grid; no arbitrary limit on property count |
| E-10 | Single property | Grid shows 1 card; full-width or constrained to card max-width depending on layout |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant property access | All queries filter by `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/properties/*` endpoints require valid JWT; return `401` |
| S-03 | Edit/delete another tenant's property | `PATCH`/`DELETE /api/properties/:id` verifies ownership; return `403 Forbidden` |
| S-04 | Input injection in name/address/notes | Use parameterized queries; sanitize all string inputs |
| S-05 | Mass assignment via PATCH | Only allow whitelisted fields (`name`, `address`, `city`, `notes`); ignore unknown fields |
| S-06 | Cascade delete risk | Server should require explicit confirmation or block deletion if child records (rooms, residents) exist |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Property photo** | Allow uploading a cover photo for each property card for visual identification |
| I-02 | **Property detail page** | Clicking a card navigates to a full property page listing all rooms, occupancy history, and expenses |
| I-03 | **Map integration** | Show property location on a map (Google Maps / OpenStreetMap embed) via address geocoding |
| I-04 | **Property-level filtering** | Allow filtering Tagihan, Pembayaran, and Pengeluaran pages by property |
| I-05 | **Archive property** | Soft-delete/archive inactive properties without losing historical data |
| I-06 | **Property type tag** | Tag properties by type (e.g., Kos Putra, Kos Putri, Kos Campur) for categorization |
| I-07 | **Facilities list** | Add a facilities summary per property (WiFi, AC, Parking, etc.) for marketing reference |
| I-08 | **Vacancy alert** | Highlight properties with low occupancy or rooms vacant for 30+ days |
| I-09 | **Multi-floor support** | Group rooms by floor within a property for larger buildings |
| I-10 | **Revenue per property** | Show monthly income attribution per property card for financial benchmarking |

---

## 10. Feature Summary

The **Properti** page is the portfolio overview screen of Living Kost Pro — the highest-level organizational layer in the system. It is composed of:

1. **Property Card Grid** — A visual, card-based layout where each kos building is displayed with its name, address, room occupancy (filled/total rooms as `X/Y`), occupancy percentage badge, and a color-filled progress bar. The intuitive card design lets landlords instantly assess which buildings have available rooms without entering detailed views.

2. **Add / Edit Modals** — A consistent modal pattern for creating new properties (Tambah Properti) and modifying existing ones (Edit Properti). Both modals capture the same fields: Nama Properti, Alamat, Kota, and optional Catatan. The "Tambah" vs "Simpan" button label convention clearly signals intent to the user.

As the root entity in the data hierarchy (`tenant → property → room → resident → invoice`), the Properti page is foundational — every other feature in Living Kost Pro either directly references a property or is scoped through one. Setting up properties correctly is the first step for any new landlord onboarding into the system.
