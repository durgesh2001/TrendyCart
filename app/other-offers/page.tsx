import Link from "next/link";
import Footer from "@/components/Footer";
import OfferCard from "@/components/OfferCard";
import { getOffersPublic } from "@/lib/github";
import Image from "next/image";

export const revalidate = 30;

export default async function OtherOffersPage() {
  const offers = await getOffersPublic();

  return (
    <main>
      <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="TrendyCart" width={885} height={781} className="h-9 w-auto" priority />
            <span className="font-display italic text-2xl tracking-tight text-ink">TrendyCart</span>
          </a>
          <Link href="/" className="text-xs uppercase tracking-widest2 text-stone hover:text-ink transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-4">Beyond fashion</p>
        <h1 className="font-display italic text-4xl md:text-5xl leading-[1.05] max-w-2xl mx-auto text-ink">
          Other loot, cashback & bank offers
        </h1>
        <p className="text-stone mt-5 max-w-md mx-auto text-sm">
          Deals worth knowing about that have nothing to do with Myntra — cashback hacks, bank promos, and
          third-party discounts.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {offers.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-black/10 bg-white/40">
            <p className="font-display italic text-2xl mb-2 text-ink">Nothing here yet.</p>
            <p className="text-stone text-sm">Check back soon for more offers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
