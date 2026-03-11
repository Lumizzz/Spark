import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/actions';
import BlogEditorClient from '@/components/dashboard/BlogEditorClient';
import type { BlogPost } from '@/types';

type Props = { params: { id: string } };

export default async function EditBlogPostPage({ params }: Props) {
  const supabase = createClient();
  const { data: post } = await supabase.from('blog_posts').select('*, categories(*)').eq('id', params.id).single() as { data: BlogPost | undefined };

  if (!post) notFound();

  const categories = await getCategories();
  return <BlogEditorClient post={post} categories={categories} />;
}
