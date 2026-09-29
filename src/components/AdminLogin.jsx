import { useState } from 'preact/hooks';

export function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check (change this to your own password)
    const ADMIN_PASSWORD = 'romlex2026';

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('romlex_admin', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
    }
    setLoading(false);
  }

  return (
    <div class="container mx-auto px-6 py-20 max-w-md">
      <div class="bg-card border border-border rounded-2xl p-8">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-accent to-[#00997a] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="fa-solid fa-lock text-2xl text-[#051a16]"></i>
          </div>
          <h1 class="text-2xl font-extrabold text-text">Admin Access</h1>
          <p class="text-muted text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block text-sm font-medium text-muted mb-2">Password</label>
            <input
              type="password"
              value={password}
              onInput={e => setPassword(e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            class="w-full py-3 bg-accent text-[#051a16] rounded-xl font-bold hover:bg-accent-dim transition disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}