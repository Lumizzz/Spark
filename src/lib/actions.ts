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
// HELPERS
// ============================================================

async function getAuthUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getUserRole(userId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('roles(name)')
    .eq('id', userId)
    .single();
  return (data?.roles as unknown as { name: string } | null)?.name ?? null;
}

// ============================================================
// SITE SETTINGS
// ============================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

export async function getPageBySlugWithPreview(slug: string, preview: boolean): Promise<Page | null> {
  const supabase = preview ? createAdminClient() : createAdminClient();
  const query = supabase.from('pages').select('*').eq('slug', slug);
  if (!preview) query.eq('status', 'published');
  const { data } = await query.single();
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

export async function duplicatePage(id: string): Promise<{ data: Page | null; error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthorized' };

  const { data: original } = await supabase.from('pages').select('*').eq('id', id).single();
  if (!original) return { data: null, error: 'Page not found' };

  const newSlug = `${original.slug}-copy-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('pages')
    .insert({
      title: `${original.title} (Copy)`,
      slug: newSlug,
      status: 'draft',
      layout: original.layout,
      meta_title: original.meta_title,
      meta_description: original.meta_description,
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

export async function togglePageStatus(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: page } = await supabase.from('pages').select('status').eq('id', id).single();
  if (!page) return { error: 'Page not found' };

  const newStatus = page.status === 'published' ? 'draft' : 'published';
  const { error } = await supabase
    .from('pages')
    .update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/pages');
  revalidatePath('/');
  return { error: null };
}

export async function deletePage(id: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };

  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete pages' };

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
  const supabase = createAdminClient();
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
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

export async function getBlogPostBySlugAdmin(slug: string): Promise<BlogPost | null> {
  const supabase = createAdminClient();
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

export async function toggleBlogPostStatus(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: post } = await supabase.from('blog_posts').select('status').eq('id', id).single();
  if (!post) return { error: 'Post not found' };

  const newStatus = post.status === 'published' ? 'draft' : 'published';
  const { error } = await supabase
    .from('blog_posts')
    .update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/blog');
  revalidatePath('/dashboard/blog');
  return { error: null };
}

export async function deleteBlogPost(id: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };

  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete posts' };

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
  const supabase = createAdminClient();
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

export async function updateCategory(
  id: string,
  name: string,
  color: string
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('categories').update({ name, color }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/blog');
  return { error: null };
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete categories' };

  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/blog');
  return { error: null };
}

// ============================================================
// PRICING
// ============================================================

export async function getPricingPlans(): Promise<PricingPlan[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('pricing_plans')
    .select('*, pricing_features(*)')
    .eq('is_active', true)
    .order('sort_order');

  if (!data) return [];

  return (data as PricingPlan[]).map((plan: PricingPlan) => ({
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
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete plans' };

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
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete media' };

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

// ============================================================
// ACTIVITY / RECENT CHANGES
// ============================================================

export async function getRecentActivity(): Promise<{
  type: string; title: string; action: string; time: string;
}[]> {
  const supabase = createAdminClient();

  const [pages, posts] = await Promise.all([
    supabase.from('pages').select('title, status, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('blog_posts').select('title, status, updated_at').order('updated_at', { ascending: false }).limit(5),
  ]);

  const items = [
    ...(pages.data || []).map((p: Record<string,unknown>) => ({ type: 'page', title: p.title as string, action: p.status === 'published' ? 'published' : 'updated', time: p.updated_at as string })),
    ...(posts.data || []).map((p: Record<string,unknown>) => ({ type: 'post', title: p.title as string, action: p.status === 'published' ? 'published' : 'updated', time: p.updated_at as string })),
  ];

  return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
}

// ============================================================
// USER INVITATIONS
// ============================================================

export async function inviteUser(
  email: string,
  roleName: 'admin' | 'editor'
): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can invite users' };

  const supabase = createAdminClient();
  const { data: roleData } = await supabase.from('roles').select('id').eq('name', roleName).single();

  const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) return { error: error.message };

  // Create profile with role
  if (invited?.user && roleData) {
    await supabase.from('profiles').upsert({
      id: invited.user.id,
      email,
      role_id: roleData.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  }

  revalidatePath('/dashboard/users');
  return { error: null };
}

export async function removeUser(userId: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  if (user.id === userId) return { error: 'Cannot remove yourself' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can remove users' };

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  await supabase.from('profiles').delete().eq('id', userId);
  revalidatePath('/dashboard/users');
  return { error: null };
}

export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string }
): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  if (user.id !== userId) {
    const role = await getUserRole(user.id);
    if (role !== 'admin') return { error: 'Unauthorized' };
  }
  const supabase = createClient();
  const { error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', userId);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/users');
  return { error: null };
}

// ============================================================
// NEWSLETTER SUBSCRIBERS
// ============================================================

export async function subscribeToNewsletter(
  email: string,
  name?: string,
  source?: string
): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email: email.toLowerCase().trim(), name, source: source || 'website', status: 'subscribed', updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    );
  if (error) return { error: error.message };
  return { error: null };
}

export async function getSubscribers(): Promise<{
  id: string; email: string; name: string | null; status: string; source: string | null; created_at: string;
}[]> {
  const user = await getAuthUser();
  if (!user) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export async function unsubscribeEmail(id: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/subscribers');
  return { error: null };
}

export async function deleteSubscriber(id: string): Promise<{ error: string | null }> {
  const user = await getAuthUser();
  if (!user) return { error: 'Unauthorized' };
  const role = await getUserRole(user.id);
  if (role !== 'admin') return { error: 'Only admins can delete subscribers' };
  const supabase = createAdminClient();
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/subscribers');
  return { error: null };
}

// ============================================================
// USER SELF-REGISTRATION (admin-controlled)
// ============================================================

export async function checkRegistrationOpen(): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'registration_open')
    .single();
  return data?.value === true;
}

export async function selfRegister(
  email: string,
  password: string,
  fullName: string
): Promise<{ error: string | null }> {
  // Check registration is open
  const open = await checkRegistrationOpen();
  if (!open) return { error: 'Registration is currently closed. Contact an administrator.' };

  const supabase = createAdminClient();

  // Create auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // will trigger confirmation email
    user_metadata: { full_name: fullName },
  });

  if (error) return { error: error.message };

  // Create profile with editor role (default, safe)
  if (data.user) {
    const { data: editorRole } = await supabase.from('roles').select('id').eq('name', 'editor').single();
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role_id: editorRole?.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  }

  return { error: null };
}
