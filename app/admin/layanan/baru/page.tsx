import { createClient } from '@/lib/supabase/server';
import AdminShell from '../../AdminShell';
import LayananForm from '../LayananForm';

export default async function TambahLayananPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminShell title="Tambah Jenis Layanan Baru" userEmail={user?.email ?? ''}>
      <LayananForm />
    </AdminShell>
  );
}
