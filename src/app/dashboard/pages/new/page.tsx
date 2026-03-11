'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import { newPageSchema, getZodErrors } from '@/lib/validations';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Loader2, FileText } from 'lucide-react';

type FieldErrors = { title?: string; slug?: string };

export default function NewPagePage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) setSlug(slugify(val));
    // Clear error on change
    if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
    setSlugEdited(true);
    if (errors.slug) setErrors((e) => ({ ...e, slug: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod validation
    const result = newPageSchema.safeParse({ title, slug });
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await createPage(title, slug);
      if (error) {
        if (error.includes('duplicate') || error.includes('unique')) {
          setErrors({ slug: 'This slug is already taken. Try a different one.' });
        } else {
          toast.error(error);
        }
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

  const inputClass = (field: keyof FieldErrors) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none text-sm transition-colors ${
      errors[field] ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
    }`;

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/pages" className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            New Page
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Create a new page to build with the page builder</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="glass-card rounded-2xl p-8 space-y-5">
        <div>
          <label className="block text-sm text-slate-300 mb-1.5 font-medium">
            Page Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Landing Page"
            className={inputClass('title')}
            autoFocus
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1.5 font-medium">
            URL Slug <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-0">
            <span className="px-3 py-3 rounded-l-xl bg-white/3 border border-r-0 border-white/10 text-slate-500 text-sm">
              /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="my-page"
              className={`flex-1 px-4 py-3 rounded-r-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none text-sm transition-colors ${
                errors.slug ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
              }`}
            />
          </div>
          {errors.slug ? (
            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.slug}
            </p>
          ) : (
            <p className="text-slate-500 text-xs mt-1.5">
              Page URL: <span className="text-slate-400">/{slug || 'my-page'}</span>
            </p>
          )}
        </div>

        {/* Info */}
        <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-4 flex items-start gap-3">
          <FileText className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <p className="text-slate-400 text-xs leading-relaxed">
            Your page will start as a <strong className="text-white">draft</strong>. You can use the page builder to add sections, then publish when ready.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              'Create & Open Builder'
            )}
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
