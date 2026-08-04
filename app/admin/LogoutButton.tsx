'use client';

import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition cursor-pointer"
    >
      Keluar Panel
    </button>
  );
}