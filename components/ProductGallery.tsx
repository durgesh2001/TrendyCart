"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-line/60 border border-black/[0.06] shadow-[0_35px_70px_-35px_rgba(18,17,15,0.3)]">
        <Image
          src={images[active]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                active === i ? "border-gold" : "border-transparent hover:border-gold/40"
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
