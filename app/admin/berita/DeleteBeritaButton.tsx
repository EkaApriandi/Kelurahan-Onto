'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DeleteBeritaButton({ id, judul }: { id: number; judul: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus berita "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    setLoading(true);
    const supabase = createClient();
    await supabase.from('berita').delete().eq('id', id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline font-medium text-xs disabled:opacity-50"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}