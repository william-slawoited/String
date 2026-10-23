import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { unlink } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { favorites, scores } from "@/db/schema";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/prihlaseni", req.url), 303);
  }

  const { id } = await params;
  const scoreId = Number(id);
  if (!Number.isInteger(scoreId)) {
    return new Response("Nenalezeno", { status: 404 });
  }

  const [score] = await db
    .select()
    .from(scores)
    .where(eq(scores.id, scoreId))
    .limit(1);

  if (!score) return new Response("Nenalezeno", { status: 404 });
  if (score.uploadedBy !== session.user.id) {
    return new Response("Nemáš oprávnění", { status: 403 });
  }

  await db.delete(favorites).where(eq(favorites.scoreId, scoreId));
  await db.delete(scores).where(eq(scores.id, scoreId));

  if (score.fileUrl) {
    try {
      await unlink(path.join(process.cwd(), "uploads", path.basename(score.fileUrl)));
    } catch {}
  }

  return NextResponse.redirect(new URL("/profil", req.url), 303);
}
