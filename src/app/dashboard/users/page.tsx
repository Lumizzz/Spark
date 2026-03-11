import { getAllUsers, getCurrentUser } from '@/lib/actions';
import UsersClient from '@/components/dashboard/UsersClient';

export default async function UsersDashboardPage() {
  const [users, currentUser] = await Promise.all([getAllUsers(), getCurrentUser()]);
  return <UsersClient users={users} currentUserId={currentUser?.id || ''} />;
}
