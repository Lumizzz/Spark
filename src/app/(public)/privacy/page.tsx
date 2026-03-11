import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/actions';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy — ${settings.site_name}`,
    description: `Learn how ${settings.site_name} collects, uses, and protects your data.`,
  };
}

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:

• **Account information**: name, email address, password, profile picture
• **Payment information**: credit card details processed securely by our payment provider (we never store raw card numbers)
• **Usage data**: features you use, pages you visit, actions you take within the platform
• **Device and log information**: IP address, browser type, operating system, referring URLs, access times
• **Communications**: emails or messages you send to our support team

We also collect information automatically when you use our services, including cookies, web beacons, and similar tracking technologies.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send you related information, including purchase confirmations and invoices
• Send technical notices, updates, security alerts, and support and administrative messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities in connection with our services
• Detect, investigate, and prevent fraudulent transactions and other illegal activities
• Personalize and improve the services and provide content or features that match user profiles or interests`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

• **With service providers**: We engage third-party companies to perform services on our behalf (e.g., payment processing, email delivery, analytics). These parties have access only to the data needed to perform these functions.
• **For legal reasons**: We may disclose information if we believe disclosure is in accordance with, or required by, applicable law or legal process.
• **Business transfers**: If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
• **With your consent**: We may share information in other circumstances with your explicit consent.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your personal information for as long as necessary to fulfill the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law. When you close your account, we will delete or anonymize your information within 90 days, except where retention is required by law or for legitimate business purposes such as resolving disputes and enforcing our agreements.`,
  },
  {
    title: '5. Security',
    content: `We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. These measures include:

• Encryption of data in transit (TLS 1.3) and at rest (AES-256)
• Regular security audits and penetration testing
• SOC 2 Type II certification
• Role-based access controls and principle of least privilege
• 24/7 security monitoring

However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our services and to hold certain information. Cookies are files with a small amount of data that are sent to your browser.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our services may not function properly.

We use:
• **Essential cookies**: Required for the platform to function
• **Analytics cookies**: Help us understand how visitors interact with our services (Google Analytics)
• **Preference cookies**: Remember your settings and preferences`,
  },
  {
    title: '7. Your Rights',
    content: `Depending on your location, you may have certain rights regarding your personal information:

• **Access**: You can request a copy of the personal data we hold about you
• **Correction**: You can ask us to correct inaccurate or incomplete data
• **Deletion**: You can request deletion of your personal data, subject to certain exceptions
• **Portability**: You can request your data in a structured, machine-readable format
• **Objection**: You can object to certain processing of your personal data
• **Withdrawal of consent**: You can withdraw consent at any time where processing is based on consent

To exercise any of these rights, please contact us at privacy@yourdomain.com. We will respond within 30 days.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information promptly. If you believe we might have any information from or about a child under 13, please contact us.`,
  },
  {
    title: '9. International Transfers',
    content: `Your information may be transferred to and processed in countries other than your own. These countries may have data protection laws that are different from the laws of your country. By using our services, you consent to the transfer of information to countries outside of your country of residence.

For users in the European Economic Area (EEA), we ensure appropriate safeguards are in place for cross-border data transfers, including Standard Contractual Clauses approved by the European Commission.`,
  },
  {
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes, we will provide a more prominent notice (including, for certain services, email notification of Privacy Policy changes).`,
  },
];

export default async function PrivacyPage() {
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
          Privacy Policy
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
              At <strong className="text-white">{settings.site_name}</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully. If you disagree with its terms, please discontinue use of our services.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title} className="glass-card rounded-2xl p-8">
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

          {/* Contact */}
          <div className="glass-card rounded-2xl p-8 mt-8 border border-purple-500/20">
            <h2
              className="text-xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact Us
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-slate-300"><strong className="text-white">{settings.site_name}</strong></p>
              <p className="text-slate-400">privacy@yourdomain.com</p>
              <p className="text-slate-400">123 Startup Street, San Francisco, CA 94105</p>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Contact Privacy Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
