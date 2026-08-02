import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ChartDemografi from './ChartDemografi';

export const revalidate = 0;

async function getData() {
  const { data: rtRws } = await supabase
    .from('rt_rw')
    .select('*')
    .order('nomor_rw')
    .order('nomor_rt');

  const { data: demografis } = await supabase.from('demografi').select('*').order('kategori');

  return {
    rtRws: rtRws ?? [],
    usia: demografis?.filter((d) => d.kategori === 'usia') ?? [],
    pendidikan: demografis?.filter((d) => d.kategori === 'pendidikan') ?? [],
    pekerjaan: demografis?.filter((d) => d.kategori === 'pekerjaan') ?? [],
  };
}

export default async function DataKependudukan() {
  const { rtRws, usia, pendidikan, pekerjaan } = await getData();

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
            <Link href="/kependudukan" className="text-blue-700">Data kependudukan</Link>
            <Link href="/layanan" className="hover:text-blue-700">Layanan</Link>
            <Link href="/kontak" className="hover:text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Data & Statistik Kependudukan</h2>

        {/* Tabel data kependudukan */}
        <div className="mb-10">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-2">RT/RW</th>
                  <th className="text-right px-4 py-2">Jumlah KK</th>
                  <th className="text-right px-4 py-2">Laki-laki</th>
                  <th className="text-right px-4 py-2">Perempuan</th>
                  <th className="text-right px-4 py-2">Total Jiwa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rtRws.length > 0 ? (
                  rtRws.map((rt) => (
                    <tr key={rt.id}>
                      <td className="px-4 py-2">
                        {rt.nomor_rt === '—' ? rt.nomor_rw : `RT ${rt.nomor_rt} / RW ${rt.nomor_rw}`}
                      </td>
                      <td className="px-4 py-2 text-right">{rt.jumlah_kk}</td>
                      <td className="px-4 py-2 text-right">{rt.jumlah_l}</td>
                      <td className="px-4 py-2 text-right">{rt.jumlah_p}</td>
                      <td className="px-4 py-2 text-right font-medium">{rt.jumlah_l + rt.jumlah_p}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      Belum ada data RT/RW.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grafik Demografi */}
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-4">Grafik Demografi</h3>
          <ChartDemografi usia={usia} pendidikan={pendidikan} pekerjaan={pekerjaan} />
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