type KartuAparatProps = {
  nama: string;
  jabatan: string;
  nip?: string | null;
  fotoUrl?: string | null;
  kosong?: boolean;
  variant?: 'orang' | 'kasi';
};

export default function KartuAparat({
  nama,
  jabatan,
  nip,
  fotoUrl,
  kosong,
  variant = 'orang',
}: KartuAparatProps) {
  if (variant === 'kasi') {
    return (
      <div className="rounded-xl overflow-hidden border border-red-200 bg-red-50/60 p-4 text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block mb-1">
          Penanggung Jawab
        </span>
        <p className="text-xs font-bold text-slate-800 leading-snug">{nama}</p>
      </div>
    );
  }

  if (kosong) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
        <p className="text-xs font-medium text-slate-400">Belum diisi</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{jabatan}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-red-300 transition flex flex-col">
      <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden">
        {fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt={nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-red-50 flex items-center justify-center">
            <span className="text-3xl font-bold text-red-700">{nama.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-slate-900 text-center flex-1 flex flex-col justify-center">
        <p className="text-xs font-bold text-white leading-tight line-clamp-1">{nama}</p>
        <p className="text-[11px] text-red-300 font-medium mt-0.5">{jabatan}</p>
        {nip && <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{nip}</p>}
      </div>
    </div>
  );
}