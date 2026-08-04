'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const MENU = [
  { href: '/admin', label: 'Ringkasan Dashboard', ikon: '📊' },
  { href: '/admin/profil', label: 'Kelola Profil Kelurahan', ikon: '🏛️' },
  { href: '/admin/pegawai', label: 'Kelola Pejabat & Pegawai', ikon: '👤' },
  { href: '/admin/layanan', label: 'Kelola Layanan Surat', ikon: '📄' },
  { href: '/admin/kependudukan', label: 'Kelola Data Kependudukan', ikon: '👥' },
  { href: '/admin/berita', label: 'Kelola Berita', ikon: '📰' },
  { href: '/admin/pengaduan', label: 'Kelola Pengaduan Warga', ikon: '📮' },
  { href: '/admin/pengaturan', label: 'Pengaturan Akun', ikon: '⚙️' },
];

export default function AdminShell({
  title,
  userEmail,
  children,
}: {
  title: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col fixed inset-y-0 left-0 z-30 border-r border-slate-800">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-bantaeng.jpg"
              alt="Logo Kabupaten Bantaeng"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-none">Kelurahan Onto</p>
            <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mt-1">
              Panel Pengurus
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  active
                    ? 'bg-red-800 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">{item.ikon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800 space-y-1 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white transition border border-slate-700 text-xs"
          >
            <span>🏠</span>
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </aside>

      {/* Drawer Seluler */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-200 ease-in-out lg:hidden flex flex-col ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-bantaeng.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Kelurahan Onto</p>
              <p className="text-[10px] text-red-400 font-semibold">Panel Pengurus</p>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="text-slate-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                  active ? 'bg-red-800 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-base">{item.ikon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-800">
          <Link
            href="/"
            onClick={() => setMobileDrawerOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700"
          >
            🏠 Kembali ke Beranda Utama
          </Link>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar / Header Admin Compact */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Buka Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate max-w-[140px] sm:max-w-none">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-700 hover:text-red-800 bg-slate-100 hover:bg-slate-200 rounded-md transition border border-slate-200"
            >
              <span>🏠</span>
              <span>Beranda</span>
            </Link>

            {userEmail && (
              <span className="hidden md:inline-block text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {userEmail}
              </span>
            )}

            <LogoutButton />
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}