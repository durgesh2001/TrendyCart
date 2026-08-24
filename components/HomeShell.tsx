"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ReferralBanner from "@/components/ReferralBanner";
import Pagination from "@/components/Pagination";
import { useResponsivePageSize } from "@/hooks/useResponsivePageSize";
import { Product } from "@/lib/github";

export default function HomeShell({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = useResponsivePageSize(10, 15);

  const filtered = useMemo(() => {
    let list = products;

    // Category is deterministic: admin sets it to exactly "Men" or "Women" when
    // adding a product (see the admin form's dropdown). Anything else only
    // shows up under "All" — that's intentional, not a bug.
    if (active !== "All") {
      list = list.filter((p) => p.category === active);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, active, search]);

  // Changing tab, search, or the responsive page size can all shrink the
  // list — reset to page 1 rather than land on a page that no longer exists.
  useEffect(() => {
    setPage(1);
  }, [active, search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <>
      <Header active={active} onSelect={setActive} search={search} onSearchChange={setSearch} />

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-4">CURATED FASHION FINDS</p>
        <h3 className="font-display italic text-2xl md:text-4xl leading-tight max-w-3xl mx-auto text-ink">
          Elite Style. Loot Prices.
        </h3>
        <p className="text-stone mt-5 max-w-md mx-auto text-sm">
          The best price drops on Myntra, filtered daily for what’s actually worth buying.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-black/10 bg-white/40">
            <p className="font-display italic text-2xl mb-2 text-ink">
              {products.length === 0 ? "The edit is empty, for now." : "Nothing matches, yet."}
            </p>
            <p className="text-stone text-sm">
              {products.length === 0
                ? "Add a product from the admin page to see it here."
                : "Try a different tab or search term."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>

      {products.length > 0 ? (
        <div className="text-center pb-24">
          <Link
            href="/products"
            className="inline-block text-xs uppercase tracking-widest2 text-ivory bg-ink hover:bg-gold transition-colors duration-300 px-8 py-3.5 rounded-full"
          >
            View All Loots
          </Link>
        </div>
      ) : null}

      <ReferralBanner />

    </>
  );
}
