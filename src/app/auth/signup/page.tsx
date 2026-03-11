'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, CheckCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { selfRegister } from '@/lib/actions';
import toast from 'react-hot-toast';

type Step = 'form' | 'verify';

export default function SignUpPage() {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await selfRegister(form.email, form.password, form.name);
      if (error) throw new Error(error);
      setStep('verify');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none transition-all text-sm';
  const inputClass = (field: string) =>
    `${inputBase} ${errors[field] ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/10 focus:border-violet-500/50 focus:bg-violet-500/5'}`;

  const strength = form.password.length === 0 ? 0
    : form.password.length < 8 ? 1
    : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password) ? 4
    : /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 3
    : 2;
  const strengthLabel = ['', 'Too short', 'Fair', 'Strong', 'Excellent'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500'][strength];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-900/40 group-hover:shadow-violet-700/50 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-white" style={{ fontFamily: 'var(--font-display)' }}>spark</span>
          </Link>
        </div>

        {step === 'verify' ? (
          <div className="gradient-border-card p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Check your email</h2>
            <p className="text-slate-400 text-sm mb-2">We sent a confirmation link to</p>
            <p className="text-white font-semibold mb-6">{form.email}</p>
            <p className="text-slate-500 text-xs mb-6">Click the link to verify your account, then sign in.</p>
            <Link href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
              Go to sign in <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="gradient-border-card p-8">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>Create your account</h1>
            <p className="text-slate-500 text-sm mb-7">Join the team and start building.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Smith"
                    className={`${inputClass('name')} pl-9`} />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="jane@company.com"
                    className={`${inputClass('email')} pl-9`} />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input type={showPassword ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className={`${inputClass('password')} pl-9 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(n => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-all ${strength >= n ? strengthColor : 'bg-white/10'}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-medium ${['','text-red-400','text-amber-400','text-emerald-400','text-violet-400'][strength]}`}>
                      {strengthLabel}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm password</label>
                <input type="password" value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repeat your password"
                  className={inputClass('confirm')} />
                {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full mt-2 py-3.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-slate-600 text-xs mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
