import type { BlockType, BlockProps } from '@/types';

export const DEFAULT_BLOCK_PROPS: Record<BlockType, BlockProps> = {
  hero: {
    eyebrow: 'YOUR TAGLINE HERE',
    title: 'Your Amazing Headline',
    subtitle: 'A supporting description that explains what you do and why visitors should care.',
    ctaPrimary: { text: 'Get Started', href: '/signup' },
    ctaSecondary: { text: 'Learn More', href: '#features' },
    backgroundGradient: true,
    showOrbs: true,
    size: 'large',
  },
  features_grid: {
    eyebrow: 'FEATURES',
    title: 'Everything you need',
    subtitle: 'A complete set of tools for modern teams.',
    columns: 3,
    features: [
      { icon: 'Zap', title: 'Feature One', description: 'Describe your first key feature here.' },
      { icon: 'Shield', title: 'Feature Two', description: 'Describe your second key feature here.' },
      { icon: 'Globe', title: 'Feature Three', description: 'Describe your third key feature here.' },
    ],
  },
  pricing_table: {
    eyebrow: 'PRICING',
    title: 'Simple, transparent pricing',
    subtitle: 'Choose the plan that fits your needs.',
    showToggle: true,
  },
  testimonials: {
    eyebrow: 'TESTIMONIALS',
    title: 'What our customers say',
    testimonials: [
      { quote: 'This product changed the way our team works.', author: 'Jane Smith', role: 'CEO', company: 'Acme Corp' },
      { quote: 'Absolutely incredible. Would recommend to anyone.', author: 'John Doe', role: 'CTO', company: 'Tech Co' },
      { quote: 'The best tool we have ever used for this workflow.', author: 'Sarah Lee', role: 'Designer', company: 'Studio X' },
    ],
  },
  cta_section: {
    title: 'Ready to get started?',
    subtitle: 'Join thousands of teams already using our platform.',
    ctaPrimary: { text: 'Get Started Free', href: '/signup' },
    ctaSecondary: { text: 'Talk to Sales', href: '/contact' },
    backgroundStyle: 'gradient',
  },
  faq_section: {
    eyebrow: 'FAQ',
    title: 'Frequently Asked Questions',
    faqs: [
      { question: 'How do I get started?', answer: 'Simply sign up for a free account and follow the onboarding steps.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and wire transfers.' },
      { question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel at any time from your account settings.' },
    ],
  },
  image_text: {
    title: 'A compelling section title',
    content: 'Write your compelling content here. Explain the value proposition, the benefits, and why users should care about this section.',
    imageUrl: '',
    imagePosition: 'right',
    ctaText: 'Learn more',
    ctaHref: '#',
  },
  blog_list: {
    postsPerPage: 9,
    showCategories: true,
    layout: 'grid',
  },
  rich_text: {
    content: '<h2>Your Title</h2><p>Start writing your content here. This rich text block supports <strong>bold</strong>, <em>italic</em>, links, lists, and more.</p>',
    alignment: 'left',
    maxWidth: 'prose',
  },
  gallery: {
    title: 'Gallery',
    images: [
      { url: '', alt: 'Image 1' },
      { url: '', alt: 'Image 2' },
      { url: '', alt: 'Image 3' },
    ],
    columns: 3,
  },
  logo_strip: {
    title: 'Trusted by teams at',
    logos: ['Company A', 'Company B', 'Company C', 'Company D', 'Company E'],
  },
};
