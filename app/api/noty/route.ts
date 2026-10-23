import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { scores } from "@/db/schema";

const MAX_SIZE = 10 * 1024 * 1024;

function back(req: Request, message: string) {
  const url = new URL("/nahrat", req.url);
  url.searchParams.set("chyba", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/prihlaseni", req.url), 303);
  }

  const form = await req.formData();
  const title = String(form.get("title") ?? "").trim();
  const composer = String(form.get("composer") ?? "").trim();
  const instrument = String(form.get("instrument") ?? "").trim();
  const genre = String(form.get("genre") ?? "").trim();
  const difficulty = Number(form.get("difficulty"));
  const rights = form.get("rights");
  const file = form.get("file");

  if (!title) return back(req, "Vyplň název skladby.");
  if (!rights) return back(req, "Potvrď, že máš právo soubor sdílet.");
  if (!(file instanceof File) || file.size === 0) {
    return back(req, "Vyber soubor PDF.");
  }
  if (file.size > MAX_SIZE) return back(req, "Soubor je větší než 10 MB.");

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 4).toString() !== "%PDF") {
    return back(req, "Soubor musí být PDF.");
  }

  const filename = `${randomUUID()}.pdf`;
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const [row] = await db
    .insert(scores)
    .values({
      title,
      composer: composer || null,
      instrument: instrument || null,
      genre: genre || null,
      difficulty: difficulty >= 1 && difficulty <= 5 ? difficulty : null,
      fileUrl: filename,
      uploadedBy: session.user.id,
    })
    .returning({ id: scores.id });

  return NextResponse.redirect(new URL(`/noty/${row.id}`, req.url), 303);
}
