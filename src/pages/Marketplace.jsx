import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');

  useEffect(() => {
    async function load() {
      let query = supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (platform) query = query.eq('platform', platform);
      const { data, error } = await query;
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    load();
  }, [platform]);

  const filtered = products.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s);
  });

  return (
    <div>
      <section class="container mx-auto px-6 py-12 text-center">
        <h1 class="text-5xl font-extrabold mb-4">Premium <span class="text-accent">Accounts</span></h1>
        <p class="text-muted text-lg max-w-xl mx-auto">Buy verified, high-quality social media accounts. Instant delivery.</p>
      </section>

      <section class="container mx-auto px-6 pb-6">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="flex-1 min-w-[250px] relative">
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted"></i>
            <input 
              type="text" 
              placeholder="Search accounts..." 
              value={search}
              onInput={e => setSearch(e.target.value)}
              class="w-full bg-card border border-border rounded-xl py-3 pl-12 pr-4 text-text focus:border-accent focus:outline-none"
            />
          </div>
          <select 
            value={platform} 
            onChange={e => setPlatform(e.target.value)}
            class="bg-card border border-border rounded-xl py-3 px-4 text-text focus:border-accent focus:outline-none"
          >
            <option value="">All Platforms</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="snapchat">Snapchat</option>
          </select>
        </div>
      </section>

      <section class="container mx-auto px-6 pb-20">
        {loading ? (
          <div class="text-center py-20 text-muted">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div class="text-center py-20 text-muted">
            <i class="fa-solid fa-box-open text-5xl mb-4 opacity-50"></i>
            <p>No accounts found</p>
          </div>
        ) : (
          <div class="space-y-3">
  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
</div>
        )}
      </section>
    </div>
  );
}