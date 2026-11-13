import { Send } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const instant = false;

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{ odeslano?: string; chyba?: string }>;
}) {
  const { odeslano, chyba } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Kontakt</h1>
        {odeslano ? (
          <p className="rounded-lg border p-4 text-sm">Zpráva odeslána, díky.</p>
        ) : (
          <form action="/api/kontakt" method="post" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Jméno</Label>
              <Input id="name" name="name" required maxLength={100} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required maxLength={200} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Zpráva</Label>
              <textarea
                id="message"
                name="message"
                required
                maxLength={2000}
                rows={5}
                className="rounded-md border bg-transparent px-3 py-2 text-sm"
              />
            </div>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            {chyba && <p className="text-sm text-red-600">{chyba}</p>}
            <button
              type="submit"
              title="Odeslat"
              aria-label="Odeslat"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-background hover:bg-foreground/80"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </main>
    </>
  );
}
