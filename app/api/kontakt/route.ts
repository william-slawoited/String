import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

function back(req: Request, key: string, value: string) {
  const url = new URL("/kontakt", req.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  const form = await req.formData();

  if (String(form.get("website") ?? "")) {
    return back(req, "odeslano", "1");
  }

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) return back(req, "chyba", "Vyplň všechna pole.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back(req, "chyba", "Neplatný e-mail.");
  if (name.length > 100 || email.length > 200 || message.length > 2000) {
    return back(req, "chyba", "Zpráva je příliš dlouhá.");
  }

  await db.insert(messages).values({ name, email, message });
  return back(req, "odeslano", "1");
}
