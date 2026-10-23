import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">String</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Noty a taby pro hudebníky na jednom místě. Bez zdlouhavého hledání.
      </p>
      <div className="flex gap-3">
        {session ? (
          <Link href="/profil" className={buttonVariants()}>
            Můj profil
          </Link>
        ) : (
          <>
            <Link href="/prihlaseni" className={buttonVariants()}>
              Přihlásit se
            </Link>
            <Link
              href="/registrace"
              className={buttonVariants({ variant: "outline" })}
            >
              Registrace
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
