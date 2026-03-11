'use client';
import React, { useState } from 'react';
import type {
  PageSection, BlockProps, HeroProps, FeaturesGridProps, CTASectionProps,
  FAQSectionProps, ImageTextProps, RichTextProps, GalleryProps, LogoStripProps,
  TestimonialsProps,
} from '@/types';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

interface BlockPropsEditorProps {
  section: PageSection;
  onChange: (props: BlockProps) => void;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</label>
      {children}
      {hint && <p className="text-slate-600 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50 transition-colors"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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

function ImagePickerField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (url: string) => void; hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {value && (
          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Selected" className="w-full h-full object-cover" />
            <button onClick={() => onChange('')} className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white hover:bg-red-500/80 transition-colors" title="Remove">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder="https://... or pick from library"
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50 transition-colors" />
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-xs font-medium transition-all shrink-0">
            <ImageIcon className="w-3.5 h-3.5" /> Library
          </button>
        </div>
      </div>
      <MediaPickerModal open={open} onClose={() => setOpen(false)} onSelect={onChange} title={`Select ${label}`} />
    </Field>
  );
}

const ICON_SUGGESTIONS = ['Zap', 'Shield', 'Globe', 'BarChart3', 'Users', 'Code2', 'Rocket', 'Star', 'Heart', 'Cpu', 'Database', 'Lock'];

function HeroEditor({ props, onChange }: { props: HeroProps; onChange: (p: HeroProps) => void }) {
  const u = (key: keyof HeroProps, val: unknown) => onChange({ ...props, [key]: val });
  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => u('eyebrow', v)} placeholder="YOUR TAGLINE" /></Field>
      <Field label="Headline *"><Textarea value={props.title} onChange={(v) => u('title', v)} placeholder="Your Amazing Headline" rows={2} /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => u('subtitle', v)} placeholder="Supporting description..." /></Field>
      <SectionDivider title="Primary CTA" />
      <Field label="Button Text"><Input value={props.ctaPrimary?.text || ''} onChange={(v) => u('ctaPrimary', { ...props.ctaPrimary, text: v, href: props.ctaPrimary?.href || '' })} placeholder="Get Started" /></Field>
      <Field label="Button URL"><Input value={props.ctaPrimary?.href || ''} onChange={(v) => u('ctaPrimary', { ...props.ctaPrimary, href: v, text: props.ctaPrimary?.text || '' })} placeholder="/signup" /></Field>
      <SectionDivider title="Secondary CTA" />
      <Field label="Button Text"><Input value={props.ctaSecondary?.text || ''} onChange={(v) => u('ctaSecondary', { ...props.ctaSecondary, text: v, href: props.ctaSecondary?.href || '' })} placeholder="Learn More" /></Field>
      <Field label="Button URL"><Input value={props.ctaSecondary?.href || ''} onChange={(v) => u('ctaSecondary', { ...props.ctaSecondary, href: v, text: props.ctaSecondary?.text || '' })} placeholder="#features" /></Field>
      <SectionDivider title="Background" />
      <ImagePickerField label="Background Image" value={props.backgroundImage || ''} onChange={(v) => u('backgroundImage', v)} hint="Optional background image behind the gradient" />
      <Toggle checked={!!props.backgroundGradient} onChange={(v) => u('backgroundGradient', v)} label="Show gradient overlay" />
      <Toggle checked={!!props.showOrbs} onChange={(v) => u('showOrbs', v)} label="Show floating orbs" />
      <SectionDivider title="Layout" />
      <Field label="Section Size">
        <Select value={props.size || 'large'} onChange={(v) => u('size', v)}
          options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]} />
      </Field>
    </div>
  );
}

function FeaturesGridEditor({ props, onChange }: { props: FeaturesGridProps; onChange: (p: FeaturesGridProps) => void }) {
  const updateFeature = (i: number, key: string, val: string) => {
    const features = [...props.features]; features[i] = { ...features[i], [key]: val }; onChange({ ...props, features });
  };
  const addFeature = () => onChange({ ...props, features: [...props.features, { icon: 'Star', title: 'New Feature', description: 'Feature description' }] });
  const removeFeature = (i: number) => onChange({ ...props, features: props.features.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} placeholder="FEATURES" /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Section title" /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Field label="Columns">
        <Select value={String(props.columns || 3)} onChange={(v) => onChange({ ...props, columns: Number(v) as 2 | 3 | 4 })}
          options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns (default)' }, { value: '4', label: '4 Columns' }]} />
      </Field>
      <SectionDivider title={`Features (${props.features.length})`} />
      {props.features.map((f, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">Feature {i + 1}</span>
            <button onClick={() => removeFeature(i)} className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
          </div>
          <Field label="Icon" hint="Lucide icon name, e.g. Zap, Shield, Globe">
            <div className="space-y-1.5">
              <Input value={f.icon || ''} onChange={(v) => updateFeature(i, 'icon', v)} placeholder="Zap" />
              <div className="flex flex-wrap gap-1">
                {ICON_SUGGESTIONS.map((icon) => (
                  <button key={icon} onClick={() => updateFeature(i, 'icon', icon)}
                    className={`px-2 py-0.5 rounded text-xs transition-all ${f.icon === icon ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </Field>
          <Field label="Title"><Input value={f.title} onChange={(v) => updateFeature(i, 'title', v)} /></Field>
          <Field label="Description"><Textarea value={f.description} onChange={(v) => updateFeature(i, 'description', v)} rows={2} /></Field>
        </div>
      ))}
      <button onClick={addFeature} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Feature
      </button>
    </div>
  );
}

function CTAEditor({ props, onChange }: { props: CTASectionProps; onChange: (p: CTASectionProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title *"><Textarea value={props.title} onChange={(v) => onChange({ ...props, title: v })} rows={2} /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Field label="Background Style">
        <Select value={props.backgroundStyle || 'gradient'} onChange={(v) => onChange({ ...props, backgroundStyle: v as 'gradient' | 'dark' | 'purple' })}
          options={[{ value: 'gradient', label: 'Gradient (purple → blue)' }, { value: 'dark', label: 'Dark (subtle)' }, { value: 'purple', label: 'Purple (bold)' }]} />
      </Field>
      <SectionDivider title="Primary CTA" />
      <Field label="Button Text"><Input value={props.ctaPrimary?.text || ''} onChange={(v) => onChange({ ...props, ctaPrimary: { text: v, href: props.ctaPrimary?.href || '' } })} placeholder="Get Started Free" /></Field>
      <Field label="Button URL"><Input value={props.ctaPrimary?.href || ''} onChange={(v) => onChange({ ...props, ctaPrimary: { href: v, text: props.ctaPrimary?.text || '' } })} placeholder="/signup" /></Field>
      <SectionDivider title="Secondary CTA" />
      <Field label="Button Text"><Input value={props.ctaSecondary?.text || ''} onChange={(v) => onChange({ ...props, ctaSecondary: { text: v, href: props.ctaSecondary?.href || '' } })} placeholder="Talk to Sales" /></Field>
      <Field label="Button URL"><Input value={props.ctaSecondary?.href || ''} onChange={(v) => onChange({ ...props, ctaSecondary: { href: v, text: props.ctaSecondary?.text || '' } })} placeholder="/contact" /></Field>
    </div>
  );
}

function FAQEditor({ props, onChange }: { props: FAQSectionProps; onChange: (p: FAQSectionProps) => void }) {
  const updateFAQ = (i: number, key: string, val: string) => {
    const faqs = [...props.faqs]; faqs[i] = { ...faqs[i], [key]: val }; onChange({ ...props, faqs });
  };
  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} placeholder="FAQ" /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Frequently Asked Questions" /></Field>
      <SectionDivider title={`FAQ Items (${props.faqs.length})`} />
      {props.faqs.map((faq, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-3 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">FAQ {i + 1}</span>
            <button onClick={() => onChange({ ...props, faqs: props.faqs.filter((_, idx) => idx !== i) })} className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
          </div>
          <Field label="Question"><Input value={faq.question} onChange={(v) => updateFAQ(i, 'question', v)} /></Field>
          <Field label="Answer"><Textarea value={faq.answer} onChange={(v) => updateFAQ(i, 'answer', v)} rows={3} /></Field>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, faqs: [...props.faqs, { question: 'New question?', answer: 'Answer here...' }] })}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add FAQ
      </button>
    </div>
  );
}

function ImageTextEditor({ props, onChange }: { props: ImageTextProps; onChange: (p: ImageTextProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title *"><Input value={props.title} onChange={(v) => onChange({ ...props, title: v })} /></Field>
      <Field label="Content"><Textarea value={props.content} onChange={(v) => onChange({ ...props, content: v })} rows={5} placeholder="Write your content here..." /></Field>
      <ImagePickerField label="Image" value={props.imageUrl || ''} onChange={(v) => onChange({ ...props, imageUrl: v })} />
      <Field label="Image Position">
        <Select value={props.imagePosition || 'right'} onChange={(v) => onChange({ ...props, imagePosition: v as 'left' | 'right' })}
          options={[{ value: 'right', label: 'Image on right' }, { value: 'left', label: 'Image on left' }]} />
      </Field>
      <SectionDivider title="CTA Button" />
      <Field label="Button Text"><Input value={props.ctaText || ''} onChange={(v) => onChange({ ...props, ctaText: v })} placeholder="Learn more" /></Field>
      <Field label="Button URL"><Input value={props.ctaHref || ''} onChange={(v) => onChange({ ...props, ctaHref: v })} placeholder="#" /></Field>
    </div>
  );
}

function RichTextEditor({ props, onChange }: { props: RichTextProps; onChange: (p: RichTextProps) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Content (HTML)" hint="Supports: <h2>, <p>, <strong>, <em>, <ul>, <li>, <a>, <blockquote>">
        <Textarea value={props.content} onChange={(v) => onChange({ ...props, content: v })} rows={12} placeholder="<h2>Title</h2><p>Content...</p>" />
      </Field>
      <Field label="Text Alignment">
        <Select value={props.alignment || 'left'} onChange={(v) => onChange({ ...props, alignment: v as 'left' | 'center' | 'right' })}
          options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} />
      </Field>
      <Field label="Container Width">
        <Select value={props.maxWidth || 'prose'} onChange={(v) => onChange({ ...props, maxWidth: v as 'prose' | 'wide' | 'full' })}
          options={[{ value: 'prose', label: 'Prose (narrow)' }, { value: 'wide', label: 'Wide' }, { value: 'full', label: 'Full width' }]} />
      </Field>
    </div>
  );
}

function GalleryEditor({ props, onChange }: { props: GalleryProps; onChange: (p: GalleryProps) => void }) {
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const updateImage = (i: number, key: string, val: string) => {
    const images = [...props.images]; images[i] = { ...images[i], [key]: val }; onChange({ ...props, images });
  };
  return (
    <div className="space-y-4">
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Gallery" /></Field>
      <Field label="Columns">
        <Select value={String(props.columns || 3)} onChange={(v) => onChange({ ...props, columns: Number(v) as 2 | 3 | 4 })}
          options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
      </Field>
      <SectionDivider title={`Images (${props.images.length})`} />
      {props.images.map((img, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">Image {i + 1}</span>
            <button onClick={() => onChange({ ...props, images: props.images.filter((_, idx) => idx !== i) })} className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
          </div>
          {img.url && <img src={img.url} alt={img.alt} className="w-full h-20 object-cover rounded-lg" />}
          <div className="flex gap-2">
            <input type="text" value={img.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateImage(i, 'url', e.target.value)} placeholder="Image URL"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50" />
            <button onClick={() => setPickerIndex(i)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-xs transition-all shrink-0">
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          <Field label="Alt Text"><Input value={img.alt} onChange={(v) => updateImage(i, 'alt', v)} placeholder="Describe the image" /></Field>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, images: [...props.images, { url: '', alt: '' }] })}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Image
      </button>
      <MediaPickerModal open={pickerIndex !== null} onClose={() => setPickerIndex(null)}
        onSelect={(url) => { if (pickerIndex !== null) { updateImage(pickerIndex, 'url', url); setPickerIndex(null); } }} title="Select Gallery Image" />
    </div>
  );
}

function LogoStripEditor({ props, onChange }: { props: LogoStripProps; onChange: (p: LogoStripProps) => void }) {
  const updateLogo = (i: number, val: string) => {
    const logos = [...props.logos]; logos[i] = val; onChange({ ...props, logos });
  };
  return (
    <div className="space-y-4">
      <Field label="Label Text" hint="e.g. 'Trusted by teams at'">
        <Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Trusted by teams at" />
      </Field>
      <SectionDivider title="Company Names" />
      {props.logos.map((logo, i) => (
        <div key={i} className="flex gap-2">
          <Input value={logo} onChange={(v) => updateLogo(i, v)} placeholder="Company name" />
          <button onClick={() => onChange({ ...props, logos: props.logos.filter((_, idx) => idx !== i) })} className="p-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={() => onChange({ ...props, logos: [...props.logos, 'New Company'] })}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Company
      </button>
    </div>
  );
}

function TestimonialsEditor({ props, onChange }: { props: TestimonialsProps; onChange: (p: TestimonialsProps) => void }) {
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const update = (i: number, key: string, val: string) => {
    const testimonials = [...props.testimonials]; testimonials[i] = { ...testimonials[i], [key]: val }; onChange({ ...props, testimonials });
  };
  return (
    <div className="space-y-4">
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} placeholder="TESTIMONIALS" /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="What our customers say" /></Field>
      <SectionDivider title={`Testimonials (${props.testimonials.length})`} />
      {props.testimonials.map((t, i) => (
        <div key={i} className="glass-card rounded-xl p-4 space-y-2 relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 font-medium">Testimonial {i + 1}</span>
            <button onClick={() => onChange({ ...props, testimonials: props.testimonials.filter((_, idx) => idx !== i) })} className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
          </div>
          <Field label="Quote"><Textarea value={t.quote} onChange={(v) => update(i, 'quote', v)} rows={3} /></Field>
          <Field label="Author Name"><Input value={t.author} onChange={(v) => update(i, 'author', v)} placeholder="Jane Smith" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Role"><Input value={t.role} onChange={(v) => update(i, 'role', v)} placeholder="CEO" /></Field>
            <Field label="Company"><Input value={t.company} onChange={(v) => update(i, 'company', v)} placeholder="Acme Corp" /></Field>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Field label="Avatar URL">
                <input type="text" value={t.avatar || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(i, 'avatar', e.target.value)} placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50" />
              </Field>
            </div>
            <button onClick={() => setPickerIndex(i)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-xs font-medium transition-all mb-0.5 shrink-0">
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
          </div>
          {t.avatar && <img src={t.avatar} alt={t.author} className="w-8 h-8 rounded-full object-cover" />}
        </div>
      ))}
      <button onClick={() => onChange({ ...props, testimonials: [...props.testimonials, { quote: 'Great product!', author: 'New Person', role: 'CEO', company: 'Company' }] })}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-white/10 text-slate-500 hover:text-purple-400 text-xs transition-all">
        <Plus className="w-3.5 h-3.5" /> Add Testimonial
      </button>
      <MediaPickerModal open={pickerIndex !== null} onClose={() => setPickerIndex(null)}
        onSelect={(url) => { if (pickerIndex !== null) { update(pickerIndex, 'avatar', url); setPickerIndex(null); } }} title="Select Avatar" />
    </div>
  );
}

function PricingTableInfo({ props, onChange }: { props: { eyebrow?: string; title?: string; subtitle?: string; showToggle?: boolean }; onChange: (p: typeof props) => void }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 text-xs text-slate-400 leading-relaxed border border-purple-500/20">
        💡 Plans are managed in the <strong className="text-white">Pricing</strong> dashboard and loaded automatically here.
      </div>
      <Field label="Eyebrow"><Input value={props.eyebrow || ''} onChange={(v) => onChange({ ...props, eyebrow: v })} placeholder="PRICING" /></Field>
      <Field label="Title"><Input value={props.title || ''} onChange={(v) => onChange({ ...props, title: v })} placeholder="Simple, transparent pricing" /></Field>
      <Field label="Subtitle"><Textarea value={props.subtitle || ''} onChange={(v) => onChange({ ...props, subtitle: v })} /></Field>
      <Toggle checked={!!props.showToggle} onChange={(v) => onChange({ ...props, showToggle: v })} label="Show monthly / yearly toggle" />
    </div>
  );
}

function BlogListInfo({ props, onChange }: { props: { postsPerPage?: number; showCategories?: boolean; layout?: string }; onChange: (p: typeof props) => void }) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 text-xs text-slate-400 border border-purple-500/20">
        💡 Posts are managed in the <strong className="text-white">Blog</strong> dashboard and loaded automatically here.
      </div>
      <Field label="Posts per page"><Input type="number" value={props.postsPerPage || 9} onChange={(v) => onChange({ ...props, postsPerPage: parseInt(v) || 9 })} /></Field>
      <Field label="Layout">
        <Select value={props.layout || 'grid'} onChange={(v) => onChange({ ...props, layout: v })}
          options={[{ value: 'grid', label: 'Grid — card layout' }, { value: 'list', label: 'List — full width rows' }]} />
      </Field>
      <Toggle checked={!!props.showCategories} onChange={(v) => onChange({ ...props, showCategories: v })} label="Show category badges" />
    </div>
  );
}

const BLOCK_LABELS: Record<string, string> = {
  hero: '🚀 Hero Section',
  features_grid: '⚡ Features Grid',
  pricing_table: '💰 Pricing Table',
  testimonials: '⭐ Testimonials',
  cta_section: '📣 CTA Section',
  faq_section: '❓ FAQ Section',
  image_text: '🖼 Image + Text',
  blog_list: '📝 Blog List',
  rich_text: '✍️ Rich Text',
  gallery: '🖼 Gallery',
  logo_strip: '🏢 Logo Strip',
};

export default function BlockPropsEditor({ section, onChange }: BlockPropsEditorProps) {
  return (
    <div>
      <div className="mb-6 pb-4 border-b border-white/8">
        <p className="text-xs text-slate-500 mb-1">Editing block</p>
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          {BLOCK_LABELS[section.type] || section.type}
        </h2>
      </div>
      {section.type === 'hero' && <HeroEditor props={section.props as HeroProps} onChange={(p) => onChange(p)} />}
      {section.type === 'features_grid' && <FeaturesGridEditor props={section.props as FeaturesGridProps} onChange={(p) => onChange(p)} />}
      {section.type === 'cta_section' && <CTAEditor props={section.props as CTASectionProps} onChange={(p) => onChange(p)} />}
      {section.type === 'faq_section' && <FAQEditor props={section.props as FAQSectionProps} onChange={(p) => onChange(p)} />}
      {section.type === 'image_text' && <ImageTextEditor props={section.props as ImageTextProps} onChange={(p) => onChange(p)} />}
      {section.type === 'rich_text' && <RichTextEditor props={section.props as RichTextProps} onChange={(p) => onChange(p)} />}
      {section.type === 'gallery' && <GalleryEditor props={section.props as GalleryProps} onChange={(p) => onChange(p)} />}
      {section.type === 'logo_strip' && <LogoStripEditor props={section.props as LogoStripProps} onChange={(p) => onChange(p)} />}
      {section.type === 'testimonials' && <TestimonialsEditor props={section.props as TestimonialsProps} onChange={(p) => onChange(p)} />}
      {section.type === 'pricing_table' && <PricingTableInfo props={section.props as { eyebrow?: string; title?: string; subtitle?: string; showToggle?: boolean }} onChange={(p) => onChange(p as BlockProps)} />}
      {section.type === 'blog_list' && <BlogListInfo props={section.props as { postsPerPage?: number; showCategories?: boolean; layout?: string }} onChange={(p) => onChange(p as BlockProps)} />}
    </div>
  );
}
