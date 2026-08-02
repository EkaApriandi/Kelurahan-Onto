'use client';

import { useState, Fragment } from 'react';
import KartuAparat from './KartuAparat';

type StafItem = {
  nama: string;
  nip: string;
  foto_url?: string | null;
};

type SeksiItem = {
  seksi: string;
  staf_pns: StafItem[];
  staf_pppk: StafItem[];
};

export default function StrukturLengkap({ data }: { data: SeksiItem[] }) {
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-6 text-center">
      <button onClick={() => setOpen(!open)} className="text-sm text-blue-600 hover:underline">
        {open ? 'Sembunyikan struktur lengkap ▲' : 'Lihat struktur lengkap ▼'}
      </button>

      {open && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {data.map((seksi) => (
            <Fragment key={seksi.seksi}>
              {/* Kartu penanda Kasi — ikut dalam alur grid yang sama, bukan kotak terpisah */}
              <KartuAparat key={`kasi-${seksi.seksi}`} nama={seksi.seksi} jabatan="" variant="kasi" />

              {/* Staf PNS Kasi ini — kalau kosong, tetap tampil 1 kartu placeholder */}
              {seksi.staf_pns.length > 0 ? (
                seksi.staf_pns.map((s, i) => (
                  <KartuAparat
                    key={`${seksi.seksi}-pns-${i}`}
                    nama={s.nama}
                    jabatan="Staf PNS"
                    nip={s.nip}
                    fotoUrl={s.foto_url}
                  />
                ))
              ) : (
                <KartuAparat key={`${seksi.seksi}-pns-kosong`} nama="" jabatan="Staf PNS" kosong />
              )}

              {/* Staf PPPK Kasi ini */}
              {seksi.staf_pppk.map((s, i) => (
                <KartuAparat
                  key={`${seksi.seksi}-pppk-${i}`}
                  nama={s.nama}
                  jabatan="Staf PPPK"
                  nip={s.nip}
                  fotoUrl={s.foto_url}
                />
              ))}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}