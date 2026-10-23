import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { scores } from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{score.title}</CardTitle>
          <CardDescription>{score.composer ?? "Neznámý autor"}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-muted-foreground">Nástroj</dt>
            <dd>{score.instrument ?? "–"}</dd>
            <dt className="text-muted-foreground">Žánr</dt>
            <dd>{score.genre ?? "–"}</dd>
            <dt className="text-muted-foreground">Obtížnost</dt>
            <dd>{score.difficulty ? `${score.difficulty} / 5` : "–"}</dd>
          </dl>
          <a
            href={`/noty/${score.id}/soubor`}
            download
            className={buttonVariants()}
          >
            Stáhnout PDF
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
