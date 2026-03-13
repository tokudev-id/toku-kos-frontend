# Feature Specification: Inventaris — Template & Room Inventory Management

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: Inventaris (Template Inventaris)
> **Analyzed From**: UI Screenshot (March 2026)

---

## 1. Feature Identification

### Main Feature
**Inventory Template Management** — a page that allows kos property owners to define a master list of default inventory items (furnitures, appliances, fixtures) that can be applied as a checklist whenever a new room is added to the system.

### Purpose
To provide landlords with a reusable inventory template so they don't have to manually re-enter the same items (e.g., AC, bed, desk) every time a new room is created. When a room is being added, this template appears as a checklist, and the landlord can select which items to include in that room's inventory.

### Problem It Solves
- Landlords managing multiple rooms with similar furnishings waste time re-entering inventory items for each room individually.
- Without a template, tracking which items are in which room becomes inconsistent and error-prone.
- Room condition and asset value (Harga Beli) tracking is important for insurance, damage assessment, and depreciation tracking.
- A centralized template ensures consistency across all rooms and properties.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page title | "Template Inventaris" — bold, prominent heading |
| Subtitle | "Kelola daftar item inventaris default untuk kamar" — descriptive sub-label |
| "+ Tambah Item" button | Primary CTA in teal, positioned top-right; opens modal/form to add a new template item |

### Info Banner
| Component | Description |
|---|---|
| Info icon | Circular info icon (teal) on the left |
| Banner text | "Item di sini akan muncul sebagai **checklist saat menambah kamar baru**. Anda bisa memilih item mana yang dimasukkan ke inventaris kamar." |
| Purpose | Contextual guidance to explain the relationship between this template and the room-creation flow |

### Inventory Template Table
| Column | Description |
|---|---|
| Nama Item | Name of the inventory item (e.g., AC, Tempat Tidur, Meja) |
| Qty | Default quantity of this item per room |
| Kondisi | Current condition of the item, displayed as a color-coded badge (e.g., "baik" = green) |
| Harga Beli | Purchase/acquisition price in Indonesian Rupiah |
| Catatan | Optional notes for the item; displays "-" if empty |
| Aksi | Per-row action buttons: edit (pencil icon) and delete (trash icon) |

### Sample Data (from screenshot)
| Nama Item | Qty | Kondisi | Harga Beli | Catatan |
|---|---|---|---|---|
| AC | 1 | baik | Rp 2.500.000 | - |
| Tempat Tidur | 1 | baik | Rp 1.500.000 | - |
| Meja | 1 | baik | Rp 500.000 | - |

### Condition Badge Color Coding
| Kondisi Value | Badge Color | Meaning |
|---|---|---|
| baik | Green (teal) | Item is in good working condition |
| rusak ringan | Yellow/Orange | Item has minor damage |
| rusak berat | Red | Item is heavily damaged or non-functional |
| hilang | Gray | Item is missing |

### Row Actions
| Action | Icon | Behavior |
|---|---|---|
| Edit | Pencil icon | Opens an edit modal/form pre-filled with the item's current data |
| Delete | Trash icon (red) | Prompts a confirmation dialog before permanently removing the item from the template |

### "Tambah Item Inventaris" Modal (Add Flow)
Triggered by clicking the "+ Tambah Item" button. All fields start empty/default.

| Field | Type | Default | Validation | Description |
|---|---|---|---|---|
| Nama Item * | Text input | Empty | Required | Item name; placeholder: "Contoh: AC, Tempat Tidur, Meja" |
| Qty Default | Number input | 1 | Positive integer ≥ 1 | Default quantity per room |
| Kondisi Default | Dropdown | Baik | One of enum values | Condition at time of template creation |
| Harga Beli (Rp) | Number input | 0 | Non-negative integer | Purchase/acquisition price |
| Catatan | Text input | Empty | Optional | Additional notes; placeholder: "Opsional" |
| Foto Item | Image upload | Empty | Optional; image file | Photo of the item; displayed as a dashed-border upload zone with an image icon |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving; prompts unsaved-changes confirmation if any field was modified |
| Tambah | Primary (teal) | Submits the form and creates the new template item |

### "Edit Item Inventaris" Modal (Edit Flow)
Triggered by clicking the pencil icon on any table row. All fields are pre-filled with the item's existing values.

| Field | Pre-filled Value Example | Notes |
|---|---|---|
| Nama Item * | "AC" | Editable; required |
| Qty Default | 1 | Editable |
| Kondisi Default | "Baik" | Dropdown, pre-selected to current condition |
| Harga Beli (Rp) | 2500000 | Raw numeric value (no Rp prefix in input field) |
| Catatan | Empty / existing note | Editable |
| Foto Item | Existing image or empty upload zone | Retains previously uploaded photo if present |

**Footer buttons:**
| Button | Style | Action |
|---|---|---|
| Batal | Secondary (outlined) | Closes modal without saving; prompts unsaved-changes confirmation if any field was modified |
| Simpan | Primary (teal) | Submits the updated values and saves changes |

> **Note**: The primary action button label differs between the two modals — **"Tambah"** for create and **"Simpan"** for edit — to clearly communicate the intent to the user.

---

## 3. User Flow

### Entry Point
The Inventaris page is accessible from the sidebar navigation under "Inventaris". The default view is the **Template Inventaris** tab/view.

### Step-by-Step Flow

```
1. User navigates to Inventaris from sidebar
   → System fetches all inventory template items for the authenticated tenant
   → Table renders with all items, quantities, conditions, and prices

2. User reviews the template list
   → Gets an overview of all standard furnishings/appliances defined for their kos
   → Identifies items that are missing, outdated, or need updating

3a. User clicks "+ Tambah Item"
    → "Tambah Item Inventaris" modal opens with all fields empty/default
    → User fills in: Nama Item (required), Qty Default, Kondisi Default, Harga Beli, Catatan
    → Optionally uploads a Foto Item by clicking the dashed upload zone
    → User clicks "Tambah" to submit
    → Modal closes; new item is appended to the template table
    → Success toast: "Item berhasil ditambahkan."

3b. User clicks Edit (pencil) on an existing item
    → "Edit Item Inventaris" modal opens pre-filled with the item's current values
    → All fields are editable; Harga Beli shows raw number (e.g., 2500000)
    → User modifies the desired fields
    → Optionally replaces or removes the Foto Item
    → User clicks "Simpan" to save
    → Modal closes; table row updates in-place with new values
    → Success toast: "Item berhasil diperbarui."

3c. User clicks Delete (trash) on an item
    → Confirmation dialog appears: "Apakah Anda yakin ingin menghapus item ini?"
    → On confirm: item is removed from the template
    → On cancel: dialog closes, no changes made

4. Template is used during room creation
   → When a landlord adds a new room (via Kamar → Tambah Kamar),
     the system presents this template list as a checklist
   → Landlord selects which items are present in the specific room
   → Selected items are saved as that room's inventory records, linked to the room
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display all inventory template items in a table with columns: Nama Item, Qty, Kondisi, Harga Beli, Catatan, Aksi |
| FR-02 | "Tambah Item" button opens a modal/form to create a new template item |
| FR-03 | Each template item must be editable via a pencil icon that opens a pre-filled modal |
| FR-04 | Each template item must be deletable with a confirmation prompt before removal |
| FR-05 | Kondisi field must render as a color-coded badge (baik, rusak ringan, rusak berat, hilang) |
| FR-06 | Harga Beli must be formatted in Indonesian Rupiah with thousand separators |
| FR-07 | Catatan displays "-" when no notes are provided |
| FR-08 | Template items must appear as a selectable checklist during the room-creation flow |
| FR-09 | All template items must be scoped to the authenticated tenant (multi-tenant isolation) |
| FR-10 | Info banner must be persistently visible to explain the template's purpose to new users |
| FR-11 | Table must support at least 50+ items without pagination issues; consider pagination or virtual scroll for large lists |
| FR-12 | "Tambah Item" modal must have fields: Nama Item (required), Qty Default, Kondisi Default (dropdown), Harga Beli, Catatan (optional), Foto Item (optional upload) |
| FR-13 | "Edit Item" modal must pre-fill all fields with the selected item's current data, including retaining existing photo if present |
| FR-14 | Primary button label must be "Tambah" in the add modal and "Simpan" in the edit modal |
| FR-15 | "Batal" button and the X close icon must both close the modal; if the user has modified any field, prompt an unsaved-changes confirmation |
| FR-16 | Foto Item upload zone must accept common image formats (JPEG, PNG, WebP); display a preview after selection |
| FR-17 | Kondisi Default dropdown must present options: Baik, Rusak Ringan, Rusak Berat, Hilang |

---

## 5. Backend Requirements

### API Endpoints

#### Get All Inventory Template Items
```
GET /api/inventory/templates
Authorization: Bearer <token>

Response 200:
{
  "items": [
    {
      "id": "uuid",
      "name": "AC",
      "qty": 1,
      "condition": "baik",
      "purchasePrice": 2500000,
      "notes": null,
      "createdAt": "2026-01-10T08:00:00Z",
      "updatedAt": "2026-01-10T08:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Tempat Tidur",
      "qty": 1,
      "condition": "baik",
      "purchasePrice": 1500000,
      "notes": null,
      "createdAt": "2026-01-10T08:00:00Z",
      "updatedAt": "2026-01-10T08:00:00Z"
    }
  ]
}
```

#### Create Inventory Template Item
```
POST /api/inventory/templates
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields:
  name          string   required
  qty           integer  required  (default: 1)
  condition     string   required  (enum: baik | rusak_ringan | rusak_berat | hilang)
  purchasePrice integer  required  (default: 0)
  notes         string   optional
  photo         file     optional  (JPEG / PNG / WebP, max 5MB)

Response 201:
{
  "id": "uuid",
  "name": "Lemari",
  "qty": 1,
  "condition": "baik",
  "purchasePrice": 800000,
  "notes": "Lemari 2 pintu",
  "photoUrl": "https://cdn.example.com/inventory/uuid.jpg",
  "createdAt": "2026-03-12T09:00:00Z",
  "updatedAt": "2026-03-12T09:00:00Z"
}
```

#### Update Inventory Template Item
```
PATCH /api/inventory/templates/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form fields (all optional for partial update):
  name          string
  qty           integer
  condition     string   (enum: baik | rusak_ringan | rusak_berat | hilang)
  purchasePrice integer
  notes         string
  photo         file     (JPEG / PNG / WebP, max 5MB; send empty to remove existing photo)

Response 200:
{
  "id": "uuid",
  "name": "AC",
  "qty": 1,
  "condition": "rusak_ringan",
  "purchasePrice": 2500000,
  "notes": "Perlu servis",
  "photoUrl": "https://cdn.example.com/inventory/uuid.jpg",
  "updatedAt": "2026-03-12T10:00:00Z"
}
```

#### Delete Inventory Template Item
```
DELETE /api/inventory/templates/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Inventory template item deleted successfully."
}
```

#### Get Template Items as Room Checklist (used during room creation)
```
GET /api/inventory/templates/checklist
Authorization: Bearer <token>

Response 200:
{
  "items": [
    { "id": "uuid", "name": "AC", "qty": 1, "condition": "baik", "purchasePrice": 2500000 },
    { "id": "uuid", "name": "Tempat Tidur", "qty": 1, "condition": "baik", "purchasePrice": 1500000 },
    { "id": "uuid", "name": "Meja", "qty": 1, "condition": "baik", "purchasePrice": 500000 }
  ]
}
```

### Business Logic
- **Template scoping**: All template items are scoped by `tenant_id`; no cross-tenant data leakage.
- **Condition enum**: Only allowed values are `baik`, `rusak_ringan`, `rusak_berat`, `hilang`.
- **purchasePrice validation**: Must be a non-negative integer; zero is allowed (for items with unknown cost).
- **qty validation**: Must be a positive integer (minimum 1).
- **Photo upload**: Accepted formats are JPEG, PNG, and WebP; maximum file size 5 MB. The file is stored in object storage (e.g., S3-compatible) and a public URL is saved in `photo_url`. If no photo is provided, `photo_url` is NULL.
- **Photo removal**: Sending an empty `photo` field in a PATCH request removes the existing photo and sets `photo_url` to NULL; the stored file is deleted from object storage.
- **Soft delete vs hard delete**: Deleting a template item does NOT delete inventory records already linked to existing rooms. Template items and room inventory items are decoupled after room creation.
- **Room inventory**: When a new room is created and items are selected from the template checklist, independent `room_inventory` records are created with a snapshot of the template item's values at that time. Future edits to the template do NOT retroactively modify room inventory.

---

## 6. Data Model

### `inventory_templates` Table
```sql
CREATE TABLE inventory_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  qty             INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  condition       VARCHAR(20) NOT NULL DEFAULT 'baik'
                    CHECK (condition IN ('baik', 'rusak_ringan', 'rusak_berat', 'hilang')),
  purchase_price  BIGINT NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  notes           TEXT,
  photo_url       TEXT,                          -- nullable; URL to object storage
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_templates_tenant ON inventory_templates(tenant_id);
```

### `room_inventory` Table (Room-specific inventory, created from template selection)
```sql
CREATE TABLE room_inventory (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id               UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  template_item_id      UUID REFERENCES inventory_templates(id) ON DELETE SET NULL,
  name                  VARCHAR(255) NOT NULL,
  qty                   INTEGER NOT NULL DEFAULT 1,
  condition             VARCHAR(20) NOT NULL DEFAULT 'baik'
                          CHECK (condition IN ('baik', 'rusak_ringan', 'rusak_berat', 'hilang')),
  purchase_price        BIGINT NOT NULL DEFAULT 0,
  notes                 TEXT,
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_room_inventory_room ON room_inventory(room_id);
CREATE INDEX idx_room_inventory_tenant ON room_inventory(tenant_id);
```

> **Note**: `template_item_id` is a nullable FK to preserve traceability (knowing which template an item originated from), but room inventory items are snapshots — they are not updated when the template changes.

---

## 7. Edge Cases

| # | Scenario | Expected Handling |
|---|---|---|
| E-01 | No template items exist yet | Table shows an empty state with a message: "Belum ada item inventaris. Klik '+ Tambah Item' untuk memulai." |
| E-02 | Duplicate item name added | System warns: "Item dengan nama ini sudah ada." but does NOT block creation (items may have different specs) |
| E-03 | Delete item already used in room inventory | Template deletion proceeds; `room_inventory` rows retain data via snapshot; `template_item_id` FK is set to NULL |
| E-04 | Empty "Catatan" field | Stored as NULL in DB; displayed as "-" in the table |
| E-05 | Harga Beli = 0 | Allowed and displayed as "Rp 0"; no validation error |
| E-06 | Very long item name | Truncated in the table with an ellipsis (`...`); full name visible on hover tooltip or in the edit modal |
| E-07 | Large template list (50+ items) | Table should paginate or use virtual scrolling; page size default: 20 items |
| E-08 | Edit an item that has been used in room checklist | Only updates the template; does NOT retroactively change existing room inventory records |
| E-09 | Unsaved form in modal then click close/cancel | Show a confirmation: "Perubahan belum disimpan. Keluar?" |
| E-10 | Network error during save | Show an error toast: "Gagal menyimpan. Coba lagi." without closing the modal |
| E-11 | Invalid purchase price (negative or non-numeric) | Inline validation error: "Harga beli tidak valid." |
| E-12 | Foto Item exceeds 5 MB | Inline error below upload zone: "Ukuran file terlalu besar. Maksimal 5 MB." Upload is not submitted |
| E-13 | Unsupported image format uploaded | Inline error: "Format file tidak didukung. Gunakan JPEG, PNG, atau WebP." |
| E-14 | Edit modal opened for item without a photo | Foto Item zone shows the empty upload placeholder; existing photo is not reset unless user explicitly uploads a new one |
| E-15 | Nama Item field left empty on submit | Inline validation error: "Nama item wajib diisi." Form is not submitted |
| E-16 | Qty Default set to 0 or negative | Inline validation error: "Qty harus minimal 1." |

---

## 8. Security Considerations

| # | Concern | Mitigation |
|---|---|---|
| S-01 | Cross-tenant data leakage | All queries against `inventory_templates` must filter by `WHERE tenant_id = :currentTenantId` |
| S-02 | Unauthenticated access | All `/api/inventory/*` endpoints require a valid JWT; return `401` if absent or expired |
| S-03 | Delete another tenant's item | `DELETE /api/inventory/templates/:id` must verify the item belongs to the requesting tenant before deletion; return `403 Forbidden` otherwise |
| S-04 | Input injection via item name/notes | All string inputs must be sanitized; use parameterized queries for all DB operations |
| S-05 | Mass assignment via PATCH | Only allow whitelisted fields (`name`, `qty`, `condition`, `purchasePrice`, `notes`); ignore unknown fields |
| S-06 | Negative or overflowing price values | Validate `purchasePrice` server-side: must be >= 0 and <= safe integer limit (e.g., 999,999,999,999) |
| S-07 | Malicious file upload via Foto Item | Validate MIME type and file extension server-side (not just frontend); run virus/malware scan if possible; never execute uploaded files |
| S-08 | Path traversal via uploaded filename | Ignore the client-supplied filename entirely; generate a UUID-based filename server-side before storing to object storage |

---

## 9. Improvement Opportunities

| # | Improvement | Rationale |
|---|---|---|
| I-01 | **Category/tag grouping** | Allow items to be grouped by category (Elektronik, Furnitur, Perabot) for easier browsing |
| I-02 | **Bulk add from common presets** | Provide a preset list of common kos items the user can select and import in bulk |
| I-03 | **Total asset value summary** | Show the total estimated asset value (sum of all `Harga Beli × Qty`) at the top of the template page |
| I-04 | **Search/filter in template table** | Add a search bar to filter template items by name when the list grows large |
| I-05 | **Condition filter** | Allow filtering table by condition (e.g., show only "rusak" items) |
| I-06 | **Sortable columns** | Allow sorting by Nama Item, Harga Beli, or Kondisi by clicking column headers |
| I-07 | **Image upload per item** | Allow attaching a photo to each inventory item for visual reference |
| I-08 | **Depreciation tracking** | Add a purchase date field; calculate estimated current value based on depreciation rate |
| I-09 | **Export to CSV/Excel** | Allow exporting the full inventory template list for external record-keeping or audit |
| I-10 | **Per-property templates** | Support different templates per property (e.g., Type A room vs Type B room furnishings) |
| I-11 | **Room inventory view** | A separate sub-view to see inventory per individual room, with the ability to update condition per room |

---

## 10. Feature Summary

The **Inventaris** feature in Living Kost Pro provides a two-layer inventory management system:

1. **Template Inventaris** (this page) — A master catalog of default inventory items that a landlord defines once and reuses across all room creations. It stores the item name, quantity, condition, purchase price, and optional notes. Items here act as a **checklist scaffold** — ensuring every new room starts with a consistent, complete furnishing record.

2. **Room Inventory** (downstream) — When a new room is created, the template checklist is presented to the landlord to select applicable items. The selected items are then saved as independent snapshots linked to that specific room. This decoupled design means future template edits don't break historical room records.

Key benefits:
- **Efficiency**: Define items once, apply to any number of rooms.
- **Consistency**: Standardizes inventory records across the entire kos portfolio.
- **Traceability**: Tracks purchase prices and conditions, enabling asset valuation and damage accountability.
- **Scalability**: As a kos business grows, the template grows with it — new item types can be added at any time and will be available for all future room additions.
