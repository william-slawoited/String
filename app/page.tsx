import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

export const instant = false;

const blackButton = "bg-black text-white hover:bg-black/80";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      {!session && (
        <div className="absolute right-4 top-4 flex gap-2 sm:right-6 sm:top-6">
          <Link
            href="/prihlaseni"
            className={buttonVariants({ className: blackButton })}
          >
            Přihlásit se
          </Link>
          <Link
            href="/registrace"
            className={buttonVariants({ className: blackButton })}
          >
            Registrace
          </Link>
        </div>
      )}

      <h1 className="text-5xl font-bold tracking-tight">String</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Noty a taby pro hudebníky na jednom místě. Bez zdlouhavého hledání.
      </p>

      {session ? (
        <div className="flex gap-3">
          <Link
            href="/hledat"
            className={buttonVariants({
              size: "lg",
              className: blackButton,
            })}
          >
            Hledat noty
          </Link>
          <Link
            href="/profil"
            className={buttonVariants({
              size: "lg",
              className: blackButton,
            })}
          >
            Můj profil
          </Link>
        </div>
      ) : (
        <Link
          href="/hledat"
          className={buttonVariants({
            size: "lg",
            className: `h-14 w-full max-w-sm px-10 text-lg ${blackButton}`,
          })}
        >
          Vyhledat noty
        </Link>
      )}
    </main>
  );
}
