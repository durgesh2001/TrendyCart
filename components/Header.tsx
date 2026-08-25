import Image from "next/image";


const FILTER_TABS = ["All", "Men", "Women"] as const;

export default function Header({
  active,
  onSelect,
  search,
  onSearchChange
}: {
  active: string;
  onSelect: (tab: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
       <a href="/" className="flex items-center gap-2">
  <Image src="/logo.png" alt="TrendyCart" width={885} height={781} className="h-9 w-auto" priority />
  <span className="font-display italic text-2xl tracking-tight text-ink">TrendyCart</span>
</a>

        <nav className="hidden md:flex items-center gap-1 bg-black/[0.04] rounded-full p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onSelect(tab)}
              className={`text-xs uppercase tracking-widest2 px-5 py-2 rounded-full transition-all duration-300 ${
                active === tab ? "bg-ink text-ivory shadow-sm" : "text-stone hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
          {/* Not a filter — this one navigates to its own page */}
          <a
            href="/other-offers"
            className="text-xs uppercase tracking-widest2 px-5 py-2 rounded-full text-stone hover:text-ink transition-all duration-300"
          >
            Exclusive Offers
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center border border-black/10 bg-white/50 rounded-full px-4 py-2 w-56 focus-within:border-gold/60 transition-colors">
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search the trendyCart"
              className="w-full bg-transparent text-sm outline-none placeholder:text-stone"
            />
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex justify-center gap-1 bg-black/[0.04] mx-6 mb-3 rounded-full p-1 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`flex-1 text-xs uppercase tracking-widest2 py-2 rounded-full transition-all ${
              active === tab ? "bg-ink text-ivory" : "text-stone"
            }`}
          >
            {tab}
          </button>
        ))}
        <a href="/other-offers" className="flex-1 text-center text-xs uppercase tracking-widest2 py-2 rounded-full text-stone">
          Offers
        </a>
      </div>
    </header>
  );
}
