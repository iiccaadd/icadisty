# The Wedding of Muhammad Irsyad & Adisty Vana Lestari 💍

Situs Web Undangan Pernikahan Digital Eksklusif terinspirasi dari desain **Sora Royal** (Dark Luxury Theme, Scroll-Snap Layout, Glassmorphism, Pure CSS Animations), terintegrasi dengan **Supabase** (Database Cloud) dan dilengkapi **Admin Dashboard**.

Repository: [https://github.com/iiccaadd/icadisty.git](https://github.com/iiccaadd/icadisty.git)

---

## 🌟 Fitur Utama

### 1. 💌 Tampilan Tamu (Guest View - Sora Royal Aesthetic)
- **Word Mask Reveal Preloader**: Animasi teks pembuka bertingkat mewah (*"The Wedding of Muhammad Irsyad & Adisty Vana Lestari"*).
- **Personalisasi Nama Tamu**: Otomatis menyapa nama tamu undangan dari parameter URL (contoh: `/?to=Bapak+Hendra+%26+Keluarga`).
- **Autoplay Background Music**: Musik instrumen romantis otomatis berputar saat tamu menekan tombol *"Buka Undangan"*, dilengkapi tombol piringan hitam (*vinyl spin*) floating di pojok kanan bawah.
- **Scroll-Snap Section Flow**: Pengalaman scroll mulus per layar (*100vh / 100dvh*), dioptimalkan untuk perangkat mobile dan desktop:
  1. *Hero / Cover* (Couple typography, ghost text effect, date stamp).
  2. *Groom & Bride* (Profil mempelai pria dan wanita).
  3. *Our Love Story* (Timeline perjalanan cinta horizontal scroll).
  4. *Event Details* (Akad Nikah & Resepsi di Masjid H. Muhammad Sidik Islamic Center Muara Tewah + Tombol Google Maps).
  5. *Live Countdown Timer* (Hitung mundur menuju 11 November 2026).
  6. *Moments Gallery* (Koleksi foto prewedding horizontal strip).
  7. *RSVP & Wishes* (Form konfirmasi kehadiran & kolom ucapan doa langsung tersimpan ke Supabase).
  8. *Closing & Amplop Digital* (Kutipan QS. Ar-Rum: 21, nomor rekening BCA & Mandiri dengan tombol salin otomatis).
- **Glassmorphism Floating Menu**: Menu navigasi elegan dengan efek blur ke clear stagger animation.

---

### 2. 👑 Tampilan Admin (Admin Portal)
- **Akses Admin**: URL `/admin` (Login di `/admin/login` dengan PIN `2026` atau sandi `icadisty2026`).
- **Statistik Kehadiran Realtime**:
  - Total tamu terdaftar di buku tamu.
  - Jumlah tamu konfirmasi Hadir (*Yes*), Berhalangan (*No*), dan Ragu-ragu (*Maybe*).
  - Total estimasi porsi/headcount kehadiran.
- **⚡ Generator Link Undangan Cepat (WhatsApp Share)**:
  - Cukup ketik nama tamu (contoh: *"Bapak Irwan & Istri"*).
  - Dapatkan link unik personalisasi seketika.
  - 1-Klik tombol **"Kirim via WhatsApp"** dengan template pesan undangan resmi dan sopan.
- **💌 Manajemen RSVP & Doa (`/admin/rsvp`)**:
  - Tabel interaktif seluruh respon tamu.
  - Filter kategori (*Hadir / Berhalangan / Ragu-ragu*).
  - Pencarian nama tamu.
  - **Ekspor Data ke Excel / CSV** (download berkas `.csv`).
- **👥 Manajemen Buku Tamu (`/admin/guests`)**:
  - Tambah tamu satuan atau import massal (*Bulk Add* dari baris Excel).
  - Salin tautan personal tamu.
  - Tracking status undangan (*Sudah Dibuka / Belum Dibuka*).

---

## 🗄️ Persiapan Supabase Database

Buka Supabase SQL Editor pada project kamu:
👉 **[Supabase SQL Editor](https://supabase.com/dashboard/project/vgbrjmqiigqjuyeowvfo/sql)**

Salin dan jalankan script yang ada di berkas [`supabase/schema.sql`](./supabase/schema.sql) untuk membuat tabel `rsvp` dan `guests` beserta kebijakan keamanannya (*Row Level Security*).

---

## 🚀 Menjalankan Lokal

```bash
# Clone repository
git clone https://github.com/iiccaadd/icadisty.git
cd icadisty

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk tampilan tamu, atau [http://localhost:3000/admin](http://localhost:3000/admin) untuk dashboard admin.

---

## 🌐 Deploy ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new) dan import repository `iiccaadd/icadisty`.
2. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://vgbrjmqiigqjuyeowvfo.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `NEXT_PUBLIC_GROOM_NAME`: `Muhammad Irsyad`
   - `NEXT_PUBLIC_BRIDE_NAME`: `Adisty Vana Lestari`
   - `NEXT_PUBLIC_WEDDING_DATE`: `2026-11-11T09:00:00+07:00`
   - `NEXT_PUBLIC_VENUE_NAME`: `Masjid H. Muhammad Sidik Islamic Center Muara Tewah`
   - `ADMIN_SECRET_PASSWORD`: `icadisty2026`
   - `NEXT_PUBLIC_ADMIN_PIN`: `2026`
3. Klik **Deploy**! ✨
