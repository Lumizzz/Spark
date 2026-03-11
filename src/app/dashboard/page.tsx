import { FileText, BookOpen, DollarSign, Image, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllPages, getBlogPosts, getAllPricingPlans, getMedia } from '@/lib/actions';

export default async function DashboardPage() {
  const [pages, posts, plans, media] = await Promise.all([
    getAllPages(),
    getBlogPosts(),
    getAllPricingPlans(),
    getMedia(),
  ]);

  const stats = [
    { label: 'Pages', value: pages.length, icon: FileText, href: '/dashboard/pages', color: 'purple' },
    { label: 'Blog Posts', value: posts.length, icon: BookOpen, href: '/dashboard/blog', color: 'blue' },
    { label: 'Pricing Plans', value: plans.length, icon: DollarSign, href: '/dashboard/pricing', color: 'green' },
    { label: 'Media Files', value: media.length, icon: Image, href: '/dashboard/media', color: 'orange' },
  ];

  const colorMap: Record<string, string> = {
    purple: 'bg-purple-500/10 text-purple-400',
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    orange: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Welcome back. Here&apos;s an overview of your site.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="glass-card glass-card-hover rounded-2xl p-5 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[stat.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Create new page', href: '/dashboard/pages' },
              { label: 'Write blog post', href: '/dashboard/blog' },
              { label: 'Update pricing', href: '/dashboard/pricing' },
              { label: 'Upload media', href: '/dashboard/media' },
              { label: 'Site settings', href: '/dashboard/settings' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white text-sm transition-all group"
              >
                {action.label}
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Recent Posts
          </h2>
          {posts.slice(0, 5).length === 0 ? (
            <p className="text-slate-500 text-sm">No posts yet. <Link href="/dashboard/blog" className="text-purple-400">Create one →</Link></p>
          ) : (
            <div className="space-y-2">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-300 truncate">{post.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
