'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface QuickToggleProps {
  id: string;
  currentStatus: string;
  action: (id: string) => Promise<{ error: string | null }>;
}

export default function QuickToggle({ id, currentStatus, action }: QuickToggleProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = status === 'published' ? 'draft' : 'published';
    const { error } = await action(id);
    if (error) {
      toast.error(error);
    } else {
      setStatus(newStatus);
      toast.success(newStatus === 'published' ? 'Published!' : 'Set to draft');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-2 py-1 rounded-md text-xs font-medium transition-all disabled:opacity-50 ${
        status === 'published'
          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
          : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
      }`}
      title={status === 'published' ? 'Click to unpublish' : 'Click to publish'}
    >
      {loading ? '...' : status}
    </button>
  );
}
