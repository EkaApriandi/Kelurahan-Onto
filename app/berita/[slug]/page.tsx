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
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/berita"
            className="inline-flex items-center text-xs font-bold text-slate-300 hover:text-white bg-white/10 px-3 py-1 rounded-md transition mb-3"
          >
            Kembali ke Daftar Berita
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-800 px-2.5 py-0.5 rounded-md">
              {berita.kategori ?? 'Berita'}
            </span>
            <span className="text-xs text-slate-300">
              {new Date(berita.tanggal_kejadian ?? berita.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {berita.judul}
          </h1>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
          {berita.gambar && (
            <div className="rounded-lg overflow-hidden border border-slate-200 max-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-justify text-sm sm:text-base">
            {berita.konten}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Diterbitkan oleh Pemerintah Kelurahan Onto</span>
            <Link
              href="/berita"
              className="font-bold text-red-800 hover:underline"
            >
              Lihat Berita Lainnya
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}