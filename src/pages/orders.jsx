import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { user } from '../lib/auth';
import jsPDF from 'jspdf';

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user.value) { setLoading(false); return; }
      const { data } = await supabase
        .from('orders')
        .select('*, products(name, platform)')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    load();
  }, [user.value]);

  function downloadPDF(order) {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 120);
    doc.text('Romlex Digital', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Account Details Receipt', 20, 35);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);
    
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`Product: ${order.products?.name || 'Account'}`, 20, 50);
    doc.text(`Reference: ${order.paystack_ref}`, 20, 58);
    doc.text(`Amount: NGN ${order.amount.toLocaleString()}`, 20, 66);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, 74);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 82);
    
    doc.line(20, 90, 190, 90);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 150, 120);
    doc.text('Your Account Details:', 20, 100);
    
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    const logs = order.delivered_logs || 'Contact support';
    const lines = doc.splitTextToSize(logs, 170);
    doc.text(lines, 20, 110);
    
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Thank you for your purchase! Contact support if you need help.', 20, 280);
    
    doc.save(`Romlex-${order.paystack_ref}.pdf`);
  }

  if (!user.value) return (
    <div class="container mx-auto px-6 py-20 text-center">
      <h1 class="text-3xl font-extrabold text-text mb-4">My Orders</h1>
      <p class="text-muted">Please log in to see your orders.</p>
    </div>
  );

  return (
    <div class="container mx-auto px-6 py-12 max-w-3xl">
      <h1 class="text-3xl font-extrabold text-text mb-2">My Orders</h1>
      <p class="text-muted mb-8">Track and view your purchased account details</p>

      {loading ? (
        <div class="text-center text-muted">Loading...</div>
      ) : orders.length === 0 ? (
        <div class="text-center text-muted py-20">
          <i class="fa-solid fa-box-open text-5xl opacity-30 mb-4"></i>
          <p>You haven't made any purchases yet.</p>
        </div>
      ) : (
        <div class="space-y-4">
          {orders.map(order => (
            <div key={order.id} class="bg-card border border-border rounded-2xl overflow-hidden">
              <div class="p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <i class="fa-solid fa-box text-accent"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-text text-sm">{order.products?.name || 'Product'}</h3>
                    <p class="text-muted text-xs font-mono">#{order.paystack_ref}</p>
                  </div>
                </div>
                <span class={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-accent/20 text-accent' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {order.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div class="border-t border-border px-4 py-3 flex items-center justify-between">
                <span class="text-lg font-bold text-text">₦{order.amount.toLocaleString()}</span>
                <span class="text-xs text-muted">{new Date(order.created_at).toLocaleString()}</span>
              </div>
              {order.status === 'completed' && order.delivered_logs && (
                <div class="border-t border-border p-4 bg-bg">
                  <p class="text-muted text-xs mb-2">Delivered Account Details:</p>
                  <div class="bg-card border border-dashed border-border rounded-xl p-4 font-mono text-sm text-text whitespace-pre-wrap break-all">
                    {order.delivered_logs}
                  </div>
                  <div class="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(order.delivered_logs)}
                      class="py-2 bg-bg border border-border text-text rounded-lg font-bold text-sm hover:border-accent transition"
                    >
                      <i class="fa-solid fa-copy mr-2"></i> Copy All
                    </button>
                    <button
                      onClick={() => downloadPDF(order)}
                      class="py-2 bg-accent text-[#051a16] rounded-lg font-bold text-sm hover:bg-accent-dim transition"
                    >
                      <i class="fa-solid fa-download mr-2"></i> Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}