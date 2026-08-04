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
    .limit(6);

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

  const teksSambutan: string =
    profil?.sambutan_lurah ??
    'Assalamu Alaikum Warahmatullahi Wabarakatuh.\nSelamat datang di website resmi Kelurahan Onto. Kami berkomitmen untuk meningkatkan kualitas pelayanan publik secara transparan, akuntabel, dan berbasis digital demi kemudahan seluruh warga masyarakat Kelurahan Onto.';

  const paragrafSambutan = teksSambutan
    .split('\n')
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  return (
    <main className="bg-slate-50 text-slate-800">
      {/* Hero Banner dengan Gambar Kantor Kelurahan & Teks Terpusat */}
      <section
        className="relative bg-slate-900 text-white py-16 lg:py-24 bg-cover bg-center"
        style={
          profil?.foto_kelurahan_url
            ? { backgroundImage: `url(${profil.foto_kelurahan_url})` }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 bg-white/10 border border-white/20 text-slate-200 text-xs font-medium rounded-full mb-3 backdrop-blur-xs">
            Portal Resmi Pemerintah Kelurahan Onto
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Selamat Datang di Kelurahan Onto
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto mb-6">
            Kecamatan Bantaeng, Kabupaten Bantaeng. Pusat informasi publik, data kependudukan, serta pelayanan administrasi warga secara transparan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/layanan"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition"
            >
              Lihat Layanan Surat
            </Link>
            <Link
              href="/kontak"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-red-800 hover:bg-red-900 rounded-lg transition shadow-sm"
            >
              Ajukan Pengaduan
            </Link>
          </div>
        </div>
      </section>

      {/* Akses Cepat Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/layanan"
            className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-red-400 transition group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-800 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-red-800 group-hover:text-white transition-colors">
              📄
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition-colors">Layanan Administrasi</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Syarat & pengurusan surat keterangan warga</p>
            </div>
          </Link>

          <Link
            href="/kependudukan"
            className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-red-400 transition group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-800 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-red-800 group-hover:text-white transition-colors">
              📊
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition-colors">Data Kependudukan</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Statistik jumlah jiwa, usia & pekerjaan</p>
            </div>
          </Link>

          <Link
            href="/profil"
            className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-red-400 transition group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-800 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-red-800 group-hover:text-white transition-colors">
              🏛️
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition-colors">Profil Kelurahan</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Visi, Misi, Sejarah & Perangkat Kelurahan</p>
            </div>
          </Link>

          <Link
            href="/kontak"
            className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 hover:border-red-400 transition group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-800 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-red-800 group-hover:text-white transition-colors">
              📢
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition-colors">Pengaduan Warga</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Layanan aspirasi & pengaduan online</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Sambutan Lurah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Foto Lurah */}
            <div className="md:col-span-4 text-center">
              <div className="overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shadow-xs max-w-[220px] mx-auto">
                {lurah?.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lurah.foto_url}
                    alt={lurah.nama}
                    className="w-full h-60 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-60 bg-slate-100 flex flex-col items-center justify-center p-4 text-slate-500">
                    <svg className="w-14 h-14 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-semibold">{lurah?.nama ?? 'Lurah Onto'}</span>
                  </div>
                )}
              </div>
              <div className="mt-2.5">
                <h4 className="text-sm font-bold text-slate-900">{lurah?.nama ?? 'Lurah Onto'}</h4>
                <p className="text-xs text-red-800 font-semibold mt-0.5">Lurah Onto</p>
              </div>
            </div>

            {/* Teks Sambutan Kerapian Rapi */}
            <div className="md:col-span-8 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Sambutan Pimpinan</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Sambutan Kepala Kelurahan Onto
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify space-y-2 pt-1">
                {paragrafSambutan.map((paragraf: string, idx: number) => (
                  <p key={idx}>{paragraf}</p>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/profil"
                  className="inline-flex items-center text-xs font-bold text-red-800 hover:text-red-900"
                >
                  Selengkapnya Tentang Kelurahan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Ringkas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Statistik Wilayah</span>
          <h2 className="text-lg font-bold text-slate-900">Data Ringkas Kelurahan</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 text-center">
            <p className="text-xl font-extrabold text-red-800">
              {statistik.penduduk.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Total Penduduk (Jiwa)</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 text-center">
            <p className="text-xl font-extrabold text-red-800">
              {statistik.kk.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kepala Keluarga (KK)</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 text-center">
            <p className="text-lg font-extrabold text-red-800 py-0.5">
              {statistik.rtRw}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Wilayah RT / RW</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 text-center">
            <p className="text-lg font-extrabold text-red-800 py-0.5">
              {statistik.luas}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Luas Wilayah</p>
          </div>
        </div>
      </section>

      {/* Berita Terkini */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 mb-10">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 block">Informasi Publik</span>
            <h2 className="text-lg font-bold text-slate-900">Berita & Pengumuman Terkini</h2>
          </div>
          <Link
            href="/berita"
            className="text-xs font-bold text-red-800 hover:text-red-900"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {beritas.length > 0 ? (
            beritas.map((berita) => (
              <article
                key={berita.id}
                className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col hover:border-red-300 transition group"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {berita.gambar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={berita.gambar}
                      alt={berita.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs font-medium">
                      Kelurahan Onto
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-800 px-2 py-0.5 rounded-md">
                      {berita.kategori ?? 'Berita'}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-[11px] text-slate-400 font-medium mb-1 block">
                    {new Date(berita.tanggal_kejadian ?? berita.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-800 transition-colors line-clamp-2 mb-1.5">
                    {berita.judul}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                    {berita.konten}
                  </p>

                  <div className="mt-auto pt-2.5 border-t border-slate-100 text-right">
                    <Link
                      href={`/berita/${berita.slug}`}
                      className="text-xs font-bold text-red-800 hover:text-red-900"
                    >
                      Baca Selengkapnya
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-8 bg-white rounded-xl border border-slate-200 text-xs">
              Belum ada berita yang dipublikasikan.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}