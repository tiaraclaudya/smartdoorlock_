# Frontend — Smart Door Lock Dashboard

Dashboard kontrol untuk sistem **Smart Door Lock** (ESP32 + RFID), dibangun dengan **React (Vite)**.
Tema visual: dark blue & broken white.

## Fitur Halaman

| Halaman      | Path          | Keterangan                                                        |
|--------------|---------------|----------------------------------------------------------------------|
| Landing      | `/`           | Halaman info singkat tentang sistem                                  |
| Login        | `/login`      | Masuk sebagai admin                                                   |
| Register     | `/register`   | Daftar akun admin baru                                                |
| Dashboard    | `/dashboard`  | (Login diperlukan) status pintu, buka jarak jauh, kelola kartu RFID, riwayat akses |

## Struktur Folder

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # state login admin (token & user)
│   ├── lib/
│   │   └── api.js              # wrapper fetch ke backend
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx       # panel utama: status pintu, kartu RFID, riwayat
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # semua styling (tema dark blue & broken white)
├── index.html
├── .env.example
└── package.json
```

## 1. Konfigurasi Environment

```bash
cp .env.example .env
```

Isi dengan alamat backend kamu:

```
VITE_API_URL=http://localhost:4000/api
```

## 2. Instalasi & Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`. Pastikan backend sudah jalan lebih dulu (lihat README backend).

## 3. Build untuk Produksi

```bash
npm run build
```

Hasil build ada di folder `dist/`, siap di-deploy ke Vercel, Netlify, atau Cloudflare Pages.

## Catatan Fitur Dashboard

- **Status pintu** — menampilkan status terkunci/terbuka berdasarkan laporan terakhir dari ESP32.
- **Buka Pintu Sekarang** — mengirim perintah ke backend, yang nanti diambil ESP32 lewat polling.
- **Kartu RFID** — tambah kartu baru (UID + nama pemilik), aktifkan/nonaktifkan tanpa harus hapus,
  atau hapus permanen.
- **Riwayat akses** — semua percobaan tap kartu (diterima/ditolak) dan histori buka jarak jauh.

## Catatan Desain

- Palet warna: dark blue (`--color-accent`) untuk aksen/tombol, broken white (`--color-bg`) untuk
  latar belakang — lihat variabel CSS di `src/index.css`.
- Semua teks di aplikasi menggunakan Bahasa Indonesia.
