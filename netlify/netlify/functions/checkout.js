import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { product_id, user_id, email } = JSON.parse(event.body || '{}');
    if (!product_id || !user_id || !email) return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };

    const { data: product, error: pErr } = await supabase.from('products').select('*').eq('id', product_id).single();
    if (pErr || !product) return { statusCode: 404, body: JSON.stringify({ error: 'Product not found' }) };
    if (product.stock <= 0) return { statusCode: 400, body: JSON.stringify({ error: 'Out of stock' }) };

    const ref = `ROMLEX_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const { data: order, error: oErr } = await supabase.from('orders').insert({
      user_id,
      product_id,
      paystack_ref: ref,
      amount: product.price,
      status: 'pending'
    }).select().single();
    if (oErr) return { statusCode: 500, body: JSON.stringify({ error: oErr.message }) };

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: product.price * 100,
        reference: ref,
        callback_url: `${process.env.SITE_URL || 'http://localhost:3002'}/orders`,
        metadata: { order_id: order.id, product_id }
      })
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) return { statusCode: 500, body: JSON.stringify({ error: paystackData.message }) };

    return { statusCode: 200, body: JSON.stringify({ authorization_url: paystackData.data.authorization_url, reference: ref }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};