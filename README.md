# HIMATIF Project Management Frontend

Ini adalah frontend untuk aplikasi HIMATIF Project Management, dibangun dengan Svelte dan TailwindCSS. Ini menyediakan antarmuka pengguna yang intuitif untuk sistem manajemen proyek berbasis web yang mirip dengan Trello.

## 🚀 Fitur-fitur

- Sistem autentikasi: Login, Registrasi, dan Logout
- Dashboard untuk manajemen proyek
- Sistem manajemen proyek yang mirip Trello dengan daftar dan kartu
- Sistem otorisasi berbasis peran (Admin, Manager, Member)
- Upload file untuk lampiran proyek
- Antarmuka yang responsif dan modern

## 🛠️ Teknologi yang Digunakan

- **Svelte** sebagai framework JavaScript
- **TailwindCSS** untuk styling
- **Vite** sebagai build tool
- **Axios** untuk permintaan HTTP
- **Svelte-routing** untuk manajemen rute

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki perangkat lunak berikut terinstal di sistem Anda:

- [Node.js](https://nodejs.org/en/) (versi 14 atau lebih tinggi)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/) untuk manajemen paket
- [Git](https://git-scm.com/)

Pastikan juga backend berjalan di `http://localhost:5000` (atau sesuaikan dengan konfigurasi backend Anda).

## 📦 Instalasi

1. **Clone repositori** (jika belum):

   ```bash
   git clone <repository-url>
   cd hpm-frontend
   ```

2. **Instal dependensi**:

   ```bash
   npm install
   ```

3. **Siapkan konfigurasi lingkungan**:

   Buat file `.env` di direktori root proyek dengan konfigurasi berikut:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_API_TIMEOUT=10000
   ```

   Sesuaikan `VITE_API_BASE_URL` dengan URL tempat backend berjalan (termasuk `/api` di akhir).

## ⚙️ Konfigurasi

Aplikasi ini terhubung ke backend melalui API. Pastikan backend sudah berjalan sebelum menjalankan frontend.

## ▶️ Menjalankan Aplikasi

### Mode Pengembangan (Development)

Untuk menjalankan aplikasi dalam mode pengembangan dengan hot-reload:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` (atau port lain jika 3000 sedang digunakan) dan akan otomatis membuka browser.

### Mode Produksi (Build)

Untuk membuat build produksi:

```bash
npm run build
```

Kemudian untuk meninjau build tersebut secara lokal:

```bash
npm run preview
```

## 📁 Struktur Proyek

```
hpm-frontend/
├── index.html              # File HTML utama
├── package.json            # Konfigurasi dependensi dan skrip
├── vite.config.js          # Konfigurasi Vite
├── postcss.config.js       # Konfigurasi PostCSS
├── tailwind.config.js      # Konfigurasi TailwindCSS
├── src/
│   ├── main.js            # Entry point aplikasi
│   ├── App.svelte         # Komponen utama aplikasi
│   ├── app.css            # File CSS utama (menggunakan Tailwind)
│   ├── api/               # Layanan API dan konfigurasi
│   │   ├── axios.js       # Konfigurasi Axios
│   │   ├── apiService.js  # Layanan API generik
│   │   ├── authService.js # Layanan autentikasi
│   │   ├── projectService.js # Layanan manajemen proyek
│   │   └── listService.js # Layanan manajemen list
│   ├── components/        # Komponen Svelte yang dapat digunakan kembali
│   │   ├── Navbar.svelte  # Komponen navigasi
│   │   └── Footer.svelte  # Komponen footer
│   └── pages/             # Komponen halaman
│       ├── Home.svelte    # Halaman beranda
│       ├── Login.svelte   # Halaman login
│       ├── Register.svelte # Halaman registrasi
│       ├── Dashboard.svelte # Halaman dashboard
│       ├── Projects.svelte # Halaman daftar proyek
│       ├── ProjectDetail.svelte # Halaman detail proyek
│       └── Users.svelte   # Halaman manajemen pengguna (admin/manager)
└── public/                # File statis
    └── vite.svg           # Ikon Vite
```

## 🔗 Ketergantungan

Aplikasi ini bergantung pada beberapa paket utama:

- `svelte` - Framework komponen JavaScript
- `svelte-routing` - Sistem routing untuk aplikasi Svelte
- `axios` - HTTP client untuk permintaan API
- `tailwindcss` - Framework CSS utility-first
- `vite` - Build tool cepat untuk aplikasi web modern

## 🧪 Menjalankan Uji Coba

Untuk memeriksa kode Svelte secara statis untuk kesalahan:

```bash
npx svelte-check
```

## 🤝 Berkontribusi

1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur/FiturHebat`)
3. Lakukan perubahan yang diperlukan
4. Commit perubahan Anda (`git commit -m 'Tambahkan Fitur Hebat'`)
5. Push ke branch (`git push origin fitur/FiturHebat`)
6. Buka pull request

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

## 👥 Penyusun

- Tim HIMATIF Project Management

## 🐛 Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repositori.