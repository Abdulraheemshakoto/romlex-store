import { useState } from 'preact/hooks';
import { signIn, signUp } from '../lib/auth';

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur p-6">
      <div class="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} class="absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:text-text hover:bg-bg transition">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <h2 class="text-2xl font-extrabold text-text mb-1">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p class="text-muted text-sm mb-6">{mode === 'login' ? 'Log in to access your orders' : 'Sign up to purchase accounts'}</p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onInput={e => setEmail(e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-muted mb-2">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onInput={e => setPassword(e.target.value)}
              class="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text focus:border-accent focus:outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>

          {error && <div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            class="w-full py-3 bg-accent text-[#051a16] rounded-xl font-bold hover:bg-accent-dim transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div class="text-center text-muted text-sm mt-6">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} class="text-accent font-semibold hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}