'use client';

import type { PageSection, BlockProps, HeroProps, FeaturesGridProps, CTASectionProps, FAQSectionProps, ImageTextProps, RichTextProps, GalleryProps, LogoStripProps, TestimonialsProps } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface BlockPropsEditorProps {
  section: PageSection;
  onChange: (props: BlockProps) => void;
}

// ─── Field helpers ─────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50 transition-colors"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-purple-600' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-slate-400">{label}</span>
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-2 border-t border-white/5">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
    </div>
  );
}

// ─── Hero Editor ───────────────────────────────────────────────
function HeroEditor({ props, onChange }: { props: HeroProps; onChange: (p: HeroProps) => void }) {
  const u = (key: keyof HeroProps, val: unknown) => onChange({ ...props, [key]: val });

  return (
    <div className="space-y-4">
      <Field label="Eyebrow Text">
        <Input value={props.eyebrow || ''} onChange={(v) => u('eyebrow', v)} placeholder="YOUR TAGLINE" />
      </Field>
      <Field label="Main Headline *">
        <Textarea value={props.title} onChange={(v) => u('title', v)} placeholder="Your Amazing Headline" rows={2} />
      </Field>
      <Field label="Subtitle">
        <Textarea value={props.subtitle || ''} onChange={(v) => u('subtitle', v)} placeholder="Supporting description..." />
      </Field>
      <SectionDivider title="Primary CTA" />
      <Field label="Button Text">
        <Input value={props.ctaPrimary?.text || ''} onChange={(v) => u('ctaPrimary', { ...props.ctaPrimary, text: v })} placeholder="Get Started" />
      </Field>
      <Field label="Button URL">
        <Input value={props.ctaPrimary?.href || ''} onChange={(v) => u('ctaPrimary', { ...props.ctaPrimary, href: v })} placeholder="/signup" />
      </Field>
      <SectionDivider title="Secondary CTA" />
      <Field label="Button Text">
        <Input value={props.ctaSecondary?.text || ''} onChange={(v) => u('ctaSecondary', { ...props.ctaSecondary, text: v })} placeholder="Learn More" />
      </Field>
      <Field label="Button URL">
        <Input value={props.ctaSecondary?.href || ''} onChange={(v) => u('ctaSecondary', { ...props.ctaSecondary, href: v })} placeholder="#features" />
      </Field>
      <SectionDivider title="Appearance" />
      <Field label="Size">
        <Select
          value={props.size || 'large'}
          onChange={(v) => u('size', v)}
          options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]}
        />
      </Field>
      <Toggle checked={!!props.backgroundGradient} onChange={(v) => u('backgroundGradient', v)} label="Show background gradient" />
      <Toggle checked={!!props.showOrbs} onChange={(v) => u('showOrbs', v)} label="Show floating orbs" />
    </div>
  );
}

// ─── Features Grid Editor ──────────────────────────────────────
function FeaturesGridEditor({ props, onChange }: { props: FeaturesGridProps; onChange: (p: FeaturesGridProps) => void }) {
  const updateFeature = (i: number, key: string, val: string) => {
    const features = [...props.features];
    features[i] = { ...features[i], [key]: val };
    onChange({ ...props, features });
  };

  const addFeature = () => onChange({ ...props, features: [...props.features, { icon: 'Star', title: 'New Feature', description: 'Feature description' }] });
  const removeFeature = (i: number) => onChange({ ...props, features: props.features.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} placeholder="FEATURES" /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Section title" /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Field label="Columns">
        <Select value={String(props.columns || 3)} onChange={(v) => onChange({ ...props, columns: Number(v) as 2 | 3 | 4 })} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
      </Field>
      <SectionDivider title="Features" />
      {props.features.map((f, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3 relative">
          <button onClick={() => removeFeature(i)} className="absolute top-3 right-3 p-1 rounded text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
          <Field label="Icon (Lucide name)"><Input value={f.icon || ''} onChange={(v) => updateFeature(i, 'icon', v)} placeholder="Zap" /></Field>
          <Field label="Title"><Input value={f.title} onChange={(v) => updateFeature(i, 'title', v)} /></Field>
          <Field label="Description"><Textarea value={f.description} onChange={(v) => updateFeature(i, 'description', v)} rows={2} /></Field>
        </div>
      ))}
      <button onClick={addFeature} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Feature
      </button>
    </div>
  );
}

// ─── CTA Editor ────────────────────────────────────────────────
function CTAEditor({ props, onChange }: { props: CTASectionProps; onChange: (p: CTASectionProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title *"><Textarea value={props.title} onChange={(v) => onChange({ ...props, title: v })} rows={2} /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Field label="Background Style">
        <Select value={props.backgroundStyle || 'gradient'} onChange={(v) => onChange({ ...props, backgroundStyle: v as 'gradient' | 'dark' | 'purple' })} options={[{ value: 'gradient', label: 'Gradient' }, { value: 'dark', label: 'Dark' }, { value: 'purple', label: 'Purple' }]} />
      </Field>
      <SectionDivider title="Primary CTA" />
      <Field label="Button Text"><Input value={props.ctaPrimary?.text || ''} onChange={(v) => onChange({ ...props, ctaPrimary: { ...props.ctaPrimary, text: v, href: props.ctaPrimary?.href || '' } })} /></Field>
      <Field label="Button URL"><Input value={props.ctaPrimary?.href || ''} onChange={(v) => onChange({ ...props, ctaPrimary: { ...props.ctaPrimary, href: v, text: props.ctaPrimary?.text || '' } })} /></Field>
      <SectionDivider title="Secondary CTA" />
      <Field label="Button Text"><Input value={props.ctaSecondary?.text || ''} onChange={(v) => onChange({ ...props, ctaSecondary: { ...props.ctaSecondary, text: v, href: props.ctaSecondary?.href || '' } })} /></Field>
      <Field label="Button URL"><Input value={props.ctaSecondary?.href || ''} onChange={(v) => onChange({ ...props, ctaSecondary: { ...props.ctaSecondary, href: v, text: props.ctaSecondary?.text || '' } })} /></Field>
    </div>
  );
}

// ─── FAQ Editor ────────────────────────────────────────────────
function FAQEditor({ props, onChange }: { props: FAQSectionProps; onChange: (p: FAQSectionProps) => void }) {
  const updateFAQ = (i: number, key: string, val: string) => {
    const faqs = [...props.faqs];
    faqs[i] = { ...faqs[i], [key]: val };
    onChange({ ...props, faqs });
  };

  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <SectionDivider title="FAQ Items" />
      {props.faqs.map((faq, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3 relative">
          <button onClick={() => onChange({ ...props, faqs: props.faqs.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 p-1 rounded text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
          <Field label="Question"><Input value={faq.question} onChange={(v) => updateFAQ(i, 'question', v)} /></Field>
          <Field label="Answer"><Textarea value={faq.answer} onChange={(v) => updateFAQ(i, 'answer', v)} /></Field>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, faqs: [...props.faqs, { question: 'New Question', answer: 'Answer here...' }] })} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add FAQ
      </button>
    </div>
  );
}

// ─── Image Text Editor ─────────────────────────────────────────
function ImageTextEditor({ props, onChange }: { props: ImageTextProps; onChange: (p: ImageTextProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title *"><Input value={props.title} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <Field label="Content"><Textarea value={props.content} onChange={(v) => onChange({ ...props, content: v })} rows={4} /></Field>
      <Field label="Image URL"><Input value={props.imageUrl || ''} onChange={(v) => onChange({ ...props, imageUrl: v })} placeholder="https://..." /></Field>
      <Field label="Image Position">
        <Select value={props.imagePosition || 'right'} onChange={(v) => onChange({ ...props, imagePosition: v as 'left' | 'right' })} options={[{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }]} />
      </Field>
      <Field label="CTA Text"><Input value={props.ctaText || ''} onChange={(v) => onChange({ ...props, ctaText: v })} /></Field>
      <Field label="CTA URL"><Input value={props.ctaHref || ''} onChange={(v) => onChange({ ...props, ctaHref: v })} /></Field>
    </div>
  );
}

// ─── Rich Text Editor ──────────────────────────────────────────
function RichTextEditor({ props, onChange }: { props: RichTextProps; onChange: (p: RichTextProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Content (HTML)"><Textarea value={props.content} onChange={(v) => onChange({ ...props, content: v })} rows={10} placeholder="<h2>Title</h2><p>Content...</p>" /></Field>
      <Field label="Alignment">
        <Select value={props.alignment || 'left'} onChange={(v) => onChange({ ...props, alignment: v as 'left' | 'center' | 'right' })} options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} />
      </Field>
      <Field label="Max Width">
        <Select value={props.maxWidth || 'prose'} onChange={(v) => onChange({ ...props, maxWidth: v as 'prose' | 'wide' | 'full' })} options={[{ value: 'prose', label: 'Prose (narrow)' }, { value: 'wide', label: 'Wide' }, { value: 'full', label: 'Full width' }]} />
      </Field>
    </div>
  );
}

// ─── Gallery Editor ────────────────────────────────────────────
function GalleryEditor({ props, onChange }: { props: GalleryProps; onChange: (p: GalleryProps) => void }) {
  const updateImage = (i: number, key: string, val: string) => {
    const images = [...props.images];
    images[i] = { ...images[i], [key]: val };
    onChange({ ...props, images });
  };

  return (
    <div className="space-y-4">
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <Field label="Columns">
        <Select value={String(props.columns || 3)} onChange={(v) => onChange({ ...props, columns: Number(v) as 2 | 3 | 4 })} options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]} />
      </Field>
      <SectionDivider title="Images" />
      {props.images.map((img, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-2 relative">
          <button onClick={() => onChange({ ...props, images: props.images.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 p-1 rounded text-slate-600 hover:text-red-400">
            <Trash2 className="w-3 h-3" />
          </button>
          <Field label="Image URL"><Input value={img.url} onChange={(v) => updateImage(i, 'url', v)} placeholder="https://..." /></Field>
          <Field label="Alt Text"><Input value={img.alt} onChange={(v) => updateImage(i, 'alt', v)} /></Field>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, images: [...props.images, { url: '', alt: '' }] })} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Image
      </button>
    </div>
  );
}

// ─── Logo Strip Editor ─────────────────────────────────────────
function LogoStripEditor({ props, onChange }: { props: LogoStripProps; onChange: (p: LogoStripProps) => void }) {
  const updateLogo = (i: number, val: string) => {
    const logos = [...props.logos];
    logos[i] = val;
    onChange({ ...props, logos });
  };

  return (
    <div className="space-y-4">
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <SectionDivider title="Logos" />
      {props.logos.map((logo, i) => (
        <div key={i} className="flex gap-2">
          <Input value={logo} onChange={(v) => updateLogo(i, v)} placeholder="Company name" />
          <button onClick={() => onChange({ ...props, logos: props.logos.filter((_, idx) => idx !== i) })} className="p-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, logos: [...props.logos, 'New Company'] })} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Logo
      </button>
    </div>
  );
}

// ─── Testimonials Editor ───────────────────────────────────────
function TestimonialsEditor({ props, onChange }: { props: TestimonialsProps; onChange: (p: TestimonialsProps) => void }) {
  const update = (i: number, key: string, val: string) => {
    const testimonials = [...props.testimonials];
    testimonials[i] = { ...testimonials[i], [key]: val };
    onChange({ ...props, testimonials });
  };

  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <SectionDivider title="Testimonials" />
      {props.testimonials.map((t, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-2 relative">
          <button onClick={() => onChange({ ...props, testimonials: props.testimonials.filter((_, idx) => idx !== i) })} className="absolute top-3 right-3 p-1 rounded text-slate-600 hover:text-red-400">
            <Trash2 className="w-3 h-3" />
          </button>
          <Field label="Quote"><Textarea value={t.quote} onChange={(v) => update(i, 'quote', v)} rows={2} /></Field>
          <Field label="Author"><Input value={t.author} onChange={(v) => update(i, 'author', v)} /></Field>
          <Field label="Role"><Input value={t.role} onChange={(v) => update(i, 'role', v)} /></Field>
          <Field label="Company"><Input value={t.company} onChange={(v) => update(i, 'company', v)} /></Field>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, testimonials: [...props.testimonials, { quote: 'Great product!', author: 'New Person', role: 'CEO', company: 'Company' }] })} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Testimonial
      </button>
    </div>
  );
}

// ─── Pricing Table Info ────────────────────────────────────────
function PricingTableInfo({ props, onChange }: { props: { eyebrow?: string; title?: string; subtitle?: string; showToggle?: boolean }; onChange: (p: typeof props) => void }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
        💡 Pricing plans are managed in the <strong className="text-white">Pricing</strong> section of the dashboard. This block pulls them automatically.
      </div>
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Toggle checked={!!props.showToggle} onChange={(v) => onChange({ ...props, showToggle: v })} label="Show monthly/yearly toggle" />
    </div>
  );
}

function BlogListInfo({ props, onChange }: { props: { postsPerPage?: number; showCategories?: boolean; layout?: string }; onChange: (p: typeof props) => void }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 text-xs text-slate-400">
        💡 Blog posts are managed in the <strong className="text-white">Blog</strong> section. This block shows your published posts.
      </div>
      <Field label="Posts per page"><Input type="number" value={props.postsPerPage || 9} onChange={(v) => onChange({ ...props, postsPerPage: parseInt(v) })} /></Field>
      <Field label="Layout">
        <Select value={props.layout || 'grid'} onChange={(v) => onChange({ ...props, layout: v })} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} />
      </Field>
      <Toggle checked={!!props.showCategories} onChange={(v) => onChange({ ...props, showCategories: v })} label="Show category badges" />
    </div>
  );
}

// ─── Main dispatcher ────────────────────────────────────────────
export default function BlockPropsEditor({ section, onChange }: BlockPropsEditorProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Edit Block
      </h2>
      <p className="text-slate-500 text-xs mb-6">Type: <span className="text-purple-400">{section.type}</span></p>

      {section.type === 'hero' && (
        <HeroEditor props={section.props as HeroProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'features_grid' && (
        <FeaturesGridEditor props={section.props as FeaturesGridProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'cta_section' && (
        <CTAEditor props={section.props as CTASectionProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'faq_section' && (
        <FAQEditor props={section.props as FAQSectionProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'image_text' && (
        <ImageTextEditor props={section.props as ImageTextProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'rich_text' && (
        <RichTextEditor props={section.props as RichTextProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'gallery' && (
        <GalleryEditor props={section.props as GalleryProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'logo_strip' && (
        <LogoStripEditor props={section.props as LogoStripProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'testimonials' && (
        <TestimonialsEditor props={section.props as TestimonialsProps} onChange={(p) => onChange(p)} />
      )}
      {section.type === 'pricing_table' && (
        <PricingTableInfo props={section.props as { eyebrow?: string; title?: string; subtitle?: string; showToggle?: boolean }} onChange={(p) => onChange(p as BlockProps)} />
      )}
      {section.type === 'blog_list' && (
        <BlogListInfo props={section.props as { postsPerPage?: number; showCategories?: boolean; layout?: string }} onChange={(p) => onChange(p as BlockProps)} />
      )}
    </div>
  );
}
