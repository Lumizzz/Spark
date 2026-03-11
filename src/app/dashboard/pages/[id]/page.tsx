import { notFound } from 'next/navigation';
import { getPageById } from '@/lib/actions';
import PageBuilderClient from '@/components/builder/PageBuilderClient';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';

type Props = { params: { id: string } };

export default async function PageBuilderPage({ params }: Props) {
  const page = await getPageById(params.id);
  if (!page) notFound();

  const previewHref = page.slug === 'home' ? '/?preview=true' : `/${page.slug}?preview=true`;

  return (
    <div className="h-screen flex flex-col -m-4 md:-m-8 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/pages" className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-white text-sm font-medium">{page.title}</p>
            <p className="text-slate-500 text-xs">/{page.slug}</p>
          </div>
        </div>
        <a href={previewHref} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/10 rounded-lg hover:border-purple-500/30 transition-all">
          <Eye className="w-3.5 h-3.5" /> Preview
        </a>
      </div>
      <PageBuilderClient page={page} />
    </div>
  );
}
