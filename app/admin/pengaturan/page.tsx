import { createClient } from '@/lib/supabase/server';
import AdminShell from '../AdminShell';
import PengaturanForm from './PengaturanForm';

export const revalidate = 0;

export default async function AdminPengaturanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminShell title="Pengaturan Akun Pengurus" userEmail={user?.email ?? ''}>
      <div className="mb-6">
        <h1 className="text-lg font-extrabold text-slate-900">Pengaturan Kredensial Akun</h1>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Kelola email login dan kata sandi pengurus resmi Kelurahan Onto secara langsung dan aman.
        </p>
      </div>

      <PengaturanForm currentEmail={user?.email ?? ''} />
    </AdminShell>
  );
}
