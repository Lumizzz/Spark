import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms of Service — ${settings.site_name}`,
    description: `Read the Terms of Service for ${settings.site_name}.`,
  };
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the services provided by this platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

We reserve the right to update these Terms at any time. We will notify users of material changes via email or a prominent notice within the platform. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.`,
  },
  {
    title: '2. Use of the Service',
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:

• Use the Service in any way that violates applicable laws or regulations
• Engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the Service
• Attempt to gain unauthorized access to any part of the Service or any connected systems
• Transmit any unsolicited or unauthorized advertising or promotional material (spam)
• Introduce viruses, trojans, worms, or other malicious code
• Scrape, data mine, or extract data from the Service without our written permission
• Use the Service to build a competing product or service`,
  },
  {
    title: '3. Accounts and Registration',
    content: `To access certain features, you must register for an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Maintain the security of your password and accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use of your account

We reserve the right to terminate or suspend accounts that violate these Terms.`,
  },
  {
    title: '4. Subscriptions and Billing',
    content: `**Subscriptions**: Some features require a paid subscription. Subscriptions are billed in advance on a monthly or annual basis.

**Cancellation**: You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial billing periods.

**Price Changes**: We may change our pricing at any time. We will provide at least 30 days notice before price changes take effect for existing subscribers.

**Taxes**: Prices do not include applicable taxes. You are responsible for paying all taxes associated with your subscription.

**Failed Payments**: If payment fails, we will attempt to recharge your payment method. If payment remains outstanding, we may suspend or terminate your account.`,
  },
  {
    title: '5. Intellectual Property',
    content: `**Our Content**: The Service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

**Your Content**: You retain ownership of any content you submit, post, or display on or through the Service ("User Content"). By providing User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your User Content in connection with operating the Service.

**Feedback**: Any feedback or suggestions you provide about the Service may be used by us without any obligation to you.`,
  },
  {
    title: '6. Privacy',
    content: `Your use of the Service is subject to our Privacy Policy, which is incorporated into these Terms by this reference. By using the Service, you consent to our collection and use of your data as described in the Privacy Policy.`,
  },
  {
    title: '7. Third-Party Services',
    content: `The Service may contain links to third-party websites or services. We have no control over these third parties and are not responsible for their content, privacy policies, or practices. We encourage you to review the terms and privacy policies of any third-party services you use.`,
  },
  {
    title: '8. Disclaimers',
    content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We are not responsible for any errors or omissions in the Service or for any consequences resulting from the use of information obtained through the Service.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.

OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNTS YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.`,
  },
  {
    title: '10. Termination',
    content: `We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.

Upon termination, your right to use the Service will cease immediately. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`,
  },
  {
    title: '11. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in San Francisco County, California.`,
  },
  {
    title: '12. Contact Information',
    content: `If you have any questions about these Terms, please contact us at legal@yourdomain.com or through our contact page.`,
  },
];

export default async function TermsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="relative pt-44 pb-12 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.5) 0%, transparent 60%)' }}
        />
        <p className="relative text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-4">LEGAL</p>
        <h1
          className="relative text-5xl font-bold gradient-text mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Terms of Service
        </h1>
        <p className="relative text-slate-500 text-sm">
          Last updated: January 1, 2025 · Effective: January 1, 2025
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <div className="glass-card rounded-2xl p-6 mb-8 border border-purple-500/20">
            <p className="text-slate-300 text-sm leading-relaxed">
              These Terms of Service govern your use of <strong className="text-white">{settings.site_name}</strong> and constitute a legally binding agreement between you and us. Please read these Terms carefully before using our services.
            </p>
          </div>

          {/* Quick nav */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">QUICK NAVIGATION</p>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((s) => (
                <a
                  key={s.title}
                  href={`#${s.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-xs text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                id={section.title.replace(/\s+/g, '-').toLowerCase()}
                className="glass-card rounded-2xl p-8"
              >
                <h2
                  className="text-xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {section.title}
                </h2>
                <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {section.content.split('**').map((part, i) => (
                    i % 2 === 1
                      ? <strong key={i} className="text-white">{part}</strong>
                      : <span key={i}>{part}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">·</span>
            <Link href="/contact" className="text-slate-400 hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
            <span className="text-slate-700">·</span>
            <a href="mailto:legal@yourdomain.com" className="text-slate-400 hover:text-purple-400 transition-colors">
              legal@yourdomain.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
