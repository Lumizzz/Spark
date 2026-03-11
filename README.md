# 🚀 Spark SaaS CMS

A complete WordPress + Elementor-style CMS built with Next.js 14, Supabase, and Tailwind CSS. Every piece of content is editable from the admin dashboard — no code changes required.

---

## ✅ Features

- 🧱 **Drag & Drop Page Builder** — Add, reorder, and edit 11 block types visually
- 📝 **Blog Manager** — Create/edit posts with HTML editor, categories, tags, featured images
- 💰 **Pricing Manager** — Full plan + feature management
- 🖼 **Media Library** — Upload/delete images via Supabase Storage
- 🔎 **SEO Manager** — Per-page meta title, description, OG image, slug
- 👥 **User Management** — Admin/Editor roles via Supabase RLS
- ⚙️ **Site Settings** — Logo, nav, footer, social links, color — all editable
- 🌍 **10 Public Pages** — All dynamically rendered from database
- 🔐 **Auth** — Supabase Auth with role-based dashboard protection
- 🚀 **Vercel-ready** — Zero config deployment

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Supabase (Auth + DB + Storage) |
| Database | PostgreSQL via Supabase |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (home, blog, pricing...)
│   │   ├── page.tsx       # Home page
│   │   ├── (pages)/[slug] # Dynamic CMS pages
│   │   ├── blog/          # Blog listing + post pages
│   │   └── layout.tsx     # Public layout (header + footer)
│   ├── dashboard/         # Protected admin dashboard
│   │   ├── page.tsx       # Overview
│   │   ├── pages/         # Page manager + builder
│   │   ├── blog/          # Blog manager
│   │   ├── pricing/       # Pricing manager
│   │   ├── media/         # Media library
│   │   ├── seo/           # SEO manager
│   │   ├── users/         # User management
│   │   └── settings/      # Site settings
│   ├── auth/login/        # Login page
│   └── layout.tsx         # Root layout
├── components/
│   ├── blocks/            # Page builder blocks (Hero, Features, etc.)
│   ├── builder/           # Page Builder UI (drag & drop)
│   ├── dashboard/         # Dashboard-specific components
│   └── public/            # Header, Footer
├── lib/
│   ├── actions.ts         # All server actions (data fetching + mutations)
│   ├── utils.ts           # Utility functions
│   └── supabase/          # Supabase clients (browser, server, middleware)
├── types/
│   └── index.ts           # All TypeScript types
└── middleware.ts           # Auth route protection
```

---

## 🚀 Setup Guide

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon key** from Settings → API
3. Also note the **service_role key** (keep this secret)

### Step 2 — Run Database Schema

1. In Supabase dashboard → SQL Editor
2. Open `supabase/schema.sql` from this project
3. Paste the entire file and click **Run**
4. This creates all tables, RLS policies, storage bucket, and seed data

### Step 3 — Create Admin User

1. Supabase dashboard → Authentication → Users → Invite User
2. Enter your email and send invite
3. After signing up, go to SQL Editor and run:

```sql
-- Make your user an admin
UPDATE public.profiles
SET role_id = (SELECT id FROM public.roles WHERE name = 'admin')
WHERE email = 'your@email.com';
```

### Step 4 — Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/saas-cms.git
cd saas-cms

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Fill in your Supabase credentials in .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site  
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — admin  
Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login) — login

### Step 5 — Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
npm i -g vercel
vercel

# Set environment variables:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub + Vercel Dashboard

1. Push this project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/saas-cms.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Select your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
5. Click **Deploy**

### Step 6 — Configure Supabase for Production

In Supabase dashboard → Authentication → URL Configuration:
- **Site URL**: `https://yourdomain.vercel.app`
- **Redirect URLs**: `https://yourdomain.vercel.app/**`

---

## 🧱 Page Builder Blocks

| Block | Description |
|-------|-------------|
| Hero Section | Full-width hero with title, subtitle, CTA buttons |
| Features Grid | 2/3/4 column feature cards with Lucide icons |
| Pricing Table | Auto-pulls from pricing database |
| Testimonials | Customer quote cards |
| CTA Section | Call-to-action with gradient background |
| FAQ Section | Accordion FAQ |
| Image + Text | Side-by-side layout |
| Blog List | Auto-pulls published blog posts |
| Rich Text | HTML content block |
| Gallery | Image grid |
| Logo Strip | Brand logos row |

---

## 📊 Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `roles` | Admin / Editor roles |
| `pages` | CMS pages with JSON layout |
| `blog_posts` | Blog posts with rich content |
| `categories` | Blog categories |
| `pricing_plans` | Pricing plan definitions |
| `pricing_features` | Features per plan |
| `media` | Media library metadata |
| `site_settings` | Global key-value settings |

---

## 🔐 Security

- All database tables have **Row Level Security (RLS)** enabled
- Public visitors can only read `published` pages and posts
- Editors can create/update content but not manage users
- Admins have full access
- Dashboard routes are protected by middleware (redirects to login)
- Service role key is **never exposed** to the browser

---

## 🔧 Customization

### Add a New Block Type

1. Add the type to `src/types/index.ts` → `BlockType` union
2. Create the component in `src/components/blocks/`
3. Add it to `src/components/blocks/BlockRenderer.tsx`
4. Add default props to `src/components/builder/blockDefaults.ts`
5. Add the editor form to `src/components/builder/BlockPropsEditor.tsx`
6. Add it to the block picker in `PageBuilderClient.tsx`

### Change the Design Theme

Edit `src/app/globals.css`:
- `:root` CSS variables control colors
- `tailwind.config.ts` for Tailwind color palette

---

## 🧪 Production Checklist

- [ ] Supabase schema deployed
- [ ] Admin user created and role set
- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Custom domain configured (optional)
- [ ] Site settings filled in from dashboard
- [ ] At least one page published

---

## 📈 Scaling Strategy

- **Database**: Supabase scales automatically. Add indexes for heavily queried columns.
- **Storage**: Supabase Storage handles large file uploads. Configure CDN for public bucket.
- **Caching**: Add `revalidate` to server components for ISR. Use `unstable_cache` for frequent reads.
- **Edge**: Vercel deploys to edge automatically. Enable Edge Runtime for middleware.
- **Rate Limiting**: Add rate limiting middleware for API routes.
- **Images**: Use `next/image` with Supabase storage domain (already configured).

---

## 📝 License

MIT — use this for any project, commercial or personal.
