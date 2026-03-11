import React from 'react';
import { getSiteSettings } from '@/lib/actions';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AnimatedBackground from '@/components/public/AnimatedBackground';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <AnimatedBackground />
      <div className="relative z-10">
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </div>
    </div>
  );
}
