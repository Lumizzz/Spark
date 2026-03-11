import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { getPricingPlans, getBlogPosts } from '@/lib/actions';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import type { PageSection, Page } from '@/types';

type Props = {
  params: { slug: string };
};

async function getPage(slug: string): Promise<Page | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

// Uses admin client — no cookies() call, safe at build time
export async function generateStaticParams() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('pages').select('slug').eq('status', 'published');
  return (data || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.slug);
  if (!page) return {};
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
    openGraph: { images: page.og_image ? [page.og_image] : [] },
  };
}

export default async function DynamicPage({ params }: Props) {
  const page = await getPage(params.slug);
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
      {sections.map((section: PageSection) => (
        <BlockRenderer
          key={section.id}
          section={section}
          pricingPlans={pricingPlans}
          blogPosts={blogPosts}
        />
      ))}
    </>
  );
}
