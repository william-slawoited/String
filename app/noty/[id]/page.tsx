import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";

export const instant = false;

export default async function NotyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scoreId = Number(id);
  if (!Number.isInteger(scoreId)) notFound();

  const [score] = await db
    .select()
    .from(scores)
    .where(eq(scores.id, scoreId))
    .limit(1);
  if (!score) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
        <Link href="/hledat" className="text-sm underline">
          ← Zpět na vyhledávání
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{score.title}</h1>
          <p className="text-muted-foreground">{score.composer ?? "Neznámý autor"}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Nástroj</dt>
          <dd>{score.instrument ?? "–"}</dd>
          <dt className="text-muted-foreground">Žánr</dt>
          <dd>{score.genre ?? "–"}</dd>
          <dt className="text-muted-foreground">Obtížnost</dt>
          <dd>{score.difficulty ? `${score.difficulty} / 5` : "–"}</dd>
        </dl>
        <div>
          <a
            href={`/noty/${score.id}/soubor`}
            download
            className={buttonVariants({ className: "bg-black text-white hover:bg-black/80" })}
          >
            Stáhnout PDF
          </a>
        </div>
      </main>
    </>
  );
}
