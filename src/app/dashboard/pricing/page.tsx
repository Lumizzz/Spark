'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Check, X, Edit2, Save } from 'lucide-react';
import {
  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  addFeatureToPlan,
  deleteFeature,
} from '@/lib/actions';
import toast from 'react-hot-toast';
import type { PricingPlan } from '@/types';
import { slugify } from '@/lib/utils';

const emptyPlan = {
  name: '',
  slug: '',
  description: '',
  price_monthly: 0,
  price_yearly: 0,
  currency: 'USD',
  is_popular: false,
  is_active: true,
  cta_text: 'Get started',
  cta_link: '/contact',
  badge_text: '',
  sort_order: 0,
};

export default function PricingDashboardPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({ ...emptyPlan });
  const [addingFeatureTo, setAddingFeatureTo] = useState<string | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newFeatureIncluded, setNewFeatureIncluded] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    setLoading(true);
    const data = await getAllPricingPlans();
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await createPricingPlan({
        ...newPlanForm,
        slug: slugify(newPlanForm.name),
      });
      if (error) throw new Error(error);
      toast.success('Plan created!');
      setShowNewForm(false);
      setNewPlanForm({ ...emptyPlan });
      loadPlans();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    setSaving(true);
    try {
      const { error } = await updatePricingPlan(editingPlan.id, {
        name: editingPlan.name,
        slug: editingPlan.slug,
        description: editingPlan.description || '',
        price_monthly: editingPlan.price_monthly,
        price_yearly: editingPlan.price_yearly,
        currency: editingPlan.currency,
        is_popular: editingPlan.is_popular,
        is_active: editingPlan.is_active,
        cta_text: editingPlan.cta_text,
        cta_link: editingPlan.cta_link,
        badge_text: editingPlan.badge_text || '',
        sort_order: editingPlan.sort_order,
      });
      if (error) throw new Error(error);
      toast.success('Plan updated!');
      setEditingPlan(null);
      loadPlans();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Delete this plan and all its features?')) return;
    const { error } = await deletePricingPlan(id);
    if (error) toast.error(error);
    else { toast.success('Plan deleted'); loadPlans(); }
  };

  const handleAddFeature = async (planId: string) => {
    if (!newFeatureText.trim()) return;
    const { error } = await addFeatureToPlan(planId, newFeatureText, newFeatureIncluded);
    if (error) toast.error(error);
    else {
      toast.success('Feature added');
      setNewFeatureText('');
      setAddingFeatureTo(null);
      loadPlans();
    }
  };

  const handleDeleteFeature = async (id: string) => {
    const { error } = await deleteFeature(id);
    if (error) toast.error(error);
    else { toast.success('Feature removed'); loadPlans(); }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Pricing
          </h1>
          <p className="text-slate-400 mt-1">Manage your pricing plans and features</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {/* New plan form */}
      {showNewForm && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-purple-500/20">
          <h2 className="text-lg font-bold text-white mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Create New Plan
          </h2>
          <form onSubmit={handleCreatePlan} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Plan Name *</label>
              <input
                value={newPlanForm.name}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                required
                placeholder="Pro"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Description</label>
              <input
                value={newPlanForm.description}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Plan description..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Monthly Price ($)</label>
              <input
                type="number"
                value={newPlanForm.price_monthly}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, price_monthly: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Yearly Price ($)</label>
              <input
                type="number"
                value={newPlanForm.price_yearly}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, price_yearly: parseFloat(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">CTA Button Text</label>
              <input
                value={newPlanForm.cta_text}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, cta_text: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">CTA Button URL</label>
              <input
                value={newPlanForm.cta_link}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, cta_link: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Sort Order</label>
              <input
                type="number"
                value={newPlanForm.sort_order}
                onChange={(e) => setNewPlanForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPlanForm.is_popular}
                  onChange={(e) => setNewPlanForm((f) => ({ ...f, is_popular: e.target.checked }))}
                  className="accent-purple-500"
                />
                <span className="text-sm text-slate-300">Mark as Popular</span>
              </label>
            </div>
            <div className="col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Plan'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-5 py-2.5 glass-card rounded-xl text-slate-300 text-sm hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card rounded-2xl overflow-hidden">
            {/* Plan header */}
            <div className="p-5 border-b border-white/5">
              {editingPlan?.id === plan.id ? (
                <div className="space-y-3">
                  <input
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className={inputClass}
                    placeholder="Plan name"
                  />
                  <input
                    value={editingPlan.description || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className={inputClass}
                    placeholder="Description"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Monthly $</label>
                      <input
                        type="number"
                        value={editingPlan.price_monthly}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price_monthly: parseFloat(e.target.value) || 0 })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Yearly $</label>
                      <input
                        type="number"
                        value={editingPlan.price_yearly}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price_yearly: parseFloat(e.target.value) || 0 })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <input
                    value={editingPlan.cta_text}
                    onChange={(e) => setEditingPlan({ ...editingPlan, cta_text: e.target.value })}
                    className={inputClass}
                    placeholder="CTA text"
                  />
                  <input
                    value={editingPlan.cta_link}
                    onChange={(e) => setEditingPlan({ ...editingPlan, cta_link: e.target.value })}
                    className={inputClass}
                    placeholder="CTA URL"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.is_popular}
                      onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-slate-300">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.is_active}
                      onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-slate-300">Active</span>
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleUpdatePlan}
                      disabled={saving}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingPlan(null)}
                      className="flex-1 py-2 glass-card rounded-lg text-slate-400 text-xs hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                          {plan.name}
                        </h3>
                        {plan.is_popular && (
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        )}
                        {!plan.is_active && (
                          <span className="text-xs text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">Inactive</span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{plan.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      ${plan.price_monthly}
                    </span>
                    <span className="text-slate-500 text-xs">/mo · ${plan.price_yearly}/yr</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Features</p>
                <button
                  onClick={() => setAddingFeatureTo(addingFeatureTo === plan.id ? null : plan.id)}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {addingFeatureTo === plan.id && (
                <div className="mb-3 space-y-2">
                  <input
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Feature text..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-purple-500/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFeature(plan.id)}
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFeatureIncluded}
                        onChange={(e) => setNewFeatureIncluded(e.target.checked)}
                        className="accent-purple-500"
                      />
                      <span className="text-xs text-slate-400">Included</span>
                    </label>
                    <button
                      onClick={() => handleAddFeature(plan.id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingFeatureTo(null); setNewFeatureText(''); }}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {plan.pricing_features?.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-2 group">
                    {feature.is_included ? (
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={`text-xs flex-1 ${feature.is_included ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature.feature_text}
                    </span>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-600 hover:text-red-400 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {(!plan.pricing_features || plan.pricing_features.length === 0) && (
                  <p className="text-slate-600 text-xs">No features yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && !showNewForm && (
          <div className="col-span-3 text-center py-16 glass-card rounded-2xl">
            <p className="text-slate-500">No pricing plans yet.</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm transition-colors"
            >
              Create your first plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
