'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewPagePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;

    setLoading(true);
    try {
      const { data, error } = await createPage(title, slug);
      if (error) {
        toast.error(error);
      } else if (data) {
        toast.success('Page created!');
        router.push(`/dashboard/pages/${data.id}`);
      }
    } catch {
      toast.error('Failed to create page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/pages" className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          New Page
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Landing Page"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5">Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="my-page"
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">Your page will be at: /{slug || 'my-page'}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !title || !slug}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create & Open Builder'}
          </button>
          <Link
            href="/dashboard/pages"
            className="px-6 py-3 glass-card rounded-xl text-slate-300 text-sm hover:text-white transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
