-- ============================================================
-- SAAS CMS - Complete Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (name, permissions) VALUES
  ('admin', '["all"]'::jsonb),
  ('editor', '["pages.read","pages.write","blog.read","blog.write","media.read","media.write"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES public.roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  editor_role_id UUID;
BEGIN
  SELECT id INTO editor_role_id FROM public.roles WHERE name = 'editor' LIMIT 1;
  INSERT INTO public.profiles (id, email, full_name, role_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    editor_role_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"Spark"'::jsonb),
  ('site_tagline', '"Build better software, faster"'::jsonb),
  ('site_url', '"https://yourdomain.com"'::jsonb),
  ('logo_text', '"spark"'::jsonb),
  ('logo_url', 'null'::jsonb),
  ('favicon_url', 'null'::jsonb),
  ('primary_color', '"#7C3AED"'::jsonb),
  ('nav_links', '[{"label":"Product","href":"/product"},{"label":"Examples","href":"/examples"},{"label":"Pricing","href":"/pricing"},{"label":"About us","href":"/about"},{"label":"Blog","href":"/blog"}]'::jsonb),
  ('footer_links', '[{"label":"Privacy","href":"/privacy"},{"label":"Terms","href":"/terms"},{"label":"Contact","href":"/contact"}]'::jsonb),
  ('social_links', '{"twitter":"","github":"","discord":"","linkedin":""}'::jsonb),
  ('analytics_id', 'null'::jsonb),
  ('maintenance_mode', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  alt_text TEXT DEFAULT '',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES (for blog)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#7C3AED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.categories (name, slug, color) VALUES
  ('Engineering', 'engineering', '#3B82F6'),
  ('Product', 'product', '#7C3AED'),
  ('News', 'news', '#10B981'),
  ('Tutorials', 'tutorials', '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT DEFAULT '',
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES auth.users(id),
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRICING PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT DEFAULT 'monthly',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  cta_text TEXT DEFAULT 'Get started',
  cta_link TEXT DEFAULT '/contact',
  badge_text TEXT,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pricing_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE CASCADE,
  feature_text TEXT NOT NULL,
  is_included BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pricing plans
WITH plan_free AS (
  INSERT INTO public.pricing_plans (name, slug, description, price_monthly, price_yearly, is_popular, cta_text, sort_order)
  VALUES ('Free', 'free', 'Perfect for developers, early-stage startups, and individuals', 0, 0, false, 'Get started', 0)
  RETURNING id
),
plan_team AS (
  INSERT INTO public.pricing_plans (name, slug, description, price_monthly, price_yearly, is_popular, cta_text, sort_order)
  VALUES ('Team', 'team', 'Advanced collaboration for individuals and organizations', 4, 40, true, 'Get started', 1)
  RETURNING id
),
plan_enterprise AS (
  INSERT INTO public.pricing_plans (name, slug, description, price_monthly, price_yearly, is_popular, cta_text, sort_order)
  VALUES ('Enterprise', 'enterprise', 'Security, compliance, and flexible deployment', 19, 190, false, 'Get started', 2)
  RETURNING id
)
INSERT INTO public.pricing_features (plan_id, feature_text, is_included, sort_order)
SELECT id, 'Host open source projects in public', true, 0 FROM plan_free
UNION ALL SELECT id, 'Project security', true, 1 FROM plan_free
UNION ALL SELECT id, 'Flexible project management features', true, 2 FROM plan_free
UNION ALL SELECT id, 'Community support', true, 3 FROM plan_free
UNION ALL SELECT id, 'Blazing fast cloud developer environments', false, 4 FROM plan_free
UNION ALL SELECT id, 'Protected branches', false, 5 FROM plan_free
UNION ALL SELECT id, 'Assign multiple users or a command to validate a pull request.', false, 6 FROM plan_free
UNION ALL SELECT id, 'Draft pull requests', false, 7 FROM plan_free
UNION ALL SELECT id, 'Code owners', false, 8 FROM plan_free
UNION ALL SELECT id, 'Web-based support', false, 9 FROM plan_free
UNION ALL SELECT id, 'Spark Copilot Access', false, 10 FROM plan_free
UNION ALL SELECT id, 'Spark Codespaces Access', false, 11 FROM plan_free
UNION ALL SELECT id, 'Host open source projects in public', true, 0 FROM plan_team
UNION ALL SELECT id, 'Project security', true, 1 FROM plan_team
UNION ALL SELECT id, 'Flexible project management features', true, 2 FROM plan_team
UNION ALL SELECT id, 'Community support', true, 3 FROM plan_team
UNION ALL SELECT id, 'Blazing fast cloud developer environments', true, 4 FROM plan_team
UNION ALL SELECT id, 'Protected branches', true, 5 FROM plan_team
UNION ALL SELECT id, 'Assign multiple users or a command to validate a pull request.', true, 6 FROM plan_team
UNION ALL SELECT id, 'Draft pull requests', true, 7 FROM plan_team
UNION ALL SELECT id, 'Code owners', false, 8 FROM plan_team
UNION ALL SELECT id, 'Web-based support', false, 9 FROM plan_team
UNION ALL SELECT id, 'Spark Copilot Access', false, 10 FROM plan_team
UNION ALL SELECT id, 'Spark Codespaces Access', false, 11 FROM plan_team
UNION ALL SELECT id, 'Host open source projects in public', true, 0 FROM plan_enterprise
UNION ALL SELECT id, 'Project security', true, 1 FROM plan_enterprise
UNION ALL SELECT id, 'Flexible project management features', true, 2 FROM plan_enterprise
UNION ALL SELECT id, 'Community support', true, 3 FROM plan_enterprise
UNION ALL SELECT id, 'Blazing fast cloud developer environments', true, 4 FROM plan_enterprise
UNION ALL SELECT id, 'Protected branches', true, 5 FROM plan_enterprise
UNION ALL SELECT id, 'Assign multiple users or a command to validate a pull request.', true, 6 FROM plan_enterprise
UNION ALL SELECT id, 'Draft pull requests', true, 7 FROM plan_enterprise
UNION ALL SELECT id, 'Code owners', true, 8 FROM plan_enterprise
UNION ALL SELECT id, 'Web-based support', true, 9 FROM plan_enterprise
UNION ALL SELECT id, 'Spark Copilot Access', true, 10 FROM plan_enterprise
UNION ALL SELECT id, 'Spark Codespaces Access', true, 11 FROM plan_enterprise;

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template TEXT DEFAULT 'default',
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  layout JSONB DEFAULT '{"sections":[]}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pages with full page builder layout
INSERT INTO public.pages (title, slug, status, layout) VALUES
('Home', 'home', 'published', '{
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "order": 0,
      "props": {
        "eyebrow": "THE BEST DEVELOPER PLATFORM",
        "title": "Optimize Top-Tier Software Creation",
        "subtitle": "Our AI-driven platform propels innovation by equipping developers with tools that not only amplify their speed but also foster a dynamic environment for creative problem-solving.",
        "ctaPrimary": {"text": "Download Free", "href": "/download"},
        "ctaSecondary": {"text": "View Examples", "href": "/examples"},
        "backgroundGradient": true,
        "showOrbs": true
      }
    },
    {
      "id": "logos-1",
      "type": "logo_strip",
      "order": 1,
      "props": {
        "title": "Trusted by teams at",
        "logos": ["Zendesk","Rakuten","Discord","Pacific Funds","NCR","Lattice","Airbnb"]
      }
    },
    {
      "id": "features-1",
      "type": "features_grid",
      "order": 2,
      "props": {
        "eyebrow": "FEATURES",
        "title": "Everything you need to ship faster",
        "subtitle": "A complete platform for modern development teams",
        "columns": 3,
        "features": [
          {"icon": "Zap", "title": "Lightning Fast", "description": "Build and deploy in seconds with our optimized pipeline."},
          {"icon": "Shield", "title": "Secure by Default", "description": "Enterprise-grade security built into every layer."},
          {"icon": "GitBranch", "title": "Git Integration", "description": "Seamless workflow with your existing Git repositories."},
          {"icon": "Globe", "title": "Global CDN", "description": "Deploy to 200+ edge locations worldwide instantly."},
          {"icon": "Code2", "title": "Code Intelligence", "description": "AI-powered code review and suggestions built-in."},
          {"icon": "Users", "title": "Team Collaboration", "description": "Real-time collaboration tools for distributed teams."}
        ]
      }
    },
    {
      "id": "pricing-1",
      "type": "pricing_table",
      "order": 3,
      "props": {
        "eyebrow": "PRICING",
        "title": "Pricing",
        "subtitle": "Review the examples below to see how easily you can use Spark",
        "showToggle": true
      }
    },
    {
      "id": "cta-1",
      "type": "cta_section",
      "order": 4,
      "props": {
        "title": "Ready to build something amazing?",
        "subtitle": "Join thousands of developers already using Spark",
        "ctaPrimary": {"text": "Get Started Free", "href": "/download"},
        "ctaSecondary": {"text": "Talk to Sales", "href": "/contact"},
        "backgroundStyle": "gradient"
      }
    }
  ]
}'::jsonb),
('Pricing', 'pricing', 'published', '{
  "sections": [
    {
      "id": "pricing-hero-1",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "Simple, transparent pricing",
        "subtitle": "Choose the plan that fits your needs. Upgrade or downgrade at any time.",
        "backgroundGradient": true,
        "showOrbs": false,
        "size": "small"
      }
    },
    {
      "id": "pricing-table-1",
      "type": "pricing_table",
      "order": 1,
      "props": {
        "showToggle": true
      }
    }
  ]
}'::jsonb),
('About', 'about', 'published', '{
  "sections": [
    {
      "id": "about-hero-1",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "Building the future of developer tooling",
        "subtitle": "We are a team of passionate engineers and designers on a mission to make software development faster, smarter, and more enjoyable.",
        "backgroundGradient": true,
        "size": "small"
      }
    },
    {
      "id": "about-text-1",
      "type": "image_text",
      "order": 1,
      "props": {
        "title": "Our Mission",
        "content": "At Spark, we believe that the best software is built by empowered teams. Our platform gives developers the tools, insights, and automation they need to focus on what truly matters — building great products.",
        "imageUrl": "",
        "imagePosition": "right",
        "ctaText": "Join Our Team",
        "ctaHref": "/careers"
      }
    }
  ]
}'::jsonb),
('Features', 'features', 'published', '{
  "sections": [
    {
      "id": "features-hero",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "Powerful features for modern teams",
        "subtitle": "Everything you need to build, ship, and scale your software.",
        "backgroundGradient": true,
        "size": "small"
      }
    },
    {
      "id": "features-grid-1",
      "type": "features_grid",
      "order": 1,
      "props": {
        "columns": 3,
        "features": [
          {"icon": "Zap", "title": "Lightning Fast", "description": "Deploy in seconds."},
          {"icon": "Shield", "title": "Secure", "description": "Enterprise security."},
          {"icon": "Code2", "title": "AI Powered", "description": "Smart code assistance."},
          {"icon": "GitBranch", "title": "Git Native", "description": "Seamless git workflows."},
          {"icon": "Globe", "title": "Global CDN", "description": "Worldwide deployment."},
          {"icon": "Users", "title": "Team Tools", "description": "Built for collaboration."}
        ]
      }
    }
  ]
}'::jsonb),
('Contact', 'contact', 'published', '{
  "sections": [
    {
      "id": "contact-hero",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "Get in touch",
        "subtitle": "Have a question? We would love to hear from you.",
        "backgroundGradient": true,
        "size": "small"
      }
    },
    {
      "id": "contact-form-1",
      "type": "rich_text",
      "order": 1,
      "props": {
        "content": "<div class=\"max-w-2xl mx-auto text-center\"><p class=\"text-gray-400 mb-8\">Send us an email at <a href=\"mailto:hello@spark.com\" class=\"text-purple-400\">hello@spark.com</a> or fill out the form below.</p></div>",
        "alignment": "center"
      }
    }
  ]
}'::jsonb),
('Blog', 'blog', 'published', '{
  "sections": [
    {
      "id": "blog-hero",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "The Spark Blog",
        "subtitle": "Insights, tutorials, and updates from the Spark team.",
        "backgroundGradient": true,
        "size": "small"
      }
    },
    {
      "id": "blog-list-1",
      "type": "blog_list",
      "order": 1,
      "props": {
        "postsPerPage": 9,
        "showCategories": true,
        "layout": "grid"
      }
    }
  ]
}'::jsonb),
('Download', 'download', 'published', '{
  "sections": [
    {
      "id": "download-hero",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "Download Spark",
        "subtitle": "Get started in minutes. Available for macOS, Windows, and Linux.",
        "ctaPrimary": {"text": "Download for macOS", "href": "#"},
        "backgroundGradient": true,
        "size": "medium"
      }
    }
  ]
}'::jsonb),
('Privacy Policy', 'privacy', 'published', '{
  "sections": [
    {
      "id": "privacy-content",
      "type": "rich_text",
      "order": 0,
      "props": {
        "content": "<h1>Privacy Policy</h1><p>Last updated: January 1, 2024</p><p>This privacy policy describes how Spark collects, uses, and shares information about you when you use our services.</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p><h2>How We Use Information</h2><p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>",
        "alignment": "left",
        "maxWidth": "prose"
      }
    }
  ]
}'::jsonb),
('Terms of Service', 'terms', 'published', '{
  "sections": [
    {
      "id": "terms-content",
      "type": "rich_text",
      "order": 0,
      "props": {
        "content": "<h1>Terms of Service</h1><p>Last updated: January 1, 2024</p><p>By accessing or using Spark, you agree to be bound by these terms of service.</p><h2>Use of Service</h2><p>You may use Spark only in compliance with these terms and all applicable laws.</p>",
        "alignment": "left",
        "maxWidth": "prose"
      }
    }
  ]
}'::jsonb),
('Examples', 'examples', 'published', '{
  "sections": [
    {
      "id": "examples-hero",
      "type": "hero",
      "order": 0,
      "props": {
        "title": "See what you can build",
        "subtitle": "Explore real-world examples built with Spark.",
        "backgroundGradient": true,
        "size": "small"
      }
    }
  ]
}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check editor or admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin());

-- Site settings: public read, admin write
CREATE POLICY "Settings are publicly readable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin());

-- Pages: public read published, editors write
CREATE POLICY "Published pages are public" ON public.pages FOR SELECT USING (status = 'published' OR public.is_editor_or_admin());
CREATE POLICY "Editors can manage pages" ON public.pages FOR ALL TO authenticated USING (public.is_editor_or_admin());

-- Blog posts
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT USING (status = 'published' OR public.is_editor_or_admin());
CREATE POLICY "Editors can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_editor_or_admin());

-- Categories: public read
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Editors can manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_editor_or_admin());

-- Pricing: public read active plans
CREATE POLICY "Active plans are public" ON public.pricing_plans FOR SELECT USING (is_active = true OR public.is_editor_or_admin());
CREATE POLICY "Editors can manage plans" ON public.pricing_plans FOR ALL TO authenticated USING (public.is_editor_or_admin());
CREATE POLICY "Pricing features are public" ON public.pricing_features FOR SELECT USING (true);
CREATE POLICY "Editors can manage features" ON public.pricing_features FOR ALL TO authenticated USING (public.is_editor_or_admin());

-- Media
CREATE POLICY "Media is publicly readable" ON public.media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload" ON public.media FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete own uploads" ON public.media FOR DELETE TO authenticated USING (auth.uid() = uploaded_by OR public.is_admin());
CREATE POLICY "Editors can view all media" ON public.media FOR SELECT TO authenticated USING (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Media is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- SAMPLE BLOG POSTS
-- ============================================================
INSERT INTO public.blog_posts (title, slug, excerpt, content, status, published_at, read_time)
VALUES
(
  'Introducing Spark 2.0: The Future of Developer Tooling',
  'introducing-spark-2-0',
  'Today we are excited to announce Spark 2.0, with groundbreaking features that will transform how you build software.',
  '<h2>A New Era</h2><p>After months of development and countless hours of user research, we are proud to present Spark 2.0. This release represents the biggest leap forward in our platform history.</p><h2>Key Features</h2><p>Spark 2.0 brings AI-powered code review, 10x faster builds, and seamless team collaboration tools that developers have been asking for.</p>',
  'published',
  NOW() - INTERVAL '2 days',
  5
),
(
  'How to Optimize Your Development Workflow',
  'optimize-development-workflow',
  'Learn the top strategies used by the fastest engineering teams to ship code 3x faster.',
  '<h2>Introduction</h2><p>In today fast-paced software industry, the teams that ship the fastest win. Here are the proven strategies used by top engineering teams.</p>',
  'published',
  NOW() - INTERVAL '7 days',
  8
),
(
  'Building Secure Applications from Day One',
  'building-secure-applications',
  'Security should not be an afterthought. Learn how to embed security practices into your development lifecycle.',
  '<h2>Security First</h2><p>The best time to think about security is at the beginning of your project, not after a breach. Here is how to get started.</p>',
  'published',
  NOW() - INTERVAL '14 days',
  6
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_order ON public.pricing_plans(sort_order);
CREATE INDEX IF NOT EXISTS idx_pricing_features_plan ON public.pricing_features(plan_id, sort_order);

-- ============================================================
-- DONE! Your schema is ready.
-- ============================================================

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  status        TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  source        TEXT DEFAULT 'website',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage subscribers"
  ON public.newsletter_subscribers FOR ALL
  TO authenticated USING (true);

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO anon WITH CHECK (true);
