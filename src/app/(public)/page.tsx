import { Metadata } from 'next';
import { getPageBySlug, getPricingPlans, getBlogPosts, getSiteSettings } from '@/lib/actions';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import type { PageSection } from '@/types';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const page = await getPageBySlug('home');
  return {
    title: page?.meta_title || settings.site_name,
    description: page?.meta_description || settings.site_tagline,
    openGraph: { images: page?.og_image ? [page.og_image] : [] },
  };
}

export default async function HomePage() {
  const [page, pricingPlans, blogPosts] = await Promise.all([
    getPageBySlug('home'),
    getPricingPlans(),
    getBlogPosts({ status: 'published', limit: 6 }),
  ]);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Page not found. Set up your home page in the dashboard.</p>
      </div>
    );
  }

  const sections: PageSection[] = (page.layout?.sections || []).sort(
    (a: PageSection, b: PageSection) => a.order - b.order
  );

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
