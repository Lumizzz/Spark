'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CTASectionProps } from '@/types';

export default function CTASectionBlock({ props }: { props: CTASectionProps }) {
  const { title, subtitle, ctaPrimary, ctaSecondary, backgroundStyle = 'gradient' } = props;

  const bgMap = {
    gradient: 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/20',
    dark: 'bg-white/3 border-white/8',
    purple: 'bg-purple-600/20 border-purple-500/30',
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-3xl border p-12 text-center ${bgMap[backgroundStyle]}`}
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">{subtitle}</p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all hover:scale-105"
              >
                {ctaPrimary.text}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="px-8 py-3.5 glass-card rounded-xl font-semibold text-sm text-white border border-white/10 hover:border-purple-500/50 transition-all"
              >
                {ctaSecondary.text}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
