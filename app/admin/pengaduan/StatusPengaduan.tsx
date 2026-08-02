'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const WARNA_STATUS: Record<string, string> = {
  baru: 'bg-orange-50 text-orange-700 border-orange-200',
  diproses: 'bg-blue-50 text-blue-700 border-blue-200',
  selesai: 'bg-green-50 text-green-700 border-green-200',
};

export default function StatusPengaduan({ id, statusAwal }: { id: number; statusAwal: string }) {
  const [status, setStatus] = useState(statusAwal);
  const [saving, setSaving] = useState(false);

  async function handleChange(baru: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('pengaduan').update({ status: baru }).eq('id', id);
    if (!error) setStatus(baru);
    setSaving(false);
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-xs font-medium px-2.5 py-1.5 rounded-full border outline-none cursor-pointer disabled:opacity-50 ${WARNA_STATUS[status]}`}
    >
      <option value="baru">Baru</option>
      <option value="diproses">Diproses</option>
      <option value="selesai">Selesai</option>
    </select>
  );
}