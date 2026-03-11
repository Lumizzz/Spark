'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBlogPost, updateBlogPost, getCategories } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import type { Category, BlogPost } from '@/types';

interface BlogEditorProps {
  post?: BlogPost;
  categories: Category[];
}

export default function BlogEditorClient({ post, categories }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    status: (post?.status || 'draft') as 'draft' | 'published',
    category_id: post?.category_id || '',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    tags: post?.tags?.join(', ') || '',
    read_time: post?.read_time || 5,
  });

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: post ? f.slug : slugify(val) }));
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
      setForm((f) => ({ ...f, featured_image: publicUrl }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (post) {
        const { error } = await updateBlogPost(post.id, form);
        if (error) throw new Error(error);
        toast.success('Post updated!');
      } else {
        const { data, error } = await createBlogPost(form);
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

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/blog" className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            {post ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60">
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-5">
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Title *</label>
              <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="Post title..." className={`${inputClass} text-lg font-semibold`} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">/blog/</span>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Brief summary..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Content (HTML)</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={16} placeholder="<h2>Introduction</h2><p>Your content here...</p>" className={`${inputClass} resize-none font-mono text-xs`} />
            </div>
          </div>

          {/* SEO */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Meta Title</label>
              <input value={form.meta_title} onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))} placeholder="SEO title (defaults to post title)" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Meta Description</label>
              <textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2} placeholder="SEO description..." className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Publish</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))} className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category</label>
              <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50">
                <option value="">No category</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="react, nextjs, tutorial" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Read Time (min)</label>
              <input type="number" value={form.read_time} onChange={(e) => setForm((f) => ({ ...f, read_time: parseInt(e.target.value) || 5 }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" />
            </div>
          </div>

          {/* Featured image */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Featured Image</h3>
            {form.featured_image && (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-black/20">
                <img src={form.featured_image} alt="Featured" className="w-full h-full object-cover" />
              </div>
            )}
            <input value={form.featured_image} onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50" />
            <label className="flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 cursor-pointer text-xs transition-all">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Upload image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
