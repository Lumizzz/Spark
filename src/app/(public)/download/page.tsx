import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';
import { Download, Monitor, Smartphone, Terminal, Package, ArrowRight, Check } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Download — ${settings.site_name}`,
    description: `Download ${settings.site_name} apps for every platform.`,
  };
}

const platforms = [
  {
    icon: Monitor,
    name: 'macOS',
    description: 'macOS 12 Monterey or later. Apple Silicon & Intel.',
    version: 'v2.4.1',
    size: '89 MB',
    badge: 'Most Popular',
    cta: 'Download for Mac',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    icon: Monitor,
    name: 'Windows',
    description: 'Windows 10 / 11 (64-bit). Auto-updates included.',
    version: 'v2.4.1',
    size: '94 MB',
    badge: null,
    cta: 'Download for Windows',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    badgeColor: '',
  },
  {
    icon: Monitor,
    name: 'Linux',
    description: 'Available as .deb, .rpm, and AppImage.',
    version: 'v2.4.1',
    size: '78 MB',
    badge: null,
    cta: 'Download for Linux',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    badgeColor: '',
  },
  {
    icon: Smartphone,
    name: 'iOS',
    description: 'iPhone & iPad. iOS 16 or later.',
    version: 'v2.3.0',
    size: '42 MB',
    badge: null,
    cta: 'App Store',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    badgeColor: '',
  },
  {
    icon: Smartphone,
    name: 'Android',
    description: 'Android 10 or later. Available on Google Play.',
    version: 'v2.3.0',
    size: '38 MB',
    badge: null,
    cta: 'Google Play',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    badgeColor: '',
  },
  {
    icon: Terminal,
    name: 'CLI',
    description: 'Command-line interface for terminal power users.',
    version: 'v1.9.2',
    size: '12 MB',
    badge: null,
    cta: 'npm install',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    badgeColor: '',
  },
];

const installMethods = [
  { label: 'npm', command: 'npm install -g @spark/cli' },
  { label: 'yarn', command: 'yarn global add @spark/cli' },
  { label: 'brew', command: 'brew install spark-cli' },
];

export default async function DownloadPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-16 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 mb-6 mx-auto">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Download {settings.site_name}
        </h1>
        <p className="relative text-slate-400 text-lg max-w-xl mx-auto">
          Available on every platform. Free to use. Sync across all your devices.
        </p>
      </section>

      {/* Platform cards */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className="glass-card rounded-2xl p-6 relative glass-card-hover">
                {p.badge && (
                  <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${p.color}`} />
                </div>
                <h3
                  className="text-white font-bold text-xl mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {p.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{p.description}</p>
                <div className="flex items-center gap-3 mb-5 text-xs text-slate-500">
                  <span>{p.version}</span>
                  <span>·</span>
                  <span>{p.size}</span>
                </div>
                <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  {p.cta}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLI install */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">DEVELOPERS</p>
            <h2
              className="text-3xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Install via package manager
            </h2>
          </div>
          <div className="space-y-3">
            {installMethods.map((m) => (
              <div key={m.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md w-12 text-center shrink-0">
                  {m.label}
                </span>
                <code className="text-sm text-slate-300 font-mono flex-1">{m.command}</code>
                <Package className="w-4 h-4 text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Everything in every download
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Automatic silent updates',
              'Offline mode support',
              'Local data encryption',
              'Multi-account switching',
              'Keyboard shortcuts',
              'Native notifications',
              'Dark & light themes',
              'Custom workspace layouts',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 glass-card rounded-lg px-4 py-3">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 border border-purple-500/20 bg-gradient-to-b from-purple-900/20 to-transparent">
          <h2
            className="text-3xl font-bold gradient-text mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Not ready to download?
          </h2>
          <p className="text-slate-400 mb-8">Try {settings.site_name} directly in your browser — no install needed.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
          >
            Use Web App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
