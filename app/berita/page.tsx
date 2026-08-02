import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

const KATEGORI_LIST = ['Semua', 'Kegiatan Kelurahan', 'Pengumuman Resmi'];

async function getBerita(kategori?: string) {
  let query = supabase
    .from('berita')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });

  if (kategori && kategori !== 'Semua') {
    query = query.eq('kategori', kategori);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

export default async function BeritaList({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const kategoriAktif = params.kategori ?? 'Semua';
  const beritas = await getBerita(kategoriAktif);

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
            <Link href="/kontak" className="hover:text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h2 className="text-2xl font-bold">Berita & Pengumuman</h2>

          <div className="flex gap-2 flex-wrap">
            {KATEGORI_LIST.map((k) => (
              <Link
                key={k}
                href={k === 'Semua' ? '/berita' : `/berita?kategori=${encodeURIComponent(k)}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  kategoriAktif === k
                    ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                    : 'border-gray-200 text-gray-500 hover:border-blue-200'
                }`}
              >
                {k === 'Kegiatan Kelurahan' ? 'Kegiatan' : k === 'Pengumuman Resmi' ? 'Pengumuman' : k}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beritas.length > 0 ? (
            beritas.map((berita) => (
              <Link
                key={berita.id}
                href={`/berita/${berita.slug}`}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col hover:border-blue-300 transition"
              >
                {berita.gambar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={berita.gambar} alt={berita.judul} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-sm font-medium">Tanpa Foto</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full uppercase">
                      {berita.kategori}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(berita.tanggal_kejadian ?? berita.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2">{berita.judul}</h4>
                  <p className="text-gray-600 text-sm line-clamp-3">{berita.konten}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
              Belum ada berita untuk kategori ini.
            </div>
          )}
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