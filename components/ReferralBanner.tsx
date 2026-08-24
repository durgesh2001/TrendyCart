"use client";

import { useState } from "react";
import { buildAffiliateLink } from "@/lib/affiliate";

const AFFILIATE_ID = process.env.NEXT_PUBLIC_AFFILIATE_ID || "";

export default function ReferralBanner() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setError("");
    setCopied(false);
    if (!input.trim()) {
      setError("Paste a Myntra product link first.");
      setResult("");
      return;
    }
    const outcome = buildAffiliateLink(input, AFFILIATE_ID);
    if ("error" in outcome) {
      setError(outcome.error);
      setResult("");
    } else {
      setResult(outcome.url);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-10">
      {/* Thin gradient frame gives the panel a "featured" edge without being loud */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-r from-gold/25 via-goldLight/60 to-gold/25">
        <div className="glass rounded-3xl px-8 py-14 md:px-16 md:py-16 text-center">
          <p className="text-xs uppercase tracking-widest2 text-gold mb-4">A Quick favour</p>
          <h2 className="font-display italic text-3xl md:text-4xl text-ink leading-snug max-w-xl mx-auto">
           Found something on Myntra? .
          </h2>
          <p className="text-stone text-sm mt-4 max-w-md mx-auto">
            Paste any Myntra product link below and get the same link, routed through my referral.
          </p>

          <div className="max-w-xl mx-auto mt-9">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="https://www.myntra.com/..."
                className="flex-1 border border-black/10 bg-white/70 rounded-full px-5 py-3.5 text-sm outline-none focus:border-gold focus:bg-white transition-all"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
              <button
                onClick={generate}
                className="bg-ink hover:bg-gold transition-colors duration-300 text-ivory text-xs uppercase tracking-widest2 px-8 py-3.5 rounded-full"
              >
                Get link
              </button>
            </div>

            {error ? <p className="text-rust text-xs mt-3">{error}</p> : null}

            {result ? (
              <div className="mt-5 flex items-center gap-3 bg-white/80 border border-black/10 rounded-full pl-5 pr-2 py-2 text-left">
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-1 text-xs text-ink truncate hover:underline"
                >
                  {result}
                </a>
                <button
                  onClick={copy}
                  className="text-xs uppercase tracking-widest2 text-ivory bg-gold hover:bg-goldLight transition-colors flex-shrink-0 px-4 py-2 rounded-full"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
