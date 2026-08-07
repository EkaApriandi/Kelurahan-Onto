'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { simpanBeritaAction } from '../actions';

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
      status: 'publish', // Default Terbit agar berita langsung tampil
      gambar: null,
      tanggal_kejadian: new Date().toISOString().slice(0, 10),
    }
  );
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');

  function handleJudulChange(judul: string) {
    setForm((f) => ({
      ...f,
      judul,
      slug: slugManual ? f.slug : buatSlug(judul),
    }));
  }

  function handleFileChange(file: File) {
    setCompressing(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setForm((f) => ({ ...f, gambar: compressedBase64 }));
        }
        setCompressing(false);
      };

      img.onerror = () => {
        setError('Gagal memproses file gambar.');
        setCompressing(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setError('Gagal membaca file gambar.');
      setCompressing(false);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await simpanBeritaAction({
      id: data?.id,
      judul: form.judul,
      slug: form.slug || buatSlug(form.judul),
      konten: form.konten,
      kategori: form.kategori,
      status: form.status,
      gambar: form.gambar,
      tanggal_kejadian: form.tanggal_kejadian,
    });

    if (!res.success) {
      setError('Gagal menyimpan berita: ' + (res.message ?? 'Terjadi kesalahan.'));
      setSaving(false);
      return;
    }

    router.push('/admin/berita');
    router.refresh();
  }

  const inputClass =
    'w-full text-xs sm:text-sm text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Berita</label>
        <input
          type="text"
          required
          value={form.judul}
          onChange={(e) => handleJudulChange(e.target.value)}
          className={inputClass}
          placeholder="Masukkan judul berita atau pengumuman..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Slug URL Halaman</label>
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
        <p className="text-[11px] text-slate-400 mt-1">
          Dibuat otomatis dari judul. Dapat disunting manual jika diperlukan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori Berita</label>
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
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Publikasi</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            <option value="publish">Terbit (Langsung Tampil di Website)</option>
            <option value="draft">Draf Simpanan (Belum Tampil)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Kejadian</label>
        <input
          type="date"
          value={form.tanggal_kejadian ?? ''}
          onChange={(e) => setForm({ ...form, tanggal_kejadian: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Berita / Artikel</label>
        <textarea
          required
          rows={8}
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
          className={`${inputClass} resize-none leading-relaxed`}
          placeholder="Tuliskan isi artikel berita secara lengkap..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Gambar / Foto Berita (Opsional)</label>
        
        {/* Pratinjau Gambar */}
        {form.gambar && (
          <div className="mb-3 relative max-w-xs group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.gambar} alt="Pratinjau Foto" className="w-full max-h-48 object-cover rounded-lg border border-slate-200 shadow-2xs" />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, gambar: null }))}
              className="mt-1 text-[11px] font-bold text-red-700 hover:underline cursor-pointer"
            >
              Hapus Gambar Ini
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          disabled={compressing}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="text-xs text-slate-600 cursor-pointer block w-full border border-slate-200 rounded-lg p-2 bg-slate-50"
        />
        {compressing ? (
          <p className="text-[11px] font-bold text-red-800 mt-1">Mengompresi & merapikan foto...</p>
        ) : (
          <p className="text-[11px] text-slate-400 mt-1">
            Foto otomatis dikompres secara instan agar penyimpanan cepat dan lancar.
          </p>
        )}
      </div>

      {error && (
        <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || compressing}
          className="bg-red-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-red-900 disabled:opacity-50 transition shadow-xs cursor-pointer"
        >
          {saving ? 'Menyimpan Berita...' : isEdit ? 'Simpan Perubahan' : 'Terbitkan Berita Baru'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/berita')}
          className="text-xs font-bold text-slate-600 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          Batal
        </button>
      </div>
    </form>
  );
}