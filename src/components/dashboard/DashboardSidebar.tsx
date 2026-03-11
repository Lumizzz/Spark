'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  DollarSign,
  Image,
  Settings,
  Users,
  Search,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { Profile } from '@/types';
import toast from 'react-hot-toast';

interface DashboardSidebarProps {
  user: Profile;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/pages', label: 'Pages', icon: FileText },
  { href: '/dashboard/blog', label: 'Blog', icon: BookOpen },
  { href: '/dashboard/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/dashboard/media', label: 'Media', icon: Image },
  { href: '/dashboard/seo', label: 'SEO', icon: Search },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/auth/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 dashboard-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            spark <span className="text-slate-500 font-normal text-xs">CMS</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/4'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/4 transition-all"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View Site
          </a>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {(user.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.full_name || user.email}</p>
            <p className="text-slate-500 text-xs capitalize">{(user.roles as { name: string } | undefined)?.name || 'editor'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
