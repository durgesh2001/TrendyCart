import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-24 relative">
      {/* Thin gold hairline instead of a hard edge — reads as intentional, not just "section ended" */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 text-center sm:text-left">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start">
            <div className="bg-ivory rounded-2xl px-4 py-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)] inline-block">
              <Image
                src="/logo-full.png"
                alt="TrendyCart — Fashion deals. Real savings."
                width={1335}
                height={307}
                className="h-8 sm:h-9 w-auto"
              />
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed mt-4 max-w-xs">
              Curated fashion and real-time loot deals worth your attention.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">Shop</p>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li>
                <a href="/products" className="hover:text-white transition-colors">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition-colors">
                 Men's Edit
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition-colors">
                  Women's Edit
                </a>
              </li>
              <li>
                <a href="/other-offers" className="hover:text-white transition-colors">
                  Exclusive Offers
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">About</p>
            <ul className="space-y-2 text-sm text-ivory/80">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              
            </ul>
          </div>

          {/* Disclosure */}
          <div>
            <p className="text-xs uppercase tracking-widest2 text-ivory/50 mb-4">Disclosure</p>
            <p className="text-sm text-ivory/60 leading-relaxed">
             TrendyCart is an independent affiliate site. When you buy through our links, we may earn a commission at no additional cost to you. Product prices and availability are accurate at the time of posting and are subject to change on partner stores.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} TrendyCart. All rights reserved.
          </p>
          <p className="text-xs text-ivory/30">Fashion deals. Real savings.</p>
        </div>
      </div>
    </footer>
  );
}