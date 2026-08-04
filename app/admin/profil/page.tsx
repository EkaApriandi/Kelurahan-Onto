import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import ProfilForm from './ProfilForm';

export const revalidate = 0;

export default async function AdminProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profil } = await supabase
    .from('profil_desa')
    .select('*')
    .limit(1)
    .single();

  return (
    <AdminShell title="Kelola Profil Kelurahan" userEmail={user?.email ?? ''}>
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Sunting Visi, Misi, Sejarah, Sambutan Lurah, serta data geografis wilayah Kelurahan Onto.
        </p>
      </div>

      {profil ? (
        <ProfilForm initialData={profil} />
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-500">
          Data profil kelurahan tidak ditemukan.
        </div>
      )}
    </AdminShell>
  );
}
