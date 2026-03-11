import { getAllPages } from '@/lib/actions';
import SEOManagerClient from '@/components/dashboard/SEOManagerClient';

export default async function SEODashboardPage() {
  const pages = await getAllPages();
  return <SEOManagerClient pages={pages} />;
}
