"use client";

import { useState } from "react";
import { Product } from "@/lib/github";

type Draft = {
  title: string;
  brand: string;
  image: string;
  category: string;
  price: number | null;
  mrp: number | null;
  discountPercent: number | null;
  url: string;
};

export default function EditProductModal({
  product,
  onClose,
  onSaved
}: {
  product: Product;
  onClose: () => void;
  onSaved: (updated: Product) => void;
}) {
  const [draft, setDraft] = useState<Draft>({
    title: product.title,
    brand: product.brand,
    image: product.image,
    category: product.category,
    price: product.price,
    mrp: product.mrp,
    discountPercent: product.discountPercent,
    url: product.url
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setError("");
    if (!draft.title.trim() || !draft.image.trim() || !draft.url.trim()) {
      setError("Title, image URL, and target link are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        body: JSON.stringify({ id: product.id, ...draft })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't update this product.");
        return;
      }
      onSaved(data.product);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-6">
      <div className="glass rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display italic text-xl text-ink">Edit product</p>
          <button onClick={onClose} className="text-stone hover:text-ink transition-colors text-sm">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <Field label="Brand" value={draft.brand} onChange={(v) => setDraft({ ...draft, brand: v })} />
          <Field label="Image URL" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <Field
            label="Target link / affiliate URL"
            value={draft.url}
            onChange={(v) => setDraft({ ...draft, url: v })}
          />

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

          <div className="grid grid-cols-3 gap-3">
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
            <img src={draft.image} alt={draft.title} className="w-24 aspect-[3/4] object-cover rounded-lg" />
          ) : null}

          {error ? <p className="text-rust text-xs">{error}</p> : null}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 text-xs uppercase tracking-widest2 py-3 rounded-lg border border-black/10 text-stone hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 text-xs uppercase tracking-widest2 py-3 rounded-lg bg-gold text-ivory hover:bg-goldLight transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
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