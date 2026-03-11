import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Globe, FileText } from 'lucide-react';
import { getAllPages, deletePage } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import DeleteButton from '@/components/dashboard/DeleteButton';

export default async function PagesPage() {
  const pages = await getAllPages();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Pages
          </h1>
          <p className="text-slate-400 mt-1">Manage your website pages</p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Page
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-3 border-b border-white/5 text-xs text-slate-500 font-medium uppercase tracking-wider">
          <span>Title</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        {pages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No pages yet. Create your first page!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pages.map((page) => (
              <div key={page.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">{page.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">/{page.slug}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${page.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                  {page.status}
                </span>
                <span className="text-slate-500 text-xs">{formatDate(page.updated_at)}</span>
                <div className="flex items-center gap-1">
                  {page.status === 'published' && (
                    <a
                      href={page.slug === 'home' ? '/' : `/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    href={`/dashboard/pages/${page.id}`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={page.id} action={deletePage} label="page" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
