import Link from "next/link";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main>
      <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="font-display italic text-2xl tracking-tight text-ink">
            The&nbsp;TrendyCart
          </Link>
          <Link href="/" className="text-xs uppercase tracking-widest2 text-stone hover:text-ink transition-colors">
            ← Back to the trendyCart
          </Link>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-xs uppercase tracking-widest2 text-gold mb-4 text-center">About TrendyCart</p>
        <h1 className="font-display italic text-4xl md:text-5xl text-ink text-center leading-snug">
          
        </h1>

        <div className="mt-14 space-y-10 text-stone leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="font-display italic text-2xl text-ink mb-3">Our mission</h2>
            <p>
              Finding great fashion shouldn't feel like digging through a digital clearance bin. Most platforms run on automated firehoses, pushing volume over quality. Our rule is simple: if a piece isn’t genuinely stylish and heavily discounted, it doesn’t make the cut. We do the hunting so you only see the steals.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink mb-3">How we curate</h2>
            <p>
            We are not an automated firehose. Every listing on TrendyCart is manually vetted before it hits your feed—verifying real-time brand discounts, working coupon stacks, and live stock availability. If a deal is on this site, a real person verified it first.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink mb-3">Affiliate disclosure</h2>
            <p>
              TrendyCart participates in affiliate marketing. When you buy through a link on this site, we may
              earn a small commission from Myntra or the relevant partner — at no extra cost to you. This never
              affects which products we choose to feature; our commission has no bearing on the price you pay.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
