import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import { getProductsPublic } from "@/lib/github";
import Image from "next/image";

export const revalidate = 30;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const products = await getProductsPublic();
  const product = products.find((p) => p.id === params.id);

  if (!product) notFound();

  const savings = product.mrp && product.price ? product.mrp - product.price : null;
  const gallery = product.images?.length ? product.images : [product.image];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <main className="bg-gradient-to-b from-white via-paper to-[#F3EEE3] min-h-screen">
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

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6 text-xs text-stone">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="hover:text-ink transition-colors">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-ink/70 truncate">{product.title}</span>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-14">
        <ProductGallery images={gallery} title={product.title} />

        {/* Details */}
        <div>
          <span className="inline-block text-[10px] uppercase tracking-widest2 text-gold border border-gold/30 rounded-full px-3 py-1">
            {product.category}
          </span>
          <p className="text-xs uppercase tracking-widest2 text-stone mt-4">{product.brand}</p>
          <h1 className="font-display italic text-3xl md:text-4xl text-ink mt-2 leading-snug">{product.title}</h1>

          {product.rating ? (
            <p className="text-sm text-stone mt-3">
              <span className="text-gold">★</span> {product.rating.toFixed(1)}{" "}
              {product.ratingCount ? `(${product.ratingCount} ratings)` : ""}
            </p>
          ) : null}

          {/* Price panel */}
          <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-r from-gold/25 via-goldLight/50 to-gold/25">
            <div className="glass rounded-2xl px-6 py-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-semibold text-ink">₹{product.price?.toLocaleString("en-IN")}</span>
                {product.mrp && product.mrp > (product.price || 0) ? (
                  <span className="text-base text-stone line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                ) : null}
                {product.discountPercent ? (
                  <span className="bg-gold text-ivory rounded-full px-3 py-1 text-xs font-medium">
                    {product.discountPercent}% off
                  </span>
                )  : null}
              </div>
              {savings && savings > 0 ? (
                <p className="text-sm text-gold mt-2 font-medium">
                  You save ₹{savings.toLocaleString("en-IN")} on this deal
                </p>
              ) : null}
              <p className="text-xs text-stone mt-1">Inclusive of all taxes · price as listed on Myntra</p>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="hidden md:block text-center mt-6 bg-ink hover:bg-gold transition-colors duration-300 text-ivory text-xs uppercase tracking-widest2 py-4 rounded-full"
              >
                Grab Deal on Myntra
              </a>
            </div>
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            {[
              ["✓", "Verified deal"],
              ["🔒", "Secure checkout"],
              ["↩", "Myntra return policy"]
            ].map(([icon, label]) => (
              <div key={label} className="rounded-xl bg-white/50 border border-black/[0.06] py-3 px-2">
                <p className="text-sm">{icon}</p>
                <p className="text-[10px] text-stone mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {product.specs?.length ? (
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest2 text-stone mb-4">Deal breakdown</p>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {product.specs.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink/80">
                    <span className="text-gold flex-shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {/* More like this */}
      {related.length > 0 ? (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <p className="font-display italic text-2xl text-ink mb-6">More like this</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <div className="pb-16" />
      )}

      {/* Sticky mobile CTA — the inline button above is desktop-only */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 glass-dark px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-ivory text-sm font-medium">₹{product.price?.toLocaleString("en-IN")}</span>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-1 text-center bg-gold text-ivory text-xs uppercase tracking-widest2 py-3 rounded-full"
        >
          Grab Deal on Myntra
        </a>
      </div>
      <div className="md:hidden h-16" />

      <Footer />
    </main>
  );
}
