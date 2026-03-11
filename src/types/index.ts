// ============================================================
// Database Types
// ============================================================

export type Role = {
  id: string;
  name: 'admin' | 'editor';
  permissions: string[];
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role_id: string | null;
  created_at: string;
  updated_at: string;
  roles?: Role;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
};

export type SiteSettings = {
  site_name: string;
  site_tagline: string;
  site_url: string;
  logo_text: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  nav_links: NavLink[];
  footer_links: NavLink[];
  social_links: SocialLinks;
  analytics_id: string | null;
  maintenance_mode: boolean;
};

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLinks = {
  twitter: string;
  github: string;
  discord: string;
  linkedin: string;
};

export type MediaItem = {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  size: number | null;
  mime_type: string | null;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived';
  category_id: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  tags: string[];
  read_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
  profiles?: Profile;
};

export type PricingPlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  billing_period: string;
  is_popular: boolean;
  is_active: boolean;
  cta_text: string;
  cta_link: string;
  badge_text: string | null;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  pricing_features?: PricingFeature[];
};

export type PricingFeature = {
  id: string;
  plan_id: string;
  feature_text: string;
  is_included: boolean;
  sort_order: number;
  created_at: string;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  layout: PageLayout;
  created_by: string | null;
  updated_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// ============================================================
// Page Builder Types
// ============================================================

export type PageLayout = {
  sections: PageSection[];
};

export type PageSection = {
  id: string;
  type: BlockType;
  order: number;
  props: BlockProps;
};

export type BlockType =
  | 'hero'
  | 'features_grid'
  | 'pricing_table'
  | 'testimonials'
  | 'cta_section'
  | 'faq_section'
  | 'image_text'
  | 'blog_list'
  | 'rich_text'
  | 'gallery'
  | 'logo_strip'
  | 'stats_bar'
  | 'code_showcase'
  | 'feature_showcase'
  | 'comparison_table'
  | 'newsletter'
  | 'timeline'
  | 'team_grid'
  | 'video_embed';

// Each block's props
export type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaPrimary?: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  backgroundImage?: string;
  backgroundGradient?: boolean;
  showOrbs?: boolean;
  size?: 'small' | 'medium' | 'large';
};

export type FeaturesGridProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
  features: FeatureItem[];
};

export type FeatureItem = {
  icon?: string;
  title: string;
  description: string;
  iconColor?: string;
};

export type PricingTableProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showToggle?: boolean;
};

export type TestimonialsProps = {
  eyebrow?: string;
  title?: string;
  testimonials: TestimonialItem[];
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
};

export type CTASectionProps = {
  title: string;
  subtitle?: string;
  ctaPrimary?: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  backgroundStyle?: 'gradient' | 'dark' | 'purple';
};

export type FAQSectionProps = {
  eyebrow?: string;
  title?: string;
  faqs: FAQItem[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ImageTextProps = {
  title: string;
  content: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaHref?: string;
};

export type BlogListProps = {
  postsPerPage?: number;
  showCategories?: boolean;
  layout?: 'grid' | 'list';
};

export type RichTextProps = {
  content: string;
  alignment?: 'left' | 'center' | 'right';
  maxWidth?: 'prose' | 'wide' | 'full';
};

export type GalleryProps = {
  title?: string;
  images: { url: string; alt: string }[];
  columns?: 2 | 3 | 4;
};

export type LogoStripProps = {
  title?: string;
  logos: string[];
};

export type BlockProps =
  | HeroProps
  | FeaturesGridProps
  | PricingTableProps
  | TestimonialsProps
  | CTASectionProps
  | FAQSectionProps
  | ImageTextProps
  | BlogListProps
  | RichTextProps
  | GalleryProps
  | LogoStripProps
  | StatsBarProps
  | CodeShowcaseProps
  | FeatureShowcaseProps
  | ComparisonTableProps
  | NewsletterProps
  | TimelineProps
  | TeamGridProps
  | VideoEmbedProps;

// ============================================================
// Form Types
// ============================================================

export type BlogPostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: 'draft' | 'published';
  category_id: string;
  meta_title: string;
  meta_description: string;
  tags: string;
  read_time: number;
};

export type PricingPlanFormData = {
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  is_popular: boolean;
  is_active: boolean;
  cta_text: string;
  cta_link: string;
  badge_text: string;
  sort_order: number;
};

// ============================================================
// API Response Types
// ============================================================

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// ============================================================
// NEW BLOCK TYPES
// ============================================================

export type StatsBarProps = {
  eyebrow?: string;
  title?: string;
  stats: StatItem[];
  background?: 'transparent' | 'dark' | 'gradient';
};

export type StatItem = {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
};

export type CodeShowcaseProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tabs: CodeTab[];
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
};

export type CodeTab = {
  label: string;
  language: string;
  code: string;
};

export type FeatureShowcaseProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  features: ShowcaseFeature[];
};

export type ShowcaseFeature = {
  icon?: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
};

export type ComparisonTableProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  competitors: string[];
  features: ComparisonFeature[];
};

export type ComparisonFeature = {
  name: string;
  values: (boolean | string)[];
};

export type NewsletterProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  backgroundStyle?: 'dark' | 'gradient' | 'purple';
};


// ─── EXTRA BLOCK TYPES ───────────────────────────────────────
export type TimelineProps = {
  eyebrow?: string; title?: string; subtitle?: string;
  items: { year: string; title: string; description: string; badge?: string }[];
};

export type TeamGridProps = {
  eyebrow?: string; title?: string; subtitle?: string;
  members: { name: string; role: string; bio?: string; avatar?: string }[];
};

export type VideoEmbedProps = {
  eyebrow?: string; title?: string; subtitle?: string;
  videoUrl: string; thumbnailUrl?: string; aspectRatio?: '16:9' | '4:3' | '1:1';
};
