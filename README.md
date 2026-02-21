# Paratamu Coffee — Full Stack Website

Website kafe modern dengan sistem reservasi online dan dashboard admin untuk mengelola menu, reservasi, dan testimoni pelanggan.

---

## Fitur

### Website Utama (User)
- **Hero Section** — Landing page dengan CTA reservasi
- **About Section** — Cerita dan statistik kafe
- **Facilities Section** — Showcase fasilitas tersedia
- **Menu Section** — Daftar menu dengan filter kategori
- **Gallery Section** — Galeri foto kafe
- **Testimonial Section** — Review pelanggan dengan Swiper carousel
- **Contact & Reservasi** — Form reservasi tanpa login + peta lokasi
- Fully **responsive** — mobile, tablet, desktop

### Admin Dashboard (`/admin`)
- Login aman dengan JWT
- **Kelola Menu** — Tambah, edit, hapus menu + upload foto ke Supabase Storage
- **Kelola Reservasi** — Lihat semua reservasi, ubah status (pending / confirmed / cancelled)
- **Kelola Testimoni** — Tambah dan hapus testimoni
- Dikelompokkan berdasarkan kategori (menu) dan rating (testimoni)
- Responsive di mobile dengan sidebar slide-in

---

## Struktur Folder

```
paratamu/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── FacilitiesSection.tsx
│   │   │   ├── MenuSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── TestimonialSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   └── AdminRoute.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── vite-env.d.ts
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── menu.controller.ts
│   │   │   ├── reservation.controller.ts
│   │   │   └── testimonial.controller.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── db/
│   │   │   └── pool.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── supabase-schema.sql
```

---

## Cara Menjalankan Lokal

### Prasyarat
- Node.js v18+
- Akun Supabase (gratis)

---

### 1. Setup Supabase

**Buat tabel** — Supabase → SQL Editor → jalankan isi file `supabase-schema.sql`

**Buat Storage bucket:**
1. Supabase → Storage → New bucket
2. Nama: `images`, centang **Public bucket** → Create

**Ambil credentials** — Supabase → Settings → API:
- Project URL → untuk `SUPABASE_URL`
- `service_role` key → untuk `SUPABASE_SERVICE_KEY`
- Session Pooler connection string → untuk `DATABASE_URL`

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` (lihat `.env.example`):

```env
DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=isi_bebas_yang_panjang
ADMIN_EMAIL=admin@emailkamu.com
ADMIN_PASSWORD=PasswordAdmin123!
SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

Jalankan:

```bash
npm run dev
```

Backend berjalan di `http://localhost:3001`

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env` di folder `frontend/`:

```env
VITE_API_URL=http://localhost:3001
```

Jalankan:

```bash
npm run dev
```

Website berjalan di `http://localhost:5173`

---

## Akses Admin

| URL | Keterangan |
|-----|-----------|
| `http://localhost:5173` | Website utama |
| `http://localhost:5173/admin` | Login admin |
| `http://localhost:5173/admin/dashboard` | Dashboard admin |

Login menggunakan `ADMIN_EMAIL` dan `ADMIN_PASSWORD` yang diset di `.env` backend.

> Halaman `/admin` tidak ada link-nya di website utama — hanya diakses langsung oleh admin melalui browser.

---

## Troubleshooting

**`ENOTFOUND db.xxx.supabase.co`**
→ Gunakan **Session Pooler** URL di Supabase, bukan Direct connection. Port 6543, bukan 5432.

**Upload foto gagal**
→ Pastikan bucket `images` sudah Public
→ Pastikan `SUPABASE_SERVICE_KEY` menggunakan **service_role** key, bukan anon key

**Login admin gagal**
→ Cek `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env` backend
→ Restart backend setelah edit `.env`

**CORS error**
→ Pastikan `FRONTEND_URL` di `.env` backend sesuai URL frontend yang berjalan

---

© 2026 Rian Cahyo Anggoro. All rights reserved.