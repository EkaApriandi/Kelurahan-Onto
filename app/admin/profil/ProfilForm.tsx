'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { simpanProfilAction } from '../actions';

type ProfilData = {
  id: number;
  tahun_berdiri: string;
  visi: string;
  misi: string;
  sejarah: string;
  sambutan_lurah: string;
  luas_wilayah: string;
  topografi: string;
  batas_utara: string;
  batas_selatan: string;
  batas_timur: string;
  batas_barat: string;
  foto_kelurahan_url?: string | null;
};

export default function ProfilForm({ initialData }: { initialData: ProfilData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProfilData>(initialData);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const res = await simpanProfilAction(form);

    if (!res.success) {
      setError('Gagal menyimpan profil: ' + (res.message ?? 'Terjadi kesalahan.'));
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    router.refresh();

    setTimeout(() => setSuccess(false), 4000);
  }

  const inputClass =
    'w-full text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
      
      {/* Seksi 1: Identitas & Sambutan */}
      <div>
        <h2 className="text-sm font-extrabold text-red-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          🏛️ Identitas & Sambutan Lurah
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tahun Berdiri Kelurahan</label>
            <input
              type="text"
              required
              value={form.tahun_berdiri}
              onChange={(e) => setForm({ ...form, tahun_berdiri: e.target.value })}
              className={inputClass}
              placeholder="Contoh: 1997"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Luas Wilayah</label>
            <input
              type="text"
              required
              value={form.luas_wilayah}
              onChange={(e) => setForm({ ...form, luas_wilayah: e.target.value })}
              className={inputClass}
              placeholder="Contoh: 4,69 km² (786 Ha)"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Sambutan Lurah</label>
          <textarea
            required
            rows={5}
            value={form.sambutan_lurah}
            onChange={(e) => setForm({ ...form, sambutan_lurah: e.target.value })}
            className={`${inputClass} leading-relaxed`}
            placeholder="Tuliskan kata sambutan resmi dari Lurah..."
          />
        </div>
      </div>

      {/* Seksi 2: Visi, Misi & Sejarah */}
      <div>
        <h2 className="text-sm font-extrabold text-red-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          📜 Visi, Misi & Sejarah Kelurahan
        </h2>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Visi Kelurahan</label>
          <textarea
            required
            rows={3}
            value={form.visi}
            onChange={(e) => setForm({ ...form, visi: e.target.value })}
            className={`${inputClass} leading-relaxed`}
            placeholder="Tuliskan Visi resmi kelurahan..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Misi Kelurahan</label>
          <textarea
            required
            rows={6}
            value={form.misi}
            onChange={(e) => setForm({ ...form, misi: e.target.value })}
            className={`${inputClass} leading-relaxed`}
            placeholder="Tuliskan poin-poin Misi resmi kelurahan..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Sejarah Singkat Kelurahan</label>
          <textarea
            required
            rows={8}
            value={form.sejarah}
            onChange={(e) => setForm({ ...form, sejarah: e.target.value })}
            className={`${inputClass} leading-relaxed`}
            placeholder="Tuliskan kisah sejarah pembentukan & kebudayaan kelurahan..."
          />
        </div>
      </div>

      {/* Seksi 3: Batas Geografis Wilayah */}
      <div>
        <h2 className="text-sm font-extrabold text-red-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          🗺️ Batas Geografis & Topografi
        </h2>

        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Kondisi Topografi</label>
          <input
            type="text"
            required
            value={form.topografi}
            onChange={(e) => setForm({ ...form, topografi: e.target.value })}
            className={inputClass}
            placeholder="Contoh: Perbukitan hingga lereng gunung yang landai..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Batas Wilayah Utara</label>
            <input
              type="text"
              required
              value={form.batas_utara}
              onChange={(e) => setForm({ ...form, batas_utara: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Batas Wilayah Selatan</label>
            <input
              type="text"
              required
              value={form.batas_selatan}
              onChange={(e) => setForm({ ...form, batas_selatan: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Batas Wilayah Timur</label>
            <input
              type="text"
              required
              value={form.batas_timur}
              onChange={(e) => setForm({ ...form, batas_timur: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Batas Wilayah Barat</label>
            <input
              type="text"
              required
              value={form.batas_barat}
              onChange={(e) => setForm({ ...form, batas_barat: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {success && (
        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2">
          <span>✅</span>
          <span>Perubahan profil kelurahan berhasil disimpan & langsung tampil di website!</span>
        </div>
      )}

      {error && (
        <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3.5">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-red-800 text-white text-xs font-bold px-8 py-3 rounded-lg hover:bg-red-900 disabled:opacity-50 transition shadow-xs cursor-pointer"
        >
          {saving ? 'Menyimpan Perubahan...' : 'Simpan Profil Kelurahan'}
        </button>
      </div>
    </form>
  );
}
