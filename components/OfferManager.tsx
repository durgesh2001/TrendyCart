"use client";

import { useEffect, useMemo, useState } from "react";
import { Offer } from "@/lib/github";
import Pagination from "@/components/Pagination";

export default function OfferManager({ pageSize }: { pageSize: number }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/offers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setOffers)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const totalPages = Math.max(1, Math.ceil(offers.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return offers.slice(start, start + pageSize);
  }, [offers, page, pageSize]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await fetch("/api/offers", {
      method: "DELETE",
      body: JSON.stringify({ id: toDelete.id })
    });
    setDeleting(false);
    setToDelete(null);
    if (res.ok) {
      setOffers((prev) => prev.filter((o) => o.id !== toDelete.id));
      setToast("Offer removed.");
    } else {
      setToast("Couldn't remove that offer — try again.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display italic text-xl text-ink">Active offers</h2>
        <span className="text-xs text-stone">{offers.length} total</span>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : offers.length === 0 ? (
        <p className="text-sm text-stone">No offers yet — add one above.</p>
      ) : (
        <>
          <div className="space-y-3">
            {pageItems.map((o) => (
              <div key={o.id} className="flex items-center gap-4 rounded-xl bg-white/60 border border-black/[0.06] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.image} alt={o.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{o.title}</p>
                  <p className="text-xs text-stone mt-0.5 truncate">{o.details}</p>
                </div>
                <button
                  onClick={() => setToDelete(o)}
                  className="text-xs uppercase tracking-widest2 text-rust hover:text-red-700 border border-rust/30 hover:border-rust rounded-lg px-4 py-2 transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {toDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-6">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <p className="font-display italic text-xl text-ink mb-2">Remove this offer?</p>
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
