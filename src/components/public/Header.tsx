'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Sun, Moon } from 'lucide-react';
import type { NavLink, SiteSettings } from '@/types';

interface HeaderProps { settings: SiteSettings; }

function useDarkMode() {
  const [dark, setDark] = useState(true); // default dark
  useEffect(() => {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'light') { setDark(false); document.documentElement.classList.add('light-mode'); }
  }, []);
  const toggle = () => {
    setDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('color-mode', 'dark');
      } else {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('color-mode', 'light');
      }
      return next;
    });
  };
  return { dark, toggle };
}

export default function Header({ settings }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { dark, toggle } = useDarkMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className={`mx-4 mt-4 transition-all duration-300 ${scrolled ? 'mt-2' : ''}`}>
        <nav className={`glass-card rounded-2xl px-5 py-2.5 flex items-center justify-between max-w-7xl mx-auto transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-900/30 group-hover:shadow-violet-700/40 transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {settings.logo_text || 'spark'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {settings.nav_links?.map((link: NavLink) => (
              <Link key={link.href} href={link.href}
                className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-150">
                {link.label}
              </Link>
            ))}
            <Link href="/changelog"
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-150">
              Changelog
            </Link>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark mode toggle */}
            <button onClick={toggle}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/auth/login"
              className="px-4 py-2 text-sm text-white rounded-xl border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all">
              Sign in
            </Link>
            <Link href="/dashboard"
              className="px-4 py-2 text-sm bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="glass-card rounded-2xl mt-2 p-3 md:hidden max-w-7xl mx-auto" style={{ animation: 'command-in 0.15s ease forwards' }}>
            <div className="flex flex-col gap-0.5">
              {settings.nav_links?.map((link: NavLink) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                  {link.label}
                </Link>
              ))}
              <Link href="/changelog" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
                Changelog
              </Link>
              <div className="pt-2 border-t border-white/5 mt-1 flex gap-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-center text-white rounded-xl border border-white/10 hover:bg-white/5 transition-all">
                  Sign in
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-center bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
