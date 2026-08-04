import { supabase } from '@/lib/supabase';
import LayananAccordion from './LayananAccordion';

export const revalidate = 0;

type KontakPetugas = {
  nama: string;
  telepon: string;
};

async function getData() {
  const { data: layanan } = await supabase.from('layanan').select('*').order('urutan');
  const { data: info } = await supabase.from('layanan_info').select('*').limit(1).single();

  return { layanan: layanan ?? [], info };
}

export default async function LayananPublik() {
  const { layanan, info } = await getData();
  const kontakPetugas: KontakPetugas[] = info?.kontak_petugas ?? [];

  return (
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1 rounded-md">
            Pelayanan Administrasi
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Layanan Publik & Dokumen Surat
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Persyaratan, alur prosedur, estimasi waktu, dan biaya pengurusan surat keterangan Kelurahan Onto.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Layanan Surat ({layanan.length} Jenis)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cari atau buka salah satu layanan di bawah untuk melihat detail persyaratan berkas.
            </p>
          </div>

          <LayananAccordion items={layanan} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Jam Operasional */}
          <div className="lg:col-span-6 bg-white rounded-xl p-6 shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-1">Jadwal Kantor</span>
            <h3 className="text-base font-bold text-slate-900 mb-3">Jam Pelayanan Kelurahan</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Jam Operasional:</span>
                <p className="text-slate-800 whitespace-pre-line font-bold leading-relaxed">
                  {info?.jam_operasional ?? '—'}
                </p>
              </div>
              {info?.hari_libur && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-medium block mb-0.5">Hari Libur:</span>
                  <p className="font-bold text-red-800">{info.hari_libur}</p>
                </div>
              )}
            </div>
          </div>

          {/* Petugas Pelayanan */}
          <div className="lg:col-span-6 bg-white rounded-xl p-6 shadow-xs border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-1">Petugas Pelayanan</span>
            <h3 className="text-base font-bold text-slate-900 mb-3">Kontak Petugas Pelayanan</h3>
            <div className="space-y-2 text-xs">
              {kontakPetugas.length > 0 ? (
                kontakPetugas.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <span className="font-bold text-slate-800">{p.nama}</span>
                    <a
                      href={`tel:${p.telepon}`}
                      className="font-bold text-red-800 hover:underline"
                    >
                      {p.telepon}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg text-center">
                  Informasi kontak petugas belum diisi.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}