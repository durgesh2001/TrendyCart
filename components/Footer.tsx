export default function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display italic text-xl mb-3">The TrendyCart</p>
          <p className="text-sm text-ivory/60 leading-relaxed">
            Curated fashion and real-time loot deals worth your attention
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><a href="/products" className="hover:text-white transition-colors">Shop All</a></li>
            <li><a href="//products" className="hover:text-white transition-colors">Men's Edit</a></li>
            <li><a href="//products" className="hover:text-white transition-colors">Women's Edit</a></li>
            <li><a href="/other-offers" className="hover:text-white transition-colors">Exclusive Offers</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">About</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
         
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">Affiliate Disclosure & Legal</p>
          <p className="text-sm text-ivory/60 leading-relaxed">
            TrendyCart is an independent affiliate site. When you buy through our links, we may earn a commission at no additional cost to you. Product prices and availability are accurate at the time of posting and are subject to change on partner stores.
          </p>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} TrendyCart. All rights reserved.
      </div>
    </footer>
  );
}
