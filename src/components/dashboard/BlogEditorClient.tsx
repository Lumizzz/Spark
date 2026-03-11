'use client';
import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost, updateBlogPost } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { blogPostSchema, getZodErrors } from '@/lib/validations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Loader2, Eye, AlertCircle, ImageIcon } from 'lucide-react';
import type { Category, BlogPost } from '@/types';
import MediaPickerModal from '@/components/builder/MediaPickerModal';

interface BlogEditorProps {
  post?: BlogPost;
  categories: Category[];
}

type FormState = {
  title: string; slug: string; excerpt: string; content: string;
  featured_image: string; status: 'draft' | 'published'; category_id: string;
  meta_title: string; meta_description: string; tags: string; read_time: number;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

export default function BlogEditorClient({ post, categories }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!post);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState<FormState>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    status: (post?.status === 'archived' ? 'draft' : post?.status) || 'draft',
    category_id: post?.category_id || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    tags: post?.tags?.join(', ') || '',
    read_time: post?.read_time || 5,
  });

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f: typeof form) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e: Record<string, string | undefined>) => ({ ...e, [key]: undefined }));
  };

  const handleContentChange = (val: string) => {
    // Auto-calculate read time from word count
    const text = val.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setForm((f: typeof form) => ({ ...f, content: val, read_time: minutes }));
    if (errors.content) setErrors((e: Record<string, string | undefined>) => ({ ...e, content: undefined }));
  };

  const handleTitleChange = (val: string) => {
    setForm((f: typeof form) => ({ ...f, title: val, slug: slugEdited ? f.slug : slugify(val) }));
    if (errors.title) setErrors((e: Record<string, string | undefined>) => ({ ...e, title: undefined }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const filename = `blog/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('media').upload(filename, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
      setField('featured_image', publicUrl);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (statusOverride?: 'draft' | 'published') => {
    const formToSave = statusOverride ? { ...form, status: statusOverride } : form;

    // Zod validation
    const result = blogPostSchema.safeParse(formToSave);
    if (!result.success) {
      const zodErrors = getZodErrors<FormState>(result.error);
      setErrors(zodErrors);
      const firstError = Object.values(zodErrors)[0];
      toast.error(firstError || 'Please fix the errors below');
      return;
    }

    setSaving(true);
    try {
      if (post) {
        const { error } = await updateBlogPost(post.id, formToSave);
        if (error) throw new Error(error);
        toast.success(statusOverride === 'published' ? '🚀 Post published!' : '✅ Post saved!');
        if (statusOverride) setField('status', statusOverride);
      } else {
        const { data, error } = await createBlogPost(formToSave);
        if (error) throw new Error(error);
        toast.success('Post created!');
        if (data) router.push(`/dashboard/blog/${data.id}`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const metaTitleLen = form.meta_title.length;
  const metaDescLen = form.meta_description.length;

  const inputClass = (field?: keyof FieldErrors) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none text-sm transition-colors ${
      field && errors[field] ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
    }`;

  const FieldError = ({ field }: { field: keyof FieldErrors }) =>
    errors[field] ? (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/blog" className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {post ? 'Edit Post' : 'New Post'}
            </h1>
            {post && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  form.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {form.status === 'published' ? '● Published' : '● Draft'}
                </span>
                {post.slug && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Preview
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 glass-card border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {form.status === 'published' ? 'Update Published' : '🚀 Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-5">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className={`${inputClass('title')} text-lg font-semibold`}
              />
              <FieldError field="title" />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">URL Slug</label>
              <div className="flex items-center">
                <span className="px-3 py-3 rounded-l-xl bg-white/3 border border-r-0 border-white/10 text-slate-500 text-sm">/blog/</span>
                <input
                  value={form.slug}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSlugEdited(true); setField('slug', slugify(e.target.value)); }}
                  className={`flex-1 px-4 py-3 rounded-r-xl bg-white/5 border text-white text-sm focus:outline-none transition-colors ${
                    errors.slug ? 'border-red-500/60' : 'border-white/10 focus:border-purple-500/50'
                  }`}
                />
              </div>
              <FieldError field="slug" />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField('excerpt', e.target.value)}
                rows={2}
                placeholder="Brief summary shown in post listings..."
                className={`${inputClass('excerpt')} resize-none`}
              />
              <div className="flex justify-between">
                <FieldError field="excerpt" />
                <p className={`text-xs mt-1 ${form.excerpt.length > 300 ? 'text-red-400' : 'text-slate-600'}`}>
                  {form.excerpt.length}/300
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                Content (HTML) <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleContentChange(e.target.value)}
                rows={18}
                placeholder="<h2>Introduction</h2><p>Your content here...</p>"
                className={`${inputClass('content')} resize-none font-mono text-xs`}
              />
              <FieldError field="content" />
            </div>
          </div>

          {/* SEO Panel */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-white">SEO & Open Graph</h3>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400 font-medium">Meta Title</label>
                <span className={`text-xs ${metaTitleLen > 70 ? 'text-red-400' : metaTitleLen > 55 ? 'text-yellow-400' : 'text-slate-600'}`}>
                  {metaTitleLen}/70
                </span>
              </div>
              <input
                value={form.meta_title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('meta_title', e.target.value)}
                placeholder="SEO title (defaults to post title)"
                className={inputClass('meta_title')}
              />
              <FieldError field="meta_title" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-400 font-medium">Meta Description</label>
                <span className={`text-xs ${metaDescLen > 160 ? 'text-red-400' : metaDescLen > 140 ? 'text-yellow-400' : 'text-slate-600'}`}>
                  {metaDescLen}/160
                </span>
              </div>
              <textarea
                value={form.meta_description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField('meta_description', e.target.value)}
                rows={2}
                placeholder="SEO description..."
                className={`${inputClass('meta_description')} resize-none`}
              />
              <FieldError field="meta_description" />
            </div>
            {/* Search preview */}
            {(form.meta_title || form.title) && (
              <div className="rounded-xl bg-white/3 border border-white/5 p-4">
                <p className="text-xs text-slate-500 mb-2">Google Search Preview</p>
                <p className="text-blue-400 text-sm truncate">{form.meta_title || form.title}</p>
                <p className="text-green-600 text-xs">yourdomain.com › blog › {form.slug || 'post-slug'}</p>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{form.meta_description || form.excerpt || 'No description set.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status & Publish */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Publish Settings</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField('status', e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category</label>
              <select
                value={form.category_id}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField('category_id', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('tags', e.target.value)}
                placeholder="react, nextjs, tutorial"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Read Time (minutes)</label>
              <input
                type="number"
                value={form.read_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('read_time', parseInt(e.target.value) || 5)}
                min={1}
                max={120}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Featured image */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Featured Image</h3>
            {form.featured_image && (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-black/20 group">
                <img src={form.featured_image} alt="Featured" className="w-full h-full object-cover" />
                <button
                  onClick={() => setField('featured_image', '')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            )}
            <input
              value={form.featured_image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('featured_image', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
            />
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 cursor-pointer text-xs transition-all">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              <button
                onClick={() => setMediaPickerOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Library
              </button>
            </div>
            <FieldError field="featured_image" />
          </div>
        </div>
      </div>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setField('featured_image', url)}
        title="Select Featured Image"
      />
    </div>
  );
}
