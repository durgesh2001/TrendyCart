import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Lets AdminGate check for an existing session on page load, so navigating
// between /admin and /admin/products doesn't ask for the password twice.
export async function GET() {
  const session = cookies().get("admin_session")?.value;
  if (session === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8
  });
  return res;
}
