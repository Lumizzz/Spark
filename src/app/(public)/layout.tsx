import { getSiteSettings } from '@/lib/actions';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
