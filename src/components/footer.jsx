export function Footer() {
  return (
    <footer class="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-gradient-to-br from-accent to-[#00997a] rounded-lg flex items-center justify-center text-[#051a16]">
              <i class="fa-brands fa-telegram text-sm"></i>
            </span>
            <span class="font-bold text-text">Romlex Digital</span>
          </div>
          <p class="text-muted text-sm max-w-xs">Premium social media accounts. Verified, high-engagement, ready to grow your brand.</p>
        </div>
        <div>
          <h4 class="font-bold text-text mb-4">Support</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="https://wa.me/2348077818647" target="_blank" class="text-muted hover:text-accent transition"><i class="fa-brands fa-whatsapp mr-2"></i> WhatsApp</a></li>
            <li><a href="https://t.me/RomlexDigital" target="_blank" class="text-muted hover:text-accent transition"><i class="fa-brands fa-telegram mr-2"></i> Telegram</a></li>
            <li><a href="https://tiktok.com/@romlexdigital" target="_blank" class="text-muted hover:text-accent transition"><i class="fa-brands fa-tiktok mr-2"></i> TikTok</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-text mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="/" class="text-muted hover:text-accent transition">Marketplace</a></li>
            <li><a href="/orders" class="text-muted hover:text-accent transition">My Orders</a></li>
          </ul>
        </div>
      </div>
      <div class="container mx-auto px-6 mt-12 pt-6 border-t border-border text-center text-muted text-xs">
        &copy; 2026 Romlex Digital. All rights reserved.
      </div>
    </footer>
  );
}