import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '../../../AdminShell';
import BeritaForm from '../../BeritaForm';

export default async function EditBerita({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: berita } = await supabase.from('berita').select('*').eq('id', id).single();

  if (!berita) notFound();

  return (
    <AdminShell title="Edit Berita" userEmail={user?.email ?? ''}>
      <BeritaForm data={berita} />
    </AdminShell>
  );
}