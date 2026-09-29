import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, products(name, platform)')
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Orders" value={orders.length} icon="fa-shopping-bag" />
        <StatCard label="Completed" value={orders.filter(o => o.status === 'completed').length} icon="fa-check" />
        <StatCard label="Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon="fa-naira-sign" />
        <StatCard label="Products Sold" value={orders.filter(o => o.status === 'completed').length} icon="fa-box" />
      </div>

      {loading ? (
        <div class="text-center py-10 text-muted">Loading...</div>
      ) : orders.length === 0 ? (
        <div class="text-center py-10 text-muted">No orders yet.</div>
      ) : (
        <div class="space-y-2">
          {orders.map(o => (
            <div key={o.id} class="bg-card border border-border rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="font-bold text-text text-sm">{o.products?.name || 'Product'}</h3>
                  <p class="text-muted text-xs font-mono">#{o.paystack_ref}</p>
                </div>
                <span class={`text-xs font-bold px-3 py-1 rounded-full ${o.status === 'completed' ? 'bg-accent/20 text-accent' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {o.status}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs text-muted">
                <span class="text-accent font-bold text-base">₦{o.amount.toLocaleString()}</span>
                <span>{new Date(o.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div class="bg-card border border-border rounded-xl p-4">
      <div class="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
        <i class={`fa-solid ${icon} text-accent text-sm`}></i>
      </div>
      <div class="text-lg font-extrabold text-text">{value}</div>
      <div class="text-xs text-muted">{label}</div>
    </div>
  );
}