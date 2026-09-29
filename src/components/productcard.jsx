const PLATFORM_ICONS = {
  tiktok: 'fa-brands fa-tiktok',
  instagram: 'fa-brands fa-instagram',
  facebook: 'fa-brands fa-facebook',
  youtube: 'fa-brands fa-youtube',
  twitter: 'fa-brands fa-twitter',
  telegram: 'fa-brands fa-telegram',
  snapchat: 'fa-brands fa-snapchat',
  whatsapp: 'fa-brands fa-whatsapp',
  linkedin: 'fa-brands fa-linkedin'
};

const PLATFORM_GRADIENTS = {
  tiktok: 'from-black to-gray-800',
  instagram: 'from-[#f09433] via-[#dc2743] to-[#bc1888]',
  facebook: 'from-[#1877f2] to-[#0d65d9]',
  youtube: 'from-[#ff0000] to-[#cc0000]',
  twitter: 'from-[#1da1f2] to-[#0d8bd9]',
  telegram: 'from-[#0088cc] to-[#006ab3]',
  snapchat: 'from-[#fffc00] to-[#ffcc00]',
  whatsapp: 'from-[#25d366] to-[#128c7e]',
  linkedin: 'from-[#0077b5] to-[#006097]'
};

export function ProductCard({ product }) {
  const inStock = product.stock > 0;
  const icon = PLATFORM_ICONS[product.platform] || 'fa-solid fa-user';
  const gradient = PLATFORM_GRADIENTS[product.platform] || 'from-gray-500 to-gray-700';

  return (
    <div class="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition">
      <div class="p-4 flex items-center gap-4">
        {/* Platform Icon */}
        <div class={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
          <i class={`${icon} text-2xl ${product.platform === 'snapchat' ? 'text-black' : 'text-white'}`}></i>
        </div>

        {/* Info */}
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-text text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p class="text-muted text-xs mt-1">{product.sold} sold pcs</p>
          <p class={`text-xs mt-1 font-semibold ${inStock ? 'text-accent' : 'text-danger'}`}>
            {inStock ? `● ${product.stock} pcs In Stock` : '● 0 pcs In Stock'}
          </p>
        </div>

        {/* Price & Button */}
        <div class="flex flex-col items-end gap-2 flex-shrink-0">
          <span class="text-base font-extrabold text-text whitespace-nowrap">₦{product.price.toLocaleString()}</span>
          {inStock ? (
            <a 
              href={`/product/${product.id}`}
              class="px-4 py-2 rounded-xl font-bold text-xs bg-[#0d2a3a] text-text border border-[#1e4a6a] hover:bg-accent hover:text-[#051a16] hover:border-accent transition whitespace-nowrap"
            >
              <i class="fa-solid fa-cart-shopping mr-1"></i> Buy Now
            </a>
          ) : (
            <span class="px-4 py-2 rounded-xl font-bold text-xs bg-[#1e3a5f] text-muted cursor-not-allowed whitespace-nowrap">
              Out Of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}