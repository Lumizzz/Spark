import { getCategories } from '@/lib/actions';
import BlogEditorClient from '@/components/dashboard/BlogEditorClient';

export default async function NewBlogPostPage() {
  const categories = await getCategories();
  return <BlogEditorClient categories={categories} />;
}
