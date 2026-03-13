# Feature Specification: WhatsApp — WhatsApp Manager

> **Application**: Living Kost Pro — Kos/Boarding House Management Platform
> **Page**: WhatsApp (WhatsApp Manager)
> **Analyzed From**: UI Screenshots (March 2026)

---

## 1. Feature Identification

### Main Feature
**WhatsApp Manager** — a dedicated communication hub that allows kos landlords to send WhatsApp messages to residents, manage message templates, run broadcast campaigns, configure automated payment reminders, and set up WhatsApp API integration — all from within the application.

### Purpose
To centralize all WhatsApp communication between landlord and residents in one place, eliminating the need to manually switch between the management app and a separate WhatsApp client. The feature supports both manual and automated messaging workflows anchored around billing cycles.

### Problem It Solves
- Landlords manually sending payment reminders to each resident via personal WhatsApp is time-consuming and error-prone.
- Without broadcast functionality, reaching all residents simultaneously requires sending individual messages one by one.
- Lack of message templates leads to inconsistent communication tone and content.
- Automated reminders based on due-date proximity eliminate follow-up tasks that landlords often forget.
- Overdue residents ("Menunggak") need to be identified instantly and contacted without navigating multiple pages.

---

## 2. UI Component Breakdown

### Page Header
| Component | Description |
|---|---|
| Page icon | Green chat/WhatsApp bubble icon |
| Page title | "WhatsApp Manager" — bold heading |
| Subtitle | "Kelola komunikasi dengan penghuni kost" |
| Connection status badge | Top-right corner; grey pill showing "Belum Dikonfigurasi" (Not Configured) when API is not yet set up; turns green when connected |

### Tab Navigation
Six tabs across the top of the content area:

| Tab | Icon | Purpose |
|---|---|---|
| Pesan | Chat bubble icon | Chat inbox — view and send messages per resident |
| Penghuni | Person icon | Resident overview with WhatsApp quick actions |
| Templat | Document icon | Message template library |
| Broadcast | Broadcast icon | Send one message to multiple selected residents |
| Otomatis | Bell icon | Configure automated reminder schedules |
| Pengaturan | Settings icon | WhatsApp API provider configuration |

---

### Tab 1: Pesan (Messages)

A two-panel chat interface for direct resident communication.

#### Left Panel — Conversation List
| Element | Description |
|---|---|
| Search bar | "Cari penghuni..." — filters conversation list in real time |
| Conversation item | Per-resident row: avatar (initials + color), resident name, room number, last message timestamp, "Menunggak" red badge if overdue |
| Active conversation | Highlighted row with teal left border or background |

#### Right Panel — Conversation View
| Element | Description |
|---|---|
| Conversation header | Resident avatar, name, phone number, "Online" green dot status |
| "Kirim Templat" button | Secondary button; opens template picker to insert a template into message |
| "Buka di WA" button | Primary teal button; opens the conversation directly in WhatsApp Web/App |
| Chat bubbles | Green bubbles = messages sent by landlord (right-aligned); white/grey bubbles = messages received from resident (left-aligned) |
| Timestamp | Shown below each message bubble (e.g., "09:00", "09:15") |
| Read receipt | Checkmark icons on sent messages |
| Message input | "Ketik pesan..." placeholder; text area at the bottom |
| Template icon | Button left of input to attach/select a template |
| Send button | Green circular button with send arrow icon |

#### Sample Conversation Data (from screenshot)
| Direction | Message | Time |
|---|---|---|
| Sent | "Selamat pagi Pak Budi, ini pengingat tagihan kost bulan ini ya 🔔" | 09:00 |
| Received | "Pagi bu, saya transfer nanti siang ya" | 09:15 |
| Sent | "Baik Pak, ditunggu ya. Terima kasih 🙏" | 09:16 |
| Received | "Sudah saya transfer bu, ini buktinya" | 13:20 |
| Sent | "Terima kasih Pak Budi, pembayaran sudah kami terima ✅" | 13:45 |

---

### Tab 2: Penghuni (Residents)

Resident-centric view with at-a-glance billing status and communication action buttons.

#### Summary Stats Bar
| Badge | Style | Description |
|---|---|---|
| Total Aktif | Teal background, large number | Count of residents with active status |
| Menunggak | Red/pink background, large number | Count of residents with overdue payment status |

#### Resident Card Grid
Cards are displayed in a 3-column responsive grid.

| Element | Description |
|---|---|
| Avatar | Circle with initials (e.g., "BS"), color-coded per resident |
| Resident name | Bold text |
| Status badge | "Aktif" (teal) or "Menunggak" (red) pill badge below name |
| Room number | House icon + room code (e.g., "Kamar A1") |
| Phone number | Phone icon + phone number (e.g., "081234567890") |
| Monthly rent | Fire/price icon + "Rp X.XXX.XXX/bln" |
| Due date | Calendar icon + "Jatuh tempo: YYYY-MM-DD" |
| Chat button | Outlined button; opens the Pesan tab scoped to this resident |
| WA button | Outlined button with external icon; opens WhatsApp directly with this resident's number |
| Templat button | Outlined button; opens template picker to send a template to this resident |

#### Sample Resident Data (from screenshot)
| Name | Room | Status | Phone | Due Date | Rent |
|---|---|---|---|---|---|
| Budi Santoso | Kamar A1 | Aktif | 081234567890 | 2025-04-05 | Rp 1.500.000/bln |
| Siti Rahayu | Kamar B3 | Aktif | 082345678901 | 2025-04-03 | Rp 1.200.000/bln |
| Andi Prasetyo | Kamar C2 | Menunggak | 083456789012 | 2025-03-25 | Rp 2.400.000/bln |
| Dewi Kusuma | Kamar A4 | Aktif | 084567890123 | 2025-04-10 | Rp 1.500.000/bln |
| Reza Firmansyah | Kamar D1 | Menunggak | 085678901234 | 2025-03-20 | Rp 1.800.000/bln |

---

### Tab 3: Templat (Message Templates)

A library of reusable WhatsApp message templates.

#### Section Header
| Component | Description |
|---|---|
| Section title | "Templat Pesan" |
| "+ Buat Templat" button | Primary teal button in top-right; opens the template creation modal |

#### Template Card Grid
Cards arranged in a 3-column responsive grid.

| Element | Description |
|---|---|
| Icon | Emoji or icon representing the template type |
| Template name | Bold title (e.g., "Pengingat Tagihan H-7") |
| Category tag | Colored pill badge (e.g., "tagihan" in orange, "konfirmasi" in teal, "info" in blue, "broadcast" in yellow) |
| Preview text | First line(s) of the template body (e.g., "Halo *{{nama}}* 👋") |
| Placeholder notation | Variables shown as `*{{nama}}*`, `*{{jumlah}}*`, etc. |
| "Kirim ke Penghuni" button | Primary teal button; opens recipient selection to send this template |
| "Edit" button | Secondary outlined button; opens template editor modal |

#### Default Template Library (from screenshot)
| Template Name | Category | Description |
|---|---|---|
| Pengingat Tagihan H-7 | tagihan | 7-day advance payment reminder |
| Tagihan Jatuh Tempo Hari Ini | tagihan | Due-date-day payment reminder |
| Tunggakan & Denda | tagihan | Overdue payment + late fee notice |
| Konfirmasi Pembayaran | konfirmasi | Payment receipt confirmation |
| Selamat Datang Penghuni Baru | info | New resident welcome message |
| Perpanjangan Kontrak | info | Lease renewal reminder |
| Broadcast Pengumuman | broadcast | General announcement to all residents |

#### "Buat Templat" / "Edit Templat" Modal Fields
| Field | Type | Required | Description |
|---|---|---|---|
| Nama Templat | Text input | Yes | Display name for the template |
| Kategori | Dropdown | Yes | Category tag (tagihan, konfirmasi, info, broadcast) |
| Isi Pesan | Textarea | Yes | Message body; supports `{{nama}}`, `{{kamar}}`, `{{jumlah}}`, `{{jatuh_tempo}}` variables |
| Icon/Emoji | Picker | Optional | Visual identifier for the template card |

---

### Tab 4: Broadcast

Mass messaging interface for sending one message to a selected group of residents.

#### Left Panel — Recipient Selection
| Element | Description |
|---|---|
| "Pilih Semua" button | Selects all residents in the list |
| "Hanya Menunggak" button | Filters and selects only overdue residents |
| "Reset" button | Clears all selections |
| Resident list item | Checkbox + avatar (initials) + resident name + room number; "Menunggak" badge shown for overdue residents |
| Selection counter | "Terpilih: X penghuni" — updates dynamically as checkboxes are toggled |

#### Right Panel — Message Composer
| Element | Description |
|---|---|
| Template dropdown | "Pilih templat..." — selects an existing template to pre-fill the message body |
| Message textarea | Editable text area; can be composed freely or populated from a template |
| Recipient count label | "X penerima" — shown above the send button; reflects the current selection count |
| "Kirim ke X Penghuni" button | Large primary green button; sends the composed message to all selected residents |

---

### Tab 5: Otomatis (Automation)

Configure and manage automated WhatsApp reminder schedules tied to billing due dates.

#### Left Panel — Jadwal Pengingat (Reminder Schedule)
A list of configurable time-based reminders, each with a toggle:

| Schedule Key | Label | Description | Default State |
|---|---|---|---|
| H-7 | 7 hari sebelum jatuh tempo | Calendar icon; reminder 7 days before due date | ON |
| H-3 | 3 hari sebelum jatuh tempo | Hourglass icon; reminder 3 days before due date | ON |
| H-1 | 1 hari sebelum jatuh tempo | Warning icon; reminder 1 day before due date | OFF |
| H+1 | 1 hari setelah jatuh tempo | Red dot icon; reminder 1 day after due date (overdue) | ON |
| H+3 | 3 hari tunggakan + denda | Money/penalty icon; overdue 3 days with late fee warning | OFF |
| H+7 | 7 hari tunggakan, peringatan keras | Alert icon; 7-day overdue hard warning | OFF |

Each schedule item has an ON/OFF toggle switch.

#### Right Panel — Pengaturan (Settings)
| Element | Description |
|---|---|
| "Jam Kirim Otomatis" input | Time picker defaulting to "09:00 AM"; sets the daily send time for all automated messages |
| "Templat H-7" dropdown | Template to use for H-7 reminder (default: "Pengingat Tagihan H-7") |
| "Templat Jatuh Tempo" dropdown | Template to use for due-date-day reminder (default: "Tagihan Jatuh Tempo Hari Ini") |
| "Templat Tunggakan" dropdown | Template to use for overdue reminders (default: "Tunggakan & Denda") |
| "Simpan Pengaturan" button | Primary teal; saves all automation settings |

#### Statistik Hari Ini (Today's Statistics)
A summary section below the settings panel:

| Metric | Color | Description |
|---|---|---|
| Terkirim | Black/green | Number of messages successfully sent today |
| Dijadwalkan | Black/blue | Number of messages scheduled but not yet sent today |
| Gagal | Red | Number of messages that failed to send today |

Sample data from screenshot: **12 Terkirim**, **5 Dijadwalkan**, **0 Gagal**

---

### Tab 6: Pengaturan (Settings)

WhatsApp API provider configuration for connecting the app to a real WhatsApp gateway.

#### Connection Status Banner
| Element | Description |
|---|---|
| WiFi icon | Visual indicator of connection state |
| Status label | "Belum Diatur" (Not set up) when no API is configured; changes to "Terhubung" when connected |
| Description | "Konfigurasi API WhatsApp Anda untuk mulai mengirim pesan otomatis" |

#### Konfigurasi API Panel
| Field | Type | Description |
|---|---|---|
| Provider WhatsApp | Dropdown | Selects the WhatsApp gateway provider; options include "Fonnte" and "Wablas" |
| API Token / Key | Password input (masked) | API token copied from the selected provider's dashboard; show/hide toggle |
| Nomor Pengirim | Text input | Sender WhatsApp number registered with the provider (e.g., "081234567890") |
| "Tes Koneksi" link/button | Secondary action | Validates the token and device connection before saving |
| "Simpan Pengaturan API" button | Primary teal; full width | Saves the API configuration |

#### Panduan Fonnte (Setup Guide)
Numbered instructions displayed inline:
1. Daftar akun di **fonnte.com**
2. Tambahkan device dan scan QR Code WhatsApp
3. Salin **API Token** dari halaman dashboard
4. Tempel token di kolom API Token di samping
5. Isi nomor pengirim, lalu klik **Tes Koneksi**
6. Jika berhasil, klik **Simpan Pengaturan API**

#### Tentang Integrasi WA (Provider Comparison)
| Provider | Key Selling Points |
|---|---|
| Fonnte | Mudah digunakan, Harga terjangkau, Support bahasa Indonesia |
| Wablas | Fitur lengkap, API stabil, Dashboard detail |

> **Note**: Each tenant manages their own WhatsApp API connection independently (per-tenant credential scope).

---

## 3. User Flows

### Entry Point
Accessible via "WhatsApp" in the sidebar navigation (under MENU UTAMA). The tab last visited is remembered; default is the Pesan tab.

### Flow A: Send a Direct Message
```
1. User navigates to WhatsApp → Pesan tab
   → System loads conversation list for the authenticated tenant
   → Conversations sorted by last message time (most recent first)

2. User clicks a resident in the conversation list
   → Right panel loads the conversation history
   → Messages rendered as chat bubbles

3a. User types a message in the input and clicks Send
    → Message is sent via configured WhatsApp API
    → Bubble appears on the right side with timestamp

3b. User clicks "Kirim Templat"
    → Template picker modal opens
    → User selects a template; body is injected into input
    → User optionally edits, then sends
```

### Flow B: Broadcast to Multiple Residents
```
1. User navigates to WhatsApp → Broadcast tab
   → All active residents are listed with unchecked boxes

2. User selects residents:
   → Manually checks individual checkboxes, OR
   → Clicks "Pilih Semua" to select everyone, OR
   → Clicks "Hanya Menunggak" to select only overdue residents

3. User selects a template from the dropdown
   → Message textarea is pre-filled with template content

4. User reviews/edits the message and checks recipient count

5. User clicks "Kirim ke X Penghuni"
   → System sends the message to all selected recipients via WhatsApp API
   → Success toast shown; recipient count resets
```

### Flow C: Set Up Automated Reminders
```
1. User navigates to WhatsApp → Otomatis tab
   → Current reminder toggle states and template mappings are loaded

2. User enables/disables individual reminder schedules (H-7, H-3, H-1, H+1, H+3, H+7)

3. User sets the "Jam Kirim Otomatis" to the desired send time

4. User assigns templates to each reminder type via dropdowns

5. User clicks "Simpan Pengaturan"
   → Settings are saved; scheduler is updated
   → Success toast shown
   → "Statistik Hari Ini" reflects current day's send activity
```

### Flow D: Connect WhatsApp API
```
1. User navigates to WhatsApp → Pengaturan tab
   → Banner shows "Belum Diatur" status

2. User selects a provider (Fonnte or Wablas) from the dropdown

3. User pastes the API Token from their provider dashboard

4. User enters the registered sender number

5. User clicks "Tes Koneksi"
   → System makes a test call to the provider API
   → Success: "Koneksi berhasil" confirmation shown
   → Failure: Error message with troubleshooting hint

6. User clicks "Simpan Pengaturan API"
   → Credentials are saved encrypted per tenant
   → Status badge in page header updates to "Terhubung"
```

### Flow E: Manage Message Templates
```
1. User navigates to WhatsApp → Templat tab
   → Existing templates shown in card grid

2a. User clicks "+ Buat Templat"
    → Empty template creation modal opens
    → User fills in name, category, message body with variables
    → Clicks "Simpan"
    → New template card appears in the grid

2b. User clicks "Edit" on an existing template
    → Pre-filled template editor modal opens
    → User modifies fields and clicks "Simpan"
    → Template card updates

2c. User clicks "Kirim ke Penghuni" on a template card
    → Recipient selection modal opens (similar to Broadcast tab)
    → User selects residents and sends
```

---

## 4. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Tab navigation must include: Pesan, Penghuni, Templat, Broadcast, Otomatis, Pengaturan |
| FR-02 | Page header must display a connection status badge reflecting the current WhatsApp API state |
| FR-03 | **Pesan**: Display a conversation list sorted by most recent message; each item shows resident name, room, last message time, and "Menunggak" badge if overdue |
| FR-04 | **Pesan**: Two-panel chat layout; right panel shows full conversation with sent/received bubbles and timestamps |
| FR-05 | **Pesan**: "Buka di WA" must open the resident's WhatsApp number in WhatsApp Web/App in a new tab |
| FR-06 | **Penghuni**: Display summary tiles for "Total Aktif" and "Menunggak" counts |
| FR-07 | **Penghuni**: Resident cards must show avatar, status badge, room, phone, rent, due date, and three action buttons (Chat, WA, Templat) |
| FR-08 | **Templat**: Display all templates in a card grid with category tag, preview text, "Kirim ke Penghuni" and "Edit" actions |
| FR-09 | **Templat**: Templates support variables: `{{nama}}`, `{{kamar}}`, `{{jumlah}}`, `{{jatuh_tempo}}` which are replaced with resident-specific data before sending |
| FR-10 | **Broadcast**: "Pilih Semua" selects all residents; "Hanya Menunggak" selects only overdue residents; "Reset" clears all |
| FR-11 | **Broadcast**: Selection counter ("Terpilih: X penghuni") and send button label ("Kirim ke X Penghuni") must update dynamically |
| FR-12 | **Otomatis**: Display six configurable reminder schedules (H-7, H-3, H-1, H+1, H+3, H+7), each individually togglable |
| FR-13 | **Otomatis**: Allow setting a global "Jam Kirim Otomatis" time for all scheduled messages |
| FR-14 | **Otomatis**: Allow mapping a specific message template to each reminder type (H-7, Jatuh Tempo, Tunggakan) |
| FR-15 | **Otomatis**: "Statistik Hari Ini" must display real-time counts of Terkirim, Dijadwalkan, and Gagal for the current day |
| FR-16 | **Pengaturan**: Support at minimum two providers: Fonnte and Wablas |
| FR-17 | **Pengaturan**: API Token field must be masked (password input) with a show/hide toggle |
| FR-18 | **Pengaturan**: "Tes Koneksi" must validate the API token and device connectivity before the user saves |
| FR-19 | API credentials must be stored encrypted at rest and scoped per tenant |
| FR-20 | All messaging operations must be scoped to the authenticated tenant's residents and data |
| FR-21 | Empty state when no WhatsApp API is configured must prompt the user to go to Pengaturan tab |

---

## 5. Backend Requirements

### API Endpoints

#### Get Conversations (Pesan)
```
GET /api/whatsapp/conversations
Authorization: Bearer <token>

Response 200:
{
  "conversations": [
    {
      "residentId": "uuid",
      "residentName": "Budi Santoso",
      "roomCode": "Kamar A1",
      "phone": "081234567890",
      "isOverdue": false,
      "lastMessage": "Terima kasih Pak Budi, pembayaran sudah kami terima ✅",
      "lastMessageAt": "2026-03-12T13:45:00Z",
      "isOnline": true
    }
  ]
}
```

#### Get Messages for a Resident
```
GET /api/whatsapp/conversations/:residentId/messages
Authorization: Bearer <token>

Response 200:
{
  "messages": [
    {
      "id": "uuid",
      "direction": "outbound",
      "body": "Selamat pagi Pak Budi, ini pengingat tagihan kost bulan ini ya 🔔",
      "sentAt": "2026-03-12T09:00:00Z",
      "status": "read"
    },
    {
      "id": "uuid",
      "direction": "inbound",
      "body": "Pagi bu, saya transfer nanti siang ya",
      "sentAt": "2026-03-12T09:15:00Z",
      "status": null
    }
  ]
}
```

#### Send Direct Message
```
POST /api/whatsapp/send
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "residentId": "uuid",
  "message": "Baik Pak, ditunggu ya. Terima kasih 🙏"
}

Response 201:
{
  "messageId": "uuid",
  "status": "sent",
  "sentAt": "2026-03-12T09:16:00Z"
}
```

#### Send Broadcast
```
POST /api/whatsapp/broadcast
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "residentIds": ["uuid1", "uuid2"],
  "templateId": "uuid",
  "message": "Kepada penghuni kost, mohon harap segera melunasi tagihan bulan ini."
}

Response 200:
{
  "total": 2,
  "queued": 2,
  "failed": 0,
  "batchId": "uuid"
}
```

#### Get All Templates
```
GET /api/whatsapp/templates
Authorization: Bearer <token>

Response 200:
{
  "templates": [
    {
      "id": "uuid",
      "name": "Pengingat Tagihan H-7",
      "category": "tagihan",
      "body": "Halo *{{nama}}* 👋\n\nIni pengingat bahwa tagihan kost Anda akan jatuh tempo dalam *{{jatuh_tempo}}* hari...",
      "icon": "📅",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### Create / Update Template
```
POST /api/whatsapp/templates
PATCH /api/whatsapp/templates/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Pengingat Tagihan H-7",
  "category": "tagihan",
  "body": "Halo *{{nama}}* 👋...",
  "icon": "📅"
}

Response 201 / 200:
{
  "id": "uuid",
  "name": "Pengingat Tagihan H-7",
  "category": "tagihan",
  "body": "...",
  "createdAt": "2026-03-12T09:00:00Z",
  "updatedAt": "2026-03-12T09:00:00Z"
}
```

#### Get / Save Automation Settings
```
GET  /api/whatsapp/automation
PATCH /api/whatsapp/automation
Authorization: Bearer <token>

Request Body (PATCH):
{
  "sendTime": "09:00",
  "schedules": {
    "H-7":  { "enabled": true,  "templateId": "uuid" },
    "H-3":  { "enabled": true,  "templateId": "uuid" },
    "H-1":  { "enabled": false, "templateId": "uuid" },
    "H+1":  { "enabled": true,  "templateId": "uuid" },
    "H+3":  { "enabled": false, "templateId": "uuid" },
    "H+7":  { "enabled": false, "templateId": "uuid" }
  }
}

Response 200:
{
  "success": true,
  "updatedAt": "2026-03-12T08:00:00Z"
}
```

#### Get Automation Stats (Today)
```
GET /api/whatsapp/automation/stats/today
Authorization: Bearer <token>

Response 200:
{
  "sent": 12,
  "scheduled": 5,
  "failed": 0,
  "date": "2026-03-12"
}
```

#### Save / Get API Settings
```
GET  /api/whatsapp/settings
PATCH /api/whatsapp/settings
Authorization: Bearer <token>

Request Body (PATCH):
{
  "provider": "fonnte",
  "apiToken": "xxxxxxxxxxxxxxxxxxxx",
  "senderNumber": "081234567890"
}

Response 200:
{
  "provider": "fonnte",
  "senderNumber": "081234567890",
  "isConnected": true,
  "updatedAt": "2026-03-12T09:00:00Z"
}
```

#### Test API Connection
```
POST /api/whatsapp/settings/test
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "provider": "fonnte",
  "apiToken": "xxxxxxxxxxxxxxxxxxxx",
  "senderNumber": "081234567890"
}

Response 200:
{
  "connected": true,
  "deviceName": "Redmi Note 12",
  "message": "Koneksi berhasil"
}

Response 400:
{
  "connected": false,
  "message": "Token tidak valid atau device tidak terhubung"
}
```

### Business Logic
- **Variable substitution**: Before sending, replace `{{nama}}` → resident name, `{{kamar}}` → room code, `{{jumlah}}` → billing amount, `{{jatuh_tempo}}` → due date, `{{hari_tunggak}}` → overdue days.
- **Automated scheduler**: A daily cron job runs at the configured `sendTime`, queries residents whose `dueDate` matches the schedule offset (H-7, H-3, etc.), and sends via the configured provider API.
- **Overdue detection**: A resident is "Menunggak" when their latest unpaid invoice's `dueDate < today`.
- **Broadcast queue**: Large broadcasts are queued and sent asynchronously with rate-limiting to comply with provider throttle limits; progress is tracked via `batchId`.
- **Credential security**: API tokens are encrypted at rest using AES-256 before storage; never returned in plain text in GET responses after initial save.
- **Tenant scoping**: All queries and outbound messages are filtered/scoped by `tenant_id`.
- **Provider abstraction**: A provider adapter layer normalizes Fonnte and Wablas API differences so the rest of the system uses a single `WhatsAppService.send()` interface.

---

## 6. Data Model

### `whatsapp_settings` Table
```sql
CREATE TABLE whatsapp_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  provider        VARCHAR(50) NOT NULL DEFAULT 'fonnte',  -- 'fonnte' | 'wablas'
  api_token_enc   TEXT NOT NULL,                           -- AES-256 encrypted
  sender_number   VARCHAR(20) NOT NULL,
  is_connected    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `whatsapp_templates` Table
```sql
CREATE TABLE whatsapp_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(50) NOT NULL,   -- 'tagihan' | 'konfirmasi' | 'info' | 'broadcast'
  body        TEXT NOT NULL,
  icon        VARCHAR(10),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wa_templates_tenant ON whatsapp_templates(tenant_id);
```

### `whatsapp_automation` Table
```sql
CREATE TABLE whatsapp_automation (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  send_time    TIME NOT NULL DEFAULT '09:00:00',
  schedules    JSONB NOT NULL DEFAULT '{}',  -- { "H-7": { "enabled": true, "templateId": "uuid" }, ... }
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### `whatsapp_messages` Table
```sql
CREATE TABLE whatsapp_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  resident_id   UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
  direction     VARCHAR(10) NOT NULL,   -- 'outbound' | 'inbound'
  body          TEXT NOT NULL,
  status        VARCHAR(20),            -- 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
  batch_id      UUID,                   -- set for broadcast messages
  template_id   UUID REFERENCES whatsapp_templates(id) ON DELETE SET NULL,
  sent_at       TIMESTAMP,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wa_messages_tenant     ON whatsapp_messages(tenant_id);
CREATE INDEX idx_wa_messages_resident   ON whatsapp_messages(resident_id);
CREATE INDEX idx_wa_messages_sent_at    ON whatsapp_messages(sent_at);
```

> **Note**: The `whatsapp_messages` table stores a local record of each message for conversation history display. Actual delivery is handled by the external WhatsApp gateway provider (Fonnte/Wablas). Inbound messages are synced via webhook callbacks from the provider.
