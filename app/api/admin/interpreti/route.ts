import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/db";
import { artists, scores } from "@/db/schema";

function back(req: Request, error?: string) {
  const url = new URL("/admin/interpreti", req.url);
  if (error) url.searchParams.set("chyba", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return new Response("Nemáš oprávnění", { status: 403 });
  }

  const form = await req.formData();
  const action = String(form.get("action") ?? "");

  if (action === "add") {
    const name = String(form.get("name") ?? "").trim();
    if (!name || name.length > 100) return back(req, "Neplatné jméno interpreta.");
    const all = await db.select().from(artists);
    const existing = all.find(
      (a) => a.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      await db
        .update(artists)
        .set({ verified: true })
        .where(eq(artists.id, existing.id));
    } else {
      await db.insert(artists).values({ name, verified: true });
    }
    return back(req);
  }

  const id = Number(form.get("id"));
  if (!Number.isInteger(id)) return back(req, "Neplatný interpret.");

  if (action === "verify" || action === "unverify") {
    await db
      .update(artists)
      .set({ verified: action === "verify" })
      .where(eq(artists.id, id));
    return back(req);
  }

  if (action === "delete") {
    const [{ n }] = await db
      .select({ n: count() })
      .from(scores)
      .where(eq(scores.artistId, id));
    if (n > 0) return back(req, "Interpret má nahrané skladby, nejde smazat.");
    await db.delete(artists).where(eq(artists.id, id));
    return back(req);
  }

  return back(req, "Neznámá akce.");
}
