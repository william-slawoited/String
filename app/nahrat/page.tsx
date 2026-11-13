import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
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

export default async function NahratPage({
  searchParams,
}: {
  searchParams: Promise<{ chyba?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/prihlaseni");

  const { chyba } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="flex justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Nahrát noty</CardTitle>
            <CardDescription>
              PDF s notami, nebo soubor Guitar Pro s přehrávačem (max. 10 MB).
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <Label htmlFor="composer">Skladatel / interpret</Label>
                <Input id="composer" name="composer" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="instrument">Nástroj</Label>
                <Input id="instrument" name="instrument" placeholder="např. kytara" />
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
                  className="h-9 rounded-md border bg-transparent px-3 text-sm"
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
                <Label htmlFor="file">Soubor (PDF, .gp, .gp3, .gp4, .gp5, .gpx)</Label>
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
                  Potvrzuji, že mám právo tento soubor sdílet (vlastní tvorba
                  nebo volné dílo).
                </span>
              </label>
              {chyba && <p className="text-sm text-red-600">{chyba}</p>}
              <Button type="submit" className="bg-foreground text-background hover:bg-foreground/80">
                Nahrát
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
