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

  const defaultItems = [
    { id: 1, kategori: 'pekerjaan', label: 'Petani / Pekebun', jumlah: 0 },
    { id: 2, kategori: 'pekerjaan', label: 'PNS / TNI / Polri', jumlah: 0 },
    { id: 3, kategori: 'pekerjaan', label: 'Wiraswasta / Pedagang', jumlah: 0 },
    { id: 4, kategori: 'pekerjaan', label: 'Buruh Harian Lepas', jumlah: 0 },
    { id: 5, kategori: 'pekerjaan', label: 'Karyawan Swasta', jumlah: 0 },
    { id: 6, kategori: 'pekerjaan', label: 'Belum / Tidak Bekerja', jumlah: 0 },

    { id: 7, kategori: 'pendidikan', label: 'SD / Sederajat', jumlah: 0 },
    { id: 8, kategori: 'pendidikan', label: 'SMP / Sederajat', jumlah: 0 },
    { id: 9, kategori: 'pendidikan', label: 'SMA / SMK / Sederajat', jumlah: 0 },
    { id: 10, kategori: 'pendidikan', label: 'Diploma / Sarjana (D3/S1/S2)', jumlah: 0 },
    { id: 11, kategori: 'pendidikan', label: 'Tidak / Belum Sekolah', jumlah: 0 },

    { id: 12, kategori: 'usia', label: '0 – 14 Tahun (Anak-Anak)', jumlah: 0 },
    { id: 13, kategori: 'usia', label: '15 – 64 Tahun (Usia Produktif)', jumlah: 0 },
    { id: 14, kategori: 'usia', label: '65+ Tahun (Lanjut Usia)', jumlah: 0 },
  ];

  return (
    <AdminShell title="Kelola Data Kependudukan & Demografi" userEmail={user?.email ?? ''}>
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500">
          Perbarui jumlah statistik matapencaharian, tingkat pendidikan, dan kelompok usia penduduk Kelurahan Onto.
        </p>
      </div>

      <DemografiForm items={items && items.length > 0 ? items : defaultItems} />
    </AdminShell>
  );
}
