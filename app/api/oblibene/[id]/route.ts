import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
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
    .select({ id: scores.id })
    .from(scores)
    .where(eq(scores.id, scoreId))
    .limit(1);
  if (!score) return new Response("Nenalezeno", { status: 404 });

  const where = and(
    eq(favorites.userId, session.user.id),
    eq(favorites.scoreId, scoreId)
  );
  const [existing] = await db.select().from(favorites).where(where).limit(1);

  if (existing) {
    await db.delete(favorites).where(where);
  } else {
    await db.insert(favorites).values({ userId: session.user.id, scoreId });
  }

  return NextResponse.redirect(new URL(`/noty/${scoreId}`, req.url), 303);
}
