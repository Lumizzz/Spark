import { notFound } from 'next/navigation';
import { getPageById } from '@/lib/actions';
import PageBuilderClient from '@/components/builder/PageBuilderClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = { params: { id: string } };

export default async function PageBuilderPage({ params }: Props) {
  const page = await getPageById(params.id);
  if (!page) notFound();

  return (
    <div className="h-screen flex flex-col -m-8 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/pages"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-white text-sm font-medium">{page.title}</p>
            <p className="text-slate-500 text-xs">/{page.slug}</p>
          </div>
        </div>
      </div>

      {/* Builder */}
      <PageBuilderClient page={page} />
    </div>
  );
}
