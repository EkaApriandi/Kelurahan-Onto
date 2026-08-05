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
      .order('nomor_rw'),
  ]);

  const profil = resProfil.data;
  const pengurus = resPengurus.data ?? [];

  return (
    <AdminShell title="Kelola Struktur Pejabat, Pegawai & RW/RT" userEmail={user?.email ?? ''}>
      <PegawaiManager
        profilId={profil?.id ?? 1}
        initialStruktur={profil?.struktur_organisasi ?? []}
        initialStrukturLengkap={profil?.struktur_lengkap ?? []}
        initialPengurus={pengurus}
      />
    </AdminShell>
  );
}
