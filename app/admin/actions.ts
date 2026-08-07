'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

async function getAdminSupabase() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    return createSupabaseClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return await createServerSupabase();
}

async function requireAuthUser() {
  const serverSupabase = await createServerSupabase();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }
  return user;
}

export async function loginAction(email: string, password: string) {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, message: error.message, code: error.code };
    }

    return { success: true, user: data.user };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal melakukan login.' };
  }
}

export async function logoutAction() {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal logout.' };
  }
}

export async function updatePasswordAction(newPassword: string) {
  try {
    const user = await requireAuthUser();

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const adminSupabase = await getAdminSupabase();
      const { error } = await adminSupabase.auth.admin.updateUserById(user.id, { password: newPassword });
      if (error) {
        console.error('Error update password (admin):', error);
        return { success: false, message: error.message };
      }
    } else {
      const serverSupabase = await createServerSupabase();
      const { error } = await serverSupabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('Error update password:', error);
        return { success: false, message: error.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal memperbarui kata sandi.' };
  }
}

export async function updateEmailAction(newEmail: string) {
  try {
    const user = await requireAuthUser();

    const cleanEmail = newEmail.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Alamat email tidak valid.' };
    }

    if (user.email && cleanEmail === user.email.toLowerCase().trim()) {
      return { success: false, message: 'Alamat email baru yang dimasukkan sudah merupakan email aktif Anda saat ini.' };
    }

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const adminSupabase = await getAdminSupabase();
      const { error } = await adminSupabase.auth.admin.updateUserById(user.id, {
        email: cleanEmail,
        email_confirm: true,
      });
      if (error) {
        console.error('Error update email (admin):', error);
        if (error.message.includes('invalid') || error.message.includes('already')) {
          return { success: false, message: `Email "${cleanEmail}" tidak dapat digunakan (sudah terdaftar atau merupakan email aktif Anda saat ini).` };
        }
        return { success: false, message: error.message };
      }
    } else {
      const serverSupabase = await createServerSupabase();
      const { error } = await serverSupabase.auth.updateUser({ email: cleanEmail });
      if (error) {
        console.error('Error update email:', error);
        if (error.message.includes('invalid') || error.message.includes('already')) {
          return { success: false, message: `Email "${cleanEmail}" tidak dapat digunakan (sudah terdaftar atau merupakan email aktif Anda saat ini).` };
        }
        return { success: false, message: error.message };
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal memperbarui alamat email.' };
  }
}

export async function simpanBeritaAction(payload: {
  id?: number;
  judul: string;
  slug: string;
  konten: string;
  kategori: string;
  status: string;
  gambar: string | null;
  tanggal_kejadian: string | null;
}) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    const dataInsert = {
      judul: payload.judul,
      slug: payload.slug,
      konten: payload.konten,
      kategori: payload.kategori,
      status: payload.status || 'publish',
      gambar: payload.gambar,
      tanggal_kejadian: payload.tanggal_kejadian || new Date().toISOString().slice(0, 10),
    };

    let error;
    if (payload.id && payload.id > 0) {
      const res = await supabase.from('berita').update(dataInsert).eq('id', payload.id);
      error = res.error;
    } else {
      const res = await supabase.from('berita').insert(dataInsert);
      error = res.error;
    }

    if (error) {
      console.error('Error simpan berita:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/berita');
    revalidatePath('/admin/berita');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menyimpan berita.' };
  }
}

export async function hapusBeritaAction(id: number) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('berita').delete().eq('id', id);

    if (error) {
      console.error('Error hapus berita:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/berita');
    revalidatePath('/admin/berita');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menghapus berita.' };
  }
}

export async function kirimPengaduanAction(payload: {
  nama: string;
  kontak: string;
  kategori: string;
  isi: string;
}) {
  try {
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('pengaduan').insert({
      nama: payload.nama,
      kontak: payload.kontak,
      kategori: payload.kategori,
      isi: payload.isi,
      status: 'baru',
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error kirim pengaduan:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/pengaduan');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal mengirim pengaduan.' };
  }
}

export async function updateStatusPengaduanAction(id: number, status: string) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('pengaduan').update({ status }).eq('id', id);

    if (error) {
      console.error('Error update status pengaduan:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/pengaduan');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal memperbarui status pengaduan.' };
  }
}

export async function hapusPengaduanAction(id: number) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('pengaduan').delete().eq('id', id);

    if (error) {
      console.error('Error hapus pengaduan:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/admin/pengaduan');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menghapus pengaduan.' };
  }
}

export async function simpanProfilAction(payload: {
  id: number;
  tahun_berdiri: string;
  visi: string;
  misi: string;
  sejarah: string;
  sambutan_lurah: string;
  luas_wilayah: string;
  topografi: string;
  batas_utara: string;
  batas_selatan: string;
  batas_timur: string;
  batas_barat: string;
  foto_kelurahan_url?: string | null;
}) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    const { data: existing } = await supabase.from('profil_desa').select('id').limit(1).maybeSingle();
    const idToUse = existing?.id ?? payload.id ?? 1;

    const updatePayload = {
      tahun_berdiri: payload.tahun_berdiri,
      visi: payload.visi,
      misi: payload.misi,
      sejarah: payload.sejarah,
      sambutan_lurah: payload.sambutan_lurah,
      luas_wilayah: payload.luas_wilayah,
      topografi: payload.topografi,
      batas_utara: payload.batas_utara,
      batas_selatan: payload.batas_selatan,
      batas_timur: payload.batas_timur,
      batas_barat: payload.batas_barat,
      foto_kelurahan_url: payload.foto_kelurahan_url ?? null,
      updated_at: new Date().toISOString(),
    };

    let error;
    let count: number | null = null;
    if (existing) {
      const res = await supabase.from('profil_desa').update(updatePayload, { count: 'exact' }).eq('id', idToUse);
      error = res.error;
      count = res.count;
    } else {
      const res = await supabase.from('profil_desa').insert(updatePayload, { count: 'exact' });
      error = res.error;
      count = res.count;
    }

    if (error) {
      console.error('Error simpan profil:', error);
      return { success: false, message: error.message };
    }

    if (count === 0) {
      console.error('Error simpan profil: 0 baris diperbarui.');
      return {
        success: false,
        message: 'Database tidak memperbarui baris (0 rows updated). Mohon pastikan SUPABASE_SERVICE_ROLE_KEY sudah ditambahkan pada file .env.local atau RLS policy pada tabel profil_desa di Supabase mengizinkan UPDATE.',
      };
    }

    revalidatePath('/profil', 'page');
    revalidatePath('/admin/profil', 'page');
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menyimpan profil kelurahan.' };
  }
}

export async function simpanLayananAction(payload: {
  id?: number;
  nama_layanan: string;
  syarat: string;
  estimasi_waktu: string;
  biaya: string;
  alur: string;
}) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    const dataInsert = {
      nama_layanan: payload.nama_layanan,
      syarat: payload.syarat,
      estimasi_waktu: payload.estimasi_waktu || 'Menyesuaikan jam pelayanan kantor kelurahan',
      biaya: payload.biaya || 'Gratis',
      alur: payload.alur || '1. Warga datang ke Kantor Kelurahan membawa berkas persyaratan.\n2. Berkas diperiksa petugas.\n3. Surat diproses dan disahkan oleh Lurah.',
    };

    let error;
    if (payload.id && payload.id > 0) {
      const res = await supabase.from('layanan').update(dataInsert).eq('id', payload.id);
      error = res.error;
    } else {
      const res = await supabase.from('layanan').insert(dataInsert);
      error = res.error;
    }

    if (error) {
      console.error('Error simpan layanan:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/layanan');
    revalidatePath('/admin/layanan');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menyimpan layanan.' };
  }
}

export async function hapusLayananAction(id: number) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('layanan').delete().eq('id', id);

    if (error) {
      console.error('Error hapus layanan:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/layanan');
    revalidatePath('/admin/layanan');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menghapus layanan.' };
  }
}

export async function updateDemografiAction(updates: Array<{ id: number; jumlah: number; kategori?: string; label?: string }>) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    for (const item of updates) {
      const payloadData: Record<string, unknown> = { jumlah: Number(item.jumlah) || 0 };
      if (item.kategori) payloadData.kategori = item.kategori;
      if (item.label) payloadData.label = item.label;

      let error;
      if (item.id && item.id > 0) {
        const res = await supabase.from('demografi').update(payloadData).eq('id', item.id);
        error = res.error;
      } else {
        const res = await supabase.from('demografi').insert(payloadData);
        error = res.error;
      }

      if (error) {
        console.error('Error update demografi:', error);
        return { success: false, message: error.message };
      }
    }

    revalidatePath('/kependudukan');
    revalidatePath('/admin/kependudukan');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal memperbarui data demografi.' };
  }
}

export async function updateRtRwAction(updates: Array<{ id?: number; nomor_rw: string; nomor_rt: string; jumlah_kk: number; jumlah_l: number; jumlah_p: number }>) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    for (const item of updates) {
      const payloadData = {
        nomor_rw: item.nomor_rw || '01',
        nomor_rt: item.nomor_rt || '01',
        jumlah_kk: Number(item.jumlah_kk) || 0,
        jumlah_l: Number(item.jumlah_l) || 0,
        jumlah_p: Number(item.jumlah_p) || 0,
      };

      let error;
      if (item.id && item.id > 0) {
        const res = await supabase.from('rt_rw').update(payloadData).eq('id', item.id);
        error = res.error;
      } else {
        const res = await supabase.from('rt_rw').insert(payloadData);
        error = res.error;
      }

      if (error) {
        console.error('Error update rt_rw:', error);
        return { success: false, message: error.message };
      }
    }

    revalidatePath('/kependudukan');
    revalidatePath('/admin/kependudukan');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal memperbarui data RT/RW.' };
  }
}

export async function hapusRtRwAction(id: number) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('rt_rw').delete().eq('id', id);

    if (error) {
      console.error('Error hapus rt_rw:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/kependudukan');
    revalidatePath('/admin/kependudukan');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menghapus data RT/RW.' };
  }
}

export async function simpanStrukturPegawaiAction(payload: {
  id: number;
  struktur: Array<{
    jabatan: string;
    nama: string;
    nip?: string;
    foto_url?: string | null;
  }>;
  strukturLengkap?: Array<{
    seksi: string;
    staf_pns: Array<{ nama: string; nip: string; foto_url?: string | null }>;
    staf_pppk: Array<{ nama: string; nip: string; foto_url?: string | null }>;
  }>;
}) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    const updateData: Record<string, unknown> = {
      struktur_organisasi: payload.struktur,
      updated_at: new Date().toISOString(),
    };

    if (payload.strukturLengkap) {
      updateData.struktur_lengkap = payload.strukturLengkap;
    }

    const idToUse = payload.id || 1;

    const { data: existing } = await supabase.from('profil_desa').select('id').eq('id', idToUse).maybeSingle();

    let error;
    if (existing) {
      const res = await supabase.from('profil_desa').update(updateData).eq('id', idToUse);
      error = res.error;
    } else {
      const res = await supabase.from('profil_desa').insert({
        id: idToUse,
        tahun_berdiri: '1997',
        visi: 'Mewujudkan Kelurahan Onto yang Maju, Sejahtera, Mandiri, Berbudaya, dan Pelayanan Publik Unggul.',
        misi: 'Meningkatkan kualitas pelayanan publik berbasis digital yang cepat dan akuntabel.',
        sejarah: 'Kelurahan Onto merupakan salah satu wilayah kelurahan di Kecamatan Bantaeng.',
        sambutan_lurah: 'Assalamu Alaikum Warahmatullahi Wabarakatuh.',
        luas_wilayah: '4,69 km²',
        topografi: 'Perbukitan dan lereng gunung yang landai',
        batas_utara: 'Desa Campaga',
        batas_selatan: 'Kelurahan Karatuang',
        batas_timur: 'Kelurahan Tappanjeng',
        batas_barat: 'Desa Ereng-Ereng',
        ...updateData,
      });
      error = res.error;
    }

    if (error) {
      console.error('Error simpan struktur pegawai:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/profil');
    revalidatePath('/admin/pegawai');
    revalidatePath('/admin/profil');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menyimpan struktur pegawai.' };
  }
}

export async function simpanPengurusWilayahAction(payload: {
  id?: number;
  level: 'RW' | 'RT';
  nomor_rw: string;
  nomor_rt?: string | null;
  nama: string;
  alamat_wilayah?: string | null;
}) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();

    const dataInsert = {
      level: payload.level,
      nomor_rw: payload.nomor_rw,
      nomor_rt: payload.nomor_rt || null,
      nama: payload.nama,
      alamat_wilayah: payload.alamat_wilayah || null,
    };

    let error;
    if (payload.id && payload.id > 0) {
      const res = await supabase.from('pengurus_wilayah').update(dataInsert).eq('id', payload.id);
      error = res.error;
    } else {
      const res = await supabase.from('pengurus_wilayah').insert(dataInsert);
      error = res.error;
    }

    if (error) {
      console.error('Error simpan pengurus wilayah:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/profil');
    revalidatePath('/admin/pegawai');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menyimpan pengurus wilayah.' };
  }
}

export async function hapusPengurusWilayahAction(id: number) {
  try {
    await requireAuthUser();
    const supabase = await getAdminSupabase();
    const { error } = await supabase.from('pengurus_wilayah').delete().eq('id', id);

    if (error) {
      console.error('Error hapus pengurus wilayah:', error);
      return { success: false, message: error.message };
    }

    revalidatePath('/profil');
    revalidatePath('/admin/pegawai');
    revalidatePath('/');

    return { success: true };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Gagal menghapus pengurus wilayah.' };
  }
}
