import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Send, Upload } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { artists } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const instant = false;

const selectClass =
  "h-9 rounded-md border bg-background px-3 text-sm text-foreground";

export default async function NahratPage({
  searchParams,
}: {
  searchParams: Promise<{ chyba?: string; info?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/prihlaseni");

  const { chyba, info } = await searchParams;
  const verified = await db
    .select()
    .from(artists)
    .where(eq(artists.verified, true))
    .orderBy(asc(artists.name));

  return (
    <>
      <SiteHeader />
      <main className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Nahrát noty</CardTitle>
            <CardDescription>
              PDF nebo Guitar Pro, max. 10 MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <form
              action="/api/noty"
              method="post"
              encType="multipart/form-data"
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Název skladby</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="artistId">Interpret</Label>
                <select
                  id="artistId"
                  name="artistId"
                  required
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    Vyber interpreta
                  </option>
                  {verified.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                {verified.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Zatím nejsou žádní ověření interpreti.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="genre">Žánr</Label>
                <Input id="genre" name="genre" placeholder="např. rock" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="difficulty">Obtížnost</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className={selectClass}
                  defaultValue=""
                >
                  <option value="">Neuvedeno</option>
                  <option value="1">1 – velmi snadná</option>
                  <option value="2">2 – snadná</option>
                  <option value="3">3 – střední</option>
                  <option value="4">4 – těžká</option>
                  <option value="5">5 – velmi těžká</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="file">Soubor</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.gp,.gp3,.gp4,.gp5,.gpx"
                  required
                />
              </div>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="rights" className="mt-1" />
                <span>
                  Mám právo tento soubor sdílet (vlastní tvorba nebo volné dílo).
                </span>
              </label>
              {chyba && <p className="text-sm text-red-600">{chyba}</p>}
              <button
                type="submit"
                title="Nahrát"
                aria-label="Nahrát"
                className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-background hover:bg-foreground/80"
              >
                <Upload className="h-4 w-4" />
              </button>
            </form>

            <form
              action="/api/interpreti"
              method="post"
              className="flex flex-col gap-2 border-t pt-4"
            >
              <Label htmlFor="suggest">Interpret chybí? Navrhni ho</Label>
              <div className="flex gap-2">
                <Input
                  id="suggest"
                  name="name"
                  required
                  maxLength={100}
                  placeholder="Jméno interpreta"
                />
                <button
                  type="submit"
                  title="Odeslat návrh"
                  aria-label="Odeslat návrh"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border hover:bg-foreground/10"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {info && <p className="text-sm text-muted-foreground">{info}</p>}
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
