import Link from "next/link";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { scores } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";

export const instant = false;

const blackButton = "bg-black text-white hover:bg-black/80";

const tasks = [
  "Zahraj skladbu pomalu, o polovinu pod původním tempem, a drž rovnoměrný rytmus.",
  "Vyber jednu nejtěžší pasáž a procvičuj ji 10 minut po taktech.",
  "Zahraj skladbu s metronomem a po každém bezchybném průchodu zrychli o 4 údery.",
  "Zahraj celou skladbu bez zastavení, i když se spleteš.",
  "Zahraj první polovinu zpaměti, jen s občasným nahlédnutím do not.",
  "Soustřeď se jen na dynamiku: výrazně odliš tiché a hlasité místa.",
  "Nahraj se na telefon a poslechni si, kde se ti zadrhává rytmus.",
];

export default async function VyzvaPage() {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Europe/Prague",
  });
  const [y, m, d] = today.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86400000);

  const [{ total }] = await db.select({ total: count() }).from(scores);
  const rows =
    total > 0
      ? await db
          .select()
          .from(scores)
          .orderBy(scores.id)
          .limit(1)
          .offset(day % total)
      : [];
  const score = rows[0];
  const task = tasks[day % tasks.length];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Challenge</h1>
          <p className="text-muted-foreground">
            Výzva na {d}. {m}. {y}. Nová přijde zítra.
          </p>
        </div>

        {score ? (
          <div className="flex flex-col gap-4 rounded-lg border p-6">
            <div>
              <p className="text-sm text-muted-foreground">Skladba dne</p>
              <h2 className="text-2xl font-semibold">{score.title}</h2>
              <p className="text-muted-foreground">
                {[score.composer, score.instrument, score.genre]
                  .filter(Boolean)
                  .join(" · ") || "Bez dalších údajů"}
                {score.difficulty ? ` · obtížnost ${score.difficulty}/5` : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dnešní úkol</p>
              <p className="text-lg">{task}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/noty/${score.id}`}
                className={buttonVariants({ className: blackButton })}
              >
                Otevřít skladbu
              </Link>
              <a
                href={`/noty/${score.id}/soubor`}
                download
                className={buttonVariants({ variant: "outline" })}
              >
                Stáhnout PDF
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Zatím nejsou nahrané žádné noty, výzva se objeví po nahrání první
            skladby.
          </p>
        )}
      </main>
    </>
  );
}
