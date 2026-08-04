import { supabase } from '@/lib/supabase';
import PengaduanForm from './PengaduanForm';

export const revalidate = 0;

type KontakPenting = {
  label: string;
  nomor: string;
};

async function getKontakInfo() {
  const { data, error } = await supabase.from('kontak_info').select('*').limit(1).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

function ikonKontak(kategori: string): { ikon: string; bg: string } {
  const l = kategori.toLowerCase();
  if (l.includes('bhabinkamtibmas') || l.includes('babinkamtibmas') || l.includes('polisi') || l.includes('polsek'))
    return { ikon: '👮', bg: 'bg-amber-50 text-amber-700' };
  if (l.includes('babinsa') || l.includes('koramil') || l.includes('tni'))
    return { ikon: '🎖️', bg: 'bg-emerald-50 text-emerald-700' };
  return { ikon: '📞', bg: 'bg-slate-100 text-slate-700' };
}

function pecahLabel(label: string): { nama: string; kategori: string } {
  const match = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { kategori: match[1].trim(), nama: match[2].trim() };
  }
  return { nama: label, kategori: '' };
}

export default async function KontakPengaduan() {
  const info = await getKontakInfo();
  const semuaKontak: KontakPenting[] = info?.kontak_penting ?? [];

  // Hanya menyisakan Babinsa & Bhabinkamtibmas
  const kontakPembina = semuaKontak.filter((k) => {
    const l = k.label.toLowerCase();
    return (
      l.includes('babinsa') ||
      l.includes('bhabinkamtibmas') ||
      l.includes('babinkamtibmas')
    );
  });

  return (
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Banner */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1 rounded-md">
            Layanan Warga
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Kontak & Pengaduan Online
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Sampaikan pengaduan secara langsung atau hubungi pembina keamanan dan lokasi kantor kelurahan.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Pengaduan */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-xs border border-slate-200">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-800">Formulir Resmi</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Pengaduan / Aspirasi Warga</h2>
            </div>
            <PengaduanForm />
          </div>

          {/* Lokasi Kantor & Kontak Resmi */}
          <div className="lg:col-span-5 bg-white rounded-xl overflow-hidden shadow-xs border border-slate-200 flex flex-col">
            {/* Peta Lokasi */}
            <div className="h-64 bg-slate-100 relative border-b border-slate-200 p-1">
              {info?.peta_embed_url ? (
                <iframe
                  src={info.peta_embed_url}
                  className="w-full h-full border-0 rounded-lg"
                  allowFullScreen
                  loading="lazy"
                  title="Peta Lokasi Kantor Kelurahan Onto"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  Peta lokasi belum diatur
                </div>
              )}
            </div>

            {/* Alamat & Informasi Kontak */}
            <div className="p-5 space-y-3.5 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Informasi Kontak & Lokasi Kantor
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none">📍</span>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">Alamat Kantor:</span>
                    <p className="font-semibold text-slate-800 leading-relaxed mt-0.5">
                      {info?.alamat ?? 'Kelurahan Onto, Kecamatan Bantaeng, Kabupaten Bantaeng, Sulawesi Selatan'}
                    </p>
                  </div>
                </div>

                {info?.email && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none">✉️</span>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Email Resmi:</span>
                      <a href={`mailto:${info.email}`} className="font-bold text-red-800 hover:underline">
                        {info.email}
                      </a>
                    </div>
                  </div>
                )}

                {info?.medsos && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none">📸</span>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] block">Instagram Resmi:</span>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {info.medsos.startsWith('@') ? info.medsos : `@${info.medsos}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Kontak Pembina Wilayah Pas 2 Kartu Simetris */}
        <section className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800">Keamanan & Ketertiban</span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Kontak Pembina Wilayah</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungi Babinsa dan Bhabinkamtibmas untuk koordinasi ketertiban dan keamanan warga Kelurahan Onto.
            </p>
          </div>

          {kontakPembina.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kontakPembina.map((k, i) => {
                const { nama, kategori } = pecahLabel(k.label);
                const { ikon, bg } = ikonKontak(kategori || k.label);
                return (
                  <a
                    key={i}
                    href={`tel:${k.nomor}`}
                    className="group bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-red-300 p-4 transition-all flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center text-xl flex-shrink-0`}>
                        {ikon}
                      </div>
                      <div className="min-w-0">
                        {kategori && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                            {kategori}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{nama}</p>
                        <p className="text-xs sm:text-sm font-extrabold text-red-800 mt-0.5">{k.nomor}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 bg-slate-50 rounded-lg text-center">
              Belum ada data kontak Babinsa & Bhabinkamtibmas.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}