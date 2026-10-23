import type { SQL } from "drizzle-orm";
import { and, desc, like, or } from "drizzle-orm";
import { db } from "@/db";
import { scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { ScoreList } from "@/components/score-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const instant = false;

export default async function HledatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; nastroj?: string }>;
}) {
  const { q, nastroj } = await searchParams;
  const term = q?.trim() ?? "";
  const instrument = nastroj?.trim() ?? "";

  const conditions: (SQL | undefined)[] = [];
  if (term) {
    const p = `%${term}%`;
    conditions.push(
      or(like(scores.title, p), like(scores.composer, p), like(scores.genre, p))
    );
  }
  if (instrument) {
    conditions.push(like(scores.instrument, `%${instrument}%`));
  }

  const rows = await db
    .select()
    .from(scores)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(scores.createdAt));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Hledat noty</h1>
        <form action="/hledat" className="flex flex-col gap-2 sm:flex-row">
          <Input name="q" defaultValue={term} placeholder="Název, skladatel, žánr…" />
          <Input name="nastroj" defaultValue={instrument} placeholder="Nástroj" className="sm:max-w-40" />
          <Button type="submit" className="bg-black text-white hover:bg-black/80">
            Hledat
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">Nalezeno: {rows.length}</p>
        <ScoreList items={rows} />
      </main>
    </>
  );
}
