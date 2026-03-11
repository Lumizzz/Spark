'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<{ error: string | null }>;
  label?: string;
}

export default function DeleteButton({ id, action, label = 'item' }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const { error } = await action(id);
      if (error) {
        toast.error(error);
      } else {
        toast.success(`${label} deleted`);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-1.5 rounded-lg transition-all text-sm ${
        confirming
          ? 'bg-red-500/20 text-red-400 px-2'
          : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
      }`}
      title={confirming ? 'Click again to confirm' : `Delete ${label}`}
    >
      {confirming ? 'Confirm?' : loading ? '...' : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
