'use client';
import React from 'react';

import { useState } from 'react';
import { updateSiteSettings } from '@/lib/actions';
import type { SiteSettings, NavLink } from '@/types';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Settings, Globe, Palette, Share2 } from 'lucide-react';

interface SettingsClientProps {
  settings: SiteSettings;
}

type Tab = 'general' | 'navigation' | 'social' | 'advanced';

export default function SettingsClient({ settings }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({
    site_name: settings.site_name || '',
    site_tagline: settings.site_tagline || '',
    site_url: settings.site_url || '',
    logo_text: settings.logo_text || '',
    logo_url: settings.logo_url || '',
    favicon_url: settings.favicon_url || '',
    primary_color: settings.primary_color || '#7C3AED',
    analytics_id: settings.analytics_id || '',
    maintenance_mode: settings.maintenance_mode || false,
    registration_open: (settings as Record<string, unknown>)['registration_open'] as boolean || false,
  });

  const [navLinks, setNavLinks] = useState<NavLink[]>(settings.nav_links || []);
  const [footerLinks, setFooterLinks] = useState<NavLink[]>(settings.footer_links || []);

  const [social, setSocial] = useState({
    twitter: settings.social_links?.twitter || '',
    github: settings.social_links?.github || '',
    discord: settings.social_links?.discord || '',
    linkedin: settings.social_links?.linkedin || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateSiteSettings({
        site_name: general.site_name,
        site_tagline: general.site_tagline,
        site_url: general.site_url,
        logo_text: general.logo_text,
        logo_url: general.logo_url || null,
        favicon_url: general.favicon_url || null,
        primary_color: general.primary_color,
        analytics_id: general.analytics_id || null,
        maintenance_mode: general.maintenance_mode,
        nav_links: navLinks,
        footer_links: footerLinks,
        social_links: social,
      });
      if (error) throw new Error(error);
      toast.success('Settings saved!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addNavLink = () => setNavLinks((l: import('@/types').NavLink[]) => [...l, { label: 'New Link', href: '/' }]);
  const removeNavLink = (i: number) => setNavLinks((l: import('@/types').NavLink[]) => l.filter((_: NavLink, idx: number) => idx !== i));
  const updateNavLink = (i: number, key: 'label' | 'href', val: string) => {
    setNavLinks((l: import('@/types').NavLink[]) => l.map((item: NavLink, idx: number) => (idx === i ? { ...item, [key]: val } : item)));
  };

  const addFooterLink = () => setFooterLinks((l: import('@/types').NavLink[]) => [...l, { label: 'New Link', href: '/' }]);
  const removeFooterLink = (i: number) => setFooterLinks((l: import('@/types').NavLink[]) => l.filter((_: NavLink, idx: number) => idx !== i));
  const updateFooterLink = (i: number, key: 'label' | 'href', val: string) => {
    setFooterLinks((l: import('@/types').NavLink[]) => l.map((item: NavLink, idx: number) => (idx === i ? { ...item, [key]: val } : item)));
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 text-sm transition-colors';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'navigation', label: 'Navigation', icon: <Globe className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Share2 className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Site Settings
          </h1>
          <p className="text-slate-400 mt-1">Configure your website globally</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 glass-card rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="glass-card rounded-2xl p-6 space-y-5 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Site Name *</label>
              <input
                value={general.site_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, site_name: e.target.value }))}
                className={inputClass}
                placeholder="My SaaS"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Logo Text</label>
              <input
                value={general.logo_text}
                onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, logo_text: e.target.value }))}
                className={inputClass}
                placeholder="spark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Site Tagline</label>
            <input
              value={general.site_tagline}
              onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, site_tagline: e.target.value }))}
              className={inputClass}
              placeholder="Build better software, faster"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Site URL</label>
            <input
              value={general.site_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, site_url: e.target.value }))}
              className={inputClass}
              placeholder="https://yourdomain.com"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Logo Image URL (optional)</label>
            <input
              value={general.logo_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, logo_url: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Favicon URL (optional)</label>
            <input
              value={general.favicon_url}
              onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, favicon_url: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
            <div>
              <p className="text-white text-sm font-medium">Maintenance Mode</p>
              <p className="text-slate-500 text-xs mt-0.5">Show maintenance page to all visitors</p>
            </div>
            <button
              onClick={() => setGeneral((g: typeof general) => ({ ...g, maintenance_mode: !g.maintenance_mode }))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${general.maintenance_mode ? 'bg-red-500' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${general.maintenance_mode ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <div className="space-y-6 max-w-2xl">
          {/* Header Nav */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Header Navigation</h2>
              <button
                onClick={addNavLink}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            <div className="space-y-3">
              {navLinks.map((link: import("@/types").NavLink, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={link.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNavLink(i, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <input
                    value={link.href}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNavLink(i, 'href', e.target.value)}
                    placeholder="/path"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    onClick={() => removeNavLink(i)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Footer Links</h2>
              <button
                onClick={addFooterLink}
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Link
              </button>
            </div>
            <div className="space-y-3">
              {footerLinks.map((link: import("@/types").NavLink, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    value={link.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFooterLink(i, 'label', e.target.value)}
                    placeholder="Label"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <input
                    value={link.href}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFooterLink(i, 'href', e.target.value)}
                    placeholder="/path"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    onClick={() => removeFooterLink(i)}
                    className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === 'social' && (
        <div className="glass-card rounded-2xl p-6 space-y-4 max-w-2xl">
          {[
            { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/youraccount' },
            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourorg' },
            { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/yourserver' },
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourcompany' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">{field.label}</label>
              <input
                value={social[field.key as keyof typeof social]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocial((s: typeof social) => ({ ...s, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="glass-card rounded-2xl p-6 space-y-5 max-w-2xl">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Brand Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={general.primary_color}
                onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, primary_color: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                value={general.primary_color}
                onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, primary_color: e.target.value }))}
                className={`${inputClass} flex-1`}
                placeholder="#7C3AED"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Google Analytics ID</label>
            <input
              value={general.analytics_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setGeneral((g: typeof general) => ({ ...g, analytics_id: e.target.value }))}
              className={inputClass}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </div>
      )}
    </div>
  );
}
