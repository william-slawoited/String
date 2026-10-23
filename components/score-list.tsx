import Link from "next/link";
import { scores } from "@/db/schema";
import { DeleteScoreButton } from "@/components/delete-score-button";

type Score = typeof scores.$inferSelect;

export function ScoreList({
  items,
  deletable = false,
}: {
  items: Score[];
  deletable?: boolean;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Zatím tu nic není.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((s) => (
        <li
          key={s.id}
          className="flex items-center justify-between gap-4 rounded-lg border p-4"
        >
          <div className="min-w-0">
            <Link href={`/noty/${s.id}`} className="font-medium hover:underline">
              {s.title}
            </Link>
            <p className="truncate text-sm text-muted-foreground">
              {[s.composer, s.instrument, s.genre].filter(Boolean).join(" · ") || "Bez dalších údajů"}
              {s.difficulty ? ` · obtížnost ${s.difficulty}/5` : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <a href={`/noty/${s.id}/soubor`} download className="text-sm underline">
              Stáhnout
            </a>
            {deletable && <DeleteScoreButton id={s.id} title={s.title} />}
          </div>
        </li>
      ))}
    </ul>
  );
}
