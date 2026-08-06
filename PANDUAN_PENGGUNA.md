# 📘 MODUL PANDUAN PENGGUNA & OPERASIONAL ADMIN LENGKAP
## Sistem Informasi & Portal Pelayanan Kelurahan Onto
**Kecamatan Bantaeng, Kabupaten Bantaeng, Sulawesi Selatan**
*Dikembangkan oleh KKN-T 116 Universitas Hasanuddin*

---

## 📌 DAFTAR ISI COMPREHENSIVE
1. [Pendahuluan & Arsitektur Sistem](#1-pendahuluan--arsitektur-sistem)
2. [Panduan Penggunaan Halaman Publik (Masyarakat)](#2-panduan-penggunaan-halaman-publik-masyarakat)
   - [2.1 Halaman Beranda Utama (`/`)](#21-halaman-beranda-utama-)
   - [2.2 Halaman Profil Kelurahan (`/profil`)](#22-halaman-profil-kelurahan-profil)
   - [2.3 Halaman Data Kependudukan (`/kependudukan`)](#23-halaman-data-kependudukan-kependudukan)
   - [2.4 Halaman Layanan Publik & Surat (`/layanan`)](#24-halaman-layanan-publik--surat-layanan)
   - [2.5 Halaman Berita & Pengumuman (`/berita`)](#25-halaman-berita--pengumuman-berita)
   - [2.6 Halaman Kontak & Pengaduan Warga (`/kontak`)](#26-halaman-kontak--pengaduan-warga-kontak)
3. [Panduan Operasional Pengurus (Panel Admin `/admin`)](#3-panduan-operasional-pengurus-panel-admin-admin)
   - [3.1 Cara Mengakses Portal Pengurus (URL Discreet)](#31-cara-mengakses-portal-pengurus-url-discreet)
   - [3.2 Alur Otentikasi Login & Pop-up Error Modal](#32-alur-otentikasi-login--pop-up-error-modal)
   - [3.3 Navigasi Ringkasan Dashboard Admin (`/admin`)](#33-navigasi-ringkasan-dashboard-admin-admin)
   - [3.4 Modul Kelola Profil Kelurahan (`/admin/profil`)](#34-modul-kelola-profil-kelurahan-adminprofil)
   - [3.5 Modul Kelola Pejabat, Pegawai, & RW/RT (`/admin/pegawai`)](#35-modul-kelola-pejabat-pegawai--rwrt-adminpegawai)
   - [3.6 Modul Kelola Layanan Surat (`/admin/layanan`)](#36-modul-kelola-layanan-surat-adminlayanan)
   - [3.7 Modul Kelola Data Kependudukan (`/admin/kependudukan`)](#37-modul-kelola-data-kependudukan-adminkependudukan)
   - [3.8 Modul Kelola Berita & Upload Foto (`/admin/berita`)](#38-modul-kelola-berita--upload-foto-adminberita)
   - [3.9 Modul Kelola Pengaduan, Ekspor CSV & Cetak PDF (`/admin/pengaduan`)](#39-modul-kelola-pengaduan-ekspor-csv--cetak-pdf-adminpengaduan)
   - [3.10 Modul Pengaturan Akun Admin (`/admin/pengaturan`)](#310-modul-pengaturan-akun-admin-adminpengaturan)
4. [Panduan Administrasi Supabase Dashboard](#4-panduan-administrasi-supabase-dashboard)
   - [4.1 Manajemen Pengguna & Auto Confirm User](#41-manajemen-pengguna--auto-confirm-user)
   - [4.2 Pemulihan Akses & Reset Password Pengurus](#42-pemulihan-akses--reset-password-pengurus)
5. [Panduan Troubleshooting & Maintenance Admin (Kendala Teknis Web)](#5-panduan-troubleshooting--maintenance-admin-kendala-teknis-web)
   - [5.1 Lupa Password & Akun Admin Terkunci](#51-lupa-password--akun-admin-terkunci)
   - [5.2 Website Tidak Bisa Diakses / Server Down](#52-website-tidak-bisa-diakses--server-down)
   - [5.3 Foto Gagal Upload di Panel Admin](#53-foto-gagal-upload-di-panel-admin)
   - [5.4 Berita, Layanan, atau Pengaduan Tidak Tampil / Tidak Updating](#54-berita-layanan-atau-pengaduan-tidak-tampil--tidak-updating)
   - [5.5 Penanganan Error Database & Supabase (Database Crash/Paused)](#55-penanganan-error-database--supabase-database-crashpaused)
   - [5.6 Prosedur Hubungi Tim Developer / Pengembang](#56-prosedur-hubungi-tim-developer--pengembang)
6. [Tanya Jawab Umum & FAQ](#6-tanya-jawab-umum--faq)

---

## 1. PENDAHULUAN & ARSITEKTUR SISTEM

Sistem Informasi Kelurahan Onto dibangun menggunakan arsitektur modern Next.js App Router dan Supabase Cloud Database. Platform ini memisahkan antara **Halaman Publik** yang dapat diakses bebas oleh seluruh warga dan **Panel Admin** yang terproteksi otentikasi ketat.

---

## 2. PANDUAN PENGGUNAAN HALAMAN PUBLIK (MASYARAKAT)

### 2.1 Halaman Beranda Utama (`/`)
* **Banner Hero**: Menampilkan ucapan selamat datang dengan latar belakang gedung Kantor Kelurahan Onto.
* **Sambutan Lurah**: Pesan resmi dari Lurah Onto mengenai komitmen pelayanan.
* **Widget Ringkasan Fitur**: Akses cepat ke Layanan Surat, Data Kependudukan, dan Pengaduan Warga.
* **Statistik Ringkas Warga**: Jumlah penduduk, laki-laki, perempuan, dan Kepala Keluarga (KK).
* **Pratinjau Berita Terbaru & Layanan Utama**: 3 Berita dan 3 Layanan teratas.
* **Peta Embed Google Maps**: Menampilkan titik lokasi presisi Kantor Kelurahan Onto.

### 2.2 Halaman Profil Kelurahan (`/profil`)
* **Sejarah & Tahun Berdiri**: Catatan sejarah berdirinya Kelurahan Onto.
* **Visi & Misi**: Pokok visi dan poin misi pemerintah kelurahan.
* **Geografis & Batas Wilayah**: Luas wilayah, topografi, serta batas wilayah (Utara, Selatan, Timur, Barat).
* **Kartu Aparat Utama**: Foto, Nama, NIP, dan Jabatan Lurah, Sekretaris Kelurahan, Babinsa, serta Bhabinkamtibmas.
* **Struktur Staf PNS & PPPK**: Daftar staf pendukung per seksi.
* **Daftar Pengurus RW & RT**: Tabel alamat dan nama ketua RW/RT se-Kelurahan Onto.

### 2.3 Halaman Data Kependudukan (`/kependudukan`)
* **Kartu Indikator Utama**: Total Jiwa, Laki-laki, Perempuan, dan Kepala Keluarga.
* **Grafik Demografi Interaktif**: Visualisasi statistik berdasarkan:
  - Kelompok Umur (Anak, Remaja, Dewasa, Lansia)
  - Agama & Kepercayaan
  - Tingkat Pendidikan Terakhir
  - Mata Pencaharian / Pekerjaan Utama Warga
* **Tabel Sebaran Warga per RW**: Rincian jumlah jiwa dan KK per wilayah RW.

### 2.4 Halaman Layanan Publik & Surat (`/layanan`)
* **Bar Pencarian Instan**: Ketik nama surat (misal: *SKTM*, *Usaha*, *Nikah*) untuk mencari berkas secara instan.
* **Accordion Layanan Surat**: Klik nama surat untuk melihat:
  - **Syarat Berkas** (KTP, KK, Pengantar RT/RW, dll.)
  - **Biaya Pengurusan** (Seluruh layanan Rp 0 / Gratis)
  - **Estimasi Waktu** & **Alur Prosedur**
* **Jam Pelayanan Resmi Kantor**:
  - **Senin – Kamis**: 07:30 – 14:00 WITA
  - **Jumat**: 07:30 – 11:30 WITA
  - **Sabtu, Minggu & Hari Libur**: Libur
* **Kontak Petugas Pelayanan**: Nomor telepon/WA petugas pelayanan yang dapat dihubungi.

### 2.5 Halaman Berita & Pengumuman (`/berita`)
* **Filter Kategori**: Filter berdasarkan *Pengumuman*, *Kegiatan Warga*, *Pembangunan*, dll.
* **Pencarian Berita**: Kolom cari judul atau kata kunci berita.
* **Detail Berita (`/berita/[slug]`)**: Membaca artikel lengkap beserta foto utama dan tanggal rilis.

### 2.6 Halaman Kontak & Pengaduan Warga (`/kontak`)
* **Formulir Pengaduan Online**: Isi Nama, No HP/WA, Wilayah RW, Kategori, Judul, dan Detail Aduan.
* **Kontak Pembina Wilayah**: Klik nomor Babinsa atau Bhabinkamtibmas untuk panggilan telepon langsung.
* **Informasi Kontak Resmi**: Alamat jalan, email resmi, instagram resmi, dan Peta Google Maps.

---

## 3. PANDUAN OPERASIONAL PENGURUS (PANEL ADMIN `/admin`)

### 3.1 Cara Mengakses Portal Pengurus (URL Discreet)
1. Buka browser dan ketik URL rahasia: `https://domain-kelurahan.com/admin` atau `https://domain-kelurahan.com/admin/login`
2. Halaman **Portal Pengurus** menampilkan latar belakang foto Kantor Kelurahan Onto dengan gradasi transparan merah maroon.

### 3.2 Alur Otentikasi Login & Pop-up Error Modal
1. Masukkan **Email** dan **Kata Sandi** terdaftar, lalu klik **"Masuk Panel Pengurus"**.
2. **Pop-up Error Modal**: Jika otentikasi gagal, modal interaktif akan muncul menjelaskan penyebab spesifik (*Email Belum Dikonfirmasi*, *Kredensial Salah*, *Akun Dinonaktifkan*) beserta petunjuk solusinya.

### 3.3 Navigasi Ringkasan Dashboard Admin (`/admin`)
* **Kartu Ringkasan Real-time**: Menampilkan total berita, layanan, pengaduan warga, total pegawai, RW/RT, dan demografi.
* **Pintasan Aksi Cepat**: Tombol *Kelola Berita*, *Kelola Layanan*, *Kelola Pegawai*, *Kelola Pengaduan*, *Pengaturan Akun*, dll.
* **Tabel Pengaduan Terbaru**: Menampilkan aduan terbaru yang membutuhkan penanganan.

### 3.4 Modul Kelola Profil Kelurahan (`/admin/profil`)
* Mengubah Visi, Misi, Sejarah, Tahun Berdiri, Sambutan Lurah, Luas Wilayah, Topografi, serta Batas Wilayah (Utara, Selatan, Timur, Barat).

### 3.5 Modul Kelola Pejabat, Pegawai, & RW/RT (`/admin/pegawai`)
* **Pejabat Utama**: Ubah Nama, NIP, dan Foto Lurah, Seklur, Babinsa, & Bhabinkamtibmas.
* **Staf PNS & PPPK**: Tambah, Edit, atau Hapus staf pendukung per seksi.
* **Pengurus RW & RT**: Kelola data Ketua RW dan RT se-Kelurahan Onto.

### 3.6 Modul Kelola Layanan Surat (`/admin/layanan`)
* **Tambah Layanan (`/admin/layanan/baru`)**: Buat jenis surat baru dengan memasukkan syarat berkas, estimasi waktu, biaya, dan alur.
* **Edit & Hapus Layanan**: Perbarui persyaratan atau hapus layanan yang tidak berlaku lagi.

### 3.7 Modul Kelola Data Kependudukan (`/admin/kependudukan`)
* **Data RT / RW (Total Jiwa, KK, Gender)**: Memperbarui jumlah KK, Laki-Laki, dan Perempuan per RT/RW. Angka Total Jiwa, Total KK, Laki-Laki, dan Perempuan di halaman utama & kependudukan akan otomatis terkalkulasi.
* **Grafik Demografi**: Memperbarui angka statistik kelompok umur, tingkat pendidikan, dan pekerjaan warga.

### 3.8 Modul Kelola Berita & Upload Foto (`/admin/berita`)
* **Tambah Berita (`/admin/berita/baru`)**: Upload foto utama (otomatis dikompresi), isi konten, tentukan kategori, dan atur status (*Publish* / *Draft*).
* **Edit & Hapus Berita**: Kelola berita yang sudah terbit.

### 3.9 Modul Kelola Pengaduan, Ekspor CSV & Cetak PDF (`/admin/pengaduan`)
* **Ubah Status Aduan**: Ubah status menjadi `Belum Diproses`, `Diproses`, atau `Selesai`.
* **📥 Ekspor Data (CSV)**: Unduh seluruh data pengaduan warga ke file `.csv` untuk diaudit di Excel.
* **🖨️ Cetak Laporan (PDF/Print)**: Cetak rekapitulasi pengaduan fisik untuk laporan resmi.

### 3.10 Modul Pengaturan Akun Admin (`/admin/pengaturan`)
Fitur ini memungkinkan pengurus kelurahan untuk memperbarui **Email Login** dan **Kata Sandi** secara mandiri tanpa harus mengakses Supabase Dashboard secara langsung.

* **Cara Mengubah Kata Sandi (Password)**:
  1. Masuk ke menu **"Pengaturan Akun"** (`⚙️`) pada sidebar navigasi admin.
  2. Pada kartu **Ubah Kata Sandi**:
     - Masukkan **Kata Sandi Baru** (minimal 6 karakter).
     - Masukkan **Konfirmasi Kata Sandi Baru** (harus sama persis).
  3. Klik **"Simpan Kata Sandi Baru"**.
  4. Muncul notifikasi hijau `✅ Kata sandi Anda berhasil diperbarui!`. Gunakan kata sandi baru ini untuk login berikutnya.

* **Cara Mengubah Alamat Email Login**:
  1. Masuk ke menu **"Pengaturan Akun"** (`⚙️`).
  2. Pada kartu **Ubah Alamat Email**:
     - Lihat email aktif Anda saat ini.
     - Masukkan **Alamat Email Baru** yang valid (misal: `pengurus.baru@email.com`).
  3. Klik **"Simpan Email Baru"**.
  4. Muncul notifikasi hijau `✅ Alamat email berhasil diperbarui!`.

---

## 4. PANDUAN ADMINISTRASI SUPABASE DASHBOARD

### 4.1 Manajemen Pengguna & Auto Confirm User
1. Buka [Supabase Dashboard](https://supabase.com/dashboard) -> **Authentication** -> **Users**.
2. Klik **"Add User"** -> **"Create User"**.
3. Masukkan Email & Password, pastikan centang **"Auto Confirm User?"** dalam keadaan aktif.

### 4.2 Pemulihan Akses & Reset Password Pengurus
* Jika pengguna belum terkonfirmasi, klik tombol **`...`** di baris user -> pilih **"Confirm User"**.
* Untuk mereset kata sandi, klik tombol **`...`** -> pilih **"Send Password Reset"** atau ubah kata sandi secara manual.

---

## 5. PANDUAN TROUBLESHOOTING & MAINTENANCE ADMIN (KENDALA TEKNIS WEB)

Bab ini memuat panduan komprehensif penanganan masalah (*troubleshooting*) operasional yang wajib dipahami oleh Admin Portal Kelurahan Onto jika terjadi kendala teknis.

---

### 5.1 Lupa Password & Akun Admin Terkunci

* **Gejala**: Admin gagal masuk ke `/admin/login`, muncul notifikasi `Invalid login credentials` atau `Email not confirmed`.
* **Penyebab**: 
  1. Salah memasukkan kata sandi lebih dari 5 kali.
  2. Lupa kombinasi kata sandi baru.
  3. Akun belum status *Confirmed* di database Supabase.
* **Langkah Penyelesaian & Solusi**:
  1. **Reset Mandiri (via Super Admin / Supabase)**:
     - Minta Super Admin / Pengelola Akses untuk masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
     - Navigasi ke menu **Authentication** -> **Users**.
     - Cari email akun admin yang bermasalah.
     - Klik titik tiga (**`...`**) di ujung kanan baris akun -> Pilih **"Reset Password"** atau **"Update Password"**.
     - Masukkan password sementara yang baru (minimal 6 karakter) lalu berikan ke admin yang bersangkutan.
  2. **Verifikasi Akun Belum Terkonfirmasi**:
     - Jika muncul error *Email not confirmed*, klik titik tiga (**`...`**) pada baris user -> Pilih **"Confirm User"**.
  3. **Rekomendasi Setelah Login**:
     - Setelah berhasil login dengan password sementara, segera buka menu **Pengaturan Akun (`/admin/pengaturan`)** untuk memperbarui kata sandi secara mandiri.

---

### 5.2 Website Tidak Bisa Diakses / Server Down

* **Gejala**: Halaman web menampilkan `502 Bad Gateway`, `504 Gateway Timeout`, `404 Not Found`, atau *Network Error* / loading terus menerus.
* **Penyebab**:
  1. Koneksi internet perangkat admin/pengunjung terputus.
  2. Layanan hosting (Vercel / Netlify) sedang *maintenance* atau mengalami gangguan server (*outage*).
  3. Layanan Supabase Backend/Database tertahan (*paused*) karena masa inaktif.
* **Langkah Penyelesaian & Solusi**:
  1. **Cek Koneksi Internet**: Buka situs umum lain (misal: Google/YouTube) untuk memastikan koneksi internet lokal stabil.
  2. **Hard Refresh Browser**: Tekan tombol `Ctrl + F5` (Windows) atau `Cmd + Shift + R` (Mac) untuk membersihkan *cache* browser temporary.
  3. **Cek Status Hosting & Backend**:
     - Buka Dashboard Vercel / Netlify tempat proyek di-deploy untuk mengecek status build & deployment.
     - Jika muncul pesan error database, lanjut ke langkah **5.5 Penanganan Error Database**.

---

### 5.3 Foto Gagal Upload di Panel Admin

* **Gejala**: Saat menambah/mengedit Berita (`/admin/berita`) atau Foto Pegawai (`/admin/pegawai`), muncul error `Failed to upload image`, `Payload Too Large`, atau foto tidak berubah.
* **Penyebab**:
  1. Ukuran file gambar terlalu besar (melebihi 5 MB).
  2. Format file gambar tidak didukung (misalnya `.heic`, `.bmp`, `.pdf`, atau `.exe`).
  3. *Bucket Storage* pada Supabase belum diatur ke status *Public* atau kebijakan RLS (*Row Level Security*) memblokir akses upload.
* **Langkah Penyelesaian & Solusi**:
  1. **Kompresi File Gambar**: 
     - Pastikan ukuran foto kurang dari 2 MB (gunakan alat gratis seperti [TinyPNG](https://tinypng.com) atau [ILoveIMG](https://iloveimg.com) sebelum di-upload).
  2. **Format File Gambar**:
     - Pastikan file berformat `.jpg`, `.jpeg`, `.png`, atau `.webp`.
  3. **Periksa Kebijakan Supabase Storage (Bagi Pengelola Teknis)**:
     - Buka Supabase Dashboard -> **Storage** -> **Buckets**.
     - Pastikan bucket `berita` dan `pegawai` sudah memiliki status **Public**.
     - Pastikan *Storage Policy* memberikan izin `INSERT` dan `SELECT` untuk authenticated user / public.

---

### 5.4 Berita, Layanan, atau Pengaduan Tidak Tampil / Tidak Updating

* **Gejala**: Data yang baru ditambahkan/diubah di Panel Admin tidak muncul di halaman publik masyarakat.
* **Penyebab**:
  1. Status postingan berita masih diset ke `Draft` bukan `Publish`.
  2. Fitur *Static Site Generation* / Cache di Next.js belum ter-refresh.
* **Langkah Penyelesaian & Solusi**:
  1. **Cek Status Draf Berita**: Buka menu `/admin/berita`, pastikan tombol sakelar status berita berwarna hijau atau bertuliskan **Published**.
  2. **Buka Halaman Publik via Incognito / Private Window**: Untuk memastikan bukan karena cache browser pribadi admin.
  3. **Refresh Cache Server**: Lakukan reload halaman publik. Apabila data pengaduan/layanan tidak tersimpan sama sekali, periksa koneksi Supabase.

---

### 5.5 Penanganan Error Database & Supabase (Database Crash/Paused)

* **Gejala**: Muncul pesan error seperti `Database connection lost`, `Project is paused`, `JWT expired`, `401 Unauthorized`, atau `Error 500 Internal Server Error` saat membuka panel admin.
* **Penyebab**:
  1. **Project Supabase Inaktif (Paused)**: Proyek Supabase tier gratis otomatis mengalami mode *pause* jika tidak ada trafik API selama lebih dari 7 hari berturut-turut.
  2. **API Key Expired / Invalid**: Kunci `NEXT_PUBLIC_SUPABASE_URL` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY` pada file environment (`.env.local`) salah atau telah di-reset.
  3. **Batas Quota Kuota Database Habis**: Penyimpanan database melebihi limit.
* **Langkah Penyelesaian & Solusi**:
  1. **Unpause Proyek Supabase**:
     - Buka [Supabase Dashboard](https://supabase.com/dashboard).
     - Jika proyek bertuliskan **Paused**, klik tombol **"Restore Project"** atau **"Unpause"**.
     - Tunggu sekitar 1–3 menit hingga status database kembali berwarna hijau (*Active*).
  2. **Verifikasi Kredensial Environment Variables**:
     - Masuk ke Supabase Dashboard -> **Project Settings** -> **API**.
     - Salin **Project URL** dan **anon / public key**.
     - Buka pengaturan Environment Variables di Hosting (Vercel/Netlify) atau `.env.local`, lalu perbarui nilai kunci tersebut jika ada perubahan.
  3. **Cek Kebijakan RLS (Row Level Security)**:
     - Jika query data gagal (misal data pengaduan tidak bisa di-submit warga), buka Supabase -> **Table Editor** -> pilih tabel yang bermasalah -> buka menu **Policies** -> Pastikan izin `INSERT` / `SELECT` sudah diaktifkan.

---

### 5.6 Prosedur Hubungi Tim Developer / Pengembang

Jika terjadi kendala teknis tingkat lanjut yang tidak dapat diselesaikan melalui langkah troubleshooting standar di atas, pengurus kelurahan dapat menghubungi tim pengembang teknis dengan prosedur berikut:

1. **Catat Informasi Detail Kendala**:
   - Ambil tangkapan layar (*screenshot*) pesan error yang muncul pada layar.
   - Catat waktu terjadinya error dan menu/halaman tempat error muncul.
2. **Kontak Tim Pengembang (Handover Technical Support)**:
   - **Tim Pengembang**: Tim KKN-T 116 Universitas Hasanuddin (Kelurahan Onto)
   - **WhatsApp Penanggung Jawab Teknis Web**: `+62 821-XXXX-XXXX` / `+62 852-XXXX-XXXX`
   - **Email Dukungan Teknis**: `kkn116.onto@gmail.com` / `dev.kelurahanonto@gmail.com`
   - **Repositori Source Code (GitHub)**: `https://github.com/EkaApriandi/Kelurahan-Onto`
3. **Penanganan Darurat Akses Kredensial**:
   - Seluruh kredensial tingkat tinggi (Akun Supabase Master, Hosting Vercel, Registrar Domain) tersimpan di dokumen **Handover Kredensial Resmi** yang diserahkan secara terpisah kepada Lurah / Sekretaris Kelurahan Onto.

---

## 6. TANYA JAWAB UMUM & FAQ

* **Q: Mengapa tombol login admin tidak ada di halaman utama portal publik?**
  * *Jawab*: Tautan sengaja disembunyikan demi keamanan agar masyarakat umum tidak sembarangan mengakses atau mencoba login. Admin cukup mengetik `/admin` langsung pada bilah alamat URL browser.
* **Q: Apakah pengaduan warga bisa langsung diekspor ke Excel?**
  * *Jawab*: Ya, admin dapat mengklik tombol **Ekspor Data (CSV)** pada menu Kelola Pengaduan di Panel Admin (`/admin/pengaduan`). File `.csv` dapat dibuka secara langsung di Microsoft Excel atau Google Sheets.
* **Q: Bagaimana jika foto lurah atau pejabat kelurahan perlu diganti?**
  * *Jawab*: Buka menu **Kelola Pejabat & Pegawai** (`/admin/pegawai`), klik tombol **Edit** pada pejabat yang bersangkutan, upload foto baru berukuran < 2MB, lalu klik **Simpan**.

---
*Sistem Informasi Kelurahan Onto &copy; 2026 — Dikelola oleh Pemerintah Kelurahan Onto, Kab. Bantaeng*
