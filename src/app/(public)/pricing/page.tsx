import { Metadata } from 'next';
import { getSiteSettings, getPricingPlans } from '@/lib/actions';
import PricingTableBlock from '@/components/blocks/PricingTableBlock';
import { Check } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Pricing — ${settings.site_name}`,
    description: `Simple, transparent pricing. Choose the plan that fits your team.`,
  };
}

const faqs = [
  { q: 'Can I change plans later?', a: 'Yes — upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.' },
  { q: 'Is there a free trial?', a: 'Our Free plan has no time limit. Paid plans come with a 14-day trial, no credit card required.' },
  { q: 'What payment methods do you accept?', a: 'All major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfer for annual Enterprise plans.' },
  { q: 'Do you offer discounts for nonprofits or startups?', a: 'Yes! Verified nonprofits get 50% off. Early-stage startups may qualify for our startup program. Contact us to apply.' },
  { q: 'How does billing work for teams?', a: 'Pricing is per-seat. You only pay for the members you invite. Add or remove seats anytime.' },
  { q: 'What happens when I hit my usage limit?', a: 'We\'ll notify you at 80% and 100% of your plan limits. We never hard-cut access — we work with you on a solution.' },
];

export default async function PricingPage() {
  const [settings, plans] = await Promise.all([getSiteSettings(), getPricingPlans()]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-4 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">PRICING</p>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Simple, transparent pricing
        </h1>
        <p className="relative text-slate-400 text-lg max-w-xl mx-auto">
          No hidden fees. No complicated tiers. Start free and scale as you grow.
        </p>
      </section>

      {/* Pricing cards — pulled from DB */}
      <PricingTableBlock
        props={{ eyebrow: '', title: '', subtitle: '', showToggle: true }}
        plans={plans}
      />

      {/* Trust badges */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', title: 'SOC 2 Certified', desc: 'Enterprise-grade security' },
            { icon: '💳', title: 'No credit card', desc: 'to start your free trial' },
            { icon: '🔄', title: 'Cancel anytime', desc: 'No long-term contracts' },
          ].map((t) => (
            <div key={t.title} className="glass-card rounded-xl p-5">
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-white font-semibold text-sm">{t.title}</p>
              <p className="text-slate-500 text-xs mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature checklist */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Everything included on every plan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Unlimited projects',
              'REST & GraphQL API',
              'Real-time collaboration',
              'Custom domains',
              '99.9% uptime SLA',
              'SSL certificates',
              'Daily backups',
              'Email support',
              'Analytics dashboard',
              'Webhooks & integrations',
              'Mobile apps (iOS & Android)',
              'Dark mode',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 glass-card rounded-lg px-4 py-3">
                <Check className="w-4 h-4 text-green-400 shrink-0" />
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">FAQ</p>
            <h2
              className="text-3xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pricing questions answered
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-xl p-6">
                <p className="text-white font-semibold mb-2">{faq.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 border border-purple-500/20 bg-gradient-to-b from-purple-900/20 to-transparent text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">ENTERPRISE</p>
          <h2
            className="text-3xl font-bold gradient-text mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Need a custom plan?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            For large teams with advanced security, compliance, and support requirements.
            Let&apos;s build a plan around your needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
          >
            Talk to Sales
          </Link>
        </div>
      </section>
    </>
  );
}
