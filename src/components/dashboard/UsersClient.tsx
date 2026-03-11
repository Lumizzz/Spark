'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/actions';
import type { Profile } from '@/types';
import toast from 'react-hot-toast';
import { Users, Shield, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UsersClientProps {
  users: Profile[];
}

export default function UsersClient({ users }: UsersClientProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (userId: string, role: 'admin' | 'editor') => {
    setSaving(true);
    try {
      const { error } = await updateUserRole(userId, role);
      if (error) throw new Error(error);
      toast.success('Role updated!');
      setEditingId(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-500/10 text-purple-400',
    editor: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Users
        </h1>
        <p className="text-slate-400 mt-1">Manage team members and their roles</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-3 border-b border-white/5 text-xs text-slate-500 font-medium uppercase tracking-wider">
          <span>User</span>
          <span>Role</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user) => {
              const roleName = (user.roles as { name: string } | undefined)?.name || 'editor';
              return (
                <div key={user.id} className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-6 py-4 items-center hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {(user.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{user.full_name || 'No name'}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </div>

                  <div>
                    {editingId === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={roleName}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'editor')}
                          disabled={saving}
                          className="px-2 py-1 rounded-lg bg-[#0a0a1a] border border-white/10 text-white text-xs focus:outline-none"
                        >
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-slate-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 w-fit ${roleColors[roleName] || roleColors.editor}`}>
                        {roleName === 'admin' && <Shield className="w-3 h-3" />}
                        {roleName}
                      </span>
                    )}
                  </div>

                  <span className="text-slate-500 text-xs">{formatDate(user.created_at)}</span>

                  <button
                    onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" /> Role Permissions
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-purple-400 font-medium text-xs mb-1">Admin</p>
            <p className="text-slate-500 text-xs">Full access to all features including user management and site settings.</p>
          </div>
          <div>
            <p className="text-blue-400 font-medium text-xs mb-1">Editor</p>
            <p className="text-slate-500 text-xs">Can manage pages, blog posts, and media. Cannot change settings or user roles.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
