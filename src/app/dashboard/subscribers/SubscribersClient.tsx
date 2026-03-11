'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unsubscribeEmail, deleteSubscriber } from '@/lib/actions';
import { Mail, Search, Download, Trash2, UserX, Users, TrendingUp, Hash } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

type Sub = { id: string; email: string; name: string | null; status: string; source: string | null; created_at: string };

export default function SubscribersClient({ subscribers }: { subscribers: Sub[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');

  const active = subscribers.filter(s => s.status === 'subscribed').length;
  const unsub = subscribers.filter(s => s.status === 'unsubscribed').length;

  const filtered = subscribers.filter(s => {
    const matchSearch = (s.email + (s.name || '')).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const handleUnsubscribe = async (id: string) => {
    const { error } = await unsubscribeEmail(id);
    if (error) toast.error(error);
    else { toast.success('Unsubscribed'); router.refresh(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscriber permanently?')) return;
    const { error } = await deleteSubscriber(id);
    if (error) toast.error(error);
    else { toast.success('Deleted'); router.refresh(); }
  };

  const exportCSV = () => {
    const header = 'Email,Name,Status,Source,Subscribed On\n';
    const rows = subscribers.map(s => `${s.email},${s.name || ''},${s.status},${s.source || ''},${s.created_at}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white animated-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Subscribers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your newsletter list</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl text-sm text-slate-400 hover:text-white hover:border-violet-500/30 transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: subscribers.length, icon: Users, color: 'text-violet-400 bg-violet-500/10' },
          { label: 'Active', value: active, icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Unsubscribed', value: unsub, icon: UserX, color: 'text-slate-400 bg-slate-500/10' },
        ].map((s) => {
          const Icon = s.icon;
          const [text, bg] = s.color.split(' ');
          return (
            <div key={s.label} className="admin-stat-card glass-card rounded-2xl p-4 border border-white/5">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="gradient-border-card overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-white/5 flex-wrap">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-slate-600 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-700 focus:outline-none min-w-0" />
          </div>
          <div className="flex gap-1">
            {(['all', 'subscribed', 'unsubscribed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20' : 'text-slate-500 hover:text-white'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-700">{filtered.length} results</span>
        </div>

        <div className="grid grid-cols-[1fr,120px,100px,auto] gap-4 px-5 py-2.5 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>Subscriber</span><span>Status</span><span>Date</span><span className="text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Mail className="w-10 h-10 text-slate-800 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">No subscribers yet.</p>
            <p className="text-slate-700 text-xs mt-1">Add a Newsletter block to your pages to collect emails.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((sub) => (
              <div key={sub.id} className="admin-row grid grid-cols-[1fr,120px,100px,auto] gap-4 px-5 py-3.5 items-center transition-colors">
                <div>
                  <p className="text-white text-sm font-medium">{sub.email}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{sub.name || 'No name'} · via {sub.source || 'website'}</p>
                </div>
                <span className={`admin-chip border w-fit ${sub.status === 'subscribed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                  <div className={`status-dot ${sub.status === 'subscribed' ? 'status-dot-green' : 'status-dot-amber'}`} />
                  {sub.status}
                </span>
                <span className="text-slate-600 text-xs">{formatDate(sub.created_at)}</span>
                <div className="flex items-center gap-1 justify-end">
                  {sub.status === 'subscribed' && (
                    <button onClick={() => handleUnsubscribe(sub.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Unsubscribe">
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(sub.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
