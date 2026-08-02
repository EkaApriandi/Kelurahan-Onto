import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import StatusPengaduan from './StatusPengaduan';

export default async function AdminPengaduan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pengaduans } = await supabase
    .from('pengaduan')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminShell title="Pengaduan Warga" userEmail={user?.email ?? ''}>
      <p className="text-sm text-gray-500 mb-6">
        {pengaduans?.length ?? 0} pengaduan masuk
      </p>

      <div className="flex flex-col gap-4">
        {pengaduans && pengaduans.length > 0 ? (
          pengaduans.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.nama}</p>
                  <p className="text-xs text-gray-500">{p.kontak}</p>
                </div>
                <StatusPengaduan id={p.id} statusAwal={p.status} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  {p.kategori}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(p.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{p.isi}</p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-400">Belum ada pengaduan masuk.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}