import * as cheerio from "cheerio";

export type ParsedProduct = {
  title: string | null;
  brand: string | null;
  image: string | null;
  images: string[];
  price: number | null;
  mrp: number | null;
  discountPercent: number | null;
  rating: number | null;
  ratingCount: number | null;
  specs: string[];
  category: string | null;
  sourceUrl: string;
};

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "string" ? parseFloat(v.replace(/[^\d.]/g, "")) : Number(v);
  return Number.isFinite(n) ? n : null;
}

// Myntra ships a schema.org JSON-LD Product block on every PDP for Google —
// that's the most reliable source since it doesn't depend on their bundle's
// internal variable names, which change often.
function extractJsonLd($: cheerio.CheerioAPI) {
  const blocks = $('script[type="application/ld+json"]');
  for (const el of blocks.toArray()) {
    try {
      const json = JSON.parse($(el).contents().text());
      const items = Array.isArray(json) ? json : [json];
      for (const item of items) {
        if (item["@type"] === "Product") return item;
        if (Array.isArray(item["@graph"])) {
          const p = item["@graph"].find((g: { "@type"?: string }) => g["@type"] === "Product");
          if (p) return p;
        }
      }
    } catch {
      // ignore malformed blocks and keep scanning
    }
  }
  return null;
}

// Fallback: Myntra embeds a large inline state object (commonly assigned to
// window.__myx) that carries pdpData including mrp/discount even when the
// JSON-LD block omits them. We regex-scan for it instead of eval'ing it.
function extractInlineState(html: string) {
  const match = html.match(/window\.__myx\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function findDeep(obj: unknown, keys: string[]): unknown {
  if (!obj || typeof obj !== "object") return null;
  for (const key of keys) {
    if (key in (obj as Record<string, unknown>)) return (obj as Record<string, unknown>)[key];
  }
  for (const value of Object.values(obj as Record<string, unknown>)) {
    const found = findDeep(value, keys);
    if (found !== null && found !== undefined) return found;
  }
  return null;
}

export async function parseMyntraUrl(url: string): Promise<ParsedProduct> {
  const res = await fetch(url, {
    headers: {
      // A real browser UA avoids Myntra serving a stripped-down bot response.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml"
    }
  });
  if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const ld = extractJsonLd($);
  const state = extractInlineState(html);

  const ogImage = $('meta[property="og:image"]').attr("content") || null;
  const ogTitle = $('meta[property="og:title"]').attr("content") || null;

  const title = (ld?.name as string) || ogTitle || $("title").text() || null;
  const brand =
    (typeof ld?.brand === "object" ? ld?.brand?.name : ld?.brand) ||
    (findDeep(state, ["brandName", "brand"]) as string) ||
    null;

  const offer = Array.isArray(ld?.offers) ? ld.offers[0] : ld?.offers;
  const price = toNumber(offer?.price) ?? toNumber(findDeep(state, ["discountedPrice", "price"]));
  const mrp = toNumber(findDeep(state, ["mrp", "maxRetailPrice"])) ?? price;
  const discountPercent =
    mrp && price && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : toNumber(findDeep(state, ["discount"]));

  const rating = toNumber(ld?.aggregateRating?.ratingValue) ?? toNumber(findDeep(state, ["averageRating"]));
  const ratingCount = toNumber(ld?.aggregateRating?.reviewCount) ?? toNumber(findDeep(state, ["ratingCount"]));

  const ldImages: string[] = Array.isArray(ld?.image) ? ld.image : ld?.image ? [ld.image] : [];
  const images = (ldImages.length ? ldImages : ogImage ? [ogImage] : []).slice(0, 6);

  const specs: string[] = [];
  $('[class*="index-tableContainer"] tr, [class*="pdp-product-description"] li').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text && text.length < 140) specs.push(text);
  });

  const category = (findDeep(state, ["articleType", "category"]) as string) || null;

  return {
    title: title?.trim() || null,
    brand: (brand as string)?.trim() || null,
    image: images[0] || null,
    images,
    price,
    mrp,
    discountPercent,
    rating,
    ratingCount,
    specs: specs.slice(0, 8),
    category,
    sourceUrl: url
  };
}
