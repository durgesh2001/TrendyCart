import { NextRequest, NextResponse } from "next/server";
import { getProductsPublic, saveProduct, deleteProduct, Product } from "@/lib/github";
import { cookies } from "next/headers";

function requireAdmin() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const products = await getProductsPublic();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  const product: Product = {
    id: crypto.randomUUID(),
    title: body.title,
    brand: body.brand,
    image: body.image,
    images: body.images || [body.image].filter(Boolean),
    price: body.price ?? null,
    mrp: body.mrp ?? null,
    discountPercent: body.discountPercent ?? null,
    rating: body.rating ?? null,
    ratingCount: body.ratingCount ?? null,
    specs: body.specs || [],
    url: body.url,
    category: body.category || "Uncategorised",
    createdAt: new Date().toISOString()
  };

  if (!product.title || !product.url || !product.image) {
    return NextResponse.json({ error: "Title, image, and Myntra link are required." }, { status: 400 });
  }

  try {
    const products = await saveProduct(product);
    return NextResponse.json({ product, count: products.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { id } = await req.json();
  const products = await deleteProduct(id);
  return NextResponse.json({ count: products.length });
}
