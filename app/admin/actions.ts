'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';

export async function loginAction(email: string, password: string) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message, code: error.code };
  }

  return { success: true, user: data.user };
}

export async function logoutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return { success: true };
}

export async function updatePasswordAction(newPassword: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Kata sandi baru minimal harus 6 karakter.' };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error('Error update password:', error);
    return { success: false, message: error.message };
  }

  return { success: true };
}

export async function updateEmailAction(newEmail: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Sesi Anda telah berakhir. Silakan login kembali.' };
  }

  if (!newEmail || !newEmail.includes('@')) {
    return { success: false, message: 'Alamat email tidak valid.' };
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    console.error('Error update email:', error);
    return { success: false, message: error.message };
  }

  return { success: true };
}

async function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, key);
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
  if (payload.id) {
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
}

export async function hapusBeritaAction(id: number) {
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
}

export async function updateStatusPengaduanAction(id: number, status: string) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('pengaduan').update({ status }).eq('id', id);

  if (error) {
    console.error('Error update status pengaduan:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/pengaduan');
  revalidatePath('/admin');
  return { success: true };
}

export async function hapusPengaduanAction(id: number) {
  const supabase = await getAdminSupabase();
  const { error } = await supabase.from('pengaduan').delete().eq('id', id);

  if (error) {
    console.error('Error hapus pengaduan:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/pengaduan');
  revalidatePath('/admin');
  return { success: true };
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
  const supabase = await getAdminSupabase();

  const { error } = await supabase
    .from('profil_desa')
    .update({
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
    })
    .eq('id', payload.id);

  if (error) {
    console.error('Error simpan profil:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/profil');
  revalidatePath('/admin/profil');
  revalidatePath('/');

  return { success: true };
}

export async function simpanLayananAction(payload: {
  id?: number;
  nama_layanan: string;
  syarat: string;
  estimasi_waktu: string;
  biaya: string;
  alur: string;
}) {
  const supabase = await getAdminSupabase();

  const dataInsert = {
    nama_layanan: payload.nama_layanan,
    syarat: payload.syarat,
    estimasi_waktu: payload.estimasi_waktu || 'Menyesuaikan jam pelayanan kantor kelurahan',
    biaya: payload.biaya || 'Gratis',
    alur: payload.alur || '1. Warga datang ke Kantor Kelurahan membawa berkas persyaratan.\n2. Berkas diperiksa petugas.\n3. Surat diproses dan disahkan oleh Lurah.',
  };

  let error;
  if (payload.id) {
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
}

export async function hapusLayananAction(id: number) {
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
}

export async function updateDemografiAction(updates: Array<{ id: number; jumlah: number }>) {
  const supabase = await getAdminSupabase();

  for (const item of updates) {
    const { error } = await supabase
      .from('demografi')
      .update({ jumlah: item.jumlah })
      .eq('id', item.id);

    if (error) {
      console.error('Error update demografi:', error);
      return { success: false, message: error.message };
    }
  }

  revalidatePath('/kependudukan');
  revalidatePath('/admin/kependudukan');
  revalidatePath('/');

  return { success: true };
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
  const supabase = await getAdminSupabase();

  const updateData: Record<string, unknown> = {
    struktur_organisasi: payload.struktur,
    updated_at: new Date().toISOString(),
  };

  if (payload.strukturLengkap) {
    updateData.struktur_lengkap = payload.strukturLengkap;
  }

  const { error } = await supabase
    .from('profil_desa')
    .update(updateData)
    .eq('id', payload.id);

  if (error) {
    console.error('Error simpan struktur pegawai:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/profil');
  revalidatePath('/admin/pegawai');
  revalidatePath('/admin/profil');
  revalidatePath('/');

  return { success: true };
}

export async function simpanPengurusWilayahAction(payload: {
  id?: number;
  level: 'RW' | 'RT';
  nomor_rw: string;
  nomor_rt?: string | null;
  nama: string;
  alamat_wilayah?: string | null;
}) {
  const supabase = await getAdminSupabase();

  const dataInsert = {
    level: payload.level,
    nomor_rw: payload.nomor_rw,
    nomor_rt: payload.nomor_rt || null,
    nama: payload.nama,
    alamat_wilayah: payload.alamat_wilayah || null,
  };

  let error;
  if (payload.id) {
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
}

export async function hapusPengurusWilayahAction(id: number) {
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
}
