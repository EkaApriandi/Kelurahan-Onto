'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDemografiAction, updateRtRwAction, hapusRtRwAction } from '../actions';

type DemografiItem = {
  id: number;
  kategori: string;
  label: string;
  jumlah: number;
};

export type RtRwItem = {
  id?: number;
  nomor_rw: string;
  nomor_rt: string;
  jumlah_kk: number;
  jumlah_l: number;
  jumlah_p: number;
};

export default function DemografiForm({
  items,
  rtRws = [],
}: {
  items: DemografiItem[];
  rtRws?: RtRwItem[];
}) {
  const router = useRouter();
  const [data, setData] = useState<DemografiItem[]>(items);
  const [rtrwList, setRtrwList] = useState<RtRwItem[]>(
    rtRws.length > 0
      ? rtRws
      : [
          { nomor_rw: '01', nomor_rt: '01', jumlah_kk: 0, jumlah_l: 0, jumlah_p: 0 },
          { nomor_rw: '01', nomor_rt: '02', jumlah_kk: 0, jumlah_l: 0, jumlah_p: 0 },
        ]
  );
  const [kategoriAktif, setKategoriAktif] = useState<'rtrw' | 'pekerjaan' | 'pendidikan' | 'usia'>('rtrw');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Perhitungan Ringkasan Total RT/RW
  const totalKk = rtrwList.reduce((sum, r) => sum + (Number(r.jumlah_kk) || 0), 0);
  const totalL = rtrwList.reduce((sum, r) => sum + (Number(r.jumlah_l) || 0), 0);
  const totalP = rtrwList.reduce((sum, r) => sum + (Number(r.jumlah_p) || 0), 0);
  const totalJiwa = totalL + totalP;

  const filteredItems = data.filter((item) => item.kategori === kategoriAktif);

  function handleJumlahChange(id: number, val: number) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, jumlah: Math.max(0, val) } : item))
    );
  }

  function handleRtRwChange(index: number, field: keyof RtRwItem, val: string | number) {
    setRtrwList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  }

  function handleTambahRtRw() {
    setRtrwList((prev) => [
      ...prev,
      { nomor_rw: '01', nomor_rt: String(prev.length + 1).padStart(2, '0'), jumlah_kk: 0, jumlah_l: 0, jumlah_p: 0 },
    ]);
  }

  async function handleHapusRtRw(index: number, id?: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus data RT/RW ini?')) return;

    if (id) {
      setSaving(true);
      const res = await hapusRtRwAction(id);
      setSaving(false);
      if (!res.success) {
        setError('Gagal menghapus data RT/RW: ' + res.message);
        return;
      }
    }
    setRtrwList((prev) => prev.filter((_, idx) => idx !== index));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    if (kategoriAktif === 'rtrw') {
      const res = await updateRtRwAction(rtrwList);
      if (!res.success) {
        setError('Gagal memperbarui data RT/RW: ' + (res.message ?? 'Terjadi kesalahan.'));
        setSaving(false);
        return;
      }
    } else {
      const res = await updateDemografiAction(
        data.map((item) => ({ id: item.id, jumlah: Number(item.jumlah), kategori: item.kategori, label: item.label }))
      );

      if (!res.success) {
        setError('Gagal memperbarui data demografi: ' + (res.message ?? 'Terjadi kesalahan.'));
        setSaving(false);
        return;
      }
    }

    setSuccess(true);
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-5xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      {/* Tab Kategori Demografi */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setKategoriAktif('rtrw')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            kategoriAktif === 'rtrw'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🏠 Total Jiwa & Data RT/RW
        </button>
        <button
          type="button"
          onClick={() => setKategoriAktif('pekerjaan')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            kategoriAktif === 'pekerjaan'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          💼 Pekerjaan
        </button>
        <button
          type="button"
          onClick={() => setKategoriAktif('pendidikan')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            kategoriAktif === 'pendidikan'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🎓 Pendidikan
        </button>
        <button
          type="button"
          onClick={() => setKategoriAktif('usia')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            kategoriAktif === 'usia'
              ? 'border-red-800 text-red-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🎂 Kelompok Usia
        </button>
      </div>

      {/* SECTION RT / RW */}
      {kategoriAktif === 'rtrw' && (
        <div className="space-y-6">
          {/* Card Ringkasan Kalkulasi Otomatis */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3">
              Ringkasan Total Penduduk (Tampil di Website Publik)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Total Jiwa</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {totalJiwa.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Total KK</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  {totalKk.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Laki-Laki</span>
                <span className="text-2xl font-black text-sky-300 mt-1 block">
                  {totalL.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Perempuan</span>
                <span className="text-2xl font-black text-pink-300 mt-1 block">
                  {totalP.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              * Angka Total Jiwa, Total KK, Laki-Laki, dan Perempuan dikalkulasi secara otomatis dari akumulasi seluruh data RT/RW di bawah ini.
            </p>
          </div>

          {/* Tabel Input RT / RW */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 font-extrabold text-slate-700">
                <tr>
                  <th className="p-3">No. RW</th>
                  <th className="p-3">No. RT</th>
                  <th className="p-3">Jumlah KK</th>
                  <th className="p-3">Laki-Laki (L)</th>
                  <th className="p-3">Perempuan (P)</th>
                  <th className="p-3 text-center">Subtotal Jiwa</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rtrwList.map((item, idx) => {
                  const subtotal = (Number(item.jumlah_l) || 0) + (Number(item.jumlah_p) || 0);
                  return (
                    <tr key={item.id ?? idx} className="hover:bg-slate-50">
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.nomor_rw}
                          onChange={(e) => handleRtRwChange(idx, 'nomor_rw', e.target.value)}
                          placeholder="01"
                          className="w-16 text-xs font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white focus:border-red-600"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.nomor_rt}
                          onChange={(e) => handleRtRwChange(idx, 'nomor_rt', e.target.value)}
                          placeholder="01"
                          className="w-16 text-xs font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white focus:border-red-600"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={item.jumlah_kk}
                          onChange={(e) => handleRtRwChange(idx, 'jumlah_kk', parseInt(e.target.value) || 0)}
                          className="w-24 text-xs font-extrabold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white focus:border-red-600"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={item.jumlah_l}
                          onChange={(e) => handleRtRwChange(idx, 'jumlah_l', parseInt(e.target.value) || 0)}
                          className="w-24 text-xs font-extrabold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white focus:border-red-600"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min="0"
                          value={item.jumlah_p}
                          onChange={(e) => handleRtRwChange(idx, 'jumlah_p', parseInt(e.target.value) || 0)}
                          className="w-24 text-xs font-extrabold text-slate-900 border border-slate-300 rounded px-2 py-1 bg-white focus:border-red-600"
                        />
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-800">
                        {subtotal.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleHapusRtRw(idx, item.id)}
                          className="text-[11px] font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition cursor-pointer"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleTambahRtRw}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition border border-slate-300 cursor-pointer"
            >
              ➕ Tambah Wilayah RT/RW
            </button>
          </div>
        </div>
      )}

      {/* SECTION GRAFIK DEMOGRAFI (Pekerjaan, Pendidikan, Usia) */}
      {kategoriAktif !== 'rtrw' && (
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
      )}

      {success && (
        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-2">
          <span>✅</span>
          <span>Data kependudukan berhasil diperbarui & langsung aktif di grafik serta statistik website!</span>
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
          {saving ? 'Menyimpan Data...' : kategoriAktif === 'rtrw' ? 'Simpan Data RT/RW & Statistik Total Jiwa' : 'Simpan Perubahan Demografi'}
        </button>
      </div>
    </form>
  );
}
