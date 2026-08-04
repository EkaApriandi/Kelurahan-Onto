'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  simpanStrukturPegawaiAction,
  simpanPengurusWilayahAction,
  hapusPengurusWilayahAction,
} from '../actions';

type AparatItem = {
  jabatan: string;
  nama: string;
  nip?: string;
  foto_url?: string | null;
};

type StafItem = {
  nama: string;
  nip: string;
  foto_url?: string | null;
};

type SeksiItem = {
  seksi: string;
  staf_pns: StafItem[];
  staf_pppk: StafItem[];
};

type PengurusWilayah = {
  id: number;
  level: 'RW' | 'RT';
  nomor_rw: string;
  nomor_rt: string | null;
  nama: string;
  alamat_wilayah: string | null;
};

export default function PegawaiManager({
  profilId,
  initialStruktur,
  initialStrukturLengkap,
  initialPengurus,
}: {
  profilId: number;
  initialStruktur: AparatItem[];
  initialStrukturLengkap: SeksiItem[];
  initialPengurus: PengurusWilayah[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'utama' | 'seksi' | 'rwrt'>('utama');

  // State Tab 1: Aparat Utama
  const [listUtama, setListUtama] = useState<AparatItem[]>(
    initialStruktur.length > 0
      ? initialStruktur
      : [
          { jabatan: 'Lurah Onto', nama: 'A. Eka Apriandi, S.STP', nip: '19850427 200412 1 001', foto_url: '' },
          { jabatan: 'Sekretaris Kelurahan', nama: 'M. Imran, S.IP', nip: '19880912 201101 1 004', foto_url: '' },
          { jabatan: 'Babinsa Onto', nama: 'Serda Herman', nip: '-', foto_url: '' },
          { jabatan: 'Bhabinkamtibmas Onto', nama: 'Bripka Supriadi', nip: '-', foto_url: '' },
        ]
  );

  // State Tab 2: Seksi & Staf
  const [listSeksi, setListSeksi] = useState<SeksiItem[]>(
    initialStrukturLengkap.length > 0
      ? initialStrukturLengkap
      : [
          {
            seksi: 'Seksi Pemerintahan & Pelayanan Umum',
            staf_pns: [{ nama: 'Siti Rahmah, S.Sos', nip: '19870315 201202 2 003', foto_url: '' }],
            staf_pppk: [{ nama: 'Ahmad Faisal, A.Md', nip: '19920101 202203 1 005', foto_url: '' }],
          },
          {
            seksi: 'Seksi Ketenteraman & Pembangunan',
            staf_pns: [{ nama: 'H. Ruslan, SE', nip: '19820510 200901 1 002', foto_url: '' }],
            staf_pppk: [],
          },
        ]
  );

  // State Tab 3: Pengurus Wilayah RW/RT
  const [pengurusList, setPengurusList] = useState<PengurusWilayah[]>(initialPengurus);
  const [formRwRt, setFormRwRt] = useState({
    id: 0,
    level: 'RW' as 'RW' | 'RT',
    nomor_rw: '01',
    nomor_rt: '',
    nama: '',
    alamat_wilayah: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handler Tab 1: Utama
  function handleAddUtama() {
    setListUtama([...listUtama, { jabatan: 'Jabatan Baru', nama: '', nip: '', foto_url: '' }]);
  }
  function handleRemoveUtama(index: number) {
    if (confirm('Hapus pegawai ini dari daftar utama?')) {
      const newList = [...listUtama];
      newList.splice(index, 1);
      setListUtama(newList);
    }
  }

  // Handler Tab 2: Seksi & Staf
  function handleAddSeksi() {
    setListSeksi([
      ...listSeksi,
      { seksi: 'Seksi Baru', staf_pns: [], staf_pppk: [] },
    ]);
  }
  function handleAddStaf(seksiIdx: number, tipe: 'staf_pns' | 'staf_pppk') {
    const newList = [...listSeksi];
    newList[seksiIdx][tipe].push({ nama: '', nip: '', foto_url: '' });
    setListSeksi(newList);
  }
  function handleRemoveStaf(seksiIdx: number, tipe: 'staf_pns' | 'staf_pppk', stafIdx: number) {
    const newList = [...listSeksi];
    newList[seksiIdx][tipe].splice(stafIdx, 1);
    setListSeksi(newList);
  }

  // Simpan Tab 1 & 2 ke DB
  async function handleSaveStruktur() {
    setSaving(true);
    setError('');
    setSuccess(false);

    const res = await simpanStrukturPegawaiAction({
      id: profilId,
      struktur: listUtama,
      strukturLengkap: listSeksi,
    });

    if (!res.success) {
      setError('Gagal menyimpan struktur pegawai: ' + (res.message ?? 'Terjadi kesalahan'));
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  // Handler Tab 3: RW/RT
  async function handleSaveRwRt(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await simpanPengurusWilayahAction({
      id: formRwRt.id || undefined,
      level: formRwRt.level,
      nomor_rw: formRwRt.nomor_rw,
      nomor_rt: formRwRt.level === 'RT' ? formRwRt.nomor_rt : null,
      nama: formRwRt.nama,
      alamat_wilayah: formRwRt.alamat_wilayah,
    });

    if (!res.success) {
      setError('Gagal menyimpan RW/RT: ' + (res.message ?? ''));
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setFormRwRt({ id: 0, level: 'RW', nomor_rw: '01', nomor_rt: '', nama: '', alamat_wilayah: '' });
    router.refresh();
    setTimeout(() => setSuccess(false), 4000);
  }

  async function handleHapusRwRt(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus data pengurus RW/RT ini?')) return;
    setSaving(true);
    const res = await hapusPengurusWilayahAction(id);
    setSaving(false);
    if (res.success) {
      setPengurusList(pengurusList.filter((p) => p.id !== id));
      router.refresh();
    } else {
      alert('Gagal menghapus RW/RT');
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('utama')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition cursor-pointer whitespace-nowrap ${
            activeTab === 'utama'
              ? 'bg-red-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          📌 1. Pejabat Utama Kelurahan
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seksi')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition cursor-pointer whitespace-nowrap ${
            activeTab === 'seksi'
              ? 'bg-red-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          🏢 2. Seksi & Staf PNS / PPPK
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rwrt')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition cursor-pointer whitespace-nowrap ${
            activeTab === 'rwrt'
              ? 'bg-red-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
          }`}
        >
          🏡 3. Pengurus Wilayah (RW & RT)
        </button>
      </div>

      {success && (
        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2">
          <span>✅</span>
          <span>Perubahan struktur berhasil disimpan dan langsung tampil di Halaman Profil Warga!</span>
        </div>
      )}

      {error && (
        <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* TAB 1: PEJABAT UTAMA */}
      {activeTab === 'utama' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Pimpinan & Aparat Utama</h3>
              <p className="text-xs text-slate-500">Lurah, Sekretaris Kelurahan, Babinsa, Bhabinkamtibmas.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddUtama}
                className="px-3 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-200"
              >
                ➕ Tambah Pejabat
              </button>
              <button
                type="button"
                onClick={handleSaveStruktur}
                disabled={saving}
                className="px-4 py-2 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-900 shadow-xs disabled:opacity-50"
              >
                💾 {saving ? 'Menyimpan...' : 'Simpan Pejabat Utama'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listUtama.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                    Posisi #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUtama(index)}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={item.jabatan}
                      onChange={(e) => {
                        const copy = [...listUtama];
                        copy[index].jabatan = e.target.value;
                        setListUtama(copy);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      value={item.nama}
                      onChange={(e) => {
                        const copy = [...listUtama];
                        copy[index].nama = e.target.value;
                        setListUtama(copy);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIP (Opsional)</label>
                    <input
                      type="text"
                      value={item.nip ?? ''}
                      onChange={(e) => {
                        const copy = [...listUtama];
                        copy[index].nip = e.target.value;
                        setListUtama(copy);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Foto URL (Opsional)</label>
                    <input
                      type="text"
                      value={item.foto_url ?? ''}
                      onChange={(e) => {
                        const copy = [...listUtama];
                        copy[index].foto_url = e.target.value;
                        setListUtama(copy);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SEKSI & STAF */}
      {activeTab === 'seksi' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Seksi & Staf Pelaksana (PNS & PPPK)</h3>
              <p className="text-xs text-slate-500">Kelola Seksi-Seksi kantor serta anggota Staf PNS dan PPPK.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddSeksi}
                className="px-3 py-2 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-200"
              >
                ➕ Tambah Seksi Baru
              </button>
              <button
                type="button"
                onClick={handleSaveStruktur}
                disabled={saving}
                className="px-4 py-2 bg-red-800 text-white text-xs font-bold rounded-lg hover:bg-red-900 shadow-xs disabled:opacity-50"
              >
                💾 {saving ? 'Menyimpan...' : 'Simpan Seksi & Staf'}
              </button>
            </div>
          </div>

          {listSeksi.map((seksiItem, sIdx) => (
            <div key={sIdx} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <input
                  type="text"
                  value={seksiItem.seksi}
                  onChange={(e) => {
                    const copy = [...listSeksi];
                    copy[sIdx].seksi = e.target.value;
                    setListSeksi(copy);
                  }}
                  className="text-sm font-extrabold text-red-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full max-w-md"
                  placeholder="Nama Seksi (misal: Seksi Pemerintahan)"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Hapus Seksi ini beserta stafnya?')) {
                      const copy = [...listSeksi];
                      copy.splice(sIdx, 1);
                      setListSeksi(copy);
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:underline ml-2"
                >
                  Hapus Seksi
                </button>
              </div>

              {/* Sub-Seksi Staf PNS */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Staf PNS ({seksiItem.staf_pns.length})</span>
                  <button
                    type="button"
                    onClick={() => handleAddStaf(sIdx, 'staf_pns')}
                    className="text-[11px] font-bold text-red-800 hover:underline"
                  >
                    + Tambah Staf PNS
                  </button>
                </div>
                {seksiItem.staf_pns.map((staf, stafIdx) => (
                  <div key={stafIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded border border-slate-200 text-xs">
                    <input
                      type="text"
                      placeholder="Nama Staf PNS"
                      value={staf.nama}
                      onChange={(e) => {
                        const copy = [...listSeksi];
                        copy[sIdx].staf_pns[stafIdx].nama = e.target.value;
                        setListSeksi(copy);
                      }}
                      className="p-1.5 border rounded font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="NIP Staf"
                      value={staf.nip}
                      onChange={(e) => {
                        const copy = [...listSeksi];
                        copy[sIdx].staf_pns[stafIdx].nip = e.target.value;
                        setListSeksi(copy);
                      }}
                      className="p-1.5 border rounded text-slate-800"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Foto URL (Opsional)"
                        value={staf.foto_url ?? ''}
                        onChange={(e) => {
                          const copy = [...listSeksi];
                          copy[sIdx].staf_pns[stafIdx].foto_url = e.target.value;
                          setListSeksi(copy);
                        }}
                        className="p-1.5 border rounded w-full text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStaf(sIdx, 'staf_pns', stafIdx)}
                        className="text-red-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-Seksi Staf PPPK */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Staf PPPK ({seksiItem.staf_pppk.length})</span>
                  <button
                    type="button"
                    onClick={() => handleAddStaf(sIdx, 'staf_pppk')}
                    className="text-[11px] font-bold text-red-800 hover:underline"
                  >
                    + Tambah Staf PPPK
                  </button>
                </div>
                {seksiItem.staf_pppk.map((staf, stafIdx) => (
                  <div key={stafIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded border border-slate-200 text-xs">
                    <input
                      type="text"
                      placeholder="Nama Staf PPPK"
                      value={staf.nama}
                      onChange={(e) => {
                        const copy = [...listSeksi];
                        copy[sIdx].staf_pppk[stafIdx].nama = e.target.value;
                        setListSeksi(copy);
                      }}
                      className="p-1.5 border rounded font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="NIP PPPK"
                      value={staf.nip}
                      onChange={(e) => {
                        const copy = [...listSeksi];
                        copy[sIdx].staf_pppk[stafIdx].nip = e.target.value;
                        setListSeksi(copy);
                      }}
                      className="p-1.5 border rounded text-slate-800"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Foto URL (Opsional)"
                        value={staf.foto_url ?? ''}
                        onChange={(e) => {
                          const copy = [...listSeksi];
                          copy[sIdx].staf_pppk[stafIdx].foto_url = e.target.value;
                          setListSeksi(copy);
                        }}
                        className="p-1.5 border rounded w-full text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStaf(sIdx, 'staf_pppk', stafIdx)}
                        className="text-red-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PENGURUS WILAYAH (RW / RT) */}
      {activeTab === 'rwrt' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveRwRt} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              {formRwRt.id ? 'Edit Data Pengurus RW/RT' : 'Tambah Pengurus RW/RT Baru'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat Wilayah</label>
                <select
                  value={formRwRt.level}
                  onChange={(e) => setFormRwRt({ ...formRwRt, level: e.target.value as 'RW' | 'RT' })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                >
                  <option value="RW">Ketua RW</option>
                  <option value="RT">Ketua RT</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor RW</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 01, 02"
                  value={formRwRt.nomor_rw}
                  onChange={(e) => setFormRwRt({ ...formRwRt, nomor_rw: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              {formRwRt.level === 'RT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor RT</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: 001, 002"
                    value={formRwRt.nomor_rt}
                    onChange={(e) => setFormRwRt({ ...formRwRt, nomor_rt: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Ketua</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Ketua RW / RT"
                  value={formRwRt.nama}
                  onChange={(e) => setFormRwRt({ ...formRwRt, nama: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Wilayah / Dusun (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: Lingkungan Onto"
                  value={formRwRt.alamat_wilayah}
                  onChange={(e) => setFormRwRt({ ...formRwRt, alamat_wilayah: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded-lg transition shadow-xs disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : formRwRt.id ? 'Update Pengurus' : 'Tambah Pengurus RW/RT'}
              </button>
              {formRwRt.id > 0 && (
                <button
                  type="button"
                  onClick={() => setFormRwRt({ id: 0, level: 'RW', nomor_rw: '01', nomor_rt: '', nama: '', alamat_wilayah: '' })}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {/* Daftar Pengurus RW & RT */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Daftar Pengurus RW & RT Terdaftar ({pengurusList.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {pengurusList.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-extrabold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-100 mr-2">
                      {item.level === 'RW' ? `RW ${item.nomor_rw}` : `RW ${item.nomor_rw} / RT ${item.nomor_rt}`}
                    </span>
                    <span className="font-bold text-slate-900">{item.nama}</span>
                    {item.alamat_wilayah && (
                      <span className="text-slate-500 font-medium ml-2">({item.alamat_wilayah})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormRwRt({
                          id: item.id,
                          level: item.level,
                          nomor_rw: item.nomor_rw,
                          nomor_rt: item.nomor_rt ?? '',
                          nama: item.nama,
                          alamat_wilayah: item.alamat_wilayah ?? '',
                        })
                      }
                      className="text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHapusRwRt(item.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
