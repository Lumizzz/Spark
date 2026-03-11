'use client';
import React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { X, Search, Upload, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getMedia } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { formatBytes } from '@/lib/utils';
import Image from 'next/image';
import toast from 'react-hot-toast';
import type { MediaItem } from '@/types';

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export default function MediaPickerModal({
  open,
  onClose,
  onSelect,
  title = 'Select Image',
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadMedia = useCallback(async () => {
    setLoading(true);
    const data = await getMedia();
    setMedia(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      loadMedia();
      setSelected(null);
      setSearch('');
    }
  }, [open, loadMedia]);

  const uploadFile = async (file: File) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split('.').pop();
    const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;

    const { data, error } = await supabase.storage.from('media').upload(filename, file);
    if (error) { toast.error(error.message); return; }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);

    await supabase.from('media').insert({
      filename,
      original_name: file.name,
      url: publicUrl,
      size: file.size,
      mime_type: file.type,
      uploaded_by: user.id,
    });

    return publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      await loadMedia();
      // Auto-select first uploaded image
      const firstUrl = urls.find(Boolean);
      if (firstUrl) setSelected(firstUrl);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const filteredMedia = media.filter((item: import("@/types").MediaItem) =>
    search === '' ||
    item.original_name.toLowerCase().includes(search.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-white/5 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors shrink-0">
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Upload</>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl animate-pulse bg-white/5" />
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-500 mb-1">
                {search ? 'No images match your search' : 'No images uploaded yet'}
              </p>
              {!search && (
                <p className="text-slate-600 text-sm">Upload images using the button above</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredMedia.map((item: import("@/types").MediaItem) => {
                const isSelected = selected === item.url;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(isSelected ? null : item.url)}
                    className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#06060f]'
                        : 'hover:ring-1 hover:ring-white/20'
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    {/* Hover overlay */}
                    <div className={`absolute inset-0 transition-all flex flex-col items-end justify-start p-2 ${
                      isSelected ? 'bg-purple-600/20' : 'bg-black/0 group-hover:bg-black/40'
                    }`}>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Name tooltip */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">{item.original_name}</p>
                      {item.size && (
                        <p className="text-slate-400 text-xs">{formatBytes(item.size)}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/8 shrink-0">
          <p className="text-slate-500 text-sm">
            {selected ? '1 image selected' : `${filteredMedia.length} image${filteredMedia.length !== 1 ? 's' : ''}`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl glass-card border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
