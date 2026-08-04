'use client';

type PengaduanItem = {
  id: number;
  nama: string;
  kontak: string;
  isi: string;
  kategori: string | null;
  status: string;
  created_at: string;
};

export default function CetakRekapButton({ data }: { data: PengaduanItem[] }) {
  function handlePrint() {
    window.print();
  }

  function handleExportCSV() {
    if (!data || data.length === 0) {
      alert('Tidak ada data pengaduan untuk di-export.');
      return;
    }

    const headers = ['No', 'Tanggal', 'Nama Pelapor', 'Kontak/HP', 'Kategori', 'Status', 'Isi Pengaduan'];
    const rows = data.map((item, idx) => [
      idx + 1,
      new Date(item.created_at).toLocaleDateString('id-ID'),
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.kontak.replace(/"/g, '""')}"`,
      `"${(item.kategori || 'Umum').replace(/"/g, '""')}"`,
      `"${item.status.replace(/"/g, '""')}"`,
      `"${item.isi.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Pengaduan_Kelurahan_Onto_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      {/* Tombol Aksi Layar Normal */}
      <div className="flex items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
        >
          <span>🖨️</span>
          <span>Cetak / Unduh PDF Rekap</span>
        </button>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
        >
          <span>📥</span>
          <span>Export Excel (CSV)</span>
        </button>
      </div>

      {/* Dokumen Formal Cetak (Hanya Tampil Saat Cetak / Window Print) */}
      <div className="hidden print:block print:p-6 text-black font-serif">
        {/* Kop Surat Resmi */}
        <div className="text-center border-b-4 border-double border-black pb-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest">PEMERINTAH KABUPATEN BANTAENG</h3>
          <h2 className="text-base font-bold uppercase tracking-wider">KECAMATAN BANTAENG</h2>
          <h1 className="text-xl font-extrabold uppercase tracking-widest mt-0.5">KELURAHAN ONTO</h1>
          <p className="text-[10px] italic font-sans mt-1">
            Alamat: Jl. Poros Onto, Kelurahan Onto, Kec. Bantaeng, Kabupaten Bantaeng, Sulawesi Selatan
          </p>
        </div>

        {/* Judul Laporan */}
        <div className="text-center mb-6">
          <h2 className="text-base font-bold underline uppercase">
            REKAPITULASI LAPORAN & PENGADUAN MASYARAKAT
          </h2>
          <p className="text-xs italic mt-0.5">
            Dicetak Pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Tabel Rekap Pengaduan */}
        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-slate-100 font-bold text-center">
              <th className="border border-black p-2 w-10">No</th>
              <th className="border border-black p-2 w-28">Tanggal</th>
              <th className="border border-black p-2 w-36">Nama Pelapor</th>
              <th className="border border-black p-2 w-28">Kontak</th>
              <th className="border border-black p-2 w-28">Kategori</th>
              <th className="border border-black p-2">Isi Pengaduan / Aspirasi</th>
              <th className="border border-black p-2 w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="align-top">
                <td className="border border-black p-2 text-center">{index + 1}</td>
                <td className="border border-black p-2 text-center">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="border border-black p-2 font-bold">{item.nama}</td>
                <td className="border border-black p-2">{item.kontak}</td>
                <td className="border border-black p-2 text-center">{item.kategori || 'Umum'}</td>
                <td className="border border-black p-2 text-justify whitespace-pre-line">{item.isi}</td>
                <td className="border border-black p-2 text-center font-bold">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Blok Tanda Tangan Formal */}
        <div className="mt-12 flex justify-between items-start text-xs pr-8 pl-8">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-bold">Pengelola Pengaduan</p>
            <div className="h-16"></div>
            <p className="font-bold underline">( ........................................ )</p>
          </div>

          <div className="text-center">
            <p>Onto, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold">Lurah Onto</p>
            <div className="h-16"></div>
            <p className="font-bold underline">LURAH ONTO</p>
            <p className="text-[10px]">NIP. ........................................</p>
          </div>
        </div>
      </div>
    </>
  );
}
