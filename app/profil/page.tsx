import Link from 'next/link';
import { Fragment } from 'react';
import { supabase } from '@/lib/supabase';
import KartuAparat from './KartuAparat';

export const revalidate = 0;

type StrukturItem = {
  jabatan: string;
  nama: string;
  nip?: string;
  foto_url?: string | null;
};

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

type PengurusWilayah = {
  id: number;
  level: 'RW' | 'RT';
  nomor_rw: string;
  nomor_rt: string | null;
  nama: string;
  alamat_wilayah: string | null;
  foto_url?: string | null;
};

async function getProfilDesa() {
  const { data, error } = await supabase.from('profil_desa').select('*').limit(1).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

async function getPengurusWilayah() {
  const { data, error } = await supabase.from('pengurus_wilayah').select('*').order('urutan');
  if (error) {
    console.error(error);
    return [];
  }
  return data as PengurusWilayah[];
}

export default async function ProfilDesa() {
  const [profil, pengurus] = await Promise.all([getProfilDesa(), getPengurusWilayah()]);
  const struktur: StrukturItem[] = profil?.struktur_organisasi ?? [];
  const strukturLengkap: SeksiItem[] = profil?.struktur_lengkap ?? [];

  const perRw = pengurus.reduce<Record<string, PengurusWilayah[]>>((acc, item) => {
    if (!acc[item.nomor_rw]) acc[item.nomor_rw] = [];
    acc[item.nomor_rw].push(item);
    return acc;
  }, {});

  return (
    <main className="bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            Kelurahan Onto
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-blue-700">Beranda</Link>
            <Link href="/profil" className="text-blue-700">Profil</Link>
            <Link href="/kependudukan" className="hover:text-blue-700">Data kependudukan</Link>
            <Link href="/layanan" className="hover:text-blue-700">Layanan</Link>
            <Link href="/kontak" className="hover:text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Profil Desa/Kelurahan</h2>

        {/* Sejarah & Visi Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Sejarah</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify">
              {profil?.tahun_berdiri && <>Kelurahan Onto berdiri pada tahun {profil.tahun_berdiri}. </>}
              {profil?.sejarah ?? (
                <span className="text-gray-400">
                  Cerita sejarah lengkap belum diisi. Silakan lengkapi lewat dashboard admin.
                </span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3">Visi & Misi</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">Visi</p>
              <p className="text-sm text-gray-700 text-justify">{profil?.visi ?? '—'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">Misi</p>
              <p className="text-sm text-gray-700 whitespace-pre-line text-justify">{profil?.misi ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Galeri Aparat Pemerintah Kelurahan — 1 grid flat, urut ke bawah */}
        <div className="mb-10">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
            Aparat Pemerintah Kelurahan
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 4 kartu utama */}
            {struktur.map((item, i) => (
              <KartuAparat
                key={`utama-${i}`}
                nama={item.nama}
                jabatan={item.jabatan}
                nip={item.nip}
                fotoUrl={item.foto_url}
              />
            ))}

            {/* Per Kasi: kartu penanda seksi, lalu staf PNS, lalu staf PPPK — mengalir dalam grid yang sama */}
            {strukturLengkap.map((seksi) => (
              <Fragment key={seksi.seksi}>
                <KartuAparat key={`kasi-${seksi.seksi}`} nama={seksi.seksi} jabatan="" variant="kasi" />

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
        </div>

        {/* Struktur RT/RW */}
        <div className="mb-10">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
            Ketua RW & RT
          </h3>
          {Object.keys(perRw).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(perRw)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([nomorRw, anggota]) => {
                  const ketuaRw = anggota.find((a) => a.level === 'RW');
                  const ketuaRts = anggota.filter((a) => a.level === 'RT');
                  return (
                    <div key={nomorRw} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-blue-700">RW {nomorRw}</p>
                        {ketuaRw?.alamat_wilayah && (
                          <span className="text-xs text-gray-400">{ketuaRw.alamat_wilayah}</span>
                        )}
                      </div>
                      {ketuaRw && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="text-gray-400">Ketua RW:</span> {ketuaRw.nama}
                        </p>
                      )}
                      <div className="pl-3 border-l-2 border-gray-100 space-y-1">
                        {ketuaRts.map((rt) => (
                          <p key={rt.id} className="text-xs text-gray-600">
                            RT {rt.nomor_rt}: {rt.nama}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Data Ketua RW/RT belum diisi.</p>
          )}
        </div>

        {/* Peta & Data Geografis */}
        <div>
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
            Peta Wilayah & Data Geografis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-lg overflow-hidden border border-gray-100 bg-white h-64">
              {profil?.peta_embed_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profil.peta_embed_url}
                  alt="Peta wilayah Kelurahan Onto"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Peta belum diisi
                </div>
              )}
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p><span className="text-gray-400">Luas wilayah:</span> {profil?.luas_wilayah ?? '—'}</p>
              <p><span className="text-gray-400">Topografi:</span> {profil?.topografi ?? '—'}</p>
              <p><span className="text-gray-400">Batas utara:</span> {profil?.batas_utara ?? '—'}</p>
              <p><span className="text-gray-400">Batas selatan:</span> {profil?.batas_selatan ?? '—'}</p>
              <p><span className="text-gray-400">Batas timur:</span> {profil?.batas_timur ?? '—'}</p>
              <p><span className="text-gray-400">Batas barat:</span> {profil?.batas_barat ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-300 py-6 text-center mt-12">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Sistem Informasi Kelurahan Onto. Dibuat oleh Mahasiswa
          KKN.
        </p>
      </footer>
    </main>
  );
}