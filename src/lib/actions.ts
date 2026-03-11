'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  Page,
  BlogPost,
  PricingPlan,
  Category,
  SiteSettings,
  MediaItem,
  Profile,
  PageLayout,
  BlogPostFormData,
  PricingPlanFormData,
} from '@/types';

// ============================================================
// SITE SETTINGS
// ============================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('key, value');

  const defaults: SiteSettings = {
    site_name: 'Spark',
    site_tagline: 'Build better software, faster',
    site_url: '',
    logo_text: 'spark',
    logo_url: null,
    favicon_url: null,
    primary_color: '#7C3AED',
    nav_links: [
      { label: 'Product', href: '/product' },
      { label: 'Examples', href: '/examples' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'About us', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
    footer_links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
    social_links: { twitter: '', github: '', discord: '', linkedin: '' },
    analytics_id: null,
    maintenance_mode: false,
  };

  if (!data) return defaults;

  const settings = { ...defaults };
  for (const row of data) {
    (settings as Record<string, unknown>)[row.key] = row.value;
  }
  return settings;
}

export async function updateSiteSettings(
  updates: Partial<Record<string, unknown>>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  for (const [key, value] of Object.entries(updates)) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    if (error) return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { error: null };
}

// ============================================================
// PAGES
// ============================================================

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

export async function getAllPages(): Promise<Page[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getPageById(id: string): Promise<Page | null> {
  const supabase = createClient();
  const { data } = await supabase.from('pages').select('*').eq('id', id).single();
  return data;
}

export async function createPage(
  title: string,
  slug: string
): Promise<{ data: Page | null; error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('pages')
    .insert({
      title,
      slug,
      status: 'draft',
      layout: { sections: [] },
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath('/dashboard/pages');
  return { data, error: null };
}

export async function updatePageLayout(
  id: string,
  layout: PageLayout
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('pages')
    .update({ layout, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/pages');
  return { error: null };
}

export async function updatePageMeta(
  id: string,
  updates: Partial<Page>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('pages')
    .update({ ...updates, updated_by: user.id, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/pages');
  return { error: null };
}

export async function deletePage(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/pages');
  return { error: null };
}

// ============================================================
// BLOG POSTS
// ============================================================

export async function getBlogPosts(options?: {
  status?: string;
  limit?: number;
  categorySlug?: string;
}): Promise<BlogPost[]> {
  const supabase = createClient();
  let query = supabase
    .from('blog_posts')
    .select('*, categories(*)')
    .order('published_at', { ascending: false });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);

  const { data } = await query;
  return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*, categories(*)')
    .eq('slug', slug)
    .single();
  return data;
}

export async function createBlogPost(
  formData: BlogPostFormData
): Promise<{ data: BlogPost | null; error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...formData,
      author_id: user.id,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return { data, error: null };
}

export async function updateBlogPost(
  id: string,
  formData: Partial<BlogPostFormData>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const updates: Record<string, unknown> = {
    ...formData,
    updated_at: new Date().toISOString(),
  };

  if (formData.tags) {
    updates.tags = formData.tags.split(',').map((t) => t.trim());
  }

  if (formData.status === 'published') {
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single();
    if (!existing?.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return { error: null };
}

export async function deleteBlogPost(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return { error: null };
}

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase.from('categories').select('*').order('name');
  return data || [];
}

export async function createCategory(
  name: string,
  slug: string,
  color: string
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('categories').insert({ name, slug, color });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/blog');
  return { error: null };
}

// ============================================================
// PRICING
// ============================================================

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pricing_plans')
    .select('*, pricing_features(*)')
    .eq('is_active', true)
    .order('sort_order');

  if (!data) return [];

  return data.map((plan) => ({
    ...plan,
    pricing_features: plan.pricing_features?.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    ),
  }));
}

export async function getAllPricingPlans(): Promise<PricingPlan[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pricing_plans')
    .select('*, pricing_features(*)')
    .order('sort_order');
  return data || [];
}

export async function createPricingPlan(
  formData: PricingPlanFormData
): Promise<{ data: PricingPlan | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pricing_plans')
    .insert(formData)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  revalidatePath('/pricing');
  revalidatePath('/dashboard/pricing');
  return { data, error: null };
}

export async function updatePricingPlan(
  id: string,
  updates: Partial<PricingPlanFormData>
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from('pricing_plans')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/pricing');
  revalidatePath('/dashboard/pricing');
  return { error: null };
}

export async function deletePricingPlan(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/pricing');
  revalidatePath('/dashboard/pricing');
  return { error: null };
}

export async function addFeatureToPlan(
  planId: string,
  featureText: string,
  isIncluded: boolean
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from('pricing_features')
    .select('sort_order')
    .eq('plan_id', planId)
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.sort_order !== undefined ? existing[0].sort_order + 1 : 0;

  const { error } = await supabase.from('pricing_features').insert({
    plan_id: planId,
    feature_text: featureText,
    is_included: isIncluded,
    sort_order: nextOrder,
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/pricing');
  return { error: null };
}

export async function deleteFeature(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('pricing_features').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/pricing');
  return { error: null };
}

// ============================================================
// MEDIA
// ============================================================

export async function getMedia(): Promise<MediaItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function deleteMedia(id: string, filename: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  await supabase.storage.from('media').remove([filename]);
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/media');
  return { error: null };
}

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*, roles(*)')
    .eq('id', user.id)
    .single();
  return data;
}

export async function getAllUsers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('profiles')
    .select('*, roles(*)')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function updateUserRole(
  userId: string,
  roleName: 'admin' | 'editor'
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (!role) return { error: 'Role not found' };

  const { error } = await supabase
    .from('profiles')
    .update({ role_id: role.id, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/users');
  return { error: null };
}
