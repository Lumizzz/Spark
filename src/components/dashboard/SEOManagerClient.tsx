'use client';

import { useState } from 'react';
import { updatePageMeta } from '@/lib/actions';
import type { Page } from '@/types';
import toast from 'react-hot-toast';
import { Save, Search, Globe } from 'lucide-react';

interface SEOManagerClientProps {
  pages: Page[];
}

export default function SEOManagerClient({ pages }: SEOManagerClientProps) {
  const [selected, setSelected] = useState<Page | null>(null);
  const [form, setForm] = useState({ meta_title: '', meta_description: '', og_image: '', slug: '' });
  const [saving, setSaving] = useState(false);

  const handleSelect = (page: Page) => {
    setSelected(page);
    setForm({
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      og_image: page.og_image || '',
      slug: page.slug,
    });
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { error } = await updatePageMeta(selected.id, {
        meta_title: form.meta_title,
        meta_description: form.meta_description,
        og_image: form.og_image,
        slug: form.slug,
      });
      if (error) throw new Error(error);
      toast.success('SEO settings saved!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors';

  const titleLength = form.meta_title.length;
  const descLength = form.meta_description.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          SEO Manager
        </h1>
        <p className="text-slate-400 mt-1">Edit meta tags and SEO settings for each page</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Page list */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pages</p>
          </div>
          <div className="divide-y divide-white/5">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelect(page)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/4 transition-colors ${selected?.id === page.id ? 'bg-purple-500/10' : ''}`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{page.title}</p>
                  <p className="text-xs text-slate-500 truncate">/{page.slug}</p>
                </div>
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${page.meta_title ? 'text-green-400 bg-green-500/10' : 'text-slate-600 bg-white/3'}`}>
                  {page.meta_title ? '✓' : '—'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="col-span-2">
          {selected ? (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {selected.title}
                </h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-400 font-medium">Meta Title</label>
                  <span className={`text-xs ${titleLength > 60 ? 'text-red-400' : titleLength > 50 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {titleLength}/60
                  </span>
                </div>
                <input
                  value={form.meta_title}
                  onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
                  placeholder={selected.title}
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-400 font-medium">Meta Description</label>
                  <span className={`text-xs ${descLength > 160 ? 'text-red-400' : descLength > 140 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {descLength}/160
                  </span>
                </div>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                  placeholder="A brief description of this page for search engines..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">OG Image URL</label>
                <input
                  value={form.og_image}
                  onChange={(e) => setForm((f) => ({ ...f, og_image: e.target.value }))}
                  placeholder="https://yourdomain.com/og-image.jpg"
                  className={inputClass}
                />
              </div>

              {/* Preview */}
              <div className="mt-2 p-4 bg-white/3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 mb-3 font-semibold flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" /> Google Preview
                </p>
                <div className="text-xs text-slate-500 mb-0.5">
                  yourdomain.com › {form.slug || selected.slug}
                </div>
                <div className="text-blue-400 text-sm font-medium mb-1">
                  {form.meta_title || selected.title}
                </div>
                <div className="text-slate-400 text-xs leading-relaxed">
                  {form.meta_description || 'No meta description set. Add one to improve click-through rates.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl h-full flex items-center justify-center p-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Select a page to edit its SEO settings</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
