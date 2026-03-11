import { z } from 'zod';

// ─── Page schemas ───────────────────────────────────────────────
export const newPageSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be under 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be under 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export type NewPageFormData = z.infer<typeof newPageSchema>;

// ─── Blog Post schemas ──────────────────────────────────────────
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(150, 'Title must be under 150 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z
    .string()
    .max(300, 'Excerpt must be under 300 characters')
    .optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  status: z.enum(['draft', 'published']),
  featured_image: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  category_id: z.string().optional(),
  meta_title: z.string().max(70, 'Meta title should be under 70 characters for SEO').optional(),
  meta_description: z.string().max(160, 'Meta description should be under 160 characters for SEO').optional(),
  tags: z.string().optional(),
  read_time: z.number().min(1).max(120),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

// ─── Site Settings schemas ──────────────────────────────────────
export const siteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(60),
  site_tagline: z.string().max(150).optional(),
  site_url: z.string().url('Must be a valid URL (e.g. https://yoursite.com)').or(z.literal('')),
  logo_text: z.string().max(30).optional(),
  logo_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  favicon_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  primary_color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color (e.g. #7C3AED)')
    .optional(),
  analytics_id: z.string().optional(),
});

// ─── Pricing Plan schemas ───────────────────────────────────────
export const pricingPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(50),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(200).optional(),
  price_monthly: z.number().min(0, 'Price must be 0 or more'),
  price_yearly: z.number().min(0, 'Price must be 0 or more'),
  currency: z.string().length(3, 'Must be a 3-letter currency code (e.g. USD)'),
  cta_text: z.string().min(1, 'CTA text is required').max(40),
  cta_link: z.string().min(1, 'CTA link is required'),
  badge_text: z.string().max(30).optional(),
  sort_order: z.number().min(0),
  is_popular: z.boolean(),
  is_active: z.boolean(),
});

// ─── Contact form schema ────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Please write at least 20 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Flattens a ZodError into a simple { field: message } record
 */
export function getZodErrors<T extends Record<string, unknown>>(
  error: z.ZodError
): Partial<Record<keyof T, string>> {
  const result: Partial<Record<keyof T, string>> = {};
  error.issues.forEach((issue: {path: (string|number)[]; message: string}) => {
    const field = issue.path[0] as keyof T;
    if (!result[field]) result[field] = issue.message;
  });
  return result;
}
