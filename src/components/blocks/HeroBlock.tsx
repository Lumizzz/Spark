'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { HeroProps } from '@/types';

interface HeroBlockProps {
  props: HeroProps;
}

export default function HeroBlock({ props }: HeroBlockProps) {
  const {
    eyebrow,
    title,
    subtitle,
    ctaPrimary,
    ctaSecondary,
    backgroundGradient = true,
    showOrbs = true,
    size = 'large',
  } = props;

  const paddingMap = {
    small: 'pt-36 pb-16',
    medium: 'pt-40 pb-24',
    large: 'pt-44 pb-32',
  };

  return (
    <section className={`relative overflow-hidden ${paddingMap[size]}`}>
      {/* Background */}
      {backgroundGradient && (
        <>
          <div
            className="bg-orb w-[800px] h-[600px] top-[-200px] right-[-100px] opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)' }}
          />
          <div
            className="bg-orb w-[600px] h-[500px] bottom-[-100px] left-[-200px] opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)' }}
          />
        </>
      )}

      {showOrbs && (
        <>
          <div
            className="bg-orb w-32 h-32 top-1/3 left-1/4 opacity-40 animate-float"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)', animationDelay: '0s' }}
          />
          <div
            className="bg-orb w-20 h-20 top-1/2 right-1/3 opacity-30 animate-float"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, transparent 70%)', animationDelay: '2s' }}
          />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-5"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="gradient-text text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {subtitle}
          </motion.p>
        )}

        {(ctaPrimary || ctaSecondary) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-200 glow-purple hover:scale-105"
              >
                {ctaPrimary.text}
              </Link>
            )}
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="px-8 py-3.5 glass-card rounded-xl font-semibold text-sm text-white hover:border-purple-500/50 transition-all duration-200 hover:scale-105"
              >
                {ctaSecondary.text}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
