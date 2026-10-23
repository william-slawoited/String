import Link from "next/link";
import { scores } from "@/db/schema";

type Score = typeof scores.$inferSelect;

export function ScoreList({ items }: { items: Score[] }) {
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
          <a
            href={`/noty/${s.id}/soubor`}
            download
            className="shrink-0 text-sm underline"
          >
            Stáhnout
          </a>
        </li>
      ))}
    </ul>
  );
}
