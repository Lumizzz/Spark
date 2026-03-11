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

  stats_bar: {
    eyebrow: 'BY THE NUMBERS',
    title: 'Trusted by teams worldwide',
    stats: [
      { value: '50000', label: 'Developers', suffix: '+', description: 'Using Spark daily' },
      { value: '99.9', label: 'Uptime', suffix: '%', description: 'SLA guaranteed' },
      { value: '200', label: 'Countries', suffix: '+', description: 'Global reach' },
      { value: '4.9', label: 'Rating', prefix: '★', description: 'Average score' },
    ],
    background: 'dark',
  },
  code_showcase: {
    eyebrow: 'DEVELOPER FIRST',
    title: 'Clean code, powerful APIs',
    subtitle: 'Write less boilerplate and ship faster. Our SDK handles the hard parts so you can focus on building.',
    imagePosition: 'right',
    tabs: [
      {
        label: 'index.js',
        language: 'javascript',
        code: `// Initialize Spark
const spark = new Spark({
  apiKey: process.env.SPARK_KEY,
  region: 'us-east-1',
});

// Deploy in one line
await spark.deploy({
  project: 'my-app',
  env: 'production',
  scale: 'auto',
});

console.log('Deployed! 🚀');`,
      },
      {
        label: 'schema.ts',
        language: 'typescript',
        code: `import { Schema } from '@spark/core';

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor',
  },
});`,
      },
    ],
  },
  feature_showcase: {
    eyebrow: 'CAPABILITIES',
    title: 'Everything your team needs',
    subtitle: 'A complete platform built for modern development workflows.',
    features: [
      { icon: 'Zap', title: 'Blazing Fast Builds', description: 'Deploy in seconds with our optimized build pipeline.', badge: 'New' },
      { icon: 'Shield', title: 'Enterprise Security', description: 'SOC2 compliant with end-to-end encryption.', badge: '' },
      { icon: 'GitBranch', title: 'Branch Deployments', description: 'Every PR gets its own preview environment automatically.', badge: '' },
      { icon: 'Globe', title: 'Global CDN', description: 'Serve your app from 200+ edge locations worldwide.', badge: '' },
      { icon: 'BarChart', title: 'Analytics Built-in', description: 'Real-time metrics without extra setup.', badge: 'Beta' },
      { icon: 'Code', title: 'API-First', description: 'Every feature accessible via our comprehensive REST API.', badge: '' },
    ],
  },
  comparison_table: {
    eyebrow: 'COMPARISON',
    title: 'Why teams choose Spark',
    subtitle: 'See how we stack up against the alternatives.',
    competitors: ['Vercel', 'Netlify', 'Heroku'],
    features: [
      { name: 'Free tier', values: [true, true, true, false] },
      { name: 'Auto-scaling', values: [true, true, false, true] },
      { name: 'Edge functions', values: [true, true, true, false] },
      { name: 'Team collaboration', values: [true, 'Paid', 'Paid', 'Paid'] },
      { name: 'AI code review', values: [true, false, false, false] },
      { name: '24/7 support', values: [true, 'Enterprise', 'Enterprise', false] },
      { name: 'Custom domains', values: [true, true, true, true] },
    ],
  },
  newsletter: {
    eyebrow: 'STAY UPDATED',
    title: 'Get the latest updates',
    subtitle: 'No spam. Just product updates, tips, and occasional deep dives.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    backgroundStyle: 'gradient',
  },

  timeline: {
    eyebrow: 'OUR JOURNEY',
    title: 'How we got here',
    subtitle: 'A brief history of what we have built.',
    items: [
      { year: '2021', title: 'Founded', description: 'Started with a small team and a big idea to change how developers deploy software.', badge: 'Origin' },
      { year: '2022', title: 'Series A', description: 'Raised $5M to grow the team and expand our infrastructure globally.', badge: '$5M' },
      { year: '2023', title: '100k Users', description: 'Hit our first major milestone: 100,000 active developers on the platform.', badge: '🎉' },
      { year: '2024', title: 'Series B', description: 'Raised $20M to accelerate AI features and international expansion.', badge: '$20M' },
    ],
  },
  team_grid: {
    eyebrow: 'THE TEAM',
    title: 'Built by people who care',
    subtitle: 'We are a distributed team passionate about developer experience.',
    members: [
      { name: 'Alex Rivera', role: 'CEO & Co-founder', bio: 'Previously at Stripe and GitHub. Passionate about developer tools.' },
      { name: 'Sam Chen', role: 'CTO & Co-founder', bio: 'Built distributed systems at Cloudflare. Loves Rust and fast code.' },
      { name: 'Jordan Kim', role: 'Head of Design', bio: 'Former design lead at Linear. Obsessed with pixels and performance.' },
      { name: 'Taylor Moss', role: 'Head of Growth', bio: 'Helped scale Vercel from 0 to 1M users. Growth and community.' },
    ],
  },
  video_embed: {
    eyebrow: 'SEE IT IN ACTION',
    title: 'Watch the demo',
    subtitle: 'See how Spark helps teams ship 10× faster in under 3 minutes.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '16:9',
  },
};
