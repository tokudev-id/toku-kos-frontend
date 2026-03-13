# TokuKos Frontend

Frontend aplikasi **TokuKos Management** menggunakan React + TypeScript + Vite.

Mencakup 2 area utama:
- **Owner Dashboard** untuk operasional kos
- **Resident Portal** untuk self-service penghuni

## Fitur Utama

### Owner Dashboard
- overview KPI dan ringkasan operasional
- properti & detail kamar
- data penghuni
- tagihan (`Tagihan`) dan verifikasi pembayaran (`Pembayaran`)
- pengeluaran (`Pengeluaran`)
- inventaris (`Inventaris`)
- laporan (`Laporan`)
- keluhan/perawatan (`Maintenance`)
- pengaturan (`Pengaturan`)
- billing SaaS (`Billing`)
- blast WhatsApp (`WhatsApp`)

### Resident Portal
- dashboard penghuni
- riwayat invoice pribadi
- pengajuan keluhan
- profil penghuni

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7
- Axios
- Zustand
- Recharts

## Prasyarat

- Node.js 20+
- npm 10+
- backend TokuKos aktif di local

## Setup Lokal

### 1) Install dependency

```bash
npm install
```

### 2) Konfigurasi environment

File `.env` sudah tersedia. Pastikan minimal variabel ini benar:

```env
VITE_API_URL=http://localhost:3000/v1
```

Jika tidak diisi, aplikasi fallback ke `http://localhost:3000/v1`.

### 3) Jalankan development server

```bash
npm run dev
```

Default URL:

- `http://localhost:5173`

## Build & Preview

```bash
npm run build
npm run preview
```

## Route Utama

### Auth
- `/login` (owner)
- `/register` (owner)
- `/resident/login` (resident)

### Owner
- `/`
- `/properties`
- `/properties/:id`
- `/residents`
- `/finance`
- `/tagihan`
- `/pembayaran`
- `/pengeluaran`
- `/inventaris`
- `/laporan`
- `/maintenance`
- `/pengaturan`
- `/billing`
- `/whatsapp`

### Resident
- `/resident`
- `/resident/invoices`
- `/resident/maintenance`
- `/resident/profile`

## Integrasi API

- Axios base URL: `VITE_API_URL`
- JWT token disimpan di `localStorage` key `toku_token`
- interceptor akan auto-attach header `Authorization: Bearer <token>`
- respon `401` akan trigger auto-logout ke halaman login

## Struktur Folder (Ringkas)

- `src/pages` — seluruh halaman owner + resident
- `src/components` — komponen reusable (termasuk modal)
- `src/api` — service API per domain
- `src/layouts` — layout owner/resident
- `src/store` — state global auth
- `src/utils` — utilitas helper

## Catatan

Untuk pengalaman lengkap, jalankan backend dan frontend bersamaan di local.