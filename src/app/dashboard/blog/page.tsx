import Link from 'next/link';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { getBlogPosts, deleteBlogPost } from '@/lib/actions';
import { formatDate } from '@/lib/utils';
import DeleteButton from '@/components/dashboard/DeleteButton';

export default async function BlogDashboardPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Blog</h1>
          <p className="text-slate-400 mt-1">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blog/new" className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-6 py-3 border-b border-white/5 text-xs text-slate-500 font-medium uppercase tracking-wider">
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No posts yet. Write your first post!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {posts.map((post) => (
              <div key={post.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">{post.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{post.excerpt}</p>
                </div>
                <span className="text-xs text-slate-500">{post.categories?.name || '—'}</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                  {post.status}
                </span>
                <span className="text-slate-500 text-xs">{formatDate(post.created_at)}</span>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/blog/${post.id}`} className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton id={post.id} action={deleteBlogPost} label="post" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
