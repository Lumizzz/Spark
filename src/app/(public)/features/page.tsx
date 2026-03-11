import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';
import {
  Zap, Shield, Globe, BarChart3, Users, Code2, Palette, Lock,
  RefreshCw, Cpu, Database, Headphones, ArrowRight, Check
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Features — ${settings.site_name}`,
    description: `Explore all the powerful features that make ${settings.site_name} the best platform for modern teams.`,
  };
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'Sub-100ms response times globally with our edge-distributed infrastructure. Your users never wait.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'SOC 2 Type II certified. End-to-end encryption, SSO, SAML, and advanced access controls built in.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Deploy to 200+ edge locations worldwide. Content served from the closest node to your users.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time dashboards, custom metrics, funnel analysis, and AI-powered insights out of the box.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Role-based permissions, shared workspaces, comments, and audit logs for every action.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Code2,
    title: 'Developer-First API',
    description: 'RESTful and GraphQL APIs with OpenAPI docs, client SDKs in 8 languages, and webhooks.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'White-label support. Match your brand with custom domains, themes, colors, and email templates.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Lock,
    title: 'Compliance Ready',
    description: 'GDPR, HIPAA, CCPA. Data residency controls, DPA agreements, and privacy-first architecture.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Backups',
    description: 'Point-in-time recovery, 99-day backup retention, and one-click restore to any snapshot.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Features',
    description: 'Smart autocomplete, anomaly detection, natural language queries, and predictive scaling.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Database,
    title: 'Managed Infrastructure',
    description: 'Zero-downtime deployments, auto-scaling, load balancing, and proactive health monitoring.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'Dedicated Slack channel, 15-min response SLA on Pro+, and a library of 500+ help articles.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

const highlights = [
  { stat: '99.99%', label: 'Uptime SLA' },
  { stat: '<100ms', label: 'Avg. response time' },
  { stat: '200+', label: 'Edge locations' },
  { stat: '10M+', label: 'API calls / day' },
];

export default async function FeaturesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">
          PLATFORM FEATURES
        </p>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-5 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Everything your team needs
        </h1>
        <p className="relative text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {settings.site_name} ships with a complete, production-ready feature set so you
          can focus on building — not infrastructure.
        </p>
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            href="/examples"
            className="px-8 py-3.5 glass-card rounded-xl font-semibold text-sm text-white border border-white/10 hover:border-purple-500/50 transition-all flex items-center gap-2"
          >
            See Examples <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((h) => (
            <div key={h.stat} className="glass-card rounded-2xl p-6 text-center">
              <p
                className="text-3xl font-bold gradient-text-purple mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {h.stat}
              </p>
              <p className="text-slate-500 text-sm">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card glass-card-hover rounded-2xl p-6 group"
                >
                  <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3
                    className="text-white font-semibold text-lg mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">COMPARE</p>
            <h2
              className="text-4xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {settings.site_name} vs. the alternatives
            </h2>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-6 py-4 text-slate-400 font-medium">Feature</th>
                  <th className="px-6 py-4 text-purple-400 font-semibold">{settings.site_name}</th>
                  <th className="px-6 py-4 text-slate-500 font-medium">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Edge-distributed globally',
                  'Built-in AI features',
                  'No vendor lock-in',
                  'SOC 2 certified',
                  'Open API + webhooks',
                  'White-label support',
                  'Unlimited team members',
                  '24/7 human support',
                ].map((feat, i) => (
                  <tr key={feat} className={i % 2 === 0 ? 'bg-white/2' : ''}>
                    <td className="px-6 py-3.5 text-slate-300">{feat}</td>
                    <td className="px-6 py-3.5 text-center">
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    </td>
                    <td className="px-6 py-3.5 text-center text-slate-600">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-14 border border-purple-500/20 bg-gradient-to-b from-purple-900/20 to-transparent">
          <h2
            className="text-4xl font-bold gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Start building today
          </h2>
          <p className="text-slate-400 mb-8">Free plan available. No credit card required.</p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
          >
            See Pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
