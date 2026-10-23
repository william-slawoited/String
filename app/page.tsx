import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const blackButton = "bg-black text-white hover:bg-black/80";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
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

      <h1 className="text-5xl font-bold tracking-tight">String</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Noty a taby pro hudebníky na jednom místě. Bez zdlouhavého hledání.
      </p>

      <Link
        href="/hledat"
        className={buttonVariants({
          size: "lg",
          className: `h-14 w-full max-w-sm px-10 text-lg ${blackButton}`,
        })}
      >
        Vyhledat noty
      </Link>
    </main>
  );
}