'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type BeritaData = {
  id?: number;
  judul: string;
  slug: string;
  konten: string;
  kategori: string;
  status: string;
  gambar: string | null;
  tanggal_kejadian: string | null;
};

function buatSlug(teks: string) {
  return teks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BeritaForm({ data }: { data?: BeritaData }) {
  const router = useRouter();
  const isEdit = !!data?.id;

  const [form, setForm] = useState<BeritaData>(
    data ?? {
      judul: '',
      slug: '',
      konten: '',
      kategori: 'Kegiatan Kelurahan',
      status: 'draft',
      gambar: null,
      tanggal_kejadian: new Date().toISOString().slice(0, 10),
    }
  );
  const [slugManual, setSlugManual] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleJudulChange(judul: string) {
    setForm((f) => ({
      ...f,
      judul,
      slug: slugManual ? f.slug : buatSlug(judul),
    }));
  }

  async function handleUploadFoto(file: File) {
    setUploading(true);
    setError('');
    const supabase = createClient();

    const namaFile = `${Date.now()}-${buatSlug(file.name.replace(/\.[^/.]+$/, ''))}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('berita').upload(namaFile, file);

    if (uploadError) {
      setError('Gagal upload foto: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('berita').getPublicUrl(namaFile);
    setForm((f) => ({ ...f, gambar: urlData.publicUrl }));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createClient();
    const payload = {
      judul: form.judul,
      slug: form.slug,
      konten: form.konten,
      kategori: form.kategori,
      status: form.status,
      gambar: form.gambar,
      tanggal_kejadian: form.tanggal_kejadian,
    };

    const { error: dbError } = isEdit
      ? await supabase.from('berita').update(payload).eq('id', data!.id)
      : await supabase.from('berita').insert(payload);

    if (dbError) {
      setError('Gagal menyimpan: ' + dbError.message);
      setSaving(false);
      return;
    }

    router.push('/admin/berita');
    router.refresh();
  }

  const inputClass =
    'w-full text-sm text-gray-900 rounded-lg border border-gray-300 px-3.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul</label>
        <input
          type="text"
          required
          value={form.judul}
          onChange={(e) => handleJudulChange(e.target.value)}
          className={inputClass}
          placeholder="Judul berita"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(e) => {
            setSlugManual(true);
            setForm({ ...form, slug: e.target.value });
          }}
          className={`${inputClass} font-mono text-xs`}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Otomatis dari judul. Bisa diedit manual kalau perlu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
          <select
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            className={inputClass}
          >
            <option value="Kegiatan Kelurahan">Kegiatan Kelurahan</option>
            <option value="Pengumuman Resmi">Pengumuman Resmi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            <option value="draft">Draf (belum tampil di website)</option>
            <option value="publish">Terbit (tampil di website)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Kejadian</label>
        <input
          type="date"
          value={form.tanggal_kejadian ?? ''}
          onChange={(e) => setForm({ ...form, tanggal_kejadian: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Isi Berita</label>
        <textarea
          required
          rows={8}
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Tulis isi berita di sini..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Foto</label>
        {form.gambar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={form.gambar} alt="Preview" className="w-full max-w-xs rounded-lg mb-3 border border-gray-200" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleUploadFoto(e.target.files[0])}
          className="text-sm text-gray-600"
          disabled={uploading}
        />
        {uploading && <p className="text-xs text-blue-600 mt-1.5">Mengunggah foto...</p>}
      </div>

      {error && (
        <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition"
        >
          {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Berita'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/berita')}
          className="text-sm font-medium text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}