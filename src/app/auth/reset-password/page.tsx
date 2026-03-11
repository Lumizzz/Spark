'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative" style={{ background: 'var(--color-bg)' }}>
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.4) 0%, transparent 60%)' }} />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: 'var(--font-display)' }}>spark</span>
          </Link>
        </div>
        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Check your email</h2>
              <p className="text-slate-400 text-sm mb-6">We sent a reset link to <span className="text-white">{email}</span></p>
              <Link href="/auth/login" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>Reset password</h1>
              <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
