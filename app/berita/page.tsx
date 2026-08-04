import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import BeritaGridClient from './BeritaGridClient';

export const revalidate = 0;

const KATEGORI_LIST = ['Semua', 'Kegiatan Kelurahan', 'Pengumuman Resmi'];

async function getBerita(kategori?: string) {
  let query = supabase
    .from('berita')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });

  if (kategori && kategori !== 'Semua') {
    query = query.eq('kategori', kategori);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function BeritaList({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const kategoriAktif = params.kategori ?? 'Semua';
  const beritas = await getBerita(kategoriAktif);

  return (
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Berita & Pengumuman Resmi
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Informasi kegiatan masyarakat, pengumuman resmi, dan seputar Kelurahan Onto.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Filter Kategori:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {KATEGORI_LIST.map((k) => {
              const isActive = kategoriAktif === k;
              return (
                <Link
                  key={k}
                  href={k === 'Semua' ? '/berita' : `/berita?kategori=${encodeURIComponent(k)}`}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-red-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {k === 'Kegiatan Kelurahan' ? 'Kegiatan' : k === 'Pengumuman Resmi' ? 'Pengumuman' : k}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Search & Grid List */}
        <BeritaGridClient beritas={beritas} />
      </div>
    </main>
  );
}