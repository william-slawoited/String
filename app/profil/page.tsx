import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { favorites, scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { ScoreList } from "@/components/score-list";
import { LogoutButton } from "@/components/logout-button";

export const instant = false;

export default async function ProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/prihlaseni");

  const { user } = session;

  const mine = await db
    .select()
    .from(scores)
    .where(eq(scores.uploadedBy, user.id))
    .orderBy(desc(scores.createdAt));

  const favRows = await db
    .select({ score: scores })
    .from(favorites)
    .innerJoin(scores, eq(favorites.scoreId, scores.id))
    .where(eq(favorites.userId, user.id));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
        <section className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Oblíbené noty</h2>
          <ScoreList items={favRows.map((f) => f.score)} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Moje nahrané noty</h2>
          <ScoreList items={mine} deletable />
        </section>

        <div>
          <LogoutButton />
        </div>
      </main>
    </>
  );
}
