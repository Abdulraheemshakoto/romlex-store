import { user, signOut } from '../lib/auth';

export function Navbar({ onLoginClick }) {
  return (
    <header class="fixed top-0 left-0 right-0 h-[72px] z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
      <div class="container mx-auto px-6 h-full flex items-center justify-between">
        <a href="/" class="flex items-center gap-3 text-xl font-extrabold text-text">
          <span class="w-10 h-10 bg-gradient-to-br from-accent to-[#00997a] rounded-lg flex items-center justify-center text-[#051a16] text-lg">
            <i class="fa-brands fa-telegram"></i>
          </span>
          <span>Romlex Digital</span>
        </a>
        <nav class="hidden md:flex gap-8">
          <a href="/" class="font-medium text-accent">Marketplace</a>
          <a href="/orders" class="font-medium text-muted hover:text-accent transition">My Orders</a>
        </nav>
        <div class="flex items-center gap-3">
          <a href="https://wa.me/2348077818647" target="_blank" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-bg border border-border text-text rounded-lg font-semibold text-sm hover:border-accent transition">
            <i class="fa-brands fa-whatsapp"></i> Support
          </a>
          {user.value ? (
            <div class="flex items-center gap-2">
              <span class="hidden sm:block text-sm text-muted max-w-[120px] truncate">{user.value.email}</span>
              <button onClick={signOut} class="px-4 py-2 bg-bg border border-border text-text rounded-lg font-semibold text-sm hover:border-danger transition">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} class="px-4 py-2 bg-accent text-[#051a16] rounded-lg font-semibold text-sm hover:bg-accent-dim transition">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}