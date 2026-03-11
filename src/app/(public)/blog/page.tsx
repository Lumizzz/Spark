import { Metadata } from 'next';
import { getBlogPosts, getCategories, getSiteSettings } from '@/lib/actions';
import { BlogListBlock } from '@/components/blocks/OtherBlocks';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates from the team.',
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getBlogPosts({ status: 'published' }),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 text-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.5) 0%, transparent 60%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
          BLOG
        </p>
        <h1
          className="relative text-5xl font-bold gradient-text mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The {settings.site_name} Blog
        </h1>
        <p className="relative text-slate-400 text-lg max-w-xl mx-auto">
          Insights, tutorials, and updates from our team.
        </p>
      </section>

      <BlogListBlock props={{ postsPerPage: 9, showCategories: true, layout: 'grid' }} posts={posts} />
    </>
  );
}
