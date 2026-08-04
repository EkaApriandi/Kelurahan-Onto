'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { loginAction } from '../actions';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State untuk Pop-up Error Modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalDetail, setModalDetail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setShowErrorModal(false);

    // 1. Panggil Server Action agar HTTP Set-Cookie header dikirim langsung dari server ke browser
    const res = await loginAction(email, password);

    if (!res.success) {
      console.error('Login Action Error:', res);
      const msg = res.message || '';
      const code = res.code || '';

      if (msg.includes('Email not confirmed') || code === 'email_not_confirmed') {
        setModalTitle('Email Belum Dikonfirmasi');
        setModalMessage('Email akun pengurus ini belum dikonfirmasi di database Supabase.');
        setModalDetail(
          'Silakan periksa inbox/spam email Anda untuk melakukan konfirmasi, atau pastikan akun sudah di-Auto Confirm di Supabase Dashboard (Authentication -> Users).'
        );
      } else if (msg.includes('Invalid login credentials') || code === 'invalid_credentials') {
        setModalTitle('Kredensial Tidak Sesuai');
        setModalMessage('Alamat email atau kata sandi yang Anda masukkan salah / tidak terdaftar.');
        setModalDetail(
          'Mohon periksa kembali penulisan email dan kata sandi Anda. Pastikan ejaan dan huruf besar/kecil sudah sesuai.'
        );
      } else if (msg.includes('User disabled') || code === 'user_disabled') {
        setModalTitle('Akun Dinonaktifkan');
        setModalMessage('Akun pengurus ini telah dinonaktifkan.');
        setModalDetail('Silakan hubungi Administrator Kelurahan Onto untuk mengaktifkan kembali akun Anda.');
      } else {
        setModalTitle('Gagal Masuk Panel');
        setModalMessage(`Terjadi kesalahan otentikasi: ${res.message || 'Error tidak diketahui'}`);
        setModalDetail('Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.');
      }

      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    // 2. Sinkronkan juga ke browser client state
    try {
      const supabase = createClient();
      await supabase.auth.signInWithPassword({ email, password });
    } catch {
      // Abaikan jika client sync opsional
    }

    // 3. Pindah ke halaman admin dengan reload penuh agar middleware & server components menerima cookie HTTP
    window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 relative">
      {/* Tombol Kembali ke Beranda Ringkas */}
      <div className="absolute top-3 right-3 z-40">
        <Link
          href="/"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white lg:text-slate-700 bg-red-900/80 lg:bg-white hover:bg-red-900 lg:hover:bg-slate-100 rounded-md shadow-2xs border border-red-800 lg:border-slate-200 transition"
        >
          <span>🏠</span>
          <span>Beranda</span>
        </Link>
      </div>

      {/* Panel Banner Identitas (Latar Belakang Foto Kantor Kelurahan + Gradasi Merah Onto) */}
      <div
        className="w-full lg:w-1/2 text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden shadow-md lg:shadow-none bg-slate-950 bg-cover bg-center"
        style={{ backgroundImage: "url('/kantor-kelurahan.jpg')" }}
      >
        {/* Layer Gradasi Transparan Transparansi Tipis agar Gambar Gedung Terlihat Sangat Jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-red-950/50 to-slate-950/40" />

        <div className="relative z-10 drop-shadow-md">
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center flex-shrink-0 border border-white/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-bantaeng.jpg"
                alt="Logo Kabupaten Bantaeng"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block leading-none drop-shadow-sm">
                Kelurahan Onto
              </span>
              <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider block mt-1 drop-shadow-xs">
                Kecamatan Bantaeng, Kab. Bantaeng
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight mb-2 text-white drop-shadow-md">
            Portal Halaman Pengurus
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed max-w-md font-medium drop-shadow-xs">
            Kelola berita, pengumuman publik, serta tanggapi pengaduan masyarakat Kelurahan Onto secara terpadu.
          </p>
        </div>

        <div className="hidden lg:flex relative z-10 border-t border-red-800/60 pt-3 text-xs text-red-200 justify-between items-center mt-6">
          <p>&copy; Sistem Informasi Kelurahan Onto</p>
          <p className="font-semibold">KKN-T 116 Universitas Hasanuddin</p>
        </div>
      </div>

      {/* Panel Formulir Masuk */}
      <div className="w-full lg:w-1/2 flex-1 flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-sm">
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Masuk Panel Pengurus</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan masukkan kredensial akun pengurus kelurahan yang terdaftar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-800 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-red-900 disabled:opacity-50 transition shadow-xs cursor-pointer mt-1"
            >
              {loading ? 'Memproses Masuk...' : 'Masuk Panel Pengurus'}
            </button>
          </form>

          <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Khusus Perangkat & Pengurus Resmi Kelurahan Onto
          </div>
        </div>
      </div>

      {/* POP-UP MODAL KESALAHAN LOGIN */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hiasan Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-800" />

            {/* Icon Peringatan */}
            <div className="w-14 h-14 rounded-full bg-red-100 border-4 border-red-50 flex items-center justify-center text-2xl mb-3 shadow-inner">
              🚫
            </div>

            {/* Judul Modal */}
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
              {modalTitle}
            </h3>

            {/* Ringkasan Kesalahan */}
            <div className="w-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold p-3 rounded-xl mb-3 text-left leading-relaxed">
              {modalMessage}
            </div>

            {/* Rincian Petunjuk Perbaikan */}
            {modalDetail && (
              <div className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] p-3 rounded-xl mb-5 text-left flex items-start gap-2 leading-relaxed">
                <span className="text-sm">💡</span>
                <div>
                  <strong className="text-slate-800 block mb-0.5">Saran Perbaikan:</strong>
                  {modalDetail}
                </div>
              </div>
            )}

            {/* Tombol Tutup */}
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-xs cursor-pointer"
            >
              Mengerti, Tutup Pesan Ini
            </button>
          </div>
        </div>
      )}
    </main>
  );
}