import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';
import { ArrowRight, Heart, Lightbulb, Shield, Rocket } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `About — ${settings.site_name}`,
    description: `Learn about the team and mission behind ${settings.site_name}.`,
  };
}

const team = [
  { name: 'Alex Rivera', role: 'CEO & Co-founder', initials: 'AR', color: 'from-purple-600 to-blue-500' },
  { name: 'Jordan Chen', role: 'CTO & Co-founder', initials: 'JC', color: 'from-blue-600 to-cyan-500' },
  { name: 'Sam Patel', role: 'Head of Design', initials: 'SP', color: 'from-pink-600 to-rose-500' },
  { name: 'Morgan Kim', role: 'Head of Growth', initials: 'MK', color: 'from-green-600 to-teal-500' },
  { name: 'Taylor Brown', role: 'Lead Engineer', initials: 'TB', color: 'from-orange-600 to-yellow-500' },
  { name: 'Casey Wilson', role: 'Customer Success', initials: 'CW', color: 'from-violet-600 to-purple-500' },
];

const values = [
  { icon: Heart, title: 'Customer Obsessed', description: 'Every decision starts with the question: how does this help our users succeed?', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { icon: Lightbulb, title: 'Relentless Innovation', description: 'We ship fast, learn constantly, and never settle for good enough.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Shield, title: 'Trust & Transparency', description: 'We own our mistakes, share our roadmap, and build in public whenever possible.', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Rocket, title: 'Ambitious Vision', description: 'We\'re building the infrastructure layer for the next generation of software teams.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const milestones = [
  { year: '2021', event: 'Founded in a San Francisco garage with a $2M seed round.' },
  { year: '2022', event: 'Launched public beta. 500 teams signed up in the first week.' },
  { year: '2023', event: 'Series A — $18M raised. Team grows to 40 people across 12 countries.' },
  { year: '2024', event: '10,000+ paying customers. Launched AI features and enterprise tier.' },
  { year: '2025', event: 'Series B — $60M. Processing over 10M API calls per day.' },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">
          OUR STORY
        </p>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-6 leading-tight max-w-3xl mx-auto"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          We believe software teams deserve better tools
        </h1>
        <p className="relative text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {settings.site_name} was founded by engineers frustrated with slow, fragmented developer tooling.
          We set out to build the platform we always wished existed.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-12 border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">OUR MISSION</p>
          <blockquote
            className="text-3xl md:text-4xl font-bold gradient-text leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            "To eliminate the infrastructure tax that slows every software team down — so builders can focus on what matters: shipping great products."
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">WHAT WE STAND FOR</p>
            <h2
              className="text-4xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass-card glass-card-hover rounded-2xl p-6">
                  <div className={`w-11 h-11 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    {v.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">JOURNEY</p>
            <h2
              className="text-4xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              How we got here
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[76px] top-0 bottom-0 w-px bg-white/8" />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="w-14 shrink-0 text-right">
                    <span className="text-sm font-bold text-purple-400">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-purple-400/30" />
                  </div>
                  <div className="glass-card rounded-xl p-4 flex-1 -mt-1">
                    <p className="text-slate-300 text-sm leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">THE PEOPLE</p>
            <h2
              className="text-4xl font-bold gradient-text"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Meet the team
            </h2>
            <p className="text-slate-400 mt-3">40 people across 12 countries, united by one mission.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="glass-card rounded-2xl p-6 text-center glass-card-hover">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg`}>
                  {member.initials}
                </div>
                <p className="text-white font-semibold">{member.name}</p>
                <p className="text-slate-500 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-4xl font-bold gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Join us on the journey
          </h2>
          <p className="text-slate-400 mb-8">We&apos;re hiring across engineering, design, and growth.</p>
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
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
