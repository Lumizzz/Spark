'use client';

import { useState } from 'react';
import { z } from 'zod';
import { getSiteSettings } from '@/lib/actions';
import { Mail, MessageSquare, MapPin, Phone, Send, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactForm, string>>;

const contactOptions = [
  { icon: Mail, label: 'Email', value: 'hello@yourdomain.com', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Available Mon–Fri, 9am–6pm EST', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: MapPin, label: 'Office', value: 'San Francisco, CA', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: keyof ContactForm, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    // Simulate submission — replace with your email service
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  };

  const inputClass = (field: keyof ContactForm) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 text-sm focus:outline-none transition-colors ${
      errors[field] ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-purple-500/50'
    }`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-44 pb-16 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.6) 0%, transparent 65%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">GET IN TOUCH</p>
        <h1
          className="relative text-5xl md:text-6xl font-bold gradient-text mb-5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Contact Us
        </h1>
        <p className="relative text-slate-400 text-lg max-w-xl mx-auto">
          Have a question, feedback, or need help? Our team is happy to hear from you.
        </p>
      </section>

      <section className="py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact options */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Ways to reach us
            </h2>
            {contactOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.label} className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${opt.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${opt.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{opt.label}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{opt.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="glass-card rounded-xl p-5 mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">Response time</p>
              <p className="text-slate-300 text-sm">We typically respond within <strong className="text-white">24 hours</strong> on business days. Enterprise customers get a 1-hour SLA.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Message sent!
                  </h3>
                  <p className="text-slate-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', company: '', subject: '', message: '' }); }}
                    className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Your name"
                        className={inputClass('name')}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="you@company.com"
                        className={inputClass('email')}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      placeholder="Your company (optional)"
                      className={inputClass('company')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Subject *</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      placeholder="How can we help?"
                      className={inputClass('subject')}
                    />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-medium">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us more about what you need..."
                      rows={5}
                      className={inputClass('message')}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                    <p className="text-slate-600 text-xs mt-1">{form.message.length} / 20 min characters</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
