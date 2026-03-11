'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface DuplicateButtonProps {
  id: string;
  action: (id: string) => Promise<{ data: unknown; error: string | null }>;
}

export default function DuplicateButton({ id, action }: DuplicateButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDuplicate = async () => {
    setLoading(true);
    const { error } = await action(id);
    if (error) toast.error(error);
    else {
      toast.success('Page duplicated!');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDuplicate}
      disabled={loading}
      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50"
      title="Duplicate page"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
