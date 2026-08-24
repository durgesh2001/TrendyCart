"use client";

import { useState } from "react";

type Draft = {
  title: string;
  image: string;
  details: string;
  stepsText: string; // one step per line, split into an array on save
  url: string;
};

const empty: Draft = { title: "", image: "", details: "", stepsText: "", url: "" };

export default function OfferForm({ onSaved }: { onSaved: () => void }) {
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setError("");
    if (!draft.title.trim() || !draft.image.trim() || !draft.url.trim()) {
      setError("Title, image URL, and target link are required.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      body: JSON.stringify({
        title: draft.title,
        image: draft.image,
        details: draft.details,
        steps: draft.stepsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        url: draft.url
      })
    });
    setSaving(false);
    const data = await res.json();
    if (res.ok) {
      setDraft(empty);
      onSaved();
    } else {
      setError(data.error || "Couldn't save this offer.");
    }
  }

  return (
    <div className="rounded-2xl bg-white/60 border border-black/[0.06] p-6 space-y-4">
      <p className="text-xs uppercase tracking-widest2 text-stone">Add a non-Myntra offer</p>

      <Field label="Offer title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
      <Field
        label="Banner / thumbnail image URL"
        value={draft.image}
        onChange={(v) => setDraft({ ...draft, image: v })}
      />

      <div>
        <label className="text-xs uppercase tracking-widest2 text-stone">Deal details / overview</label>
        <textarea
          value={draft.details}
          onChange={(e) => setDraft({ ...draft, details: e.target.value })}
          rows={3}
          className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-stone">Steps to avail — one per line</label>
        <textarea
          value={draft.stepsText}
          onChange={(e) => setDraft({ ...draft, stepsText: e.target.value })}
          rows={4}
          placeholder={"Open the app and go to Offers\nAdd items worth ₹999+\nApply code at checkout"}
          className="w-full border border-black/10 bg-white/70 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      <Field label="Target link / affiliate URL" value={draft.url} onChange={(v) => setDraft({ ...draft, url: v })} />

      {error ? <p className="text-rust text-xs">{error}</p> : null}

      <button
        onClick={save}
        disabled={saving}
        className="bg-gold hover:bg-goldLight transition-colors text-ivory text-xs uppercase tracking-widest2 px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save offer"}
      </button>
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
