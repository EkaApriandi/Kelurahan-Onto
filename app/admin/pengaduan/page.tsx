import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import StatusPengaduan from './StatusPengaduan';
import DeletePengaduanButton from './DeletePengaduanButton';
import CetakRekapButton from './CetakRekapButton';

export const revalidate = 0;

export default async function AdminPengaduan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pengaduans } = await supabase
    .from('pengaduan')
    .select('*')
    .order('created_at', { ascending: false });

  const dataList = pengaduans ?? [];

  return (
    <AdminShell title="Kelola Pengaduan Masyarakat" userEmail={user?.email ?? ''}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Total: <span className="font-bold text-slate-900">{dataList.length}</span> laporan pengaduan masuk
        </p>

        <CetakRekapButton data={dataList} />
      </div>

      <div className="flex flex-col gap-4">
        {pengaduans && pengaduans.length > 0 ? (
          pengaduans.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{p.nama}</h3>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-0.5">
                    <span>📞 {p.kontak}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      📅 {new Date(p.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2.5 py-1.5 rounded-md border border-red-100">
                    {p.kategori ?? 'Umum'}
                  </span>
                  <StatusPengaduan id={p.id} statusAwal={p.status} />
                  <DeletePengaduanButton id={p.id} nama={p.nama} />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {p.isi}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 text-center">
            <p className="text-xs text-slate-400">Belum ada pengaduan masyarakat yang masuk.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}