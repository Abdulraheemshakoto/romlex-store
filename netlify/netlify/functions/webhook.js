import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const signature = event.headers['x-paystack-signature'];
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(event.body).digest('hex');
  if (signature !== hash) return { statusCode: 401, body: 'Invalid signature' };

  const payload = JSON.parse(event.body);
  if (payload.event !== 'charge.success') return { statusCode: 200, body: 'OK' };

  const ref = payload.data.reference;

  const { data: order, error } = await supabase.from('orders').select('*, products(*)').eq('paystack_ref', ref).single();
  if (error || !order) return { statusCode: 404, body: 'Order not found' };
  if (order.status === 'completed') return { statusCode: 200, body: 'Already processed' };

  const logs = (order.products.log_template || '').split('\n').filter(Boolean);
  const deliveredLog = logs[0] || 'Contact support for your account details.';
  const remainingLogs = logs.slice(1).join('\n');

  await supabase.from('orders').update({
    status: 'completed',
    delivered_logs: deliveredLog,
    delivered_at: new Date().toISOString()
  }).eq('id', order.id);

  await supabase.from('products').update({
    stock: Math.max(0, order.products.stock - 1),
    sold: order.products.sold + 1,
    log_template: remainingLogs
  }).eq('id', order.products.id);

  return { statusCode: 200, body: 'OK' };
};