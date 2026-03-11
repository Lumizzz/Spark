import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const productLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Examples', href: '/examples' },
    { label: 'Download', href: '/download' },
    { label: 'Changelog', href: '/blog' },
  ];
  const companyLinks = [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];
  const legalLinks = settings.footer_links?.length
    ? settings.footer_links
    : [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ];

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr] gap-12">
          {/* Brand col */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                {settings.logo_text || 'spark'}
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              {settings.site_tagline || 'Build better software, faster. The modern CMS for developer teams.'}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {settings.social_links?.twitter && (
                <a href={settings.social_links.twitter} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.github && (
                <a href={settings.social_links.github} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.linkedin && (
                <a href={settings.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.social_links?.discord && (
                <a href={settings.social_links.discord} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {settings.site_name || 'Spark'}. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Built with ❤️ using Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
