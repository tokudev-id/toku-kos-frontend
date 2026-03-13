# Product Requirements Document (PRD): TokuKosManagement (SaaS SaaS B2B Model)

## 1. Executive Summary
**TokuKosManagement** adalah platform SaaS (*Software as a Service*) Property Management System yang dirancang untuk memberdayakan pemilik properti dan kos-kosan (*Owners*). Aplikasi ini memberikan solusi *end-to-end* mulai dari pencatatan ketersediaan kamar, pendataan penyewa (*Residents*), otomatisasi penagihan dan pembayaran (Invoicing & Payment Gateway), hingga manajemen komplain. Sebagai platform SaaS B2B, TokuKosManagement akan memonetisasi layanannya melalui skema berlangganan (*Subscription*) bulanan/tahunan kepada para pemilik kos.

---

## 2. Fitur Inti (Core Features) - B2B & B2C

| Modul Utama | Deskripsi Fitur |
| :--- | :--- |
| **SaaS Billing & Subscriptions** | Modul platform untuk menagih biaya langganan aplikasi kepada para Pemilik Kos secara otomatis (Tiers: Basic, Pro, Enterprise). |
| **Dashboard Owner** | Ringkasan operasional bagi Pemilik: total kamar, *occupancy rate*, arus kas realtime, dan pengingat jatuh tempo tagihan penghuni. |
| **Multi-Properti & Kamar** | Manajemen aset multi-cabang kos dengan kontrol detail per kamar (tipe, fasilitas, harga, status ketersediaan). |
| **Manajemen Resident** | Database profil penyewa (*Resident*), melacak histori kontrak (*Rent Contracts*), dan keamanan data identitas (KTP). |
| **Keuangan Terpusat** | - **Invoice Bulanan Otomatis** ke penghuni.<br>- **Pencatatan Pembayaran:** Penghuni *upload* bukti transfer, Admin verifikasi lunas dengan 1-klik.<br>- **Expenses Tracker:** Pencatatan biaya perbaikan/operasional. |
| **Integrasi Komunikasi** | Notifikasi via WhatsApp API (mengirim invoice pdf, pengingat jatuh tempo H-3, notifikasi bukti transfer ke Owner). |

---

## 3. Analisa Gap (Kekurangan Kompetitor)
Kompetitor saat ini (seperti Living Kost Pro) sebagian besar:
1.  **Fokus Hanya pada Admin (Tidak punya aplikasi mandiri untuk Penghuni)**: Penghuni tidak bisa mengecek tagihannya kapanpun.
2.  **Sistem Komplain Manual**: Laporan AC rusak masih via chat WA pribadi pengelola, tidak ter-rekap dengan baik sehingga SLA (Service Level Agreement) perbaikan lambat.
3.  **Kaku dalam Penagihan Tambahan**: Sulit mencatat tagihan tak terduga (seperti denda, atau selisih token listrik).

---

## 4. Fitur Unggulan TokuKosManagement (Menutup Gap)

### 🌟 4.1. Resident Portal (Self-Service Dashboard)
*   **Resident Profil:** Penghuni memiliki akses (*login*) untuk melihat kontrak sewa mereka yang masih aktif.
*   **Billing & Upload Bukti:** Penghuni bisa melihat detail Invoice, info Rekening Bank milik *Owner* (Tanpa pihak ketiga), dan mengunggah foto Bukti Transfer. Begitu diunggah, *Owner* akan menerima notifikasi WA untuk verifikasi 1-klik.
*   **Helpdesk / Ticketing System:** Penghuni bisa melaporkan kerusakan fasilitas kamar yang langsung masuk ke daftar tugas (*task list*) sang Owner/Teknisi.

### 🌟 4.2. Smart Meter Expense Calculation
Fitur khusus kost eksklusif; Admin bisa menginput saldo meteran awal & akhir bulan, sistem otomatis mengubahnya menjadi nominal Rp dan menyisipkannya ke `InvoiceItem` bulan berikutnya tanpa hitung manual di Excel.

### 🌟 4.3. Skalabilitas Multi-Tenant (SaaS)
TokuKosManagement mengisolasi data tiap-tiap Pemilik Kos (Multitenancy). Pemilik A tidak akan pernah tercampur data huniannya dengan Pemilik B. Model bisnis ini memungkinkan TokuKosManagement dijual massal tanpa perlu setup server terpisah tiap *client*.

---

## 5. Analisa SWOT (Strengths, Weaknesses, Opportunities, Threats)

### 💪 Strengths (Kekuatan)
1. **Solusi *End-to-End***: Menyediakan dari *Admin Dashboard* hingga *Resident Portal*.
2. **Onboarding Sangat Mudah**: Pemilik Kos tidak perlu mendaftar Payment Gateway berbelit-belit (KYC, legalitas). Mereka cukup memasukkan Nomor Rekening Bank pribadi mereka di pengaturan aplikasi, dan siap menerima pembayaran *tenant*.
3. **Bisnis Model Terukur (SaaS)**: Aliran pendapatan yang jelas (Bulanan/Tahunan) dari langganan aplikasi para Pemilik Kos.

### 📉 Weaknesses (Kelemahan)
1. **Kurva Pembelajaran & Onboarding**: Memindahkan pemilik kos tradisional dari Excel ke ekosistem terpadu kita memerlukan edukasi pelanggan yang intensif di awal.
2. **Ketergantungan Infrastruktur Pihak Ketiga**: WhatsApp API dan Layanan Payment Gateway memiliki ongkos (Ratelimit & MDR) yang harus dikalkulasi ke dalam harga langganan bulanan kita.

### 🎯 Opportunities (Peluang)
1. **Pasar Properti Kost Berkembang**: Banyak milenial/Gen-Z *owner* kos yang melek teknologi dan ingin mengotomatisasi bisnis properti mereka.
2. **Monetisasi Lintas (*Cross-Sell*)**: TokuKosManagement bisa mendapatkan *margin* tambahan dari *convenience fee* setiap pembayaran dari Penghuni, atau menjual Add-ons (misal: CCTV Cloud Storage).

### ⚠️ Threats (Ancaman)
1. **Dominasi Platform OTA (Online Travel Agent)**: Platform raksasa seperti Mamikos yang sudah memiliki ekosistem end-to-end gratis untuk listing namun memotong komisi besar.
2. **Resiko Hukum/Data Privacy**: Jika *Multi-Tenant* tidak diimplementasikan dengan pengamanan (RLS/Encryption) yang kuat, kebocoran satu tenant bisa merusak reputasi seluruh platform.

---

## 6. Arsitektur Teknis (Tech Stack)

*   **Backend**: NestJS (Multi-tenant ready, Modular Architecture).
*   **Database**: PostgreSQL dengan TypeORM (Mendukung integrasi Row-Level Security jika dibutuhkan kelak).
*   **Frontend**: Multi-repo setup dengan React dan Svelte.
*   **Gateway**: API pihak ketiga untuk WA dan Pembayaran.

---

## 7. Rencana Pengembangan (Fase)
Silakan merujuk kepada [implementation_plan.md](file:///C:/Users/ADMIN/.gemini/antigravity/brain/cf7ea88b-66cc-4a56-a651-9a718265a354/implementation_plan.md) untuk deskripsi granular tingkat teknis.

---
## 8. Call to Action / Next Step
Konsep produk (PRD), ERD (Database), dan Rencana Teknis telah selaras dengan model bisnis **SaaS**. Saat ini siap untuk memulai Fase 0: *Boilerplate Setup*.
