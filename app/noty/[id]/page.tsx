import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { favorites, scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { GuitarProViewer } from "@/components/guitar-pro-viewer";
import { buttonVariants } from "@/components/ui/button";

export const instant = false;

const blackButton = "bg-black text-white hover:bg-black/80";

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

  const isPdf = (score.fileUrl ?? "").toLowerCase().endsWith(".pdf");

  const session = await auth.api.getSession({ headers: await headers() });
  let isFavorite = false;
  if (session) {
    const [fav] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, session.user.id),
          eq(favorites.scoreId, scoreId)
        )
      )
      .limit(1);
    isFavorite = !!fav;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
        <Link href="/hledat" className="text-sm underline">
          ← Zpět na vyhledávání
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{score.title}</h1>
          <p className="text-muted-foreground">
            {score.composer ?? "Neznámý autor"}
          </p>
        </div>
        <dl className="grid max-w-md grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Nástroj</dt>
          <dd>{score.instrument ?? "–"}</dd>
          <dt className="text-muted-foreground">Žánr</dt>
          <dd>{score.genre ?? "–"}</dd>
          <dt className="text-muted-foreground">Obtížnost</dt>
          <dd>{score.difficulty ? `${score.difficulty} / 5` : "–"}</dd>
        </dl>
        <div className="flex flex-wrap gap-3">
          <a
            href={`/noty/${score.id}/soubor`}
            download
            className={buttonVariants({ className: blackButton })}
          >
            Stáhnout soubor
          </a>
          {session && (
            <form action={`/api/oblibene/${score.id}`} method="post">
              <button
                type="submit"
                className={buttonVariants({ variant: "outline" })}
              >
                {isFavorite ? "♥ Odebrat z oblíbených" : "♡ Přidat do oblíbených"}
              </button>
            </form>
          )}
        </div>

        {isPdf ? (
          <iframe
            src={`/noty/${score.id}/soubor`}
            title={`Noty: ${score.title}`}
            className="h-[80vh] w-full rounded-lg border"
          />
        ) : (
          <GuitarProViewer fileUrl={`/noty/${score.id}/soubor`} />
        )}
      </main>
    </>
  );
}
