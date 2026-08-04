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

  const teksSejarah: string = profil?.sejarah ?? 'Informasi sejarah lengkap Kelurahan Onto belum diisi.';
  const paragrafSejarah = teksSejarah
    .split('\n')
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const teksMisi: string = profil?.misi ?? 'Misi belum diisi.';
  const paragrafMisi = teksMisi
    .split('\n')
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  return (
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Banner Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1 rounded-md">
            Tentang Kami
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Profil Kelurahan Onto
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Sejarah, Visi, Misi, Perangkat Kelurahan, serta Pengurus Wilayah RT/RW Kelurahan Onto.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sejarah & Visi Misi */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl p-5 shadow-xs border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block mb-1">Sejarah</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2.5">Sejarah Kelurahan</h2>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify space-y-2">
              {profil?.tahun_berdiri && (
                <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  🏛️ Kelurahan Onto berdiri pada tahun <span className="font-bold text-red-800">{profil.tahun_berdiri}</span>.
                </p>
              )}
              {paragrafSejarah.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block mb-1">Visi</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Visi Kelurahan</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-3.5 rounded-lg border border-slate-100 font-medium">
                &quot;{profil?.visi ?? 'Visi belum diisi.'}&quot;
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block mb-1">Misi</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Misi Kelurahan</h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-1.5">
                {paragrafMisi.map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Aparat Kelurahan */}
        <section className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Struktur Perangkat</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Aparat Pemerintah Kelurahan</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {struktur.map((item, i) => (
              <KartuAparat
                key={`utama-${i}`}
                nama={item.nama}
                jabatan={item.jabatan}
                nip={item.nip}
                fotoUrl={item.foto_url}
              />
            ))}

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
        </section>

        {/* Struktur RT / RW */}
        <section className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Pengurus Wilayah</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Daftar Ketua RW & RT</h2>
          </div>

          {Object.keys(perRw).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.entries(perRw)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([nomorRw, anggota]) => {
                  const ketuaRw = anggota.find((a) => a.level === 'RW');
                  const ketuaRts = anggota.filter((a) => a.level === 'RT');
                  return (
                    <div key={nomorRw} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
                        <span className="text-xs font-extrabold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                          RW {nomorRw}
                        </span>
                        {ketuaRw?.alamat_wilayah && (
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                            {ketuaRw.alamat_wilayah}
                          </span>
                        )}
                      </div>

                      {ketuaRw && (
                        <div className="mb-2 p-2 bg-white rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Ketua RW</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{ketuaRw.nama}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        {ketuaRts.map((rt) => (
                          <div key={rt.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-md border border-slate-100">
                            <span className="font-semibold text-slate-700">RT {rt.nomor_rt}</span>
                            <span className="text-slate-800">{rt.nama}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl text-center">
              Data pengurus RW dan RT belum diisi.
            </p>
          )}
        </section>

        {/* Peta Wilayah & Spesifikasi Wilayah Utuh */}
        <section className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Data Geografis</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Peta & Batas Wilayah</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Container Peta (Diatur agar Peta Tampil Utuh Tanpa Terpotong) */}
            <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-2 flex items-center justify-center min-h-[300px]">
              {profil?.peta_embed_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profil.peta_embed_url}
                  alt="Peta wilayah Kelurahan Onto"
                  className="w-full h-auto max-h-[360px] object-contain rounded-lg shadow-2xs"
                />
              ) : (
                <div className="w-full h-full min-h-[250px] flex items-center justify-center text-slate-400 text-xs">
                  Gambar peta wilayah belum diatur
                </div>
              )}
            </div>

            {/* Kartu Spesifikasi Wilayah Ringkas & Pas */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 h-fit space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Spesifikasi Wilayah Kelurahan
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Luas Wilayah</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{profil?.luas_wilayah ?? '—'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Topografi</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{profil?.topografi ?? '—'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Batas Geografis Wilayah</span>
                <div className="bg-white rounded-lg border border-slate-200/80 divide-y divide-slate-100">
                  <div className="flex justify-between px-3 py-1.5">
                    <span className="text-slate-500 font-medium">Batas Utara</span>
                    <span className="font-bold text-slate-800 text-right">{profil?.batas_utara ?? '—'}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5">
                    <span className="text-slate-500 font-medium">Batas Selatan</span>
                    <span className="font-bold text-slate-800 text-right">{profil?.batas_selatan ?? '—'}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5">
                    <span className="text-slate-500 font-medium">Batas Timur</span>
                    <span className="font-bold text-slate-800 text-right">{profil?.batas_timur ?? '—'}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5">
                    <span className="text-slate-500 font-medium">Batas Barat</span>
                    <span className="font-bold text-slate-800 text-right">{profil?.batas_barat ?? '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}