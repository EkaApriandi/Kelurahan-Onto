import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import PegawaiManager from './PegawaiManager';

export const revalidate = 0;

export default async function AdminPegawaiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [resProfil, resPengurus] = await Promise.all([
    supabase
      .from('profil_desa')
      .select('id, struktur_organisasi, struktur_lengkap')
      .limit(1)
      .single(),
    supabase
      .from('pengurus_wilayah')
      .select('*')
      .order('urutan'),
  ]);

  const profil = resProfil.data;
  const pengurus = resPengurus.data ?? [];

  return (
    <AdminShell title="Kelola Struktur Pejabat, Pegawai & RW/RT" userEmail={user?.email ?? ''}>
      {profil ? (
        <PegawaiManager
          profilId={profil.id}
          initialStruktur={profil.struktur_organisasi ?? []}
          initialStrukturLengkap={profil.struktur_lengkap ?? []}
          initialPengurus={pengurus}
        />
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-500">
          Data profil kelurahan tidak ditemukan.
        </div>
      )}
    </AdminShell>
  );
}
