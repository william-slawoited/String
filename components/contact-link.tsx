import Link from "next/link";
import { Mail } from "lucide-react";

export function ContactLink() {
  return (
    <Link
      href="/kontakt"
      aria-label="Kontakt"
      className="group fixed bottom-4 left-4 z-50 inline-flex h-9 items-center rounded-md bg-foreground px-2.5 text-background shadow transition-colors hover:bg-foreground/80 focus-visible:bg-foreground/80"
    >
      <Mail className="h-4 w-4 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        Kontakt
      </span>
    </Link>
  );
}
