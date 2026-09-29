import { useState, useEffect } from 'preact/hooks';
import { AdminLogin } from '../components/AdminLogin';
import { AdminProducts } from '../components/AdminProducts';
import { AdminOrders } from '../components/AdminOrders';
import { AdminSettings } from '../components/AdminSettings';

export function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('products');

  useEffect(() => {
    if (localStorage.getItem('romlex_admin') === 'true') setAuthed(true);
  }, []);

  function logout() {
    localStorage.removeItem('romlex_admin');
    setAuthed(false);
  }

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const tabs = [
    { id: 'products', label: 'Products', icon: 'fa-box' },
    { id: 'orders', label: 'Orders', icon: 'fa-shopping-bag' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' }
  ];

  return (
    <div class="container mx-auto px-6 py-12 max-w-5xl">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-text">Admin Dashboard</h1>
          <p class="text-muted text-sm mt-1">Manage your store</p>
        </div>
        <button onClick={logout} class="px-4 py-2 bg-bg border border-border rounded-lg text-muted hover:border-red-500 hover:text-red-400 transition text-sm font-semibold">
          <i class="fa-solid fa-right-from-bracket mr-2"></i> Logout
        </button>
      </div>

      <div class="flex gap-2 mb-6 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            class={`px-4 py-3 font-semibold text-sm transition border-b-2 -mb-px ${
              tab === t.id
                ? 'text-accent border-accent'
                : 'text-muted border-transparent hover:text-text'
            }`}>
            <i class={`fa-solid ${t.icon} mr-2`}></i> {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'products' && <AdminProducts />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}