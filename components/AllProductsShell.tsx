"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { useResponsivePageSize } from "@/hooks/useResponsivePageSize";
import { Product } from "@/lib/github";

export default function AllProductsShell({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // Larger than the homepage's page size — this is the "see everything" view.
  const pageSize = useResponsivePageSize(12, 30);

  const filtered = useMemo(() => {
    let list = products;
    if (active !== "All") list = list.filter((p) => p.category === active);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list;
  }, [products, active, search]);

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

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-3">The full TrendyCart</p>
        <h1 className="font-display italic text-3xl md:text-4xl text-ink mb-1">All products</h1>
        <p className="text-stone text-sm">{filtered.length} pieces</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-black/10 bg-white/40">
            <p className="font-display italic text-2xl mb-2 text-ink">Nothing matches, yet.</p>
            <p className="text-stone text-sm">Try a different tab or search term.</p>
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
    </>
  );
}
