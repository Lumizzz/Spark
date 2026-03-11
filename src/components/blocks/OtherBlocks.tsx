'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type {
  TestimonialsProps,
  FAQSectionProps,
  ImageTextProps,
  RichTextProps,
  GalleryProps,
  LogoStripProps,
  BlogListProps,
  BlogPost,
} from '@/types';
import { formatDate } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// ========================
// TESTIMONIALS
// ========================
export function TestimonialsBlock({ props }: { props: TestimonialsProps }) {
  const { eyebrow, title, testimonials } = props;
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title) && (
          <div className="text-center mb-16">
            {eyebrow && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                {t.avatar && (
                  <Image src={t.avatar} alt={t.author} width={36} height={36} className="rounded-full" />
                )}
                <div>
                  <p className="text-white text-sm font-semibold">{t.author}</p>
                  <p className="text-slate-500 text-xs">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// FAQ
// ========================
export function FAQSectionBlock({ props }: { props: FAQSectionProps }) {
  const { eyebrow, title, faqs } = props;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {(eyebrow || title) && (
          <div className="text-center mb-16">
            {eyebrow && (
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple-400 mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-4xl font-bold gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h2>
            )}
          </div>
        )}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/3 transition-colors"
              >
                <span className="text-white font-medium text-sm">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// IMAGE + TEXT
// ========================
export function ImageTextBlock({ props }: { props: ImageTextProps }) {
  const { title, content, imageUrl, imagePosition = 'right', ctaText, ctaHref } = props;
  const isRight = imagePosition === 'right';

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row items-center gap-16 ${isRight ? '' : 'md:flex-row-reverse'}`}>
          <div className="flex-1">
            <h2 className="text-4xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">{content}</p>
            {ctaText && ctaHref && (
              <Link href={ctaHref} className="inline-flex items-center gap-2 text-purple-400 font-medium hover:text-purple-300 transition-colors">
                {ctaText} →
              </Link>
            )}
          </div>
          <div className="flex-1">
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image src={imageUrl} alt={title} fill className="object-cover" />
              </div>
            ) : (
              <div className="glass-card rounded-2xl aspect-video flex items-center justify-center">
                <span className="text-slate-600 text-sm">Add an image in the Page Builder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ========================
// RICH TEXT
// ========================
export function RichTextBlock({ props }: { props: RichTextProps }) {
  const { content, alignment = 'left', maxWidth = 'prose' } = props;
  const maxWidthMap = {
    prose: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-7xl',
  };
  const alignMap = { left: 'text-left', center: 'text-center mx-auto', right: 'text-right ml-auto' };

  return (
    <section className="py-16 px-6">
      <div className={`${maxWidthMap[maxWidth]} ${alignMap[alignment]} mx-auto`}>
        <div
          className="prose-dark"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}

// ========================
// GALLERY
// ========================
export function GalleryBlock({ props }: { props: GalleryProps }) {
  const { title, images, columns = 3 } = props;
  const colMap = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl font-bold gradient-text mb-10 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
        )}
        <div className={`grid ${colMap[columns]} gap-4`}>
          {images.map((img, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-square glass-card">
              {img.url && <Image src={img.url} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-300" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// LOGO STRIP
// ========================
export function LogoStripBlock({ props }: { props: LogoStripProps }) {
  const { title, logos } = props;
  return (
    <section className="py-16 px-6 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        {title && <p className="text-center text-xs text-slate-600 uppercase tracking-widest mb-8">{title}</p>}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, i) => (
            <span
              key={i}
              className="text-slate-600 font-semibold text-sm hover:text-slate-400 transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========================
// BLOG LIST
// ========================
export function BlogListBlock({ props, posts }: { props: BlogListProps; posts: BlogPost[] }) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`grid gap-8 ${props.layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden"
            >
              {post.featured_image && (
                <div className="relative h-48">
                  <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                {post.categories && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md mb-3 inline-block"
                    style={{ background: `${post.categories.color}20`, color: post.categories.color }}
                  >
                    {post.categories.name}
                  </span>
                )}
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {post.title}
                </h3>
                {post.excerpt && <p className="text-slate-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-xs">{formatDate(post.published_at)}</span>
                  <Link href={`/blog/${post.slug}`} className="text-purple-400 text-xs font-medium hover:text-purple-300">
                    Read more →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
