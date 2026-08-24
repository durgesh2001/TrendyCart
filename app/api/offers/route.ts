import { NextRequest, NextResponse } from "next/server";
import { getOffersPublic, saveOffer, deleteOffer, Offer } from "@/lib/github";
import { cookies } from "next/headers";

function requireAdmin() {
  const session = cookies().get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const offers = await getOffersPublic();
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  const body = await req.json();
  const offer: Offer = {
    id: crypto.randomUUID(),
    title: body.title,
    image: body.image,
    details: body.details || "",
    steps: body.steps || [],
    url: body.url,
    createdAt: new Date().toISOString()
  };

  if (!offer.title || !offer.image || !offer.url) {
    return NextResponse.json({ error: "Title, image, and target link are required." }, { status: 400 });
  }

  try {
    const offers = await saveOffer(offer);
    return NextResponse.json({ offer, count: offers.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin()) return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { id } = await req.json();
  const offers = await deleteOffer(id);
  return NextResponse.json({ count: offers.length });
}
