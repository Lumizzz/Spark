import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import { Check, X, Zap, Shield, GitBranch, Globe, BarChart2, Code2, Terminal, Users, ArrowRight, Star, Play } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product — Spark',
  description: 'Every feature your team needs to build and ship world-class software.',
};

const SCHEMA_CODE = [
  { n: 1, t: '// Schema', c: 'comment' },
  { n: 2, t: 'const schema = new Schema({', c: 'code' },
  { n: 3, t: '  name: {', c: 'code' },
  { n: 4, t: '    type: String,', c: 'code' },
  { n: 5, t: '    required: true,', c: 'code' },
  { n: 6, t: '    plt.scatter(x_values, y_values, s=20)', c: 'comment' },
  { n: 7, t: '    plt.title("Scatter Plot")', c: 'comment' },
  { n: 8, t: '    plt.xlabel("x values")', c: 'comment' },
  { n: 9, t: '    plt.show()', c: 'comment' },
  { n: 10, t: '  },', c: 'code' },
  { n: 11, t: '}, {timestamps: true})', c: 'code' },
  { n: 12, t: '', c: 'empty' },
  { n: 13, t: '// Model', c: 'comment' },
  { n: 14, t: "export default mongoose.model('collection', schema,", c: 'code' },
];

const CAPABILITIES = [
  { icon: Zap, title: 'Blazing Fast Builds', desc: 'Build times under 10 seconds with our distributed pipeline.', badge: 'Avg 8s', c: 'violet' },
  { icon: Shield, title: 'Enterprise Security', desc: 'SOC2 Type II certified with E2E encryption and SSO.', badge: 'SOC2', c: 'emerald' },
  { icon: GitBranch, title: 'Branch Deployments', desc: 'Every PR gets an isolated preview environment automatically.', badge: '', c: 'blue' },
  { icon: Globe, title: 'Global Edge Network', desc: 'Serve from 220+ edge locations with sub-20ms TTFB.', badge: '220+', c: 'cyan' },
  { icon: BarChart2, title: 'Real-time Analytics', desc: 'Built-in performance metrics and error tracking.', badge: 'Beta', c: 'amber' },
  { icon: Code2, title: 'API First', desc: 'Every feature accessible via REST or GraphQL.', badge: '', c: 'rose' },
  { icon: Terminal, title: 'CLI & SDK', desc: 'One command to deploy, rollback, scale, and debug.', badge: '', c: 'teal' },
  { icon: Users, title: 'Team Collaboration', desc: 'Comments, notifications, and approval workflows built in.', badge: '', c: 'purple' },
];

const COMPARISON = [
  ['Free tier', true, true, true, false],
  ['Unlimited projects', true, false, false, false],
  ['Branch previews', true, true, true, false],
  ['Edge functions', true, true, true, false],
  ['AI code review', true, false, false, false],
  ['Built-in analytics', true, 'Paid', false, false],
  ['Team seats free', 'Unlimited', '1', '1', '1'],
  ['24/7 support', true, 'Enterprise', 'Enterprise', false],
];

const COLOR = {
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

function Val({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (v === false) return <span className="text-slate-800 text-lg block text-center">—</span>;
  return <span className="text-xs text-slate-400 text-center block">{v}</span>;
}

export default async function ProductPage() {
  const settings = await getSiteSettings();

  return (
    <div style={{ background: 'var(--color-bg)' }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.9) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] opacity-10 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.8) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold mb-8 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current text-amber-400" />
            WE JUST RAISED $20M IN SERIES B
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #fff 0%, rgba(196,181,253,0.9) 50%, rgba(147,197,253,0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Accelerate high-quality software development
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Our AI-powered assistant boosts developer productivity by 10×. Ship faster, break less, collaborate better.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/download"
              className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
              Download the app
            </Link>
            <Link href="/contact"
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 backdrop-blur-sm">
              Talk to an expert
            </Link>
          </div>
        </div>
      </section>

      {/* ── LOGO STRIP ──────────────────────────────────── */}
      <section className="py-12 px-6 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[10px] text-slate-600 font-semibold uppercase tracking-[0.2em] mb-8">Trusted by engineering teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {['zendesk', 'Rakuten', '⊞ Discord', '∴ PACIFIC FUNDS', '⊗ NCR', '⬡ Lattice', 'airbnb'].map((logo) => (
              <span key={logo} className="text-slate-600 hover:text-slate-400 font-semibold text-sm transition-colors cursor-default tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}>{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CODE SHOWCASE ──────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 max-w-xl">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-5">DEVELOPER FIRST</p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #fff 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Facilitate and expedite the process of creating top-notch software
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Our AI-driven platform fosters innovation through tools that enhance developer productivity and code quality.
              </p>
              <div className="flex gap-3 flex-wrap">
                {['Productivity', 'Collaboration', 'Security'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg glass-card text-sm text-slate-300 border border-white/8">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            {/* Code editor mockup */}
            <div className="flex-1 w-full max-w-xl">
              <div className="code-block" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2), 0 0 60px rgba(124,58,237,0.05)' }}>
                <div className="code-block-header justify-between">
                  <div className="flex items-center gap-2">
                    <div className="code-dot code-dot-red" /><div className="code-dot code-dot-yellow" /><div className="code-dot code-dot-green" />
                  </div>
                  <div className="flex gap-1">
                    {['index.js', 'README.md', '.gitignore'].map((f, i) => (
                      <span key={f} className={`text-xs px-2.5 py-1 rounded ${i === 0 ? 'bg-white/8 text-white' : 'text-slate-600'}`}>{f}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5 space-y-0.5">
                  {SCHEMA_CODE.map((line) => (
                    <div key={line.n} className="flex gap-4">
                      <span className="text-slate-700 select-none w-5 shrink-0 text-right text-xs tabular-nums pt-[1px]">{line.n}</span>
                      <span className={`text-xs leading-5 font-mono ${line.c === 'comment' ? 'text-slate-600 italic' : line.c === 'empty' ? '' : 'text-slate-300'}`}>
                        {line.t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────── */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { val: '50,000+', lbl: 'Developers', sub: 'Using Spark daily' },
            { val: '99.99%', lbl: 'Uptime SLA', sub: 'Enterprise guaranteed' },
            { val: '220+', lbl: 'Edge locations', sub: 'Globally distributed' },
            { val: '4.9 ★', lbl: 'Avg. rating', sub: 'Across all reviews' },
          ].map((s) => (
            <div key={s.lbl} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2 tabular-nums"
                style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.val}
              </div>
              <div className="text-white font-semibold text-sm">{s.lbl}</div>
              <div className="text-slate-600 text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES GRID ────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">CAPABILITIES</p>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Everything your team needs
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">One platform covering the full development lifecycle — from first commit to global scale.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              const [text, bg, border] = (COLOR[cap.c as keyof typeof COLOR] || COLOR.violet).split(' ');
              return (
                <div key={i} className={`gradient-border-card p-6 hover:translate-y-[-4px] transition-all duration-300 group`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${text}`} />
                    </div>
                    {cap.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${bg} ${text} border ${border} font-semibold`}>{cap.badge}</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold mb-2 group-hover:text-violet-300 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{cap.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">COMPARISON</p>
            <h2 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Why teams choose {settings.site_name}
            </h2>
            <p className="text-slate-400 text-lg">See how we stack up against the alternatives.</p>
          </div>
          <div className="gradient-border-card overflow-hidden">
            <div className="grid grid-cols-5 border-b border-white/5">
              <div className="px-6 py-4 text-xs text-slate-600 font-semibold uppercase tracking-widest">Feature</div>
              {['✦ Spark', 'Vercel', 'Netlify', 'Heroku'].map((col, i) => (
                <div key={col} className={`px-4 py-4 text-center text-sm font-bold ${i === 0 ? 'text-violet-300 bg-violet-600/10' : 'text-slate-600'}`}>{col}</div>
              ))}
            </div>
            {COMPARISON.map((row, ri) => (
              <div key={ri} className="admin-row grid grid-cols-5 border-b border-white/5 last:border-0 transition-colors">
                {row.map((cell, ci) => ci === 0 ? (
                  <div key={ci} className="px-6 py-3.5 text-slate-300 text-sm font-medium flex items-center">{String(cell)}</div>
                ) : (
                  <div key={ci} className={`px-4 py-3.5 flex items-center justify-center ${ci === 1 ? 'bg-violet-600/5' : ''}`}>
                    <Val v={cell as boolean | string} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <FAQSection />

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-border-card p-14">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-5">GET STARTED FREE</p>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to ship 10× faster?
            </h2>
            <p className="text-slate-400 text-lg mb-10">Join 50,000+ developers. Free forever for individuals, scalable for teams.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/download"
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                Download the app
              </Link>
              <Link href="/pricing"
                className="px-8 py-3.5 border border-white/10 hover:border-violet-500/40 rounded-xl font-bold text-sm text-white transition-all">
                View pricing <ArrowRight className="inline w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQSection() {
  'use client';
  const faqs = [
    { q: 'What languages does Spark support?', a: 'Spark supports JavaScript, TypeScript, Python, Go, Rust, Ruby, and more. If your language has a runtime, we can run it.' },
    { q: 'Does Spark write perfect code?', a: 'Our AI assistant significantly reduces errors and suggests best practices, but all suggestions should be reviewed by your team.' },
    { q: 'How does a customer get the most out of Spark?', a: 'Teams that integrate Spark into their CI/CD pipeline and use branch deployments see the biggest productivity gains.' },
    { q: 'Will my code be shared with other users?', a: 'Never. Your code is private and encrypted. We use it only to power your workspace features and never train models on your data.' },
    { q: 'Does Spark ever output personal data?', a: 'Spark does not store or output any personal data beyond what you explicitly provide in your workspace configuration.' },
  ];
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold gradient-text mb-12" style={{ fontFamily: 'var(--font-display)' }}>FAQs</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details key={i} className="gradient-border-card group overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-white font-medium text-sm hover:text-violet-300 transition-colors">
                <span>{faq.q}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform shrink-0 ml-4" />
              </summary>
              <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Need to import ChevronRight for FAQ
import { ChevronRight } from 'lucide-react';
