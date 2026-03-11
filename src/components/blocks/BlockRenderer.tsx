import React from 'react';
import type { PageSection, PricingPlan, BlogPost } from '@/types';
import HeroBlock from './HeroBlock';
import FeaturesGridBlock from './FeaturesGridBlock';
import PricingTableBlock from './PricingTableBlock';
import CTASectionBlock from './CTASectionBlock';
import { TestimonialsBlock, FAQSectionBlock, ImageTextBlock, RichTextBlock, GalleryBlock, LogoStripBlock, BlogListBlock } from './OtherBlocks';
import { StatsBarBlock, CodeShowcaseBlock, FeatureShowcaseBlock, ComparisonTableBlock, NewsletterBlock, TimelineBlock, TeamGridBlock, VideoEmbedBlock } from './NewBlocks';
import type { TimelineProps, TeamGridProps, VideoEmbedProps } from './NewBlocks';
import type { StatsBarProps, CodeShowcaseProps, FeatureShowcaseProps, ComparisonTableProps, NewsletterProps } from '@/types';

interface BlockRendererProps {
  key?: string;
  section: PageSection;
  pricingPlans?: PricingPlan[];
  blogPosts?: BlogPost[];
}

export default function BlockRenderer({ section, pricingPlans = [], blogPosts = [] }: BlockRendererProps) {
  switch (section.type) {
    case 'hero': return <HeroBlock props={section.props as Parameters<typeof HeroBlock>[0]['props']} />;
    case 'features_grid': return <FeaturesGridBlock props={section.props as Parameters<typeof FeaturesGridBlock>[0]['props']} />;
    case 'pricing_table': return <PricingTableBlock props={section.props as Parameters<typeof PricingTableBlock>[0]['props']} plans={pricingPlans} />;
    case 'cta_section': return <CTASectionBlock props={section.props as Parameters<typeof CTASectionBlock>[0]['props']} />;
    case 'testimonials': return <TestimonialsBlock props={section.props as Parameters<typeof TestimonialsBlock>[0]['props']} />;
    case 'faq_section': return <FAQSectionBlock props={section.props as Parameters<typeof FAQSectionBlock>[0]['props']} />;
    case 'image_text': return <ImageTextBlock props={section.props as Parameters<typeof ImageTextBlock>[0]['props']} />;
    case 'rich_text': return <RichTextBlock props={section.props as Parameters<typeof RichTextBlock>[0]['props']} />;
    case 'gallery': return <GalleryBlock props={section.props as Parameters<typeof GalleryBlock>[0]['props']} />;
    case 'logo_strip': return <LogoStripBlock props={section.props as Parameters<typeof LogoStripBlock>[0]['props']} />;
    case 'blog_list': return <BlogListBlock props={section.props as Parameters<typeof BlogListBlock>[0]['props']} posts={blogPosts} />;
    case 'stats_bar': return <StatsBarBlock props={section.props as StatsBarProps} />;
    case 'code_showcase': return <CodeShowcaseBlock props={section.props as CodeShowcaseProps} />;
    case 'feature_showcase': return <FeatureShowcaseBlock props={section.props as FeatureShowcaseProps} />;
    case 'comparison_table': return <ComparisonTableBlock props={section.props as ComparisonTableProps} />;
    case 'newsletter': return <NewsletterBlock props={section.props as NewsletterProps} />;
    case 'timeline': return <TimelineBlock props={section.props as TimelineProps} />;
    case 'team_grid': return <TeamGridBlock props={section.props as TeamGridProps} />;
    case 'video_embed': return <VideoEmbedBlock props={section.props as VideoEmbedProps} />;
    default: return null;
  }
}
