import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div
          className="text-[160px] font-bold leading-none mb-4 opacity-10"
          style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #7C3AED, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </div>
        <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Page not found
        </h1>
        <p className="text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
