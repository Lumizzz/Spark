'use client';
import React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Bell, Mail, FileText, Users, BookOpen, X, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type NotifType = 'subscriber' | 'page' | 'post' | 'user';

interface Notif {
  id: string;
  type: NotifType;
  message: string;
  detail?: string;
  time: string;
  read: boolean;
}

const TYPE_CONFIG: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  subscriber: { icon: Mail, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  page: { icon: FileText, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  post: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  user: { icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

// Demo notifications — in production, poll from Supabase realtime
const DEMO: Notif[] = [
  { id: '1', type: 'subscriber', message: 'New subscriber', detail: 'hello@example.com joined your list', time: new Date(Date.now() - 120000).toISOString(), read: false },
  { id: '2', type: 'page', message: 'Page published', detail: '"About Us" is now live', time: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: '3', type: 'post', message: 'Blog post drafted', detail: '"Getting Started with Spark"', time: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: '4', type: 'user', message: 'Team invite sent', detail: 'Invite sent to dev@company.com', time: new Date(Date.now() - 86400000).toISOString(), read: true },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(DEMO);
  const [ringing, setRinging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = notifs.filter((n: Notif) => !n.read).length;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const markAll = () => setNotifs((n: Notif[]) => n.map((x: Notif) => ({ ...x, read: true })));
  const dismiss = (id: string) => setNotifs((n: Notif[]) => n.filter((x: Notif) => x.id !== id));

  const ringBell = () => {
    setRinging(true);
    setTimeout(() => setRinging(false), 600);
    setOpen((p: boolean) => !p);
  };

  const timeAgo = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={ringBell}
        className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all ${open ? 'bg-violet-500/15 text-violet-400' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}`}>
        <Bell className={`w-4 h-4 ${ringing ? 'bell-ring' : ''}`} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center border border-[#06060f]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 z-50" style={{ animation: 'command-in 0.15s ease forwards' }}>
          <div className="gradient-border-card overflow-hidden" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold" style={{ fontFamily: 'var(--font-display)' }}>Notifications</span>
                {unread > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-bold">{unread} new</span>}
              </div>
              {unread > 0 && (
                <button onClick={markAll} className="flex items-center gap-1 text-[10px] text-slate-600 hover:text-violet-400 transition-colors">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs">No notifications yet</p>
                </div>
              ) : notifs.map((n: Notif) => {
                const cfg = TYPE_CONFIG[n.type as NotifType];
                const Icon = cfg.icon;
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors hover:bg-white/2 ${!n.read ? 'bg-violet-500/3' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${n.read ? 'text-slate-500' : 'text-white'}`}>{n.message}</p>
                      {n.detail && <p className="text-slate-600 text-[10px] mt-0.5 truncate">{n.detail}</p>}
                      <p className="text-slate-700 text-[10px] mt-1">{timeAgo(n.time)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />}
                      <button onClick={() => dismiss(n.id)} className="p-1 text-slate-700 hover:text-red-400 transition-colors rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
