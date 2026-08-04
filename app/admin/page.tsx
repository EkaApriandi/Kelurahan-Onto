import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AdminShell from './AdminShell';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [beritaRes, pengaduanBaruRes, totalPengaduanRes, layananRes] = await Promise.all([
    supabase.from('berita').select('id', { count: 'exact' }),
    supabase.from('pengaduan').select('id', { count: 'exact' }).eq('status', 'baru'),
    supabase.from('pengaduan').select('id', { count: 'exact' }),
    supabase.from('layanan').select('id', { count: 'exact' }),
  ]);

  const stats = [
    { label: 'Total Berita Published', count: beritaRes.count ?? 0, ikon: '📰', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { label: 'Pengaduan Baru', count: pengaduanBaruRes.count ?? 0, ikon: '📩', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Total Pengaduan', count: totalPengaduanRes.count ?? 0, ikon: '📮', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { label: 'Layanan Terdaftar', count: layananRes.count ?? 0, ikon: '📄', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  ];

  return (
    <AdminShell title="Ringkasan Dashboard Admin" userEmail={user?.email ?? ''}>
      {/* KARTU STATISTIK UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`p-5 rounded-xl border ${s.color} shadow-2xs`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{s.label}</span>
              <span className="text-xl">{s.ikon}</span>
            </div>
            <span className="text-2xl font-black">{s.count}</span>
          </div>
        ))}
      </div>

      {/* TAUTAN CEPAT PENGELOLAAN WEBSITE */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
          ⚡ Menu Kelola Cepat Website
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/profil"
            className="group p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition">
              Kelola Profil Kelurahan
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Sunting Visi, Misi, Sejarah, Sambutan Lurah, & batas geografis wilayah.
            </p>
          </Link>

          <Link
            href="/admin/layanan"
            className="group p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">📄</div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition">
              Kelola Layanan Surat
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Tambah & sunting jenis layanan surat administrasi serta persyaratannya.
            </p>
          </Link>

          <Link
            href="/admin/kependudukan"
            className="group p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition">
              Kelola Data Kependudukan
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Perbarui statistik demografi pekerjaan, pendidikan, dan kelompok usia.
            </p>
          </Link>

          <Link
            href="/admin/berita/baru"
            className="group p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition">
              Terbitkan Berita Baru
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Buat dan terbitkan artikel berita atau pengumuman resmi kelurahan.
            </p>
          </Link>

          <Link
            href="/admin/pengaduan"
            className="group p-4 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-xs transition bg-slate-50/50 hover:bg-white"
          >
            <div className="text-2xl mb-2">📮</div>
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-800 transition">
              Tanggapi Pengaduan Warga
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Lihat laporan pengaduan masuk, ubah status, atau hapus pesan spam.
            </p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}