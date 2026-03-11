'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import type { PricingTableProps, PricingPlan } from '@/types';

interface PricingTableBlockProps {
  props: PricingTableProps;
  plans: PricingPlan[];
}

const planGradients = [
  'from-slate-800/50 to-slate-900/50',
  'from-purple-900/40 to-indigo-900/40',
  'from-slate-800/50 to-slate-900/50',
];

const planBorders = [
  'border-white/8',
  'border-purple-500/40',
  'border-white/8',
];

export default function PricingTableBlock({ props, plans }: PricingTableBlockProps) {
  const { eyebrow, title, subtitle, showToggle = true } = props;
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-12">
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
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">{subtitle}</p>
            )}

            {showToggle && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className={`text-sm ${!yearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                <button
                  onClick={() => setYearly(!yearly)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${yearly ? 'bg-purple-600' : 'bg-white/10'}`}
                  aria-label="Toggle yearly billing"
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${yearly ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </button>
                <span className={`text-sm ${yearly ? 'text-white' : 'text-slate-500'}`}>
                  Yearly <span className="text-xs text-green-400 ml-1">Save 20%</span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = yearly ? plan.price_yearly : plan.price_monthly;
            const isPopular = plan.is_popular;
            const gradient = planGradients[i % planGradients.length];
            const border = planBorders[i % planBorders.length];

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative rounded-2xl border bg-gradient-to-b ${gradient} ${border} p-8 flex flex-col ${isPopular ? 'scale-105 shadow-2xl shadow-purple-500/20' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                      ✦ Most Popular
                    </span>
                  </div>
                )}

                {/* Icon placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-6 text-2xl">
                  {i === 0 ? '💎' : i === 1 ? '🌐' : '🔷'}
                </div>

                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {plan.name}
                </h3>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-slate-400 text-sm align-top mt-2 mr-0.5">$</span>
                  <span
                    className="text-5xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {price}
                  </span>
                  <span className="text-slate-400 text-sm ml-1">/month</span>
                </div>
                <p className="text-slate-500 text-xs mb-6">
                  {price === 0 ? 'Forever' : yearly ? 'per user / billed annually' : 'per user / for the first 12 months'}
                </p>

                {/* CTA */}
                <Link
                  href={plan.cta_link}
                  className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 mb-8 block ${
                    isPopular
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                  }`}
                >
                  {plan.cta_text}
                </Link>

                {/* Features */}
                <div className="space-y-3 flex-1">
                  {plan.pricing_features?.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-2.5">
                      {feature.is_included ? (
                        <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${feature.is_included ? 'text-slate-300' : 'text-slate-600'}`}
                      >
                        {feature.feature_text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
