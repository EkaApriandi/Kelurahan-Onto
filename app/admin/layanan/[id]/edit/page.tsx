import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '../../../AdminShell';
import LayananForm from '../../LayananForm';

export default async function EditLayananPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: layanan } = await supabase
    .from('layanan')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (!layanan) {
    notFound();
  }

  return (
    <AdminShell title={`Sunting Layanan: ${layanan.nama_layanan}`} userEmail={user?.email ?? ''}>
      <LayananForm data={layanan} />
    </AdminShell>
  );
}
