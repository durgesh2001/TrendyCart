"use client";

import { useState } from "react";
import AdminGate from "@/components/AdminGate";
import ProductManager from "@/components/ProductManager";
import OfferForm from "@/components/OfferForm";
import OfferManager from "@/components/OfferManager";

type Draft = {
  title: string;
  brand: string;
  image: string;
  price: number | null;
  mrp: number | null;
  discountPercent: number | null;
  rating: number | null;
  ratingCount: number | null;
  category: string;
  specs: string[];
  url: string;
};

const empty: Draft = {
  title: "",
  brand: "",
  image: "",
  price: null,
  mrp: null,
  discountPercent: null,
  rating: null,
  ratingCount: null,
  category: "Men",
  specs: [],
  url: ""
};

const TABS = ["Myntra Products", "Other Offers"] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Myntra Products");

  // Products tab state
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [productManagerKey, setProductManagerKey] = useState(0);

  // Offers tab state
  const [offerManagerKey, setOfferManagerKey] = useState(0);

  async function importLink() {
    if (!link.trim()) {
      setParseError("Paste a Myntra product link first.");
      return;
    }
    setParseError("");
    setLoading(true);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: JSON.stringify({ url: link })
      });
      const data = await res.json();
      if (!res.ok) {
        setParseError(data.error || "Couldn't read that link.");
        setDraft({ ...empty, url: link });
      } else {
        setDraft({
          title: data.title || "",
          brand: data.brand || "",
          image: data.image || "",
          price: data.price,
          mrp: data.mrp,
          discountPercent: data.discountPercent,
          rating: data.rating,
          ratingCount: data.ratingCount,
          category: "Men",
          specs: data.specs || [],
          url: link
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    if (!draft) return;
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(draft)
    });
    const data = await res.json();
    if (res.ok) {
      setDraft(null);
      setLink("");
      setProductManagerKey((k) => k + 1);
    } else {
      setParseError(data.error || "Couldn't save this product.");
    }
  }

  return (
    <AdminGate>
      <main className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-2">Admin</p>
        <h1 className="font-display italic text-3xl mb-8 text-ink">Dashboard</h1>

        <div className="inline-flex bg-black/[0.04] rounded-full p-1 mb-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs uppercase tracking-widest2 px-5 py-2 rounded-full transition-all duration-300 ${
                tab === t ? "bg-ink text-ivory shadow-sm" : "text-stone hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Myntra Products" ? (
          <>
            <div className="rounded-2xl bg-white/60 border border-black/[0.06] p-6">
              <label className="text-xs uppercase tracking-widest2 text-stone">Myntra product link</label>
              <div className="flex gap-3 mt-2">
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://www.myntra.com/..."
                  className="flex-1 border border-black/10 bg-white/70 rounded-lg px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                />
                <button
                  onClick={importLink}
                  disabled={loading}
                  className="bg-ink hover:bg-ink/80 transition-colors text-ivory text-xs uppercase tracking-widest2 px-6 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Importing…" : "Import"}
                </button>
              </div>
              {parseError ? <p className="text-rust text-xs mt-3">{parseError}</p> : null}
            </div>

            {draft ? (
              <div className="rounded-2xl bg-white/60 border border-black/[0.06] p-6 mt-6 space-y-4">
                <p className="text-xs uppercase tracking-widest2 text-stone">
                  Review the details — fix anything the import missed before saving.
                </p>

                <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                <Field label="Brand" value={draft.brand} onChange={(v) => setDraft({ ...draft, brand: v })} />
                <Field label="Image URL" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />

                <div>
                  <label className="text-xs uppercase tracking-widest2 text-stone">Category</label>
                  <select
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Other">Other (won't show under Men/Women tabs)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <NumField label="Price (₹)" value={draft.price} onChange={(v) => setDraft({ ...draft, price: v })} />
                  <NumField label="MRP (₹)" value={draft.mrp} onChange={(v) => setDraft({ ...draft, mrp: v })} />
                  <NumField
                    label="Discount %"
                    value={draft.discountPercent}
                    onChange={(v) => setDraft({ ...draft, discountPercent: v })}
                  />
                </div>

                {draft.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image} alt={draft.title} className="w-32 aspect-[3/4] object-cover rounded-lg" />
                ) : null}

                <button
                  onClick={saveProduct}
                  className="bg-gold hover:bg-goldLight transition-colors text-ivory text-xs uppercase tracking-widest2 px-6 py-3 rounded-lg"
                >
                  Save to the trendyCart
                </button>
              </div>
            ) : null}

            <div className="mt-12">
              <ProductManager key={productManagerKey} pageSize={8} viewAllHref="/admin/products" />
            </div>
          </>
        ) : (
          <>
            <OfferForm onSaved={() => setOfferManagerKey((k) => k + 1)} />
            <div className="mt-12">
              <OfferManager key={offerManagerKey} pageSize={8} />
            </div>
          </>
        )}
      </main>
    </AdminGate>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest2 text-stone">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}

function NumField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest2 text-stone">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
