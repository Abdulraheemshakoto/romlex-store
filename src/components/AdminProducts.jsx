import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'youtube', 'twitter', 'telegram', 'snapchat', 'whatsapp', 'linkedin'];

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  }

  function handleNew() {
    setEditing(null);
    setShowForm(true);
  }

  function handleEdit(product) {
    setEditing(product);
    setShowForm(true);
  }

  if (showForm) {
    return (
      <ProductForm
        product={editing}
        onSave={() => { setShowForm(false); load(); }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-text">
          <i class="fa-solid fa-box text-accent mr-2"></i> Products ({products.length})
        </h2>
        <button onClick={handleNew} class="px-4 py-2 bg-accent text-[#051a16] rounded-lg font-bold text-sm hover:bg-accent-dim transition">
          <i class="fa-solid fa-plus mr-1"></i> New Product
        </button>
      </div>

      {loading ? (
        <div class="text-center py-10 text-muted">Loading...</div>
      ) : products.length === 0 ? (
        <div class="text-center py-10 text-muted">
          <p>No products yet. Click "New Product" to start.</p>
        </div>
      ) : (
        <div class="space-y-2">
          {products.map(p => (
            <div key={p.id} class="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-text text-sm truncate">{p.name}</h3>
                <p class="text-muted text-xs">{p.platform} · ₦{p.price.toLocaleString()} · {p.stock} in stock · {p.sold} sold</p>
              </div>
              <button onClick={() => handleEdit(p)} class="w-9 h-9 rounded-lg text-blue-400 hover:bg-blue-500/10 transition">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button onClick={() => handleDelete(p.id, p.name)} class="w-9 h-9 rounded-lg text-red-400 hover:bg-red-500/10 transition">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    platform: product?.platform || 'tiktok',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    sold: product?.sold || 0,
    log_template: product?.log_template || '',
    thumbnail_url: product?.thumbnail_url || '',
    is_active: product?.is_active !== false
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseInt(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      sold: parseInt(form.sold) || 0,
      updated_at: new Date().toISOString()
    };

    let error;
    if (product?.id) {
      ({ error } = await supabase.from('products').update(payload).eq('id', product.id));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    setSaving(false);
    if (error) {
      alert('Save failed: ' + error.message);
    } else {
      onSave();
    }
  }

  const logCount = form.log_template.split('\n').filter(Boolean).length;

  return (
    <div>
      <button onClick={onCancel} class="text-muted hover:text-accent text-sm mb-4 inline-flex items-center gap-2">
        <i class="fa-solid fa-arrow-left"></i> Back to Products
      </button>

      <h2 class="text-xl font-bold text-text mb-6">
        {product ? 'Edit Product' : 'New Product'}
      </h2>

      <form onSubmit={handleSubmit} class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Product Name *</label>
            <input type="text" value={form.name} onInput={e => update('name', e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              placeholder="Foreign TikTok Accounts" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Platform *</label>
            <select value={form.platform} onChange={e => update('platform', e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none">
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">Description</label>
          <textarea value={form.description} onInput={e => update('description', e.target.value)}
            rows={3} class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="Fresh foreign TikTok accounts with full access..." />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Price (₦) *</label>
            <input type="number" value={form.price} onInput={e => update('price', e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              min="0" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Stock *</label>
            <input type="number" value={form.stock} onInput={e => update('stock', e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              min="0" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Sold</label>
            <input type="number" value={form.sold} onInput={e => update('sold', e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              min="0" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">Thumbnail URL (optional)</label>
          <input type="url" value={form.thumbnail_url} onInput={e => update('thumbnail_url', e.target.value)}
            class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
            placeholder="https://..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-muted mb-2">
            Account Logs <span class="text-accent">({logCount} logs ready)</span>
          </label>
          <textarea value={form.log_template} onInput={e => update('log_template', e.target.value)}
            rows={10} class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text font-mono text-sm focus:border-accent focus:outline-none"
            placeholder={`Paste one account per line. Each sale delivers one line.&#10;Example:&#10;user1@example.com:password123&#10;user2@example.com:password456&#10;user3@example.com:password789`} />
          <p class="text-xs text-muted mt-1">
            Each line = one account. When someone buys, the first line is delivered and removed from the list.
          </p>
        </div>

        <div class="flex gap-3">
          <button type="submit" disabled={saving}
            class="flex-1 py-3 bg-accent text-[#051a16] rounded-xl font-bold hover:bg-accent-dim transition disabled:opacity-50">
            {saving ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
          <button type="button" onClick={onCancel}
            class="px-6 py-3 bg-bg border border-border text-text rounded-xl font-bold hover:border-accent transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}