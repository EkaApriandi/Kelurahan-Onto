'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { loginAction } from '../actions';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Panggil Server Action agar HTTP Set-Cookie header dikirim langsung dari server ke browser
    const res = await loginAction(email, password);

    if (!res.success) {
      console.error('Login Action Error:', res);
      const msg = res.message || '';
      const code = res.code || '';

      if (msg.includes('Email not confirmed') || code === 'email_not_confirmed') {
        setError('Email belum dikonfirmasi di Supabase. Silakan periksa inbox/spam email Anda, atau pastikan akun sudah dikonfirmasi di Supabase Dashboard (Authentication -> Users).');
      } else if (msg.includes('Invalid login credentials') || code === 'invalid_credentials') {
        setError('Email atau kata sandi tidak sesuai. Pastikan email dan password yang dimasukkan sudah terdaftar di Supabase Auth.');
      } else if (msg.includes('User disabled') || code === 'user_disabled') {
        setError('Akun pengurus ini telah dinonaktifkan.');
      } else {
        setError(`Gagal masuk (${res.message || 'Error tidak diketahui'}). Silakan periksa kredensial atau pengaturan Supabase Anda.`);
      }
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
      <div className="absolute top-3 right-3 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white lg:text-slate-700 bg-red-900/80 lg:bg-white hover:bg-red-900 lg:hover:bg-slate-100 rounded-md shadow-2xs border border-red-800 lg:border-slate-200 transition"
        >
          <span>🏠</span>
          <span>Beranda</span>
        </Link>
      </div>

      {/* Panel Banner Identitas (Di Seluler jadi Header Top, Di Desktop jadi Left Side 50%) */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden shadow-md lg:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 lg:mb-8">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-xs flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-bantaeng.jpg"
                alt="Logo Kabupaten Bantaeng"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white block leading-none">
                Kelurahan Onto
              </span>
              <span className="text-[10px] font-semibold text-red-200 uppercase tracking-wider">
                Kecamatan Bantaeng, Kab. Bantaeng
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight mb-2 text-white">
            Portal Halaman Pengurus
          </h1>
          <p className="text-red-100 text-xs sm:text-sm leading-relaxed max-w-md">
            Kelola berita, pengumuman publik, serta tanggapi pengaduan masyarakat Kelurahan Onto secara terpadu.
          </p>
        </div>

        <div className="hidden lg:flex relative z-10 border-t border-red-800/60 pt-3 text-xs text-red-200 justify-between items-center mt-6">
          <p>&copy; Sistem Informasi Kelurahan Onto</p>
          <p className="font-semibold">KKN-T 116 Universitas Hasanuddin</p>
        </div>
      </div>

      {/* Panel Formulir Masuk (Mengisi Penuh Layar Tanpa Space Kosong Terbuang) */}
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

            {error && (
              <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">
                {error}
              </div>
            )}

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
    </main>
  );
}