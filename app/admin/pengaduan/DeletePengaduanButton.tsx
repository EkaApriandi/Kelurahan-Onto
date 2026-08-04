'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { hapusPengaduanAction } from '../actions';

export default function DeletePengaduanButton({ id, nama }: { id: number; nama: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus laporan pengaduan dari "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setLoading(true);
    const res = await hapusPengaduanAction(id);
    if (!res.success) {
      alert('Gagal menghapus pengaduan: ' + res.message);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-md border border-red-200 transition disabled:opacity-50 cursor-pointer"
      title="Hapus Pengaduan Ini"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
