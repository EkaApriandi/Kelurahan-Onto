'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type DemografiItem = {
  label: string;
  jumlah: number;
};

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

  const totalUsia = usia.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalPendidikan = pendidikan.reduce((acc, curr) => acc + curr.jumlah, 0);
  const totalPekerjaan = pekerjaan.reduce((acc, curr) => acc + curr.jumlah, 0);

  useEffect(() => {
    const palettePie = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#475569', '#334155'];
    const charts: Chart[] = [];

    if (usiaRef.current && usia.length > 0) {
      charts.push(
        new Chart(usiaRef.current, {
          type: 'pie',
          data: {
            labels: usia.map((d) => d.label),
            datasets: [
              {
                data: usia.map((d) => d.jumlah),
                backgroundColor: palettePie.slice(0, usia.length),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: { size: 10, family: 'var(--font-geist-sans)' },
                  boxWidth: 10,
                  padding: 8,
                  usePointStyle: true,
                },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.raw as number;
                    const pct = totalUsia > 0 ? ((val / totalUsia) * 100).toFixed(1) : '0';
                    return ` ${ctx.label}: ${val.toLocaleString('id-ID')} Jiwa (${pct}%)`;
                  },
                },
              },
            },
          },
        })
      );
    }

    if (pendidikanRef.current && pendidikan.length > 0) {
      charts.push(
        new Chart(pendidikanRef.current, {
          type: 'doughnut',
          data: {
            labels: pendidikan.map((d) => d.label),
            datasets: [
              {
                data: pendidikan.map((d) => d.jumlah),
                backgroundColor: palettePie.slice(0, pendidikan.length),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: { size: 10, family: 'var(--font-geist-sans)' },
                  boxWidth: 10,
                  padding: 8,
                  usePointStyle: true,
                },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const val = ctx.raw as number;
                    const pct = totalPendidikan > 0 ? ((val / totalPendidikan) * 100).toFixed(1) : '0';
                    return ` ${ctx.label}: ${val.toLocaleString('id-ID')} Jiwa (${pct}%)`;
                  },
                },
              },
            },
          },
        })
      );
    }

    if (pekerjaanRef.current && pekerjaan.length > 0) {
      charts.push(
        new Chart(pekerjaanRef.current, {
          type: 'bar',
          data: {
            labels: pekerjaan.map((d) => d.label),
            datasets: [
              {
                data: pekerjaan.map((d) => d.jumlah),
                backgroundColor: '#b91c1c',
                borderRadius: 6,
                maxBarThickness: 40,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: (items) => pekerjaan[items[0].dataIndex]?.label ?? '',
                  label: (ctx) => {
                    const val = ctx.raw as number;
                    const pct = totalPekerjaan > 0 ? ((val / totalPekerjaan) * 100).toFixed(1) : '0';
                    return ` ${val.toLocaleString('id-ID')} Jiwa (${pct}%)`;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { font: { size: 10 } },
              },
              x: {
                grid: { display: false },
                ticks: {
                  font: { size: 10 },
                  maxRotation: 45,
                  minRotation: 15,
                  autoSkip: false,
                },
              },
            },
          },
        })
      );
    }

    return () => charts.forEach((c) => c.destroy());
  }, [usia, pendidikan, pekerjaan, totalUsia, totalPendidikan, totalPekerjaan]);

  return (
    <div className="space-y-6">
      {/* Grid Usia & Pendidikan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Usia */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800">Komposisi Kelompok Usia</h4>
              <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
                Diagram Lingkaran
              </span>
            </div>
            {usia.length > 0 ? (
              <div className="h-72 sm:h-64 relative">
                <canvas ref={usiaRef} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">Data usia belum diisi</p>
            )}
          </div>

          {/* Rincian Angka Ringkas Mobile Friendly */}
          {usia.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              {usia.map((item) => {
                const pct = totalUsia > 0 ? ((item.jumlah / totalUsia) * 100).toFixed(1) : '0';
                return (
                  <div key={item.label} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block truncate">{item.label}</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-extrabold text-slate-900">{item.jumlah.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] font-bold text-red-700">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card Pendidikan */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800">Tingkat Pendidikan Warga</h4>
              <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
                Diagram Donat
              </span>
            </div>
            {pendidikan.length > 0 ? (
              <div className="h-72 sm:h-64 relative">
                <canvas ref={pendidikanRef} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">Data pendidikan belum diisi</p>
            )}
          </div>

          {/* Rincian Angka Ringkas Mobile Friendly */}
          {pendidikan.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              {pendidikan.map((item) => {
                const pct = totalPendidikan > 0 ? ((item.jumlah / totalPendidikan) * 100).toFixed(1) : '0';
                return (
                  <div key={item.label} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-medium block truncate">{item.label}</span>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-xs font-extrabold text-slate-900">{item.jumlah.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] font-bold text-red-700">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Card Pekerjaan */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800">Mata Pencaharian Utama</h4>
          <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
            Diagram Batang
          </span>
        </div>
        {pekerjaan.length > 0 ? (
          <div className="h-80 sm:h-72 relative">
            <canvas ref={pekerjaanRef} />
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-10">Data pekerjaan belum diisi</p>
        )}

        {/* Rincian Angka Ringkas Mobile Friendly */}
        {pekerjaan.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {pekerjaan.map((item) => {
              const pct = totalPekerjaan > 0 ? ((item.jumlah / totalPekerjaan) * 100).toFixed(1) : '0';
              return (
                <div key={item.label} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-medium block truncate">{item.label}</span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-xs font-extrabold text-slate-900">{item.jumlah.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] font-bold text-red-700">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}