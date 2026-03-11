'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import { Plus, Edit2, Trash2, Save, X, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Category } from '@/types';

const PRESET_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'];

export default function CategoriesClient({ categories: initial }: { categories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const { error } = await createCategory(newName.trim(), slugify(newName), newColor);
    if (error) { toast.error(error); }
    else {
      toast.success('Category created!');
      setNewName(''); setShowNew(false);
      router.refresh();
    }
    setSaving(false);
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    const { error } = await updateCategory(id, editName, editColor);
    if (error) { toast.error(error); }
    else { toast.success('Updated!'); setEditingId(null); router.refresh(); }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Posts using it won't be deleted.`)) return;
    const { error } = await deleteCategory(id);
    if (error) toast.error(error);
    else { toast.success('Category deleted'); router.refresh(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Categories</h1>
          <p className="text-slate-400 mt-1">Organize your blog posts</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/blog" className="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl transition-colors">
            ← Blog
          </Link>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Category
          </button>
        </div>
      </div>

      {showNew && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">New Category</h3>
          <div className="flex items-center gap-4">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm" />
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button key={c} onClick={() => setNewColor(c)}
                  className={`w-6 h-6 rounded-full transition-all ${newColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''}`}
                  style={{ background: c }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving || !newName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm disabled:opacity-50 flex items-center gap-1">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 glass-card rounded-xl text-sm text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Tag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No categories yet. Create your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {categories.map((cat) => (
              <div key={cat.id} className="px-6 py-4 flex items-center gap-4">
                {editingId === cat.id ? (
                  <>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50" />
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((c) => (
                        <button key={c} onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full ${editColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''}`}
                          style={{ background: c }} />
                      ))}
                    </div>
                    <button onClick={() => handleUpdate(cat.id)} disabled={saving}
                      className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-all">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-white/5">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="flex-1 text-white text-sm font-medium">{cat.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{cat.slug}</span>
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditColor(cat.color); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
