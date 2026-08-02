'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type DemografiItem = {
  label: string;
  jumlah: number;
};

// Pecah label jadi array per kata, supaya Chart.js otomatis menampilkannya
// bertingkat ke bawah (bukan dirotasi miring). Label satu kata tetap 1 baris.
function wrapLabel(label: string): string | string[] {
  return label.includes(' ') ? label.split(' ') : label;
}

export default function ChartDemografi({
  usia,
  pendidikan,
  pekerjaan,
}: {
  usia: DemografiItem[];
  pendidikan: DemografiItem[];
  pekerjaan: DemografiItem[];
}) {
  const usiaRef = useRef<HTMLCanvasElement>(null);
  const pendidikanRef = useRef<HTMLCanvasElement>(null);
  const pekerjaanRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const warna = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#1e40af'];
    const charts: Chart[] = [];

    if (usiaRef.current) {
      charts.push(
        new Chart(usiaRef.current, {
          type: 'pie',
          data: {
            labels: usia.map((d) => d.label),
            datasets: [{ data: usia.map((d) => d.jumlah), backgroundColor: warna }],
          },
          options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } },
        })
      );
    }

    if (pendidikanRef.current) {
      charts.push(
        new Chart(pendidikanRef.current, {
          type: 'doughnut',
          data: {
            labels: pendidikan.map((d) => d.label),
            datasets: [{ data: pendidikan.map((d) => d.jumlah), backgroundColor: warna }],
          },
          options: { plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } },
        })
      );
    }

    if (pekerjaanRef.current) {
      charts.push(
        new Chart(pekerjaanRef.current, {
          type: 'bar',
          data: {
            // setiap label dipecah per kata -> otomatis tersusun ke bawah, presisi di bawah batangnya
            labels: pekerjaan.map((d) => wrapLabel(d.label)),
            datasets: [{ data: pekerjaan.map((d) => d.jumlah), backgroundColor: '#1d4ed8' }],
          },
          options: {
            plugins: {
              legend: { display: false },
              tooltip: {
                // pastikan judul tooltip tetap utuh (gabung ulang array jadi 1 kalimat)
                callbacks: {
                  title: (items) => {
                    const raw = pekerjaan[items[0].dataIndex]?.label ?? '';
                    return raw;
                  },
                },
              },
            },
            scales: {
              y: { beginAtZero: true },
              x: {
                ticks: {
                  maxRotation: 0, // paksa horizontal, tidak dirotasi
                  minRotation: 0,
                  font: { size: 10 },
                  autoSkip: false, // pastikan SEMUA 10 kategori pekerjaan tampil, tidak ada yang disembunyikan
                },
              },
            },
          },
        })
      );
    }

    return () => charts.forEach((c) => c.destroy());
  }, [usia, pendidikan, pekerjaan]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 text-center mb-2">Usia</p>
          {usia.length > 0 ? (
            <canvas ref={usiaRef} height={200} />
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Data usia belum diisi</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 text-center mb-2">Pendidikan</p>
          {pendidikan.length > 0 ? (
            <>
              <canvas ref={pendidikanRef} height={200} />
              <p className="text-[10px] text-gray-400 text-center mt-3 italic">
                *Data tahun 2018, belum tentu mencakup seluruh penduduk
              </p>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Data pendidikan belum diisi</p>
          )}
        </div>
      </div>

      {/* Chart pekerjaan dibuat full-width karena kategorinya paling banyak (10 jenis) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <p className="text-xs text-gray-500 text-center mb-3">Pekerjaan</p>
        {pekerjaan.length > 0 ? (
          <canvas ref={pekerjaanRef} height={90} />
        ) : (
          <p className="text-xs text-gray-400 text-center py-8">Data pekerjaan belum diisi</p>
        )}
      </div>
    </div>
  );
}