# Dahar Lurr

Aplikasi web untuk mereview warung dan kantin. Pengguna bisa melihat daftar warung, membaca menu, menulis ulasan, dan menyukai ulasan orang lain. Pemilik warung mengelola warung dan menunya sendiri. Admin memoderasi laporan ulasan dan memantau log aktivitas.

By oleh Muhammad Ghazy Hikmatiar.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router 7, Tailwind CSS 4, Lucide React |
| Backend | Node.js, Express 5, TypeScript (dijalankan dengan `tsx`) |
| Database | Microsoft SQL Server (driver `mssql`) |
| Validasi | Zod |
| Autentikasi | JWT di cookie HttpOnly, hash password dengan bcryptjs |
| Dokumentasi API | OpenAPI dengan Swagger UI |
| Kualitas kode | ESLint dan TypeScript strict mode |

## Fitur dan Role

| Role | Hak akses |
| --- | --- |
| `customer` | Melihat warung dan menu, menulis, mengubah, dan menghapus review sendiri, menyukai review, melaporkan review |
| `owner` | Mengelola warung dan menu miliknya, melihat review warungnya |
| `admin` | Mengelola pengguna dan role, membuat akun owner, memoderasi laporan review, melihat audit log |

Akun yang mendaftar lewat halaman Register otomatis menjadi `customer`.

## Struktur Folder

```
hands-on-2/
├── backend/
│   ├── src/
│   │   ├── config/        # pembacaan environment variable
│   │   ├── controllers/   # penghubung request dan service
│   │   ├── services/      # logika bisnis
│   │   ├── repositories/  # query SQL Server
│   │   ├── routes/        # definisi endpoint
│   │   ├── middlewares/   # auth, authorize, validate, cors, error handler
│   │   ├── schemas/       # skema validasi Zod
│   │   ├── dtos/          # bentuk data keluaran
│   │   ├── errors/        # class error kustom
│   │   ├── db/            # koneksi dan transaksi
│   │   ├── docs/          # dokumen OpenAPI
│   │   └── index.ts       # titik masuk server
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/    # komponen UI dan ProtectedRoute
    │   ├── context/       # AuthContext
    │   ├── lib/           # klien HTTP, daftar endpoint, helper
    │   ├── pages/         # halaman aplikasi
    │   └── types/         # tipe data API
    └── .env.example
```

## Prasyarat

Pastikan perangkat sudah memiliki:

- Node.js 22 LTS atau lebih baru, beserta npm
- Microsoft SQL Server (lokal atau lewat Docker) yang bisa diakses lewat TCP di port 1433
- Git

## Instalasi

1. Clone repositori dan masuk ke foldernya.

   ```bash
   git clone https://github.com/hixmatiar/Tugas-Praktikum-RSI.git
   cd hands-on-2
   ```

2. Install dependensi backend.

   ```bash
   cd backend
   npm install
   ```

3. Install dependensi frontend di terminal lain atau setelah kembali ke folder utama.

   ```bash
   cd ../frontend
   npm install
   ```

## Konfigurasi Environment

Aplikasi memakai dua file `.env` terpisah, satu di `backend/` dan satu di `frontend/`. File `.env` di folder utama tidak dibaca oleh aplikasi.

### Backend

Salin contoh konfigurasinya.

```bash
cd backend
cp .env.example .env
```

Lalu sesuaikan isinya.

| Variabel | Wajib | Default | Keterangan |
| --- | --- | --- | --- |
| `NODE_ENV` | Tidak | `development` | Isi `production` agar cookie memakai flag `secure` |
| `PORT` | Tidak | `3000` | Port server API |
| `CORS_ORIGIN` | Tidak | `http://localhost:5173` | Alamat frontend yang diizinkan mengakses API |
| `AUTH_COOKIE_NAME` | Tidak | `kantin_session` | Nama cookie sesi |
| `DB_SERVER` | Tidak | `localhost` | Alamat SQL Server |
| `DB_PORT` | Tidak | `1433` | Port SQL Server |
| `DB_USER` | Ya | - | Username database |
| `DB_PASSWORD` | Ya | - | Password database |
| `DB_NAME` | Ya | - | Nama database, contohnya `review_kantin` |
| `DB_ENCRYPT` | Tidak | `false` | Isi `true` bila koneksi wajib terenkripsi |
| `DB_TRUST_SERVER_CERTIFICATE` | Tidak | `false` | Isi `true` untuk SQL Server lokal |
| `JWT_SECRET` | Ya | - | String acak, minimal 32 karakter |
| `JWT_EXPIRES_IN` | Tidak | `2h` | Masa berlaku sesi login |
| `BCRYPT_SALT_ROUNDS` | Tidak | `10` | Tingkat kerumitan hash password |

Server akan berhenti dengan pesan error bila `JWT_SECRET`, `DB_USER`, `DB_PASSWORD`, atau `DB_NAME` kosong.

Contoh membuat `JWT_SECRET` acak:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

| Variabel | Default | Keterangan |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Alamat dasar API backend |

Bila backend dijalankan di port lain, ubah nilai ini dan `CORS_ORIGIN` di backend agar tetap sinkron.

## Persiapan Database

Backend menggunakan tujuh tabel di skema `dbo`:

`USERS`, `STALLS`, `MENU_ITEMS`, `REVIEWS`, `LIKES`, `FLAGS`, dan `AUDIT_LOGS`.

Skrip pembuatan tabel tidak disertakan di repositori ini. Buat database dan tabelnya terlebih dahulu sesuai kebutuhan praktikum, lalu isi `DB_NAME` di `.env` dengan nama database tersebut.

Setelah backend jalan, cek koneksi database lewat `http://localhost:3000/health`.

### Membuat akun admin pertama

Register hanya menghasilkan akun `customer`. Untuk admin pertama, daftar lewat halaman Register, lalu ubah rolenya langsung di database.

```sql
UPDATE dbo.USERS SET role = 'admin' WHERE email = 'email@kamu.com';
```

Setelah itu admin bisa membuat akun owner dan mengubah role pengguna lain dari Panel Admin.

## Menjalankan Aplikasi

Jalankan backend dan frontend di dua terminal berbeda.

**Terminal 1: backend**

```bash
cd backend
npm run dev
```

Server berjalan di `http://localhost:3000` dan akan memuat ulang otomatis saat kode berubah.

**Terminal 2: frontend**

```bash
cd frontend
npm run dev
```

Buka `http://localhost:5173` di browser.

### Alamat penting

| Alamat | Fungsi |
| --- | --- |
| `http://localhost:5173` | Aplikasi frontend |
| `http://localhost:3000/api` | Dasar semua endpoint API |
| `http://localhost:3000/api-docs` | Dokumentasi Swagger UI |
| `http://localhost:3000/api-docs/openapi.json` | Dokumen OpenAPI mentah |
| `http://localhost:3000/health` | Cek server dan koneksi database |

## Ringkasan Endpoint

Semua endpoint berawalan `/api`. Detail lengkap ada di Swagger UI.

| Kelompok | Endpoint |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Profil | `GET /profile`, `PUT /profile`, `PATCH /profile/password` |
| Pengguna (admin) | `GET /users`, `POST /users/owner`, `PATCH /users/:id/role` |
| Warung | `GET /stalls`, `GET /stalls/:id`, `POST /stalls`, `PUT /stalls/:id`, `DELETE /stalls/:id` |
| Menu | `GET /menu`, `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id` |
| Review | `GET /stalls/:id/reviews`, `POST /stalls/:id/reviews`, `GET /reviews/mine`, `GET /reviews/manage`, `PUT /reviews/:id`, `DELETE /reviews/:id` |
| Like | `POST /reviews/:id/like`, `DELETE /reviews/:id/like` |
| Laporan | `POST /reviews/:id/flags`, `GET /flags`, `PATCH /flags/:id` |
| Audit log (admin) | `GET /audit-logs` |