'use client';

import { useState } from 'react';
import { updatePasswordAction, updateEmailAction } from '../actions';

export default function PengaturanForm({ currentEmail }: { currentEmail: string }) {
  // State Ubah Kata Sandi
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // State Ubah Email
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassLoading(true);
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.');
      setPassLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Kata sandi baru minimal harus 6 karakter.');
      setPassLoading(false);
      return;
    }

    const res = await updatePasswordAction(newPassword);

    if (!res.success) {
      setPassError(res.message || 'Gagal mengoperasikan pembaruan kata sandi.');
    } else {
      setPassSuccess('Kata sandi Anda berhasil diperbarui! Silakan gunakan kata sandi baru ini untuk login berikutnya.');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPassLoading(false);
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    setEmailSuccess('');

    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('Masukkan alamat email yang valid.');
      setEmailLoading(false);
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError('Alamat email baru harus berbeda dari alamat email saat ini.');
      setEmailLoading(false);
      return;
    }

    const res = await updateEmailAction(newEmail);

    if (!res.success) {
      setEmailError(res.message || 'Gagal memperbarui alamat email.');
    } else {
      setEmailSuccess('Alamat email berhasil diperbarui! Jika fitur verifikasi aktif di Supabase, silakan periksa inbox email baru untuk konfirmasi.');
      setNewEmail('');
    }
    setEmailLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* CARD UBAH KATA SANDI */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-800 flex items-center justify-center text-xl font-bold">
            🔑
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Ubah Kata Sandi</h2>
            <p className="text-xs text-slate-500">Perbarui kata sandi akun pengurus Anda untuk keamanan.</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-xs text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
              placeholder="Ulangi kata sandi baru"
            />
          </div>

          {passError && (
            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 leading-relaxed">
              ⚠️ {passError}
            </div>
          )}

          {passSuccess && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 leading-relaxed">
              ✅ {passSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={passLoading}
            className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {passLoading ? 'Memproses Pembaruan...' : 'Simpan Kata Sandi Baru'}
          </button>
        </form>
      </div>

      {/* CARD UBAH ALAMAT EMAIL */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-800 flex items-center justify-center text-xl font-bold">
            ✉️
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Ubah Alamat Email</h2>
            <p className="text-xs text-slate-500">Perbarui email login resmi pengurus kelurahan.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 text-xs">
          <span className="text-slate-500 block font-medium">Email Saat Ini:</span>
          <span className="font-extrabold text-slate-900 text-sm truncate block mt-0.5">{currentEmail || 'Belum terdeteksi'}</span>
        </div>

        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Baru</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full text-xs text-slate-900 rounded-lg border border-slate-300 px-3.5 py-2.5 outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-100 transition bg-white"
              placeholder="pengurus.baru@email.com"
            />
          </div>

          {emailError && (
            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 leading-relaxed">
              ⚠️ {emailError}
            </div>
          )}

          {emailSuccess && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 leading-relaxed">
              ✅ {emailSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={emailLoading}
            className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {emailLoading ? 'Memproses Pembaruan...' : 'Simpan Email Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}
