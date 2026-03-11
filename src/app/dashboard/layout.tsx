import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser } from '@/lib/actions';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      <DashboardSidebar user={user} />
      <main className="flex-1 min-w-0 ml-64">
        <div className="p-8">{children}</div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </div>
  );
}
