import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

type StrukturItem = {
  jabatan: string;
  nama: string;
  foto_url?: string | null;
};

type PengurusWilayah = {
  nomor_rw: string;
  level: 'RW' | 'RT';
};

async function getBerita() {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

async function getProfilDesa() {
  const { data, error } = await supabase.from('profil_desa').select('*').limit(1).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data;
}

async function getStatistik() {
  const { data: rtRwData } = await supabase.from('rt_rw').select('jumlah_kk, jumlah_l, jumlah_p');
  const { data: pengurus } = await supabase
    .from('pengurus_wilayah')
    .select('nomor_rw, level');

  const penduduk =
    rtRwData?.reduce((sum, r) => sum + (r.jumlah_l ?? 0) + (r.jumlah_p ?? 0), 0) ?? 0;
  const kk = rtRwData?.reduce((sum, r) => sum + (r.jumlah_kk ?? 0), 0) ?? 0;

  const daftarRw = new Set((pengurus as PengurusWilayah[] | null)?.map((p) => p.nomor_rw));
  const jumlahRt = (pengurus as PengurusWilayah[] | null)?.filter((p) => p.level === 'RT').length ?? 0;

  return {
    penduduk,
    kk,
    rtRw: pengurus && pengurus.length > 0 ? `${daftarRw.size} RW / ${jumlahRt} RT` : '—',
  };
}

export default async function Beranda() {
  const [beritas, profil, statistikDasar] = await Promise.all([
    getBerita(),
    getProfilDesa(),
    getStatistik(),
  ]);

  const statistik = {
    ...statistikDasar,
    luas: profil?.luas_wilayah ?? '—',
  };

  const struktur: StrukturItem[] = profil?.struktur_organisasi ?? [];
  const lurah = struktur.find((s) => s.jabatan === 'Lurah');

  return (
    <main className="bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            Kelurahan Onto
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="text-blue-700">Beranda</Link>
            <Link href="/profil" className="hover:text-blue-700">Profil</Link>
            <Link href="/kependudukan" className="hover:text-blue-700">Data kependudukan</Link>
            <Link href="/layanan" className="hover:text-blue-700">Layanan</Link>
            <Link href="/kontak" className="hover:text-blue-700">Kontak</Link>
          </div>
        </div>
      </nav>

      {/* Hero dengan foto latar */}
      <div
        className="relative bg-blue-700 text-white py-24 text-center bg-cover bg-center"
        style={
          profil?.foto_kelurahan_url
            ? { backgroundImage: `url(${profil.foto_kelurahan_url})` }
            : undefined
        }
      >
        {profil?.foto_kelurahan_url && (
          <div className="absolute inset-0 bg-black/50" />
        )}
        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Selamat Datang di Kelurahan Onto Kecamatan Bantaeng Kabupaten Bantaeng
          </h2>
        </div>
      </div>

      {/* Sambutan Lurah — foto & teks proporsional dalam grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="md:col-span-1">
            {lurah?.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lurah.foto_url}
                alt={lurah.nama}
                className="w-full max-w-[220px] mx-auto md:mx-0 h-auto rounded-xl shadow-md"
              />
            ) : (
              <div className="w-full max-w-[220px] mx-auto md:mx-0 aspect-square rounded-xl bg-blue-100 flex items-center justify-center">
                <span className="text-5xl font-semibold text-blue-700">
                  {lurah?.nama?.charAt(0) ?? 'L'}
                </span>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xl font-bold mb-1">Sambutan Lurah Onto</h3>
            <p className="text-sm font-semibold text-gray-600 mb-4">
              {lurah?.nama ?? '—'}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify">
              {profil?.sambutan_lurah ?? (
                <span className="text-gray-400">Sambutan belum diisi.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">Statistik ringkas</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{statistik.penduduk.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500 mt-0.5">Penduduk</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{statistik.kk.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500 mt-0.5">Kepala keluarga</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{statistik.rtRw}</p>
            <p className="text-xs text-gray-500 mt-0.5">RT / RW</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-blue-700">{statistik.luas}</p>
            <p className="text-xs text-gray-500 mt-0.5">Luas wilayah</p>
          </div>
        </div>
      </div>

      {/* Berita Terkini */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold border-b-2 border-blue-500 pb-2 inline-block mb-6">
          Berita & Pengumuman Terkini
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beritas.length > 0 ? (
            beritas.map((berita) => (
              <div
                key={berita.id}
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col"
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
                  <div className="mb-2 flex items-center gap-2 flex-wrap">
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
                  <h4 className="text-base font-bold mb-2">{berita.judul}</h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{berita.konten}</p>

                  <div className="mt-auto flex justify-end">
                    <Link
                      href={`/berita/${berita.slug}`}
                      className="text-blue-600 font-semibold text-sm hover:underline"
                    >
                      Baca selengkapnya
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8 bg-white rounded-lg shadow-sm border border-gray-100">
              Belum ada berita yang dipublikasikan.
            </div>
          )}
        </div>
      </div>

      {/* Akses Cepat */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-4">Akses cepat</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/profil" className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:border-blue-300 transition">
            <p className="text-xl mb-1">🗺️</p>
            <p className="text-xs font-medium">Profil desa</p>
          </Link>
          <Link href="/kependudukan" className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:border-blue-300 transition">
            <p className="text-xl mb-1">📊</p>
            <p className="text-xs font-medium">Data penduduk</p>
          </Link>
          <Link href="/layanan" className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:border-blue-300 transition">
            <p className="text-xl mb-1">📄</p>
            <p className="text-xs font-medium">Syarat surat</p>
          </Link>
          <Link href="/kontak" className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center hover:border-blue-300 transition">
            <p className="text-xl mb-1">☎️</p>
            <p className="text-xs font-medium">Kontak</p>
          </Link>
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Sistem Informasi Kelurahan Onto. Dibuat oleh Mahasiswa
          KKN.
        </p>
      </footer>
    </main>
  );
}