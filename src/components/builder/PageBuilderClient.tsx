'use client';
import React from 'react';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updatePageLayout, updatePageMeta } from '@/lib/actions';
import type { Page, PageSection, BlockType, PageLayout } from '@/types';
import toast from 'react-hot-toast';
import {
  Plus, Save, Eye, GripVertical, Trash2, Settings2, Globe,
  ChevronDown, ChevronUp, X, Check
} from 'lucide-react';
import { generateId } from '@/lib/utils';
import BlockPropsEditor from './BlockPropsEditor';
import { DEFAULT_BLOCK_PROPS } from './blockDefaults';

interface PageBuilderClientProps {
  page: Page;
}

// ─── Sortable Section Item ─────────────────────────────────────
function SortableSection({
  section,
  onEdit,
  onDelete,
}: {
  key?: string;
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const blockLabels: Record<BlockType, string> = {
    hero: '🚀 Hero Section',
    features_grid: '⚡ Features Grid',
    pricing_table: '💰 Pricing Table',
    testimonials: '⭐ Testimonials',
    cta_section: '📣 CTA Section',
    faq_section: '❓ FAQ Section',
    image_text: '🖼 Image + Text',
    blog_list: '📝 Blog List',
    rich_text: '✍️ Rich Text',
    gallery: '🖼 Gallery',
    logo_strip: '🏢 Logo Strip',
    stats_bar: '📊 Stats Bar',
    code_showcase: '💻 Code Showcase',
    feature_showcase: '✨ Feature Showcase',
    comparison_table: '⚖️ Comparison Table',
    newsletter: '📧 Newsletter',
    timeline: '🕐 Timeline',
    team_grid: '👥 Team Grid',
    video_embed: '🎬 Video Embed',
  };

  return (
    <div ref={setNodeRef} style={style} className="glass-card rounded-xl border border-white/8 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="drag-handle text-slate-600 hover:text-slate-400 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="flex-1 text-sm text-slate-300 font-medium">
          {blockLabels[section.type] || section.type}
        </span>
        <button
          onClick={() => onEdit(section)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all text-xs flex items-center gap-1"
        >
          <Settings2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Add Block Modal ───────────────────────────────────────────
const BLOCK_TYPES: { type: BlockType; label: string; description: string; emoji: string }[] = [
  { type: 'hero', label: 'Hero Section', description: 'Full-width hero with title, subtitle, and CTA buttons', emoji: '🚀' },
  { type: 'features_grid', label: 'Features Grid', description: 'Grid of feature cards with icons', emoji: '⚡' },
  { type: 'pricing_table', label: 'Pricing Table', description: 'Pricing plans from your database', emoji: '💰' },
  { type: 'testimonials', label: 'Testimonials', description: 'Customer testimonial cards', emoji: '⭐' },
  { type: 'cta_section', label: 'CTA Section', description: 'Call-to-action with buttons', emoji: '📣' },
  { type: 'faq_section', label: 'FAQ Section', description: 'Accordion FAQ section', emoji: '❓' },
  { type: 'image_text', label: 'Image + Text', description: 'Side-by-side image and text', emoji: '🖼' },
  { type: 'blog_list', label: 'Blog List', description: 'Grid of blog posts', emoji: '📝' },
  { type: 'rich_text', label: 'Rich Text', description: 'WYSIWYG text content block', emoji: '✍️' },
  { type: 'gallery', label: 'Gallery', description: 'Image gallery grid', emoji: '🖼' },
  { type: 'logo_strip', label: 'Logo Strip', description: 'Brand logo strip', emoji: '🏢' },
];

function AddBlockModal({ onAdd, onClose }: { onAdd: (type: BlockType) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Add Block
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BLOCK_TYPES.map((block) => (
              <button
                key={block.type}
                onClick={() => { onAdd(block.type); onClose(); }}
                className="flex items-start gap-3 p-4 rounded-xl glass-card hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left group"
              >
                <span className="text-2xl">{block.emoji}</span>
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">
                    {block.label}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">{block.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Builder ─────────────────────────────────────────
export default function PageBuilderClient({ page }: PageBuilderClientProps) {
  const [sections, setSections] = useState<PageSection[]>(
    (page.layout?.sections || []).sort((a, b) => a.order - b.order)
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(page.status);
  const [showMeta, setShowMeta] = useState(false);
  const [metaTitle, setMetaTitle] = useState(page.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(page.meta_description || '');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items: PageSection[]) => {
        const oldIndex = items.findIndex((i: PageSection) => i.id === active.id);
        const newIndex = items.findIndex((i: PageSection) => i.id === over.id);
        return arrayMove(items, oldIndex as number, newIndex as number).map((s: PageSection, idx: number) => ({ ...s, order: idx }));
      });
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newSection: PageSection = {
      id: `${type}-${generateId()}`,
      type,
      order: sections.length,
      props: DEFAULT_BLOCK_PROPS[type] || {},
    };
    setSections((prev: PageSection[]) => [...prev, newSection]);
    setEditingSection(newSection);
  };

  const handleDeleteSection = (id: string) => {
    setSections((prev: PageSection[]) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateProps = useCallback((id: string, props: PageSection['props']) => {
    setSections((prev: PageSection[]) => prev.map((s: PageSection) => s.id === id ? { ...s, props } : s));
    setEditingSection((prev: PageSection | null) => prev && prev.id === id ? { ...prev, props } : prev);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const layout: PageLayout = { sections };
      const { error } = await updatePageLayout(page.id, layout);
      if (error) throw new Error(error);

      await updatePageMeta(page.id, {
        status,
        meta_title: metaTitle,
        meta_description: metaDescription,
      });

      toast.success('Page saved!');
    } catch (err) {
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = page.slug === 'home' ? '/' : `/${page.slug}`;

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left panel: section list */}
      <div className="w-80 shrink-0 flex flex-col border-r border-white/5 overflow-y-auto">
        {/* Page Meta */}
        <div className="p-4 border-b border-white/5">
          <button
            onClick={() => setShowMeta(!showMeta)}
            className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors"
          >
            <span className="font-medium">Page Settings</span>
            {showMeta ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMeta && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Status</label>
                <select
                  value={status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Meta Title</label>
                <input
                  value={metaTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetaTitle(e.target.value)}
                  placeholder="SEO title..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMetaDescription(e.target.value)}
                  placeholder="SEO description..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sections list */}
        <div className="flex-1 p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Sections ({sections.length})</p>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 text-sm">No sections yet.</p>
              <p className="text-slate-700 text-xs mt-1">Click &ldquo;Add Block&rdquo; to start.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s: PageSection) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sections.map((section: PageSection) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onEdit={(s: PageSection) => setEditingSection(s)}
                      onDelete={handleDeleteSection}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Add block button */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-sm"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
      </div>

      {/* Right panel: props editor OR preview placeholder */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 shrink-0">
          <p className="text-sm text-slate-500">
            {editingSection ? `Editing: ${editingSection.type}` : 'Select a block to edit'}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
            >
              {saving ? (
                <><span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /></>
              ) : (
                <><Save className="w-3.5 h-3.5" /> Save</>
              )}
            </button>
          </div>
        </div>

        {/* Props editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {editingSection ? (
            <BlockPropsEditor
              section={editingSection}
              onChange={(props) => handleUpdateProps(editingSection.id, props)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-500/50" />
                </div>
                <p className="text-slate-500 text-sm">Select a block from the left panel to edit its content</p>
                <p className="text-slate-600 text-xs mt-1">or add a new block to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add block modal */}
      {showAddModal && (
        <AddBlockModal onAdd={handleAddBlock} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
