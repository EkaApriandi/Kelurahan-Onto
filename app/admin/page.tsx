import { createClient } from '@/lib/supabase/server';
import AdminShell from './AdminShell';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: jumlahBerita } = await supabase
    .from('berita')
    .select('*', { count: 'exact', head: true });

  const { count: jumlahPengaduanBaru } = await supabase
    .from('pengaduan')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'baru');

  const { count: jumlahPengaduanTotal } = await supabase
    .from('pengaduan')
    .select('*', { count: 'exact', head: true });

  return (
    <AdminShell title="Dashboard" userEmail={user?.email ?? ''}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Berita</p>
          <p className="text-3xl font-bold text-gray-900">{jumlahBerita ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Pengaduan Baru</p>
          <p className="text-3xl font-bold text-orange-600">{jumlahPengaduanBaru ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Belum ditindaklanjuti</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Pengaduan</p>
          <p className="text-3xl font-bold text-gray-900">{jumlahPengaduanTotal ?? 0}</p>
        </div>
      </div>

      <h2 className="text-base font-bold text-gray-900 mb-4">Menu Cepat</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/admin/berita"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition"
        >
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-xl mb-3">
            📰
          </div>
          <p className="text-base font-semibold text-gray-900">Kelola Berita & Pengumuman</p>
          <p className="text-sm text-gray-500 mt-1">Tambah, edit, atau hapus berita</p>
        </Link>
        <Link
          href="/admin/pengaduan"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition"
        >
          <div className="w-11 h-11 rounded-lg bg-orange-50 flex items-center justify-center text-xl mb-3">
            📮
          </div>
          <p className="text-base font-semibold text-gray-900">Kelola Pengaduan</p>
          <p className="text-sm text-gray-500 mt-1">Lihat & tanggapi pengaduan warga</p>
        </Link>
      </div>
    </AdminShell>
  );
}