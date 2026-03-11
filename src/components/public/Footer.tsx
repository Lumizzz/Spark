import Link from 'next/link';
import { Sparkles, Twitter, Github } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {settings.logo_text || 'spark'}
            </span>
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-6">
            {settings.footer_links?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {settings.social_links?.twitter && (
              <a
                href={settings.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {settings.social_links?.github && (
              <a
                href={settings.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
