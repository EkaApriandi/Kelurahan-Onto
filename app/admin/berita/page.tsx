import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import DeleteBeritaButton from './DeleteBeritaButton';

export default async function AdminBeritaList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: beritas } = await supabase
    .from('berita')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminShell title="Kelola Berita & Pengumuman" userEmail={user?.email ?? ''}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Total: <span className="font-bold text-slate-900">{beritas?.length ?? 0}</span> artikel berita tersimpan
        </p>
        <Link
          href="/admin/berita/baru"
          className="bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-red-900 transition shadow-xs"
        >
          + Tambah Berita Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {beritas && beritas.length > 0 ? (
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-bold text-slate-700">Judul Berita</th>
                <th className="px-5 py-3.5 font-bold text-slate-700">Kategori</th>
                <th className="px-5 py-3.5 font-bold text-slate-700">Status Publikasi</th>
                <th className="px-5 py-3.5 font-bold text-slate-700 text-right">Aksi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {beritas.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-slate-900 font-bold max-w-xs truncate">
                    {b.judul}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{b.kategori}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${
                        b.status === 'publish'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {b.status === 'publish' ? 'Terbit Publik' : 'Draf Simpanan'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-3">
                    <Link
                      href={`/admin/berita/${b.id}/edit`}
                      className="text-red-800 hover:text-red-900 font-bold"
                    >
                      Sunting
                    </Link>
                    <DeleteBeritaButton id={b.id} judul={b.judul} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-slate-400 p-8 text-center">
            Belum ada berita tersimpan. Klik &quot;Tambah Berita Baru&quot; untuk membuat artikel.
          </p>
        )}
      </div>
    </AdminShell>
  );
}