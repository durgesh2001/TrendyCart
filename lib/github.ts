// Zero-cost "database": each collection (products, offers) is a JSON file
// inside this same GitHub repo, read/written through the GitHub Contents API.
// No external DB needed.

export type Product = {
  id: string;
  title: string;
  brand: string;
  image: string;
  images: string[];
  price: number | null;
  mrp: number | null;
  discountPercent: number | null;
  rating: number | null;
  ratingCount: number | null;
  specs: string[];
  url: string;
  category: string;
  createdAt: string;
};

// "Other Offers" — non-Myntra loot/cashback/bank deals. Kept in a separate
// file so they never mix into the Myntra product feed.
export type Offer = {
  id: string;
  title: string;
  image: string;
  details: string;
  steps: string[];
  url: string;
  createdAt: string;
};

const REPO = process.env.GITHUB_REPO as string; // "yourname/yourrepo"
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN as string;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json"
  };
}

// Reads a collection file straight from GitHub's raw CDN — fast, cacheable,
// no auth needed. Used for all public reads (homepage, other-offers page).
async function readPublic<T>(filePath: string): Promise<T[]> {
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${filePath}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  return res.json();
}

// Reads via the Contents API (needed to get the file's sha before writing).
async function readWithSha<T>(filePath: string): Promise<{ items: T[]; sha: string | null }> {
  const url = `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });
  if (res.status === 404) return { items: [], sha: null };
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return { items: JSON.parse(content || "[]"), sha: json.sha };
}

async function commit<T extends { id: string }>(
  filePath: string,
  message: string,
  next: T[],
  sha: string | null
) {
  const body = {
    message,
    content: Buffer.from(JSON.stringify(next, null, 2)).toString("base64"),
    branch: BRANCH,
    ...(sha ? { sha } : {})
  };
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${err}`);
  }
  return next;
}

async function addItem<T extends { id: string; title: string }>(filePath: string, item: T): Promise<T[]> {
  const { items, sha } = await readWithSha<T>(filePath);
  const next = [item, ...items.filter((i) => i.id !== item.id)];
  return commit(filePath, `Add: ${item.title}`, next, sha);
}

async function removeItem<T extends { id: string }>(filePath: string, id: string): Promise<T[]> {
  const { items, sha } = await readWithSha<T>(filePath);
  const next = items.filter((i) => i.id !== id);
  return commit(filePath, `Remove ${id}`, next, sha);
}

// ---- Products ----

const PRODUCTS_FILE = "data/products.json";

export const getProductsPublic = () => readPublic<Product>(PRODUCTS_FILE);
export const saveProduct = (product: Product) => addItem(PRODUCTS_FILE, product);
export const deleteProduct = (id: string) => removeItem<Product>(PRODUCTS_FILE, id);

// ---- Other Offers ----

const OFFERS_FILE = "data/offers.json";

export const getOffersPublic = () => readPublic<Offer>(OFFERS_FILE);
export const saveOffer = (offer: Offer) => addItem(OFFERS_FILE, offer);
export const deleteOffer = (id: string) => removeItem<Offer>(OFFERS_FILE, id);
