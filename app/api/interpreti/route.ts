import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { artists } from "@/db/schema";

function back(req: Request, key: string, value: string) {
  const url = new URL("/nahrat", req.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/prihlaseni", req.url), 303);
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name || name.length > 100) return back(req, "chyba", "Neplatné jméno.");

  const all = await db.select().from(artists);
  const existing = all.find((a) => a.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return back(
      req,
      "info",
      existing.verified ? "Interpret už je v seznamu." : "Interpret už čeká na ověření."
    );
  }

  await db
    .insert(artists)
    .values({ name, verified: false, suggestedBy: session.user.id });
  return back(req, "info", "Návrh odeslán, objeví se po ověření.");
}
