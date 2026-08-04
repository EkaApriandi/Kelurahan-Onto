'use client';

import { useState } from 'react';
import { updateStatusPengaduanAction } from '../actions';

const WARNA_STATUS: Record<string, string> = {
  baru: 'bg-amber-50 text-amber-800 border-amber-200',
  diproses: 'bg-blue-50 text-blue-800 border-blue-200',
  selesai: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export default function StatusPengaduan({ id, statusAwal }: { id: number; statusAwal: string }) {
  const [status, setStatus] = useState(statusAwal);
  const [saving, setSaving] = useState(false);

  async function handleChange(baru: string) {
    setSaving(true);
    const res = await updateStatusPengaduanAction(id, baru);
    if (res.success) {
      setStatus(baru);
    } else {
      alert('Gagal memperbarui status: ' + res.message);
    }
    setSaving(false);
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-xs font-bold px-2.5 py-1.5 rounded-md border outline-hidden cursor-pointer disabled:opacity-50 transition ${
        WARNA_STATUS[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      <option value="baru">Status: Baru</option>
      <option value="diproses">Status: Diproses</option>
      <option value="selesai">Status: Selesai</option>
    </select>
  );
}