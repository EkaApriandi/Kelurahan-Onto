'use client';

import { useState, useMemo } from 'react';

type LayananItem = {
  id: number;
  nama_layanan: string;
  syarat: string;
  alur: string | null;
  estimasi_waktu: string | null;
  biaya: string | null;
  file_template: string | null;
};

export default function LayananAccordion({ items }: { items: LayananItem[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.nama_layanan.toLowerCase().includes(term) ||
        item.syarat.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  return (
    <div className="space-y-3">
      {/* Pencarian Layanan & Filter Instan */}
      <div className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari surat atau layanan (misal: KTP, SKTM, Surat Nikah, Pindah, Kematian)..."
            className="w-full px-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-lg border border-slate-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Rekomendasi Surat:</span>
          {['SKTM', 'KTP / KK', 'Pindah', 'Kematian', 'Suket Usaha', 'Pengantar Nikah', 'Domisili'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchTerm(searchTerm === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                searchTerm.toLowerCase() === tag.toLowerCase()
                  ? 'bg-red-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Layanan */}
      {filteredItems.length > 0 ? (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            const paragrafSyarat = item.syarat
              .split('\n')
              .map((s) => s.trim())
              .filter((s) => s.length > 0);

            const paragrafAlur = (item.alur ?? '')
              .split('\n')
              .map((a) => a.trim())
              .filter((a) => a.length > 0);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-red-500 shadow-xs'
                    : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left gap-4"
                >
                  <span className={`text-xs sm:text-sm font-bold ${isOpen ? 'text-red-800' : 'text-slate-800'}`}>
                    {item.nama_layanan}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.biaya && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        {item.biaya}
                      </span>
                    )}
                    <span className="text-slate-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          ⏱️ Estimasi Waktu
                        </span>
                        <span className="font-semibold text-slate-800">
                          {item.estimasi_waktu ?? 'Sesuai Antrean'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          💰 Biaya Layanan
                        </span>
                        <span className="font-bold text-emerald-600">
                          {item.biaya ?? 'Gratis (Rp 0)'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-900 block mb-1">
                        Persyaratan Dokumen:
                      </span>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed space-y-1">
                        {paragrafSyarat.map((s, idx) => (
                          <p key={idx}>{s}</p>
                        ))}
                      </div>
                    </div>

                    {paragrafAlur.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-900 block mb-1">
                          Alur Pengurusan:
                        </span>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-600 leading-relaxed space-y-1">
                          {paragrafAlur.map((a, idx) => (
                            <p key={idx}>{a}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.file_template && (
                      <div className="pt-0.5">
                        <a
                          href={item.file_template}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-bold rounded-lg transition"
                        >
                          <span>Unduh Formulir Persyaratan</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-5 text-center rounded-lg border border-slate-200 text-slate-500 text-xs">
          Layanan tidak ditemukan. Coba kata kunci lainnya.
        </div>
      )}
    </div>
  );
}