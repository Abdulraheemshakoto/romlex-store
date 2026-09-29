import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import { user } from '../lib/auth';

export function ProductDetail({ id, onLoginRequired }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error) setProduct(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleBuy() {
    console.log('--- Buy button clicked ---');
    console.log('window.PaystackPop:', typeof window.PaystackPop);
    console.log('User:', user.value);
    console.log('Product:', product);

    if (!user.value) {
      alert('Please log in first');
      if (onLoginRequired) onLoginRequired();
      return;
    }

    if (!product || product.stock <= 0) {
      alert('Product unavailable');
      return;
    }

    if (typeof window.PaystackPop === 'undefined') {
      alert('Paystack is still loading. Please refresh the page and try again.');
      return;
    }

    setProcessing(true);

    try {
      const ref = 'ROMLEX_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8).toUpperCase();

      const handler = window.PaystackPop.setup({
        key: 'pk_test_6c9bd9363df6f0460cace9e1daa727e8a9de0cae',
        email: user.value.email,
        amount: Math.round(product.price * 100),
        currency: 'NGN',
        ref: ref,
        metadata: {
          product_id: product.id,
          user_id: user.value.id,
          product_name: product.name
        },
        callback: function(response) {
          console.log('Payment success callback:', response);
          finalizeOrder(response.reference);
        },
        onClose: function() {
          console.log('Paystack popup closed');
          setProcessing(false);
        }
      });

      console.log('Opening Paystack iframe...');
      handler.openIframe();
    } catch (e) {
      console.error('Paystack setup error:', e);
      alert('Paystack error: ' + e.message);
      setProcessing(false);
    }
  }

  async function finalizeOrder(reference) {
    try {
      const logs = (product.log_template || '').split('\n').filter(Boolean);
      const deliveredLog = logs[0] || 'Contact support for your account details.';
      const remainingLogs = logs.slice(1).join('\n');

      await supabase.from('orders').insert({
        user_id: user.value.id,
        product_id: product.id,
        paystack_ref: reference,
        amount: product.price,
        status: 'completed',
        delivered_logs: deliveredLog,
        delivered_at: new Date().toISOString()
      });

      await supabase.from('products').update({
        stock: Math.max(0, product.stock - 1),
        sold: product.sold + 1,
        log_template: remainingLogs
      }).eq('id', product.id);

      window.location.href = '/orders';
    } catch (e) {
      alert('Payment succeeded but delivery failed. Contact support with ref: ' + reference);
      setProcessing(false);
    }
  }

  if (loading) return <div class="text-center py-20 text-muted">Loading...</div>;
  if (!product) return <div class="text-center py-20 text-muted">Product not found</div>;

  const inStock = product.stock > 0;

  return (
    <div class="container mx-auto px-6 py-12 max-w-2xl">
      <a href="/" class="text-muted hover:text-accent text-sm mb-6 inline-block">
        <i class="fa-solid fa-arrow-left mr-2"></i> Back to Marketplace
      </a>
      <div class="bg-card border border-border rounded-2xl p-6">
        <h1 class="text-3xl font-extrabold text-text mb-3">{product.name}</h1>
        <p class="text-muted mb-6">{product.description || 'Premium account'}</p>

        <div class="flex items-center gap-4 mb-6">
          <span class="text-4xl font-extrabold text-accent">₦{product.price.toLocaleString()}</span>
          <span class={`text-sm font-semibold ${inStock ? 'text-accent' : 'text-red-500'}`}>
            {inStock ? `● ${product.stock} in stock` : '● Out of stock'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBuy}
          disabled={!inStock || processing}
          class={`w-full py-4 rounded-xl font-bold text-lg transition ${
            inStock && !processing
              ? 'bg-accent text-[#051a16] hover:bg-accent-dim cursor-pointer'
              : 'bg-[#1e3a5f] text-muted cursor-not-allowed'
          }`}
        >
          {processing ? 'Processing...' : (inStock ? 'Buy Now with Paystack' : 'Out of Stock')}
        </button>
      </div>
    </div>
  );
}