'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const MENU = [
  { href: '/admin', label: 'Dashboard', ikon: '📊' },
  { href: '/admin/berita', label: 'Berita & Pengumuman', ikon: '📰' },
  { href: '/admin/pengaduan', label: 'Pengaduan', ikon: '📮' },
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-base font-bold">Kelurahan Onto</p>
          <p className="text-xs text-slate-400 mt-0.5">Panel Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {MENU.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="text-base">🌐</span>
            Lihat Website
          </Link>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{userEmail}</span>
            <LogoutButton />
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}