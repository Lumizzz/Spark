'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { FeaturesGridProps } from '@/types';

interface FeaturesGridBlockProps {
  props: FeaturesGridProps;
}

// Safe icon lookup
function getIcon(name: string) {
  const icons = LucideIcons as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[name] || LucideIcons.Star;
}

export default function FeaturesGridBlock({ props }: FeaturesGridBlockProps) {
  const { eyebrow, title, subtitle, columns = 3, features } = props;

  const colMap = { 2: 'grid-cols-1 md:grid-cols-2', 3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' };

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16">
            {eyebrow && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="text-4xl md:text-5xl font-bold gradient-text mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        <div className={`grid ${colMap[columns]} gap-6`}>
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon || 'Star');
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3
                  className="text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
