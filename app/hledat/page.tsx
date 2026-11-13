import type { SQL } from "drizzle-orm";
import { desc, like, or } from "drizzle-orm";
import { Search } from "lucide-react";
import { db } from "@/db";
import { scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { ScoreList } from "@/components/score-list";
import { Input } from "@/components/ui/input";

export const instant = false;

export default async function HledatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";

  let condition: SQL | undefined;
  if (term) {
    const p = `%${term}%`;
    condition = or(
      like(scores.title, p),
      like(scores.composer, p),
      like(scores.genre, p)
    );
  }

  const rows = await db
    .select()
    .from(scores)
    .where(condition)
    .orderBy(desc(scores.createdAt));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Hledat noty</h1>
        <form action="/hledat" className="flex gap-2">
          <Input name="q" defaultValue={term} placeholder="Název, interpret, žánr…" />
          <button
            type="submit"
            title="Hledat"
            aria-label="Hledat"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/80"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
        <p className="text-sm text-muted-foreground">Nalezeno: {rows.length}</p>
        <ScoreList items={rows} />
      </main>
    </>
  );
}
