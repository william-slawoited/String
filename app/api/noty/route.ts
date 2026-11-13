import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { artists, scores } from "@/db/schema";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = [".pdf", ".gp", ".gp3", ".gp4", ".gp5", ".gpx"];

function contentOk(ext: string, b: Buffer) {
  if (ext === ".pdf") return b.subarray(0, 4).toString() === "%PDF";
  if (ext === ".gp") return b[0] === 0x50 && b[1] === 0x4b;
  if (ext === ".gpx") {
    const h = b.subarray(0, 4).toString();
    return h === "BCFZ" || h === "BCFS";
  }
  return b.subarray(1, 19).toString("latin1") === "FICHIER GUITAR PRO";
}

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
  const artistId = Number(form.get("artistId"));
  const genre = String(form.get("genre") ?? "").trim();
  const difficulty = Number(form.get("difficulty"));
  const rights = form.get("rights");
  const file = form.get("file");

  if (!title) return back(req, "Vyplň název skladby.");
  if (!Number.isInteger(artistId)) return back(req, "Vyber interpreta.");

  const [artist] = await db
    .select()
    .from(artists)
    .where(and(eq(artists.id, artistId), eq(artists.verified, true)))
    .limit(1);
  if (!artist) return back(req, "Vyber ověřeného interpreta.");

  if (!rights) return back(req, "Potvrď, že máš právo soubor sdílet.");
  if (!(file instanceof File) || file.size === 0) {
    return back(req, "Vyber soubor (PDF nebo Guitar Pro).");
  }
  if (file.size > MAX_SIZE) return back(req, "Soubor je větší než 10 MB.");

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.includes(ext)) {
    return back(req, "Povolené jsou soubory PDF, .gp, .gp3, .gp4, .gp5 a .gpx.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!contentOk(ext, bytes)) {
    return back(req, "Obsah souboru neodpovídá jeho příponě.");
  }

  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const [row] = await db
    .insert(scores)
    .values({
      title,
      composer: artist.name,
      artistId: artist.id,
      genre: genre || null,
      difficulty: difficulty >= 1 && difficulty <= 5 ? difficulty : null,
      fileUrl: filename,
      uploadedBy: session.user.id,
    })
    .returning({ id: scores.id });

  return NextResponse.redirect(new URL(`/noty/${row.id}`, req.url), 303);
}
