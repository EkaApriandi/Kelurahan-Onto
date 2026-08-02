import { createClient } from '@/lib/supabase/server';
import AdminShell from '../../AdminShell';
import BeritaForm from '../BeritaForm';

export default async function TambahBerita() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminShell title="Tambah Berita" userEmail={user?.email ?? ''}>
      <BeritaForm />
    </AdminShell>
  );
}