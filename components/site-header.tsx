import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

const blackButton = "bg-black text-white hover:bg-black/80";

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        String
      </Link>
      <nav className="flex flex-wrap gap-2">
        <Link href="/hledat" className={buttonVariants({ className: blackButton })}>
          Hledat noty
        </Link>
        <Link href="/vyzva" className={buttonVariants({ className: blackButton })}>
          Daily Challenge
        </Link>
        {session ? (
          <>
            <Link href="/nahrat" className={buttonVariants({ className: blackButton })}>
              Nahrát noty
            </Link>
            <Link href="/profil" className={buttonVariants({ className: blackButton })}>
              Můj profil
            </Link>
          </>
        ) : (
          <>
            <Link href="/prihlaseni" className={buttonVariants({ className: blackButton })}>
              Přihlásit se
            </Link>
            <Link href="/registrace" className={buttonVariants({ className: blackButton })}>
              Registrace
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
