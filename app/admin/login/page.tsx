'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email atau password salah.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex">
      {/* Panel kiri — branding (tersembunyi di layar kecil) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-between p-12 text-white">
        <div>
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl mb-8">
            🏛️
          </div>
          <h1 className="text-3xl font-bold leading-snug mb-3">
            Sistem Informasi
            <br />
            Kelurahan Onto
          </h1>
          <p className="text-blue-100 text-sm max-w-sm">
            Kelola berita, pengumuman, dan pengaduan warga Kelurahan Onto melalui satu panel
            terpadu.
          </p>
        </div>
        <p className="text-xs text-blue-200">
          &copy; {new Date().getFullYear()} Kelurahan Onto, Kecamatan Bantaeng
        </p>
      </div>

      {/* Panel kanan — form login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-700 flex items-center justify-center text-xl mb-6 lg:hidden">
              🏛️
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Masuk ke Panel Admin</h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Silakan masuk menggunakan akun yang telah terdaftar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm text-gray-900 rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm text-gray-900 rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white text-sm font-bold py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Khusus untuk aparat Kelurahan Onto
          </p>
        </div>
      </div>
    </main>
  );
}