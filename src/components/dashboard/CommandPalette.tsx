'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, FileText, BookOpen, DollarSign, Image as ImageIcon, Settings, 
  Users, LayoutDashboard, Tag, Plus, Globe, ExternalLink, Hash,
} from 'lucide-react';

const COMMANDS = [
  { group: 'Navigate', items: [
    { id: 'dash', label: 'Dashboard Overview', icon: LayoutDashboard, href: '/dashboard', shortcut: 'G D' },
    { id: 'pages', label: 'Pages', icon: FileText, href: '/dashboard/pages', shortcut: 'G P' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, href: '/dashboard/blog', shortcut: 'G B' },
    { id: 'cats', label: 'Categories', icon: Tag, href: '/dashboard/blog/categories' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, href: '/dashboard/pricing' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, href: '/dashboard/media' },
    { id: 'users', label: 'Team & Users', icon: Users, href: '/dashboard/users' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { id: 'subscribers', label: 'Subscribers', icon: Hash, href: '/dashboard/subscribers' },
  ]},
  { group: 'Create', items: [
    { id: 'new-page', label: 'New Page', icon: Plus, href: '/dashboard/pages/new', shortcut: 'C P' },
    { id: 'new-post', label: 'New Blog Post', icon: Plus, href: '/dashboard/blog/new', shortcut: 'C B' },
  ]},
  { group: 'Site', items: [
    { id: 'site', label: 'View Live Site', icon: Globe, href: '/', external: true },
    { id: 'product', label: 'Product Page', icon: ExternalLink, href: '/product', external: true },
  ]},
];

interface CommandPaletteProps {
  onClose: () => void;
}

export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const flatItems = COMMANDS.flatMap(g => g.items);
  const filtered = query.trim()
    ? flatItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : flatItems;

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { setSelected(0); }, [query]);

  const go = (item: typeof flatItems[number]) => {
    onClose();
    if (item.external) {
      window.open(item.href, '_blank');
    } else {
      router.push(item.href);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) { go(filtered[selected]); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [filtered, selected, onClose]);

  // Group view when no search
  const display = query.trim()
    ? [{ group: 'Results', items: filtered.map(i => ({ ...i, _flat: true })) }]
    : COMMANDS.map(g => ({ ...g, items: g.items }));

  let globalIdx = -1;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="w-full max-w-lg" onClick={e => e.stopPropagation()}
        style={{ animation: 'command-in 0.15s cubic-bezier(0.16,1,0.3,1) forwards' }}>
        <div className="gradient-border-card overflow-hidden"
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)' }}>
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search commands, pages, settings..."
              className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none"
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-600 font-mono border border-white/8">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-slate-600 text-sm">No results for "{query}"</div>
            ) : (
              display.map((group) => (
                <div key={group.group}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700 px-5 py-2">{group.group}</p>
                  {group.items.map((item) => {
                    globalIdx++;
                    const idx = globalIdx;
                    const Icon = item.icon;
                    const isSelected = selected === (query.trim() ? idx : flatItems.findIndex(f => f.id === item.id));
                    const actualSelected = query.trim()
                      ? filtered.indexOf(filtered.find(f => f.id === item.id)!) === selected
                      : selected === flatItems.findIndex(f => f.id === item.id);

                    return (
                      <button key={item.id} onClick={() => go(item as typeof flatItems[number])}
                        onMouseEnter={() => setSelected(flatItems.findIndex(f => f.id === item.id))}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all text-left
                          ${actualSelected ? 'bg-violet-600/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/4'}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${actualSelected ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                          <Icon className={`w-3.5 h-3.5 ${actualSelected ? 'text-violet-400' : 'text-slate-600'}`} />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {'shortcut' in item && item.shortcut && (
                          <div className="flex gap-1">
                            {String(item.shortcut).split(' ').map((k: string) => (
                              <kbd key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-700 font-mono border border-white/8">{k}</kbd>
                            ))}
                          </div>
                        )}
                        {'external' in item && item.external && <ExternalLink className="w-3 h-3 text-slate-700" />}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-4 px-5 py-3 border-t border-white/5 text-[10px] text-slate-700">
            <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded border border-white/8">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded border border-white/8">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded border border-white/8">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
