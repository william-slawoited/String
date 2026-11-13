import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import { BadgeCheck, Check, Clock, Plus, Trash2, X } from "lucide-react";
import { getAdminSession } from "@/lib/admin";
import { db } from "@/db";
import { artists } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";

export const instant = false;

function Action({
  id,
  action,
  label,
  children,
}: {
  id: number;
  action: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <form action="/api/admin/interpreti" method="post">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button
        type="submit"
        title={label}
        aria-label={label}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-foreground/10"
      >
        {children}
      </button>
    </form>
  );
}

export default async function AdminInterpretiPage({
  searchParams,
}: {
  searchParams: Promise<{ chyba?: string }>;
}) {
  if (!(await getAdminSession())) notFound();

  const { chyba } = await searchParams;
  const rows = await db
    .select()
    .from(artists)
    .orderBy(asc(artists.verified), asc(artists.name));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Interpreti</h1>

        <form
          action="/api/admin/interpreti"
          method="post"
          className="flex gap-2"
        >
          <input type="hidden" name="action" value="add" />
          <Input name="name" placeholder="Nový interpret" required maxLength={100} />
          <button
            type="submit"
            title="Přidat ověřeného interpreta"
            aria-label="Přidat ověřeného interpreta"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background hover:bg-foreground/80"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        {chyba && <p className="text-sm text-red-600">{chyba}</p>}

        <ul className="flex flex-col gap-2">
          {rows.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                {a.verified ? (
                  <BadgeCheck
                    className="h-4 w-4 shrink-0"
                    aria-label="Ověřený"
                  />
                ) : (
                  <Clock
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-label="Čeká na ověření"
                  />
                )}
                <span className="truncate">{a.name}</span>
              </div>
              <div className="flex shrink-0 gap-2">
                {a.verified ? (
                  <Action id={a.id} action="unverify" label="Zrušit ověření">
                    <X className="h-4 w-4" />
                  </Action>
                ) : (
                  <Action id={a.id} action="verify" label="Ověřit">
                    <Check className="h-4 w-4" />
                  </Action>
                )}
                <Action id={a.id} action="delete" label="Smazat">
                  <Trash2 className="h-4 w-4" />
                </Action>
              </div>
            </li>
          ))}
          {rows.length === 0 && (
            <li className="text-sm text-muted-foreground">Zatím nikdo.</li>
          )}
        </ul>
      </main>
    </>
  );
}
