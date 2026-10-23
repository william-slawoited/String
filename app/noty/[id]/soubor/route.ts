import { readFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { scores } from "@/db/schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  if (!score?.fileUrl) return new Response("Nenalezeno", { status: 404 });

  try {
    const file = await readFile(
      path.join(process.cwd(), "uploads", path.basename(score.fileUrl))
    );
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${score.id}.pdf"`,
      },
    });
  } catch {
    return new Response("Soubor chybí", { status: 404 });
  }
}
