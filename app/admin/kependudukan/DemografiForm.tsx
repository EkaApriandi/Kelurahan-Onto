'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDemografiAction } from '../actions';

type DemografiItem = {
  id: number;
  kategori: string;
  label: string;
  jumlah: number;
};

export default function DemografiForm({ items }: { items: DemografiItem[] }) {
  const router = useRouter();
  const [data, setData] = useState<DemografiItem[]>(items);
  const [kategoriAktif, setKategoriAktif] = useState<'pekerjaan' | 'pendidikan' | 'usia'>('pekerjaan');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const filteredItems = data.filter((item) => item.kategori === kategoriAktif);

  function handleJumlahChange(id: number, val: number) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, jumlah: Math.max(0, val) } : item))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    const res = await updateDemografiAction(
      data.map((item) => ({ id: item.id, jumlah: Number(item.jumlah), kategori: item.kategori, label: item.label }))
    );

    if (!res.success) {
      setError('Gagal memperbarui data demografi: ' + (res.message ?? 'Terjadi kesalahan.'));
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      {/* Tab Kategori Demografi */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setKategoriAktif('pekerjaan')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            kategoriAktif === 'pekerjaan'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          💼 Matapencaharian & Pekerjaan
        </button>
        <button
          type="button"
          onClick={() => setKategoriAktif('pendidikan')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            kategoriAktif === 'pendidikan'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🎓 Tingkat Pendidikan
        </button>
        <button
          type="button"
          onClick={() => setKategoriAktif('usia')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${
            kategoriAktif === 'usia'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🎂 Kelompok Usia
        </button>
      </div>

      {/* Daftar Item Kategori Aktif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white transition"
          >
            <label className="text-xs font-bold text-slate-800">{item.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={item.jumlah}
                onChange={(e) => handleJumlahChange(item.id, parseInt(e.target.value) || 0)}
                className="w-24 text-xs font-extrabold text-slate-900 rounded-md border border-slate-300 px-3 py-1.5 text-right focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
              />
              <span className="text-[11px] text-slate-400 font-medium">Jiwa</span>
            </div>
          </div>
        ))}
      </div>

      {success && (
        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2">
          <span>✅</span>
          <span>Data demografi kependudukan berhasil diperbarui & langsung aktif di grafik website!</span>
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
          {saving ? 'Menyimpan Data...' : 'Simpan Perubahan Demografi'}
        </button>
      </div>
    </form>
  );
}
