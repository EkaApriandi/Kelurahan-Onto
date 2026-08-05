'use client';

import { useState } from 'react';
import { kirimPengaduanAction } from '@/app/admin/actions';

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

    const res = await kirimPengaduanAction({
      nama: form.nama,
      kontak: form.kontak,
      kategori: form.kategori,
      isi: form.isi,
    });

    if (!res.success) {
      console.error(res.message);
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm({ nama: '', kontak: '', kategori: '', isi: '' });
  }

  const inputClass =
    'w-full text-xs sm:text-sm rounded-lg border border-slate-200 px-3.5 py-2.5 shadow-xs placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-hidden transition bg-slate-50/50 focus:bg-white text-slate-800 font-medium';

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
          ✓
        </div>
        <h4 className="text-base font-bold text-emerald-900 mb-1">Pengaduan Berhasil Terkirim</h4>
        <p className="text-xs text-emerald-700 leading-relaxed mb-4 max-w-md mx-auto">
          Terima kasih, laporan Anda telah diterima dan akan segera ditindaklanjuti oleh petugas Kelurahan Onto.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
        >
          Kirim Pengaduan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Nama Lengkap <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Masukkan nama lengkap Anda..."
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Nomor HP / WhatsApp / Email <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Nomor HP atau Email aktif"
          value={form.kontak}
          onChange={(e) => setForm({ ...form, kontak: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Kategori Pengaduan <span className="text-red-600">*</span>
        </label>
        <select
          required
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          className={inputClass}
        >
          <option value="">Pilih Kategori Pengaduan</option>
          <option value="Layanan Administrasi">Layanan Administrasi Surat / Dokumen</option>
          <option value="Infrastruktur">Fasilitas Umum & Infrastruktur</option>
          <option value="Keamanan & Ketertiban">Keamanan & Ketertiban Masyarakat</option>
          <option value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</option>
          <option value="Lainnya">Lainnya / Aspirasi</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
          Isi Pengaduan <span className="text-red-600">*</span>
        </label>
        <textarea
          required
          placeholder="Tuliskan isi pengaduan Anda secara lengkap dan jelas..."
          rows={4}
          value={form.isi}
          onChange={(e) => setForm({ ...form, isi: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 font-semibold">
          Gagal mengirim pengaduan. Silakan coba beberapa saat lagi.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 px-5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs disabled:opacity-50 transition cursor-pointer"
      >
        {status === 'loading' ? 'Mengirim Pengaduan...' : 'Kirim Pengaduan'}
      </button>
    </form>
  );
}