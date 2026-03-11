import React from 'react';
import AnimatedBackground from '@/components/public/AnimatedBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <AnimatedBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
