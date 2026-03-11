'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandPalette from './CommandPalette';
import NotificationBell from './NotificationBell';
import OnboardingChecklist from './OnboardingChecklist';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev: boolean) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <main className="flex-1 min-w-0 md:ml-64 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/5 bg-[rgba(6,6,15,0.85)] backdrop-blur-xl">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-violet-500/30 hover:bg-violet-500/[0.04] transition-all text-xs group"
          >
            <Search className="w-3.5 h-3.5 group-hover:text-violet-400 transition-colors" />
            <span>Search commands...</span>
            <div className="hidden sm:flex items-center gap-0.5 ml-2">
              <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/8 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/8 font-mono">K</kbd>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 pt-6">{children}</div>
      </main>

      {paletteOpen && (
        <div className="fixed inset-0 z-[100] command-overlay" onClick={() => setPaletteOpen(false)}>
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CommandPalette onClose={() => setPaletteOpen(false)} />
          </div>
        </div>
      )}

      <OnboardingChecklist />
    </>
  );
}
