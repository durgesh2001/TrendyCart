"use client";

import { useState } from "react";
import { Offer } from "@/lib/github";

export default function OfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden bg-white/70 border border-black/[0.06] card-lift">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={offer.image} alt={offer.title} className="w-full aspect-[16/9] object-cover" />

      <div className="p-5">
        <p className="font-display italic text-lg text-ink leading-snug">{offer.title}</p>
        {offer.details ? <p className="text-sm text-stone mt-2 leading-relaxed">{offer.details}</p> : null}

        {offer.steps?.length ? (
          <div className="mt-4">
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-xs uppercase tracking-widest2 text-gold hover:text-goldLight transition-colors"
            >
              {open ? "Hide steps ▲" : "How to avail ▼"}
            </button>
            {open ? (
              <ol className="mt-3 space-y-1.5 text-sm text-ink/80 list-decimal list-inside">
                {offer.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : null}
          </div>
        ) : null}

        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block text-center mt-5 bg-ink hover:bg-gold transition-colors duration-300 text-ivory text-xs uppercase tracking-widest2 py-3 rounded-full"
        >
          Grab This Offer
        </a>
      </div>
    </div>
  );
}
