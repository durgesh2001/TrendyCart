import { NextRequest, NextResponse } from "next/server";
import { parseMyntraUrl } from "@/lib/parse";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const session = cookies().get("admin_session")?.value;
  if (session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url || !/myntra\.com/.test(url)) {
    return NextResponse.json({ error: "Enter a valid Myntra product link." }, { status: 400 });
  }

  try {
    const parsed = await parseMyntraUrl(url);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Couldn't read that page. Myntra may have blocked the request — fill the details in manually." },
      { status: 502 }
    );
  }
}
