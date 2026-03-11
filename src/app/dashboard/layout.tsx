import React from 'react';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser } from '@/lib/actions';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardShell from '@/components/dashboard/DashboardShell';
import AnimatedBackground from '@/components/public/AnimatedBackground';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="min-h-screen flex relative" style={{ background: 'var(--color-bg)' }}>
      <AnimatedBackground />
      <div className="relative z-10 flex w-full min-h-screen">
        <DashboardSidebar user={user!} />
        <DashboardShell children={children} />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10,10,26,0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(124,58,237,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#a78bfa', secondary: '#06060f' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#06060f' } },
        }}
      />
    </div>
  );
}
