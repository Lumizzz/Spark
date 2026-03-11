import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { getPricingPlans, getBlogPosts } from '@/lib/actions';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import type { PageSection, Page } from '@/types';

type Props = {
  params: { slug: string };
  searchParams: { preview?: string };
};

async function getPage(slug: string, preview: boolean): Promise<Page | null> {
  const supabase = createAdminClient();
  const query = supabase.from('pages').select('*').eq('slug', slug);
  if (!preview) query.eq('status', 'published');
  const { data } = await query.single();
  return data;
}

export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('pages').select('slug').eq('status', 'published');
  return (data || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.slug, false);
  if (!page) return {};
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
    openGraph: { images: page.og_image ? [page.og_image] : [] },
  };
}

export default async function DynamicPage({ params, searchParams }: Props) {
  const isPreview = searchParams?.preview === 'true';
  const page = await getPage(params.slug, isPreview);
  if (!page) notFound();

  const sections: PageSection[] = (page.layout?.sections || []).sort(
    (a: PageSection, b: PageSection) => a.order - b.order
  );

  const needsPricing = sections.some((s) => s.type === 'pricing_table');
  const needsBlog = sections.some((s) => s.type === 'blog_list');

  const [pricingPlans, blogPosts] = await Promise.all([
    needsPricing ? getPricingPlans() : Promise.resolve([]),
    needsBlog ? getBlogPosts({ status: 'published', limit: 9 }) : Promise.resolve([]),
  ]);

  return (
    <>
      {isPreview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-yellow-500 text-black text-xs font-semibold shadow-lg">
          📝 Preview mode — <a href={`/${params.slug}`} className="underline">Exit preview</a>
        </div>
      )}
      {sections.map((section: PageSection) => (
        <BlockRenderer key={section.id} section={section} pricingPlans={pricingPlans} blogPosts={blogPosts} />
      ))}
    </>
  );
}
