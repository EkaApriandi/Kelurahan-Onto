import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import DemografiForm from './DemografiForm';

export const revalidate = 0;

export default async function AdminKependudukanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from('demografi')
    .select('*')
    .order('id', { ascending: true });

  return (
    <AdminShell title="Kelola Data Kependudukan & Demografi" userEmail={user?.email ?? ''}>
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Perbarui jumlah statistik matapencaharian, tingkat pendidikan, dan kelompok usia penduduk Kelurahan Onto.
        </p>
      </div>

      {items && items.length > 0 ? (
        <DemografiForm items={items} />
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-500">
          Data demografi kependudukan belum tersedia.
        </div>
      )}
    </AdminShell>
  );
}
