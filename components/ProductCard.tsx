"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/github";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const isFlashLoot = (product.discountPercent ?? 0) >= 50;

  function goToDetail() {
    router.push(`/product/${product.id}`);
  }

  return (
    <div
      onClick={goToDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToDetail()}
      role="button"
      tabIndex={0}
      className="group relative rounded-xl overflow-hidden bg-white/70 border border-black/[0.06] card-lift cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-line/60">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="card-image object-cover"
        />

        {product.discountPercent ? (
          <div className="glass-badge absolute top-2 left-2 rounded-full px-2 py-1 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span className="text-[9px] sm:text-[10px] font-medium tracking-wide text-ink">
              {isFlashLoot ? "Flash Loot" : `${product.discountPercent}% off`}
            </span>
          </div>
        ) : null}

        {/* Scrim gives the glass button legibility on light product images */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Not inside the tile's click handler's DOM path for navigation purposes —
            stopPropagation keeps this from also triggering goToDetail(). */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center rounded-full py-2.5 text-[9px] sm:text-[11px] uppercase tracking-widest2 font-medium text-ink backdrop-blur-md bg-white/50 border border-white/60 hover:bg-white/70"
        >
          Buy on Myntra ↗
        </a>
      </div>

      <div className="p-2.5 sm:p-3">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone truncate">{product.brand}</p>
        <p className="text-xs sm:text-sm mt-1 leading-snug text-ink font-medium line-clamp-2">{product.title}</p>
        <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
          <span className="text-xs sm:text-sm font-semibold text-ink">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          {product.mrp && product.mrp > (product.price || 0) ? (
            <span className="text-[10px] sm:text-xs text-stone/70 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
