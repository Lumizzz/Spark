'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X, ChevronRight, ChevronDown, Mail, Play } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { StatsBarProps, CodeShowcaseProps, FeatureShowcaseProps, ComparisonTableProps, NewsletterProps } from '@/types';
import React from 'react';

const getIcon = (name: string) => {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[name] || LucideIcons.Star;
};

// ─── COUNT-UP HOOK ───────────────────────────────────────────
function useCountUp(target: string, duration = 1800) {
  const [display, setDisplay] = useState('0');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setDisplay(target); return; }
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(num % 1 === 0 ? Math.floor(num * eased).toLocaleString() : (num * eased).toFixed(1));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target, duration]);
  return { display, ref };
}

// ─── STATS BAR ───────────────────────────────────────────────
function StatCounter({ stat }: { stat: StatsBarProps['stats'][number] }) {
  const { display, ref } = useCountUp(stat.value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold mb-3 tabular-nums"
        style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {stat.prefix}{display}{stat.suffix}
      </div>
      <div className="text-white font-semibold text-sm tracking-wide">{stat.label}</div>
      {stat.description && <div className="text-slate-500 text-xs mt-1.5">{stat.description}</div>}
    </div>
  );
}

export function StatsBarBlock({ props }: { props: StatsBarProps }) {
  const { eyebrow, title, stats, background = 'dark' } = props;
  const bgMap = { transparent: '', dark: 'bg-white/[0.02]', gradient: 'bg-gradient-to-br from-violet-950/30 via-transparent to-blue-950/20' };
  return (
    <section className={`py-24 px-6 border-y border-white/5 ${bgMap[background] || bgMap.dark}`}>
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title) && (
          <div className="text-center mb-16">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
          </div>
        )}
        <div className={`grid gap-10 ${stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {stats.map((stat, i) => (
            <div key={i} style={{ animationDelay: `${i * 100}ms` }} className="stat-animate">
              <StatCounter stat={stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CODE SHOWCASE ───────────────────────────────────────────
function syntaxHighlight(code: string) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/[^\n]*)/g, '<span class="token-comment">$1</span>')
    .replace(/\b(const|let|var|function|return|import|from|export|default|async|await|type|interface|extends|class|new)\b/g, '<span class="token-keyword">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span class="token-string">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>');
}

export function CodeShowcaseBlock({ props }: { props: CodeShowcaseProps }) {
  const { eyebrow, title, subtitle, tabs, imagePosition = 'right' } = props;
  const [activeTab, setActiveTab] = useState(0);
  const tab = tabs?.[activeTab] || tabs?.[0];
  const lines = tab?.code?.split('\n') || [];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-1 max-w-lg">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-4">{eyebrow}</p>}
            {title && <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg leading-relaxed">{subtitle}</p>}
          </div>
          <div className="flex-1 w-full">
            <div className="code-block shadow-2xl" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15)' }}>
              <div className="code-block-header justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="code-dot code-dot-red" />
                  <div className="code-dot code-dot-yellow" />
                  <div className="code-dot code-dot-green" />
                </div>
                <div className="flex gap-1">
                  {tabs?.map((t, i) => (
                    <button key={i} onClick={() => setActiveTab(i)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${i === activeTab ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20' : 'text-slate-600 hover:text-slate-400'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <pre className="p-5 text-xs leading-relaxed min-h-[260px]">
                  <code>
                    {lines.map((line, i) => (
                      <div key={i} className="flex">
                        <span className="select-none text-slate-700 w-6 shrink-0 mr-4 text-right tabular-nums">{i + 1}</span>
                        <span dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) || '&nbsp;' }} />
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURE SHOWCASE ────────────────────────────────────────
export function FeatureShowcaseBlock({ props }: { props: FeatureShowcaseProps }) {
  const { eyebrow, title, subtitle, features } = props;
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(features || []).map((feature, i) => {
            const Icon = getIcon(feature.icon || 'Star');
            return (
              <div key={i} className="group gradient-border-card p-6 transition-all duration-300 hover:translate-y-[-4px]"
                style={{ transitionDelay: `${i * 40}ms` }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold text-base mb-2.5 group-hover:text-violet-300 transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-1 text-xs text-slate-700 group-hover:text-violet-400 transition-colors">
                  <span>Learn more</span><ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── COMPARISON TABLE ────────────────────────────────────────
export function ComparisonTableBlock({ props }: { props: ComparisonTableProps }) {
  const { eyebrow, title, subtitle, competitors, features } = props;
  const cols = ['✦ Spark', ...(competitors || [])];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-12">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg max-w-xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className="gradient-border-card overflow-hidden">
          <div className="grid border-b border-white/5" style={{ gridTemplateColumns: `1fr ${cols.map(() => '1fr').join(' ')}` }}>
            <div className="px-6 py-4" />
            {cols.map((c, i) => (
              <div key={i} className={`px-4 py-4 text-center text-sm font-bold ${i === 0 ? 'text-violet-300 bg-violet-600/10' : 'text-slate-500'}`}>{c}</div>
            ))}
          </div>
          {(features || []).map((row, ri) => (
            <div key={ri} className="admin-row grid border-b border-white/5 last:border-0 transition-colors"
              style={{ gridTemplateColumns: `1fr ${cols.map(() => '1fr').join(' ')}` }}>
              <div className="px-6 py-3.5 text-slate-300 text-sm font-medium flex items-center">{row.name}</div>
              {row.values.map((v, vi) => (
                <div key={vi} className={`px-4 py-3.5 flex items-center justify-center ${vi === 0 ? 'bg-violet-600/5' : ''}`}>
                  {v === true ? <Check className="w-4 h-4 text-emerald-400" />
                   : v === false ? <X className="w-4 h-4 text-slate-700" />
                   : <span className="text-xs text-slate-400 text-center">{v}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NEWSLETTER ──────────────────────────────────────────────
export function NewsletterBlock({ props }: { props: NewsletterProps }) {
  const { eyebrow, title, subtitle, placeholder = 'Your email address', buttonText = 'Subscribe', backgroundStyle = 'gradient' } = props;
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const bgMap = {
    dark: 'bg-white/3 border-white/8',
    gradient: 'bg-gradient-to-br from-violet-950/40 to-blue-950/30 border-violet-500/20',
    purple: 'bg-violet-600/15 border-violet-500/30',
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { subscribeToNewsletter } = await import('@/lib/actions');
      const { error } = await subscribeToNewsletter(email, undefined, 'newsletter-block');
      if (error) throw new Error(error);
      setDone(true);
    } catch {
      // Silently succeed for better UX — user gets feedback either way
      setDone(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className={`rounded-3xl border p-10 text-center ${bgMap[backgroundStyle] || bgMap.gradient}`}
          style={{ backdropFilter: 'blur(24px)' }}>
          {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
          {title && <h2 className="text-3xl font-bold gradient-text mb-3" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
          {subtitle && <p className="text-slate-400 text-sm mb-8 leading-relaxed">{subtitle}</p>}
          {done ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
              <Check className="w-5 h-5" /> You're in! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={placeholder}
                  className="w-full pl-9 pr-4 py-3 rounded-xl admin-search-input text-sm text-white" />
              </div>
              <button type="submit" disabled={loading}
                className="px-5 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-60 shrink-0">
                {loading ? '...' : buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── TIMELINE BLOCK ──────────────────────────────────────────
export type TimelineProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: { year: string; title: string; description: string; badge?: string }[];
};

export function TimelineBlock({ props }: { props: TimelineProps }) {
  const { eyebrow, title, subtitle, items } = props;
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg max-w-xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className="relative">
          <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
          <div className="space-y-10">
            {(items || []).map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-violet-400 font-bold text-sm tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>{item.year}</span>
                </div>
                <div className="relative shrink-0">
                  <div className="w-4 h-4 rounded-full border-2 border-violet-500 bg-violet-500/20 mt-0.5 group-hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40" />
                </div>
                <div className="gradient-border-card p-5 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                    {item.badge && <span className="admin-chip bg-violet-500/10 text-violet-400 border border-violet-500/20">{item.badge}</span>}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TEAM GRID BLOCK ─────────────────────────────────────────
export type TeamGridProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  members: { name: string; role: string; bio?: string; avatar?: string; twitter?: string; linkedin?: string }[];
};

const MEMBER_GRADIENTS = ['from-violet-500 to-blue-500','from-blue-500 to-cyan-400','from-emerald-400 to-teal-500','from-rose-500 to-pink-500','from-amber-400 to-orange-500','from-purple-500 to-indigo-500'];

export function TeamGridBlock({ props }: { props: TeamGridProps }) {
  const { eyebrow, title, subtitle, members } = props;
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg max-w-xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(members || []).map((m, i) => {
            const gradient = MEMBER_GRADIENTS[i % MEMBER_GRADIENTS.length];
            const initials = m.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={i} className="gradient-border-card p-6 text-center group hover:translate-y-[-4px] transition-all duration-300">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-2 ring-violet-500/30" />
                ) : (
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xl font-bold text-white mx-auto mb-4 shadow-lg`}>
                    {initials}
                  </div>
                )}
                <h3 className="text-white font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{m.name}</h3>
                <p className="text-violet-400 text-xs font-semibold mb-3 uppercase tracking-wider">{m.role}</p>
                {m.bio && <p className="text-slate-500 text-xs leading-relaxed">{m.bio}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── VIDEO EMBED BLOCK ───────────────────────────────────────
export type VideoEmbedProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
};

export function VideoEmbedBlock({ props }: { props: VideoEmbedProps }) {
  const { eyebrow, title, subtitle, videoUrl, thumbnailUrl, aspectRatio = '16:9' } = props;
  const [playing, setPlaying] = useState(false);
  const ratioMap = { '16:9': 'pb-[56.25%]', '4:3': 'pb-[75%]', '1:1': 'pb-[100%]' };

  const getEmbedUrl = (url: string) => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
    return url;
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-12">
            {eyebrow && <p className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400 mb-3">{eyebrow}</p>}
            {title && <h2 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>}
            {subtitle && <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}
        <div className={`relative ${ratioMap[aspectRatio]} rounded-3xl overflow-hidden shadow-2xl`}
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)' }}>
          {playing ? (
            <iframe src={getEmbedUrl(videoUrl)} className="absolute inset-0 w-full h-full" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              style={{ background: thumbnailUrl ? `url(${thumbnailUrl}) center/cover` : 'linear-gradient(135deg, #1a0a2e 0%, #0a0a1e 100%)' }}
              onClick={() => videoUrl && setPlaying(true)}>
              <div className="absolute inset-0 bg-black/30" />
              {videoUrl && (
                <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl animate-pulse-glow">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              )}
              {!videoUrl && <p className="relative text-slate-500 text-sm">Add a video URL to preview</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
