'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import type { NavLink, SiteSettings } from '@/types';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <nav className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center glow-purple">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-display font-bold text-lg text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {settings.logo_text || 'spark'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {settings.nav_links?.map((link: NavLink) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/download"
              className="px-4 py-2 text-sm text-white rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-200"
            >
              Download
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="glass-card rounded-2xl mt-2 p-4 md:hidden max-w-7xl mx-auto">
            <div className="flex flex-col gap-1">
              {settings.nav_links?.map((link: NavLink) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5 mt-2 flex gap-2">
                <Link
                  href="/download"
                  className="flex-1 px-4 py-2 text-sm text-center text-white rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Download
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 px-4 py-2 text-sm text-center bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
