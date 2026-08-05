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

      <ProfilForm
        initialData={
          profil ?? {
            id: 1,
            tahun_berdiri: '1997',
            visi: 'Mewujudkan Kelurahan Onto yang Maju, Sejahtera, Mandiri, Berbudaya, dan Pelayanan Publik Unggul.',
            misi: '1. Meningkatkan kualitas pelayanan publik berbasis digital yang cepat dan akuntabel.\n2. Memberdayakan ekonomi warga berbasis potensi lokal dan pertanian.\n3. Pembangunan sarana dan prasarana lingkungan kelurahan yang merata.\n4. Memperkuat nilai gotong royong dan ketenteraman warga.',
            sejarah: 'Kelurahan Onto merupakan salah satu wilayah kelurahan bersejarah di Kecamatan Bantaeng, Kabupaten Bantaeng, Sulawesi Selatan.',
            sambutan_lurah: 'Assalamu Alaikum Warahmatullahi Wabarakatuh.\nSelamat datang di portal resmi Kelurahan Onto. Kami siap memberikan pelayanan terbaik bagi seluruh warga.',
            luas_wilayah: '4,69 km²',
            topografi: 'Perbukitan dan lereng gunung yang landai',
            batas_utara: 'Desa Campaga',
            batas_selatan: 'Kelurahan Karatuang',
            batas_timur: 'Kelurahan Tappanjeng',
            batas_barat: 'Desa Ereng-Ereng',
          }
        }
      />
    </AdminShell>
  );
}
