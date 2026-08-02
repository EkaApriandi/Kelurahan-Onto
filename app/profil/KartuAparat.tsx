type KartuAparatProps = {
  nama: string;
  jabatan: string;
  nip?: string | null;
  fotoUrl?: string | null;
  kosong?: boolean;   // true kalau slot ini memang belum ada orangnya, tapi layout tetap tampil
  variant?: 'orang' | 'kasi'; // 'kasi' = kartu penanda seksi, bukan kartu orang
};

export default function KartuAparat({
  nama,
  jabatan,
  nip,
  fotoUrl,
  kosong,
  variant = 'orang',
}: KartuAparatProps) {
  // Kartu penanda Kasi/Seksi — beda gaya biar jelas ini bukan kartu orang
  if (variant === 'kasi') {
    return (
      <div className="rounded-lg overflow-hidden shadow-sm border border-blue-100 bg-white">
        <div className="w-full aspect-[3/4] bg-blue-50 flex items-center justify-center">
          <span className="text-4xl">🏢</span>
        </div>
        <div className="bg-blue-100 px-3 py-2 text-center">
          <p className="text-[10px] text-blue-500 uppercase tracking-wide">Seksi</p>
          <p className="text-sm font-bold text-blue-800 leading-tight">{nama}</p>
        </div>
      </div>
    );
  }

  if (kosong) {
    return (
      <div className="rounded-lg overflow-hidden shadow-sm border border-dashed border-gray-200 bg-white">
        <div className="w-full aspect-[3/4] bg-gray-50 flex items-center justify-center">
          <span className="text-gray-300 text-2xl">—</span>
        </div>
        <div className="bg-gray-100 px-3 py-2 text-center">
          <p className="text-sm font-medium text-gray-400">Belum ada data</p>
          <p className="text-xs text-gray-400 mt-0.5">{jabatan}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-white">
      {fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fotoUrl} alt={nama} className="w-full aspect-[3/4] object-cover" />
      ) : (
        <div className="w-full aspect-[3/4] bg-blue-50 flex items-center justify-center">
          <span className="text-3xl font-semibold text-blue-700">{nama.charAt(0)}</span>
        </div>
      )}
      <div className="bg-gray-800 px-3 py-2 text-center">
        <p className="text-sm font-semibold text-white leading-tight">{nama}</p>
        <p className="text-xs text-gray-300 mt-0.5">{jabatan}</p>
        {nip && <p className="text-[10px] text-gray-400 mt-0.5">{nip}</p>}
      </div>
    </div>
  );
}