'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { hapusLayananAction } from '../actions';

export default function DeleteLayananButton({ id, nama }: { id: number; nama: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus layanan "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setLoading(true);
    const res = await hapusLayananAction(id);
    if (!res.success) {
      alert('Gagal menghapus layanan: ' + res.message);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
