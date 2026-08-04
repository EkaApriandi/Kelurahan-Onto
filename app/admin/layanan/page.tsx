import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import DeleteLayananButton from './DeleteLayananButton';

export const revalidate = 0;

export default async function AdminLayananPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: layanans } = await supabase
    .from('layanan')
    .select('*')
    .order('id', { ascending: true });

  return (
    <AdminShell title="Kelola Layanan Surat & Dokumen" userEmail={user?.email ?? ''}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Total: <span className="font-bold text-slate-900">{layanans?.length ?? 0}</span> jenis layanan administrasi terdaftar
        </p>
        <Link
          href="/admin/layanan/baru"
          className="inline-flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Tambah Jenis Layanan Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th className="px-4 py-3.5">Nama Layanan</th>
                <th className="px-4 py-3.5">Persyaratan Dokumen</th>
                <th className="px-4 py-3.5 w-28">Biaya</th>
                <th className="px-4 py-3.5 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {layanans && layanans.length > 0 ? (
                layanans.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900">{l.nama_layanan}</td>
                    <td className="px-4 py-3.5 text-slate-600 line-clamp-2 max-w-xs">{l.syarat}</td>
                    <td className="px-4 py-3.5 font-bold text-emerald-700">{l.biaya ?? 'Gratis'}</td>
                    <td className="px-4 py-3.5 text-right space-x-3">
                      <Link
                        href={`/admin/layanan/${l.id}/edit`}
                        className="font-bold text-red-800 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteLayananButton id={l.id} nama={l.nama_layanan} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Belum ada jenis layanan surat yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
