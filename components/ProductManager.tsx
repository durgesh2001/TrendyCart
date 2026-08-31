"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/github";
import Pagination from "@/components/Pagination";
import EditProductModal from "@/components/EditProductModal";

export default function ProductManager({
  pageSize,
  viewAllHref
}: {
  pageSize: number;
  viewAllHref?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  // If a delete shrinks the list past the current page, step back automatically.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, page, pageSize]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await fetch("/api/products", {
      method: "DELETE",
      body: JSON.stringify({ id: toDelete.id })
    });
    setDeleting(false);
    setToDelete(null);
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
      setToast("Product removed.");
    } else {
      setToast("Couldn't remove that product — try again.");
    }
  }

  function handleUpdated(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
    setToast("Product updated.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display italic text-xl text-ink">Active products</h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-stone">{products.length} total</span>
          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="text-xs uppercase tracking-widest2 text-gold hover:text-goldLight transition-colors"
            >
              View all →
            </a>
          ) : null}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-stone">No products yet — import one above.</p>
      ) : (
        <>
          <div className="space-y-3">
            {pageItems.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl bg-white/60 border border-black/[0.06] p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.title} className="w-14 h-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest2 text-stone">
                    {p.brand} · {p.category}
                  </p>
                  <p className="text-sm text-ink truncate">{p.title}</p>
                  <p className="text-xs text-stone mt-0.5">₹{p.price?.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-xs uppercase tracking-widest2 text-gold hover:text-goldLight border border-gold/30 hover:border-gold rounded-lg px-4 py-2 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setToDelete(p)}
                    className="text-xs uppercase tracking-widest2 text-rust hover:text-red-700 border border-rust/30 hover:border-rust rounded-lg px-4 py-2 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {editing ? (
        <EditProductModal product={editing} onClose={() => setEditing(null)} onSaved={handleUpdated} />
      ) : null}

      {toDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-6">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <p className="font-display italic text-xl text-ink mb-2">Remove this product?</p>
            <p className="text-sm text-stone mb-6">
              "{toDelete.title}" will be removed from the site immediately. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="flex-1 text-xs uppercase tracking-widest2 py-3 rounded-lg border border-black/10 text-stone hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 text-xs uppercase tracking-widest2 py-3 rounded-lg bg-rust text-ivory hover:bg-rust/80 transition-colors disabled:opacity-50"
              >
                {deleting ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-dark text-ivory text-sm px-5 py-3 rounded-full">
          {toast}
        </div>
      ) : null}
    </div>
  );
}