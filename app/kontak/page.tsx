import Link from 'next/link';
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

// Pilih ikon & warna aksen berdasarkan kategori, biar tiap kontak kelihatan beda dan gampang dikenali
function ikonKontak(kategori: string): { ikon: string; bg: string } {
  const l = kategori.toLowerCase();
  if (l.includes('kantor')) return { ikon: '🏢', bg: 'bg-blue-50' };
  if (l.includes('bhabinkamtibmas') || l.includes('babinkamtibmas') || l.includes('polisi') || l.includes('polsek')) return { ikon: '👮', bg: 'bg-amber-50' };
  if (l.includes('babinsa') || l.includes('koramil')) return { ikon: '🎖️', bg: 'bg-green-50' };
  if (l.includes('puskesmas') || l.includes('pustu')) return { ikon: '🏥', bg: 'bg-red-50' };
  if (l.includes('damkar')) return { ikon: '🚒', bg: 'bg-orange-50' };
  return { ikon: '☎️', bg: 'bg-gray-50' };
}

// Pecah label "Kantor Kelurahan (Mahyuni)" jadi nama utama "Mahyuni" + kategori "Kantor Kelurahan"
function pecahLabel(label: string): { nama: string; kategori: string } {
  const match = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { kategori: match[1].trim(), nama: match[2].trim() };
  }
  return { nama: label, kategori: '' };
}

export default async function KontakPengaduan() {
  const info = await getKontakInfo();
  const kontakPenting: KontakPenting[] = info?.kontak_penting ?? [];

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
            <Link href="/profil" className="hover:text-blue-700">Profil</Link>
            <Link href="/kependudukan" className="hover:text-blue-700">Data kependudukan</Link>
            <Link href="/layanan" className="hover:text-blue-700">Layanan</Link>
            <Link href="/kontak" className="text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-1">Kontak & Pengaduan</h2>
        <p className="text-sm text-gray-500 mb-10">
          Sampaikan pertanyaan atau laporan Anda, atau hubungi kami langsung.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          {/* Form Pengaduan */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-base font-bold mb-1">Form Pengaduan</h3>
              <p className="text-xs text-gray-400 mb-6">
                Isi form di bawah untuk menyampaikan pengaduan Anda kepada kami.
              </p>
              <PengaduanForm />
            </div>
          </div>

          {/* Lokasi Kantor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="h-48">
                {info?.peta_embed_url ? (
                  <iframe
                    src={info.peta_embed_url}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                    Peta belum diisi
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-base leading-none mt-0.5">📍</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{info?.alamat ?? '—'}</p>
                </div>
                {info?.email && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">✉️</span>
                    <p className="text-sm text-gray-600">{info.email}</p>
                  </div>
                )}
                {info?.medsos && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">📱</span>
                    <p className="text-sm text-gray-600">{info.medsos}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nomor Kontak Penting */}
        <div>
          <h3 className="text-base font-bold mb-4">Nomor Kontak Penting</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kontakPenting.length > 0 ? (
              kontakPenting.map((k, i) => {
                const { nama, kategori } = pecahLabel(k.label);
                const { ikon, bg } = ikonKontak(kategori || k.label);
                return (
                  <div
                    key={i}
                    className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition"
                  >
                    {kategori && (
                      <span className="absolute top-3 right-3 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                        {kategori}
                      </span>
                    )}
                    <div className="flex items-center gap-3 pr-2">
                      <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center text-xl flex-shrink-0`}>
                        {ikon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{nama}</p>
                        <p className="text-base font-bold text-gray-900 mt-0.5">{k.nomor}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400 col-span-full">Belum ada data kontak penting.</p>
            )}
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