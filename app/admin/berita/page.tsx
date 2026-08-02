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
    <AdminShell title="Berita & Pengumuman" userEmail={user?.email ?? ''}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {beritas?.length ?? 0} berita tersimpan
        </p>
        <Link
          href="/admin/berita/baru"
          className="bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition"
        >
          + Tambah Berita
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {beritas && beritas.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Judul</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Kategori</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {beritas.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-gray-900 font-medium max-w-xs truncate">
                    {b.judul}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{b.kategori}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        b.status === 'publish'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {b.status === 'publish' ? 'Terbit' : 'Draf'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/berita/${b.id}/edit`}
                      className="text-blue-600 hover:underline font-medium text-xs mr-4"
                    >
                      Edit
                    </Link>
                    <DeleteBeritaButton id={b.id} judul={b.judul} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400 p-8 text-center">
            Belum ada berita. Klik &quot;Tambah Berita&quot; untuk mulai menulis.
          </p>
        )}
      </div>
    </AdminShell>
  );
}