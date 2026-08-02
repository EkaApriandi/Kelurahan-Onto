'use client';

import { useState } from 'react';

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
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`border rounded-lg px-4 py-3 bg-white ${
              isOpen ? 'border-blue-300 shadow-sm' : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className={`text-sm ${isOpen ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                {item.nama_layanan}
              </span>
              <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="mt-3 pl-1 text-xs text-gray-600 space-y-1.5 border-t border-gray-100 pt-3">
                <p>
                  <span className="text-gray-400">Syarat:</span> {item.syarat}
                </p>
                <div>
                  <span className="text-gray-400">Alur:</span>
                  <p className="whitespace-pre-line mt-1">
                    {item.alur ?? 'Belum diisi, sementara ikuti prosedur umum di kantor kelurahan'}
                  </p>
                </div>
                <p>
                  <span className="text-gray-400">Estimasi waktu:</span>{' '}
                  {item.estimasi_waktu ?? 'Belum diisi'}
                </p>
                <p>
                  <span className="text-gray-400">Biaya:</span> {item.biaya ?? 'Belum diisi'}
                </p>
                {item.file_template && (
                  <a
                    href={item.file_template}
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline"
                  >
                    ⬇ Unduh formulir
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}