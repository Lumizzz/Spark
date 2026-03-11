'use client';
import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRole, inviteUser, removeUser, updateUserProfile } from '@/lib/actions';
import type { Profile } from '@/types';
import toast from 'react-hot-toast';
import { Users, Shield, UserPlus, Trash2, Check, X, Mail, User, ChevronDown, Search, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const ROLE_CONFIG: Record<string, { label: string; chipClass: string; dotClass: string }> = {
  admin: { label: 'Admin', chipClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20', dotClass: 'status-dot-green' },
  editor: { label: 'Editor', chipClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dotClass: 'status-dot-amber' },
};

const AVATAR_GRADIENTS = [
  'from-violet-500 to-blue-500',
  'from-blue-500 to-cyan-400',
  'from-emerald-400 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-400 to-orange-500',
];

function hashColor(email: string) {
  return AVATAR_GRADIENTS[(email || 'a').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_GRADIENTS.length];
}

function getRoleName(user: Profile): string {
  return ((user.roles as unknown) as { name?: string } | null)?.name ?? 'editor';
}


const PERMISSIONS = [
  ['Create & edit pages', true, true],
  ['Publish / unpublish pages', true, true],
  ['Delete pages', true, false],
  ['Write & edit blog posts', true, true],
  ['Publish blog posts', true, true],
  ['Delete blog posts', true, false],
  ['Manage categories', true, true],
  ['Upload media', true, true],
  ['Delete media', true, false],
  ['Manage pricing plans', true, false],
  ['Site settings', true, false],
  ['Invite team members', true, false],
  ['Change user roles', true, false],
  ['Remove team members', true, false],
];

export default function UsersClient({ users: initial, currentUserId }: { users: Profile[]; currentUserId: string }) {
  const router = useRouter();
  const [users] = useState(initial);
  const [search, setSearch] = useState('');
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor'>('editor');
  const [inviting, setInviting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const currentUser = users.find((u: Profile) => u.id === currentUserId);
  const isAdmin = getRoleName(currentUser!) === 'admin';

  const filtered = users.filter((u: Profile) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const admins = users.filter((u: Profile) => getRoleName(u) === 'admin').length;
  const editors = users.filter((u: Profile) => getRoleName(u) !== 'admin').length;

  const handleRoleChange = async (userId: string, role: 'admin' | 'editor') => {
    setSaving(true);
    const { error } = await updateUserRole(userId, role);
    if (error) toast.error(error);
    else { toast.success('Role updated!'); router.refresh(); }
    setSaving(false);
  };

  const handleNameSave = async (userId: string) => {
    setSaving(true);
    const { error } = await updateUserProfile(userId, { full_name: editName });
    if (error) toast.error(error);
    else { toast.success('Name saved!'); setEditingNameId(null); router.refresh(); }
    setSaving(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    const { error } = await inviteUser(inviteEmail, inviteRole);
    if (error) toast.error(error);
    else {
      toast.success(`Invite sent to ${inviteEmail}!`);
      setInviteEmail(''); setShowInvite(false);
      router.refresh();
    }
    setInviting(false);
  };

  const handleRemove = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from the team? This cannot be undone.`)) return;
    const { error } = await removeUser(userId);
    if (error) toast.error(error);
    else { toast.success('Member removed'); router.refresh(); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white animated-gradient-text" style={{ fontFamily: 'var(--font-display)' }}>Team</h1>
          <p className="text-slate-500 text-sm mt-1">Manage members, roles, and permissions</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowInvite(!showInvite)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/30">
            <UserPlus className="w-4 h-4" /> Invite Member
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Members', value: users.length, icon: Users, color: 'text-violet-400 bg-violet-500/10' },
          { label: 'Admins', value: admins, icon: Shield, color: 'text-purple-400 bg-purple-500/10' },
          { label: 'Editors', value: editors, icon: User, color: 'text-blue-400 bg-blue-500/10' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="admin-stat-card glass-card rounded-2xl p-4 border border-white/5">
              <div className={`w-8 h-8 rounded-xl ${s.color.split(' ')[1]} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color.split(' ')[0]}`} />
              </div>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Invite panel */}
      {showInvite && (
        <div className="gradient-border-card p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-violet-400" /> Send an invite
          </h3>
          <form onSubmit={handleInvite} className="flex gap-3 flex-wrap">
            <input type="email" value={inviteEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteEmail(e.target.value)} required
              placeholder="teammate@company.com"
              className="flex-1 min-w-48 px-4 py-2.5 rounded-xl admin-search-input text-sm" />
            <div className="relative">
              <select value={inviteRole} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInviteRole(e.target.value as 'admin' | 'editor')}
                className="appearance-none px-4 py-2.5 pr-8 rounded-xl admin-search-input text-sm cursor-pointer">
                <option value="editor" style={{ background: '#06060f' }}>Editor role</option>
                <option value="admin" style={{ background: '#06060f' }}>Admin role</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <button type="submit" disabled={inviting}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors">
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
            <button type="button" onClick={() => setShowInvite(false)}
              className="px-4 py-2.5 text-slate-500 hover:text-white text-sm transition-colors">
              Cancel
            </button>
          </form>
          <p className="text-xs text-slate-700 mt-3">They'll receive a magic link to set their password and join the workspace.</p>
        </div>
      )}

      {/* Search + table */}
      <div className="gradient-border-card overflow-hidden">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
          <Search className="w-4 h-4 text-slate-600 shrink-0" />
          <input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-700 focus:outline-none" />
          <span className="text-xs text-slate-700">{filtered.length} of {users.length}</span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr,140px,120px,80px] gap-4 px-5 py-2.5 border-b border-white/5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          <span>Member</span><span>Role</span><span>Joined</span><span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-800 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">No members found.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((user: Profile) => {
              const roleName = getRoleName(user);
              const rc = ROLE_CONFIG[roleName] || ROLE_CONFIG.editor;
              const isMe = user.id === currentUserId;
              const gradient = hashColor(user.email || '');
              const initials = ((user.full_name || user.email || 'U').slice(0, 2)).toUpperCase();

              return (
                <div key={user.id} className="admin-row grid grid-cols-[1fr,140px,120px,80px] gap-4 px-5 py-3.5 items-center transition-colors">
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      {editingNameId === user.id ? (
                        <div className="flex items-center gap-1.5">
                          <input value={editName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                            className="px-2.5 py-1 rounded-lg admin-search-input text-xs text-white w-36"
                            placeholder="Full name" autoFocus />
                          <button onClick={() => handleNameSave(user.id)} disabled={saving}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingNameId(null)}
                            className="p-1 text-slate-500 hover:bg-white/5 rounded-lg transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-medium truncate">{user.full_name || 'No name'}</p>
                          {isMe && <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/6 text-slate-500 border border-white/8">you</span>}
                        </div>
                      )}
                      <p className="text-slate-600 text-xs truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    {isAdmin && !isMe ? (
                      <div className="relative w-fit">
                        <select defaultValue={roleName}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRoleChange(user.id, e.target.value as 'admin' | 'editor')}
                          disabled={saving}
                          className={`appearance-none pl-6 pr-6 py-1 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none border ${rc.chipClass}`}
                          style={{ background: 'transparent' }}>
                          <option value="editor" style={{ background: '#06060f' }}>Editor</option>
                          <option value="admin" style={{ background: '#06060f' }}>Admin</option>
                        </select>
                        <div className={`status-dot ${rc.dotClass} absolute left-2 top-1/2 -translate-y-1/2`} />
                        <ChevronDown className="w-2.5 h-2.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-50" />
                      </div>
                    ) : (
                      <span className={`admin-chip border ${rc.chipClass}`}>
                        <div className={`status-dot ${rc.dotClass}`} />
                        {rc.label}
                      </span>
                    )}
                  </div>

                  {/* Joined */}
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{formatDate(user.created_at)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => { setEditingNameId(editingNameId === user.id ? null : user.id); setEditName(user.full_name || ''); }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all" title="Edit name">
                      <User className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && !isMe && (
                      <button onClick={() => handleRemove(user.id, user.email || '')}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Permission Matrix toggle */}
      <div className="gradient-border-card">
        <button type="button" onClick={() => setShowMatrix(prev => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" /> Permission Matrix
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showMatrix ? 'rotate-180' : ''}`} />
        </button>
        <div className={`transition-all duration-200 ${showMatrix ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto border-t border-white/5">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-slate-600 font-medium">Permission</th>
                  <th className="px-5 py-3 text-violet-400 font-semibold text-center">Admin</th>
                  <th className="px-5 py-3 text-blue-400 font-semibold text-center">Editor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PERMISSIONS.map(([perm, admin, editor]) => (
                  <tr key={String(perm)} className="admin-row transition-colors">
                    <td className="px-5 py-2.5 text-slate-500">{String(perm)}</td>
                    <td className="px-5 py-2.5 text-center">
                      {admin ? <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-700 mx-auto" />}
                    </td>
                    <td className="px-5 py-2.5 text-center">
                      {editor ? <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <X className="w-3.5 h-3.5 text-slate-700 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
