import Link from 'next/link';
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
            <Link href="/layanan" className="text-blue-700">Layanan</Link>
            <Link href="/kontak" className="hover:text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-2">Layanan Publik / Administrasi</h2>
        <p className="text-sm text-gray-500 mb-8">
          Klik salah satu layanan di bawah untuk melihat syarat dan detailnya.
        </p>

        {/* Daftar Layanan (Accordion) */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">
            Daftar layanan surat ({layanan.length} jenis)
          </p>
          <LayananAccordion items={layanan} />
        </div>

        {/* Jadwal & Kontak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                🕐
              </div>
              <p className="text-sm font-semibold text-gray-700">Jam Pelayanan</p>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {info?.jam_operasional ?? '—'}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Libur</p>
              <p className="text-sm text-gray-600">{info?.hari_libur ?? '—'}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                👤
              </div>
              <p className="text-sm font-semibold text-gray-700">Petugas Pelayanan</p>
            </div>
            <div className="space-y-3">
              {kontakPetugas.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-sm text-gray-800 font-medium">{p.nama}</p>
                  <p className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">{p.telepon}</p>
                </div>
              ))}
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