import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/actions';
import { createAdminClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Clock } from 'lucide-react';
import ReadingProgress from '@/components/public/ReadingProgress';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('blog_posts').select('slug').eq('status', 'published');
  return (data || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    openGraph: {
      images: post.og_image ? [post.og_image] : post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl mx-auto px-6 pt-40 pb-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>

        {post.categories && (
          <span className="text-xs font-semibold px-2 py-1 rounded-md mb-4 inline-block"
            style={{ background: `${post.categories.color}20`, color: post.categories.color }}>
            {post.categories.name}
          </span>
        )}

        <h1 className="text-4xl md:text-5xl font-bold gradient-text mt-3 mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-slate-500 text-sm mb-8">
          <span>{formatDate(post.published_at)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.read_time} min read
          </span>
        </div>

        {post.featured_image && (
          <div className="relative rounded-2xl overflow-hidden aspect-video mb-10">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg text-slate-300 leading-relaxed mb-8 border-l-2 border-purple-500 pl-4 italic">{post.excerpt}</p>
        )}

        <div className="prose-dark" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 glass-card rounded-full text-xs text-slate-400">#{tag}</span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
