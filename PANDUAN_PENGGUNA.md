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
4. [Panduan Administrasi Supabase Dashboard](#4-panduan-administrasi-supabase-dashboard)
   - [4.1 Manajemen Pengguna & Auto Confirm User](#41-manajemen-pengguna--auto-confirm-user)
   - [4.2 Pemulihan Akses & Reset Password Pengurus](#42-pemulihan-akses--reset-password-pengurus)
5. [Tanya Jawab & Troubleshooting (FAQ)](#5-tanya-jawab--troubleshooting-faq)

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
* **Pintasan Aksi Cepat**: Tombol *Kelola Berita*, *Kelola Layanan*, *Kelola Pegawai*, *Kelola Pengaduan*, dll.
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
* Memperbarui angka statistik kelompok umur, gender, pendidikan, pekerjaan, agama, dan data per RW.

### 3.8 Modul Kelola Berita & Upload Foto (`/admin/berita`)
* **Tambah Berita (`/admin/berita/baru`)**: Upload foto utama (otomatis dikompresi), isi konten, tentukan kategori, dan atur status (*Publish* / *Draft*).
* **Edit & Hapus Berita**: Kelola berita yang sudah terbit.

### 3.9 Modul Kelola Pengaduan, Ekspor CSV & Cetak PDF (`/admin/pengaduan`)
* **Ubah Status Aduan**: Ubah status menjadi `Belum Diproses`, `Diproses`, atau `Selesai`.
* **📥 Ekspor Data (CSV)**: Unduh seluruh data pengaduan warga ke file `.csv` untuk diaudit di Excel.
* **🖨️ Cetak Laporan (PDF/Print)**: Cetak rekapitulasi pengaduan fisik untuk laporan resmi.

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

## 5. TANYA JAWAB & TROUBLESHOOTING (FAQ)

* **Q: Mengapa tombol login admin tidak ada di halaman utama?**
  * *Jawab*: Tautan sengaja disembunyikan demi keamanan agar masyarakat tidak sembarangan mencoba login. Admin cukup mengetik `/admin` di URL browser.
* **Q: Apakah pengaduan warga bisa langsung diekspor ke Excel?**
  * *Jawab*: Ya, admin dapat mengklik tombol **Ekspor Data (CSV)** pada menu Kelola Pengaduan.

---
*Sistem Informasi Kelurahan Onto &copy; 2026 — Dikelola oleh Pemerintah Kelurahan Onto, Kab. Bantaeng*
