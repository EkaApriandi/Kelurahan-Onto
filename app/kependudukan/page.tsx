import { supabase } from '@/lib/supabase';
import ChartDemografi from './ChartDemografi';

export const revalidate = 0;

async function getData() {
  const { data: rtRws } = await supabase
    .from('rt_rw')
    .select('*')
    .order('nomor_rw')
    .order('nomor_rt');

  const { data: demografis } = await supabase.from('demografi').select('*').order('kategori');

  return {
    rtRws: rtRws ?? [],
    usia: demografis?.filter((d) => d.kategori === 'usia') ?? [],
    pendidikan: demografis?.filter((d) => d.kategori === 'pendidikan') ?? [],
    pekerjaan: demografis?.filter((d) => d.kategori === 'pekerjaan') ?? [],
  };
}

export default async function DataKependudukan() {
  const { rtRws, usia, pendidikan, pekerjaan } = await getData();

  const totalKk = rtRws.reduce((sum, item) => sum + (item.jumlah_kk ?? 0), 0);
  const totalL = rtRws.reduce((sum, item) => sum + (item.jumlah_l ?? 0), 0);
  const totalP = rtRws.reduce((sum, item) => sum + (item.jumlah_p ?? 0), 0);
  const totalPenduduk = totalL + totalP;

  return (
    <main className="bg-slate-50 text-slate-800 pb-16">
      {/* Banner - Samakan Warna dengan Layanan (bg-slate-900) */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 bg-white/10 px-3 py-1 rounded-md">
            Data Statistik
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Data & Grafik Kependudukan
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Informasi demografi warga, distribusi gender, kelompok usia, tingkat pendidikan, dan mata pencaharian di Kelurahan Onto.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Ringkasan Statistik */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Jiwa</p>
            <p className="text-2xl font-extrabold text-red-800 mt-1">
              {totalPenduduk.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Total KK</p>
            <p className="text-2xl font-extrabold text-red-800 mt-1">
              {totalKk.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Laki-Laki</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {totalL.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Perempuan</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {totalP.toLocaleString('id-ID')}
            </p>
          </div>
        </section>

        {/* Grafik Demografi */}
        <section className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Grafik & Statistik Demografi</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Grafik distribusi kelompok usia, tingkat pendidikan, dan mata pencaharian warga.
            </p>
          </div>
          <ChartDemografi usia={usia} pendidikan={pendidikan} pekerjaan={pekerjaan} />
        </section>
      </div>
    </main>
  );
}