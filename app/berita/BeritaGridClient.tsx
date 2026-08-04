'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type BeritaItem = {
  id: number;
  judul: string;
  slug: string;
  konten: string;
  kategori: string;
  gambar: string | null;
  created_at: string;
  tanggal_kejadian: string | null;
};

export default function BeritaGridClient({ beritas }: { beritas: BeritaItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeritas = useMemo(() => {
    if (!searchQuery.trim()) return beritas;
    const term = searchQuery.toLowerCase();
    return beritas.filter(
      (b) =>
        b.judul.toLowerCase().includes(term) ||
        b.konten.toLowerCase().includes(term)
    );
  }, [beritas, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Live Search Input Bar & Quick Tags */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="text-base text-slate-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel berita atau pengumuman (misal: Bantuan, Posyandu, Kerja Bakti)..."
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Search Tags */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Pencarian Populer:</span>
          {['Bantuan', 'Posyandu', 'Kerja Bakti', 'Stunting', 'Pengumuman'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-red-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeritas.length > 0 ? (
          filteredBeritas.map((berita) => (
            <article
              key={berita.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:border-red-300 transition group"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                {berita.gambar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={berita.gambar}
                    alt={berita.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs font-medium">
                    Kelurahan Onto
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-800 px-2.5 py-0.5 rounded-md">
                    {berita.kategori ?? 'Berita'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium mb-1.5 block">
                  {new Date(berita.tanggal_kejadian ?? berita.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-800 transition-colors line-clamp-2 mb-2">
                  {berita.judul}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {berita.konten}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 text-right">
                  <Link
                    href={`/berita/${berita.slug}`}
                    className="text-xs font-bold text-red-800 hover:text-red-900"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 py-12 bg-white rounded-xl border border-slate-200 text-xs">
            Tidak ada berita ditemukan dengan kata kunci &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
