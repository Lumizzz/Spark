'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const TASKS = [
  { id: 'site_name', label: 'Set your site name', href: '/dashboard/settings', desc: 'Give your site an identity' },
  { id: 'first_page', label: 'Create your first page', href: '/dashboard/pages/new', desc: 'Build something to show the world' },
  { id: 'first_post', label: 'Write a blog post', href: '/dashboard/blog/new', desc: 'Share your first story' },
  { id: 'pricing', label: 'Configure pricing plans', href: '/dashboard/pricing', desc: 'Start monetizing' },
  { id: 'seo', label: 'Set up SEO', href: '/dashboard/seo', desc: 'Get found on Google' },
  { id: 'invite', label: 'Invite a team member', href: '/dashboard/users', desc: 'Collaborate with others' },
];

export default function OnboardingChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('onboarding-completed');
    if (saved) setCompleted(new Set(JSON.parse(saved)));
    const dis = localStorage.getItem('onboarding-dismissed');
    if (dis) setDismissed(true);
    const min = localStorage.getItem('onboarding-minimized');
    if (min) setMinimized(true);
  }, []);

  const toggle = (id: string) => {
    setCompleted((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem('onboarding-completed', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('onboarding-dismissed', '1');
  };

  const toggleMin = () => {
    setMinimized((p: boolean) => {
      localStorage.setItem('onboarding-minimized', p ? '' : '1');
      return !p;
    });
  };

  if (!mounted || dismissed) return null;

  const done = completed.size;
  const total = TASKS.length;
  const pct = Math.round((done / total) * 100);
  const allDone = done === total;

  // Progress ring
  const R = 16;
  const circ = 2 * Math.PI * R;
  const offset = circ - (pct / 100) * circ;

  if (allDone) {
    return (
      <div className="fixed bottom-6 left-[272px] z-40 onboarding-card">
        <div className="gradient-border-card p-5 max-w-xs text-center" style={{ boxShadow: '0 20px 60px rgba(124,58,237,0.3)' }}>
          <div className="text-3xl mb-3">🎉</div>
          <p className="text-white font-bold text-sm mb-1" style={{ fontFamily: 'var(--font-display)' }}>Setup complete!</p>
          <p className="text-slate-500 text-xs mb-4">You're all set. Go build something amazing.</p>
          <button onClick={dismiss} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-[272px] z-40 onboarding-card w-72">
      <div className="gradient-border-card overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
          <div className="relative shrink-0">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle cx="20" cy="20" r={R} fill="none" stroke="#7C3AED" strokeWidth="3"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" className="progress-ring-circle" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{pct}%</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-xs" style={{ fontFamily: 'var(--font-display)' }}>Getting started</p>
            <p className="text-slate-600 text-[10px]">{done} of {total} complete</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleMin} className="p-1 text-slate-600 hover:text-white transition-colors">
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${minimized ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={dismiss} className="p-1 text-slate-600 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-2">
            {TASKS.map((task) => {
              const done = completed.has(task.id);
              return (
                <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors group">
                  <button onClick={() => toggle(task.id)} className="shrink-0 mt-0.5 transition-all">
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-violet-400 check-pop" />
                      : <Circle className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <Link href={task.href} className={`text-xs font-medium transition-colors ${done ? 'text-slate-600 line-through' : 'text-slate-300 hover:text-white'}`}>
                      {task.label}
                    </Link>
                    {!done && <p className="text-slate-700 text-[10px] mt-0.5">{task.desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
