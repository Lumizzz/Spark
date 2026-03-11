'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Image as ImageIcon, Check } from 'lucide-react';
import { getMedia, deleteMedia } from '@/lib/actions';
import { createClient } from '@/lib/supabase/client';
import { formatBytes } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { MediaItem } from '@/types';
import Image from 'next/image';

export default function MediaDashboardPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    const data = await getMedia();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const uploadFile = async (file: File) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split('.').pop();
    const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${ext}`;

    const { data, error } = await supabase.storage.from('media').upload(filename, file);
    if (error) { toast.error(error.message); return; }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);

    const { error: dbError } = await supabase.from('media').insert({
      filename,
      original_name: file.name,
      url: publicUrl,
      size: file.size,
      mime_type: file.type,
      uploaded_by: user.id,
    });

    if (dbError) toast.error(dbError.message);
    else toast.success('Uploaded!');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    setUploading(true);
    try {
      await Promise.all(files.map(uploadFile));
      loadMedia();
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const allFiles = Array.from(e.dataTransfer.files) as File[];
    const files = allFiles.filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    try {
      await Promise.all(files.map(uploadFile));
      loadMedia();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Delete this image?')) return;
    const { error } = await deleteMedia(item.id, item.filename);
    if (error) toast.error(error);
    else { toast.success('Deleted'); loadMedia(); }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Media Library
          </h1>
          <p className="text-slate-400 mt-1">{media.length} files uploaded</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center mb-6 transition-all ${
          dragOver
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-purple-400' : 'text-slate-600'}`} />
        <p className="text-slate-500 text-sm">
          {dragOver ? 'Drop to upload' : 'Drag & drop images here, or click Upload above'}
        </p>
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl loading-shimmer" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item: MediaItem) => (
            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden glass-card">
              <Image
                src={item.url}
                alt={item.alt_text || item.original_name}
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-white text-xs px-2 text-center truncate w-full">
                  {item.original_name}
                </p>
                {item.size && (
                  <p className="text-slate-400 text-xs">{formatBytes(item.size)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
