import { Metadata } from 'next';
import { getBlogPosts } from '@/lib/actions';
import Link from 'next/link';
import { Tag, Calendar, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Changelog — Spark',
  description: 'Every update, improvement, and fix. Stay in the loop.',
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  feature: { label: 'New', color: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
  improvement: { label: 'Improved', color: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  fix: { label: 'Fixed', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  breaking: { label: 'Breaking', color: 'bg-red-500/15 text-red-300 border-red-500/25' },
};

function detectType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('fix') || t.includes('bug') || t.includes('patch')) return 'fix';
  if (t.includes('improve') || t.includes('enhanc') || t.includes('update') || t.includes('upgrade')) return 'improvement';
  if (t.includes('breaking') || t.includes('deprecat') || t.includes('remov')) return 'breaking';
  return 'feature';
}

export default async function ChangelogPage() {
  const allPosts = await getBlogPosts();
  // Use posts tagged 'changelog' or fall back to all published posts
  const posts = allPosts
    .filter(p => p.status === 'published')
    .filter(p => {
      const cats = (p.categories as { slug: string }[] | undefined) || [];
      return cats.some(c => c.slug === 'changelog') || cats.length === 0;
    })
    .slice(0, 20);

  // Group by year-month
  const grouped = new Map<string, typeof posts>();
  for (const post of posts) {
    const d = new Date(post.published_at || post.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en', { month: 'long', year: 'numeric' });
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(post);
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3 h-3" /> Always improving
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Changelog</h1>
          <p className="text-slate-400 text-lg">Every update, improvement, and fix. No marketing fluff.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
              <Tag className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium mb-2">No updates yet</p>
            <p className="text-slate-600 text-sm">Tag blog posts with "changelog" to see them here.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent hidden sm:block" />

            <div className="space-y-14">
              {Array.from(grouped.entries()).map(([month, entries]) => (
                <div key={month}>
                  {/* Month label */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="hidden sm:flex w-36 shrink-0 justify-end">
                      <span className="text-violet-400 text-xs font-bold uppercase tracking-widest whitespace-nowrap">{month}</span>
                    </div>
                    <div className="hidden sm:block w-3 h-3 rounded-full border-2 border-violet-500 bg-violet-500/30 shadow-lg shadow-violet-900/50 shrink-0 -ml-[7px]" />
                    <div className="sm:hidden">
                      <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">{month}</span>
                    </div>
                  </div>

                  <div className="sm:pl-[calc(144px+12px)] space-y-4">
                    {entries.map((post) => {
                      const type = detectType(post.title);
                      const cfg = TYPE_CONFIG[type];
                      return (
                        <Link key={post.id} href={`/blog/${post.slug}`}
                          className="block gradient-border-card p-5 hover:translate-x-1 transition-all duration-200 group">
                          <div className="flex items-start gap-3 flex-wrap">
                            <span className={`admin-chip border text-[10px] font-bold uppercase tracking-wide ${cfg.color} shrink-0`}>
                              {cfg.label}
                            </span>
                            <h3 className="text-white font-semibold text-sm group-hover:text-violet-300 transition-colors flex-1"
                              style={{ fontFamily: 'var(--font-display)' }}>
                              {post.title}
                            </h3>
                          </div>
                          {post.excerpt && (
                            <p className="text-slate-500 text-sm mt-2.5 leading-relaxed line-clamp-2">{post.excerpt}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-3 text-slate-700 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.published_at || post.created_at)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
