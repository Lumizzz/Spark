import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Examples — ${settings.site_name}`,
    description: `See how teams are using ${settings.site_name} to build faster.`,
  };
}

const categories = ['All', 'SaaS', 'E-commerce', 'Startup', 'Agency', 'Enterprise'];

const examples = [
  {
    name: 'LaunchFlow',
    description: 'SaaS onboarding automation platform. Reduced time-to-value by 60% using our workflow builder.',
    category: 'SaaS',
    stat: '3x faster setup',
    color: 'from-purple-600 to-blue-600',
    emoji: '🚀',
  },
  {
    name: 'ShopStack',
    description: 'E-commerce analytics dashboard. Processes 2M+ events daily with real-time inventory sync.',
    category: 'E-commerce',
    stat: '2M events/day',
    color: 'from-green-600 to-teal-600',
    emoji: '🛍️',
  },
  {
    name: 'DevHive',
    description: 'Internal developer portal for a 500-person engineering team. Built and deployed in 2 weeks.',
    category: 'Enterprise',
    stat: '2-week deploy',
    color: 'from-orange-600 to-red-600',
    emoji: '🏗️',
  },
  {
    name: 'Pixels & Co.',
    description: 'Creative agency managing 80+ client projects. Replaced 4 tools with a single integrated workspace.',
    category: 'Agency',
    stat: '4 tools replaced',
    color: 'from-pink-600 to-rose-600',
    emoji: '🎨',
  },
  {
    name: 'Fundly',
    description: 'Fintech startup that went from idea to 10k users in 90 days. Zero infrastructure headaches.',
    category: 'Startup',
    stat: '10k users in 90 days',
    color: 'from-cyan-600 to-blue-600',
    emoji: '💸',
  },
  {
    name: 'HealthOS',
    description: 'HIPAA-compliant patient management system. Handles sensitive data with enterprise security controls.',
    category: 'Enterprise',
    stat: 'HIPAA compliant',
    color: 'from-blue-600 to-indigo-600',
    emoji: '🏥',
  },
  {
    name: 'Edify',
    description: 'Online learning platform with 50k enrolled students. Scales dynamically with course traffic spikes.',
    category: 'SaaS',
    stat: '50k students',
    color: 'from-violet-600 to-purple-600',
    emoji: '📚',
  },
  {
    name: 'MarketMesh',
    description: 'B2B marketplace connecting 200+ vendors. Launched with 3 engineers in under 6 months.',
    category: 'Startup',
    stat: '6-month build',
    color: 'from-teal-600 to-green-600',
    emoji: '🔗',
  },
  {
    name: 'NovaBrand',
    description: 'Global brand agency running campaigns for Fortune 500 clients across 30+ countries.',
    category: 'Agency',
    stat: '30+ countries',
    color: 'from-yellow-600 to-orange-600',
    emoji: '🌍',
  },
];

export default async function ExamplesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-16 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">
          CUSTOMER STORIES
        </p>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          See what&apos;s possible
        </h1>
        <p className="relative text-slate-400 text-lg max-w-xl mx-auto">
          Thousands of teams across every industry use {settings.site_name} to ship faster.
          Here are a few of their stories.
        </p>
      </section>

      {/* Filter bar */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                cat === 'All'
                  ? 'bg-purple-600 text-white'
                  : 'glass-card text-slate-400 hover:text-white hover:border-purple-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Examples grid */}
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((ex) => (
            <div
              key={ex.name}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden group cursor-pointer"
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br ${ex.color} p-8 flex items-center justify-between`}>
                <span className="text-4xl">{ex.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
                  {ex.category}
                </span>
              </div>
              {/* Card body */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-white font-bold text-lg"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {ex.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0 mt-0.5" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{ex.description}</p>
                <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  ✦ {ex.stat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 border border-purple-500/20 bg-gradient-to-b from-purple-900/20 to-transparent">
          <h2
            className="text-4xl font-bold gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Build your own story
          </h2>
          <p className="text-slate-400 mb-8">Start for free. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 glass-card rounded-xl font-semibold text-sm text-white border border-white/10 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2"
            >
              Talk to Sales <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
