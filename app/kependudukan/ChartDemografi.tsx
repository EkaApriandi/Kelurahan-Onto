'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type DemografiItem = {
  label: string;
  jumlah: number;
};

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
    const palettePie = ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#475569', '#334155'];
    const charts: Chart[] = [];

    if (usiaRef.current) {
      charts.push(
        new Chart(usiaRef.current, {
          type: 'pie',
          data: {
            labels: usia.map((d) => d.label),
            datasets: [{ data: usia.map((d) => d.jumlah), backgroundColor: palettePie }],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
                labels: { font: { size: 11, family: 'var(--font-geist-sans)' }, padding: 10 },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        })
      );
    }

    if (pendidikanRef.current) {
      charts.push(
        new Chart(pendidikanRef.current, {
          type: 'doughnut',
          data: {
            labels: pendidikan.map((d) => d.label),
            datasets: [{ data: pendidikan.map((d) => d.jumlah), backgroundColor: palettePie }],
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
                labels: { font: { size: 11, family: 'var(--font-geist-sans)' }, padding: 10 },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        })
      );
    }

    if (pekerjaanRef.current) {
      charts.push(
        new Chart(pekerjaanRef.current, {
          type: 'bar',
          data: {
            labels: pekerjaan.map((d) => wrapLabel(d.label)),
            datasets: [
              {
                data: pekerjaan.map((d) => d.jumlah),
                backgroundColor: '#b91c1c',
                borderRadius: 4,
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
                  title: (items) => {
                    return pekerjaan[items[0].dataIndex]?.label ?? '';
                  },
                },
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
              x: {
                grid: { display: false },
                ticks: {
                  maxRotation: 0,
                  minRotation: 0,
                  font: { size: 10 },
                  autoSkip: false,
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
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800">Komposisi Kelompok Usia</h4>
            <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
              Diagram Lingkaran
            </span>
          </div>
          {usia.length > 0 ? (
            <div className="h-60 relative">
              <canvas ref={usiaRef} />
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Data usia belum diisi</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800">Tingkat Pendidikan Warga</h4>
            <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
              Diagram Donat
            </span>
          </div>
          {pendidikan.length > 0 ? (
            <div className="h-60 relative">
              <canvas ref={pendidikanRef} />
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Data pendidikan belum diisi</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800">Mata Pencaharian Utama</h4>
          <span className="text-[10px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded-md">
            Diagram Batang
          </span>
        </div>
        {pekerjaan.length > 0 ? (
          <div className="h-64 relative">
            <canvas ref={pekerjaanRef} />
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-10">Data pekerjaan belum diisi</p>
        )}
      </div>
    </div>
  );
}