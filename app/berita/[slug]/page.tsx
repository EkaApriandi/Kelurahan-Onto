import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

async function getBeritaBySlug(slug: string) {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single();

  if (error || !data) return null;
  return data;
}

export default async function BeritaDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/berita" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          Kembali ke daftar berita
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full uppercase">
            {berita.kategori}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(berita.tanggal_kejadian ?? berita.created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{berita.judul}</h1>

        {berita.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={berita.gambar}
            alt={berita.judul}
            className="w-full h-auto rounded-lg mb-6 object-cover"
          />
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">{berita.konten}</p>
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