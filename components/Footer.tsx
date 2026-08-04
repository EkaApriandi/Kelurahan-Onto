import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Informasi Kelurahan */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center p-0.5 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-bantaeng.jpg"
                  alt="Logo Kabupaten Bantaeng"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">
                  Kelurahan Onto
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kecamatan Bantaeng, Kabupaten Bantaeng
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Portal Resmi Informasi Publik & Pelayanan Administrasi Kelurahan Onto, Kecamatan Bantaeng, Kabupaten Bantaeng, Sulawesi Selatan.
            </p>
          </div>

          {/* Navigasi Halaman Ringkas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 border-b border-slate-800 pb-2">
              Navigasi Halaman
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/" className="hover:text-white transition-colors py-0.5">
                Beranda
              </Link>
              <Link href="/profil" className="hover:text-white transition-colors py-0.5">
                Profil Kelurahan
              </Link>
              <Link href="/layanan" className="hover:text-white transition-colors py-0.5">
                Layanan Administrasi
              </Link>
              <Link href="/kependudukan" className="hover:text-white transition-colors py-0.5">
                Data Kependudukan
              </Link>
              <Link href="/berita" className="hover:text-white transition-colors py-0.5">
                Berita & Pengumuman
              </Link>
              <Link href="/kontak" className="hover:text-white transition-colors py-0.5">
                Kontak & Pengaduan
              </Link>
            </div>
          </div>

          {/* Jam Pelayanan Kantor Langsung & Jelas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 border-b border-slate-800 pb-2">
              Jam Pelayanan Kantor
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Senin – Kamis</span>
                <span className="font-semibold text-slate-200">07:30 – 14:00 WITA</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Jumat</span>
                <span className="font-semibold text-slate-200">07:30 – 11:30 WITA</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Sabtu, Minggu & Libur</span>
                <span className="font-semibold text-slate-400">Libur</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            &copy; Sistem Informasi Kelurahan Onto.
          </p>
          <p className="font-medium">
            Dibuat oleh Mahasiswa KKN-T 116 Universitas Hasanuddin
          </p>
        </div>
      </div>
    </footer>
  );
}
