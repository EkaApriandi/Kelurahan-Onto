'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PengaduanForm() {
  const [form, setForm] = useState({
    nama: '',
    kontak: '',
    kategori: '',
    isi: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const { error } = await supabase.from('pengaduan').insert({
      nama: form.nama,
      kontak: form.kontak,
      kategori: form.kategori,
      isi: form.isi,
    });

    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm({ nama: '', kontak: '', kategori: '', isi: '' });
  }

  const inputClass =
    'w-full text-sm rounded-lg border border-gray-200 px-3.5 py-2.5 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition';

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 text-2xl">
          ✅
        </div>
        <p className="text-sm font-medium text-green-800 mb-1">Pengaduan berhasil dikirim</p>
        <p className="text-xs text-green-600 mb-4">Terima kasih, laporan Anda akan segera ditindaklanjuti.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-green-700 font-medium underline underline-offset-2"
        >
          Kirim pengaduan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Nama</label>
        <input
          type="text"
          required
          placeholder="Nama lengkap Anda"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Kontak</label>
        <input
          type="text"
          required
          placeholder="Nomor HP atau email"
          value={form.kontak}
          onChange={(e) => setForm({ ...form, kontak: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategori</label>
        <select
          required
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          className={inputClass}
        >
          <option value="">Pilih kategori pengaduan</option>
          <option value="Layanan Administrasi">Layanan Administrasi</option>
          <option value="Infrastruktur">Infrastruktur</option>
          <option value="Keamanan & Ketertiban">Keamanan & Ketertiban</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Isi Pengaduan</label>
        <textarea
          required
          placeholder="Jelaskan pengaduan Anda secara singkat dan jelas"
          rows={4}
          value={form.isi}
          onChange={(e) => setForm({ ...form, isi: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          Gagal mengirim pengaduan. Silakan coba lagi.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition w-full sm:w-fit"
      >
        {status === 'loading' ? 'Mengirim...' : 'Kirim Pengaduan'}
      </button>
    </form>
  );
}