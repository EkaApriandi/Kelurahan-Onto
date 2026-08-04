'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { simpanLayananAction } from '../actions';

type LayananData = {
  id?: number;
  nama_layanan: string;
  syarat: string;
  estimasi_waktu: string;
  biaya: string;
  alur: string;
};

export default function LayananForm({ data }: { data?: LayananData }) {
  const router = useRouter();
  const isEdit = !!data?.id;

  const [form, setForm] = useState<LayananData>(
    data ?? {
      nama_layanan: '',
      syarat: '',
      estimasi_waktu: 'Menyesuaikan jam pelayanan kantor kelurahan',
      biaya: 'Gratis',
      alur:
        '1. Warga datang langsung ke Kantor Kelurahan Onto dengan membawa syarat dokumen yang diperlukan.\n2. Petugas pelayanan memeriksa kelengkapan berkas.\n3. Surat diproses dan ditandatangani oleh Lurah.\n4. Surat yang telah selesai diserahkan kepada pemohon.',
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await simpanLayananAction({
      id: data?.id,
      nama_layanan: form.nama_layanan,
      syarat: form.syarat,
      estimasi_waktu: form.estimasi_waktu,
      biaya: form.biaya,
      alur: form.alur,
    });

    if (!res.success) {
      setError('Gagal menyimpan layanan: ' + (res.message ?? 'Terjadi kesalahan.'));
      setSaving(false);
      return;
    }

    router.push('/admin/layanan');
    router.refresh();
  }

  const inputClass =
    'w-full text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Layanan Surat / Rekomendasi</label>
        <input
          type="text"
          required
          value={form.nama_layanan}
          onChange={(e) => setForm({ ...form, nama_layanan: e.target.value })}
          className={inputClass}
          placeholder="Contoh: Surat Keterangan Usaha (SKU)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimasi Waktu Pelayanan</label>
          <input
            type="text"
            required
            value={form.estimasi_waktu}
            onChange={(e) => setForm({ ...form, estimasi_waktu: e.target.value })}
            className={inputClass}
            placeholder="Contoh: 15 – 30 Menit"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Biaya Pelayanan</label>
          <input
            type="text"
            required
            value={form.biaya}
            onChange={(e) => setForm({ ...form, biaya: e.target.value })}
            className={inputClass}
            placeholder="Contoh: Gratis"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Persyaratan Dokumen</label>
        <textarea
          required
          rows={3}
          value={form.syarat}
          onChange={(e) => setForm({ ...form, syarat: e.target.value })}
          className={`${inputClass} leading-relaxed`}
          placeholder="Contoh: Fotokopi KTP, Fotokopi Kartu Keluarga, Pengantar RT/RW..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Alur Prosedur Pelayanan</label>
        <textarea
          required
          rows={5}
          value={form.alur}
          onChange={(e) => setForm({ ...form, alur: e.target.value })}
          className={`${inputClass} leading-relaxed`}
          placeholder="Tuliskan tahapan alur pengurusan..."
        />
      </div>

      {error && (
        <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-red-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-red-900 disabled:opacity-50 transition shadow-xs cursor-pointer"
        >
          {saving ? 'Menyimpan Layanan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Layanan Baru'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/layanan')}
          className="text-xs font-bold text-slate-600 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
