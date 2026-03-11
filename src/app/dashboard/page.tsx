import { FileText, BookOpen, DollarSign, Image as ImageIcon, ArrowRight, Clock, Globe, Tag, TrendingUp, Eye, Zap } from 'lucide-react';
import Link from 'next/link';
import { getAllPages, getBlogPosts, getAllPricingPlans, getMedia, getRecentActivity } from '@/lib/actions';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const [pages, posts, plans, media, activity] = await Promise.all([
    getAllPages(),
    getBlogPosts(),
    getAllPricingPlans(),
    getMedia(),
    getRecentActivity(),
  ]);

  const publishedPages = pages.filter((p) => p.status === 'published').length;
  const publishedPosts = posts.filter((p) => p.status === 'published').length;
  const draftPages = pages.length - publishedPages;
  const draftPosts = posts.length - publishedPosts;

  const stats = [
    {
      label: 'Pages', value: pages.length, href: '/dashboard/pages',
      icon: FileText, color: 'purple', sub: `${publishedPages} published · ${draftPages} draft`,
      sparkData: [3, 5, 4, 7, 6, 8, pages.length],
    },
    {
      label: 'Blog Posts', value: posts.length, href: '/dashboard/blog',
      icon: BookOpen, color: 'blue', sub: `${publishedPosts} live · ${draftPosts} drafts`,
      sparkData: [2, 3, 3, 4, 5, 5, posts.length],
    },
    {
      label: 'Pricing Plans', value: plans.length, href: '/dashboard/pricing',
      icon: DollarSign, color: 'emerald', sub: `${plans.filter(p => p.is_active).length} active plans`,
      sparkData: [1, 1, 2, 2, 3, 3, plans.length],
    },
    {
      label: 'Media Files', value: media.length, href: '/dashboard/media',
      icon: ImageIcon, color: 'amber', sub: `Stored in Supabase`,
      sparkData: [5, 8, 10, 14, 18, 20, media.length],
    },
  ];

  const colorConfig: Record<string, { icon: string; bg: string; border: string; glow: string; spark: string }> = {
    purple: { icon: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'shadow-violet-900/30', spark: 'bg-violet-500' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-900/30', spark: 'bg-blue-500' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-900/30', spark: 'bg-emerald-500' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-900/30', spark: 'bg-amber-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white animated-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
            Good morning ✦
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your site today.</p>
        </div>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl text-sm text-slate-400 hover:text-white hover:border-purple-500/30 transition-all">
          <Globe className="w-3.5 h-3.5" /> View site
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const c = colorConfig[stat.color];
          const maxSpark = Math.max(...stat.sparkData, 1);
          return (
            <Link key={stat.label} href={stat.href}
              className={`admin-stat-card glass-card rounded-2xl p-5 block border ${c.border} shadow-xl ${c.glow}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${c.icon}`} style={{ width: 18, height: 18 }} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
              </div>
              <div className="mb-3">
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                <p className="text-slate-600 text-[10px] mt-1">{stat.sub}</p>
              </div>
              {/* Sparkline */}
              <div className="flex items-end gap-0.5 h-6">
                {stat.sparkData.map((val, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${c.spark} opacity-60`}
                    style={{ height: `${Math.max(15, (val / maxSpark) * 100)}%` }} />
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="lg:col-span-2 gradient-border-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> Recent Activity
            </h2>
            <span className="text-[10px] text-slate-600 uppercase tracking-wider">Last 24h</span>
          </div>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-8 h-8 text-slate-800 mb-3" />
              <p className="text-slate-600 text-sm">No recent activity yet.</p>
              <p className="text-slate-700 text-xs mt-1">Create a page or post to get started.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div key={i} className="admin-row flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'page' ? 'bg-violet-500/10' : 'bg-blue-500/10'}`}>
                    {item.type === 'page'
                      ? <FileText className="w-3.5 h-3.5 text-violet-400" />
                      : <BookOpen className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    <p className="text-slate-600 text-xs">{item.type === 'page' ? 'Page' : 'Post'} · {formatDate(item.time)}</p>
                  </div>
                  <span className={`admin-chip ${item.action === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
                    <div className={`status-dot ${item.action === 'published' ? 'status-dot-green' : 'status-dot-amber'}`} />
                    {item.action}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="gradient-border-card p-5">
          <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" /> Quick Actions
          </h2>
          <div className="space-y-1">
            {[
              { label: 'New page', href: '/dashboard/pages/new', icon: FileText, color: 'text-violet-400' },
              { label: 'New blog post', href: '/dashboard/blog/new', icon: BookOpen, color: 'text-blue-400' },
              { label: 'Manage categories', href: '/dashboard/blog/categories', icon: Tag, color: 'text-cyan-400' },
              { label: 'Update pricing', href: '/dashboard/pricing', icon: DollarSign, color: 'text-emerald-400' },
              { label: 'Upload media', href: '/dashboard/media', icon: ImageIcon, color: 'text-amber-400' },
              { label: 'Team & Users', href: '/dashboard/users', icon: Globe, color: 'text-pink-400' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.href} href={a.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 text-slate-400 hover:text-white text-sm transition-all group">
                  <Icon className={`w-3.5 h-3.5 ${a.color} shrink-0`} />
                  <span>{a.label}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-600" />
                </Link>
              );
            })}
          </div>

          {/* Site health mini */}
          <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">Site Health</p>
            {[
              { label: 'Published pages', val: publishedPages, total: Math.max(pages.length, 1), color: 'bg-violet-500' },
              { label: 'Live posts', val: publishedPosts, total: Math.max(posts.length, 1), color: 'bg-blue-500' },
            ].map((h) => (
              <div key={h.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-600">{h.label}</span>
                  <span className="text-white font-medium">{h.val}/{h.total}</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${h.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(h.val / h.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
