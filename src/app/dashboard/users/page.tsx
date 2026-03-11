import { getAllUsers, updateUserRole } from '@/lib/actions';
import UsersClient from '@/components/dashboard/UsersClient';

export default async function UsersDashboardPage() {
  const users = await getAllUsers();
  return <UsersClient users={users} />;
}
