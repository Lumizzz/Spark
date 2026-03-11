'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, FileText, BookOpen, DollarSign, Image as ImageIcon,
  Settings, Users, Search, LogOut, Sparkles, ExternalLink, Menu, X,
  Tag, ChevronRight, Bell, Hash } from 'lucide-react';
import type { Profile } from '@/types';
import toast from 'react-hot-toast';

const NAV_SECTIONS = [
  {
    label: 'Content',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/pages', label: 'Pages', icon: FileText },
      { href: '/dashboard/blog', label: 'Blog', icon: BookOpen },
      { href: '/dashboard/blog/categories', label: 'Categories', icon: Tag, sub: true },
      { href: '/dashboard/media', label: 'Media', icon: ImageIcon },
    ],
  },
  {
    label: 'Monetization',
    items: [
      { href: '/dashboard/pricing', label: 'Pricing', icon: DollarSign },
    ],
  },
  {
    label: 'Admin',
    items: [
      { href: '/dashboard/subscribers', label: 'Subscribers', icon: Hash },
      { href: '/dashboard/seo', label: 'SEO', icon: Search },
      { href: '/dashboard/users', label: 'Users', icon: Users },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
];

function getAvatarGradient(email: string) {
  const gradients = [
    'from-violet-500 via-purple-500 to-blue-500',
    'from-blue-500 via-cyan-500 to-teal-400',
    'from-rose-500 via-pink-500 to-purple-500',
    'from-amber-400 via-orange-500 to-red-500',
    'from-emerald-400 via-green-500 to-teal-500',
  ];
  const hash = (email || 'a').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

export default function DashboardSidebar({ user }: { user: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleName = (user.roles as { name: string } | undefined)?.name || 'editor';
  const initials = ((user.full_name || user.email || 'U').slice(0, 2)).toUpperCase();
  const avatarGradient = getAvatarGradient(user.email || '');

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/auth/login');
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>spark</span>
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium border border-purple-500/20">CMS</span>
          </div>
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 pb-3 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-600 px-3 mb-1.5">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative
                      ${item.sub ? 'ml-4 py-2 text-xs' : ''}
                      ${active ? 'sidebar-active font-medium' : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'}`}>
                    <Icon className={`shrink-0 transition-colors ${item.sub ? 'w-3 h-3' : 'w-4 h-4'} ${active ? 'text-purple-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    <span>{item.label}</span>
                    {active && <ChevronRight className="w-3 h-3 ml-auto text-purple-500/50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* View site */}
        <div className="pt-2 border-t border-white/5">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-300 hover:bg-white/4 transition-all group">
            <ExternalLink className="w-4 h-4 shrink-0 group-hover:text-purple-400 transition-colors" />
            <span>View live site</span>
          </a>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/3 border border-white/5">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.full_name || user.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="status-dot status-dot-green" />
              <p className="text-slate-500 text-[10px] capitalize">{roleName}</p>
            </div>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-600 hover:text-slate-300 cursor-pointer transition-colors" />
          </div>
        </div>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-card text-slate-400 hover:text-white transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 z-40 dashboard-sidebar admin-grid-bg">
        <SidebarContent />
      </aside>

      {/* Mobile */}
      <aside className={`md:hidden fixed left-0 top-0 bottom-0 w-64 z-50 dashboard-sidebar transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
}
