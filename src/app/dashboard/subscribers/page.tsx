import { getSubscribers } from '@/lib/actions';
import SubscribersClient from './SubscribersClient';

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();
  return <SubscribersClient subscribers={subscribers} />;
}
