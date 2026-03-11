import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.5) 0%, transparent 60%)' }} />
      <div className="relative text-center">
        <div
          className="text-[180px] font-bold leading-none mb-2 select-none"
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(59,130,246,0.3) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>
        <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Page not found
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all">
            Go home
          </Link>
          <Link href="/blog" className="px-6 py-3 glass-card rounded-xl text-sm text-white font-medium hover:border-purple-500/50 transition-all">
            Browse blog
          </Link>
        </div>
      </div>
    </div>
  );
}
