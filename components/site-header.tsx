import Link from "next/link";
import { headers } from "next/headers";
import {
  CalendarCheck,
  LogIn,
  Mail,
  Search,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";

const iconButton = buttonVariants({
  size: "icon",
  className: "bg-black text-white hover:bg-black/80",
});

function NavIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} title={label} aria-label={label} className={iconButton}>
      {children}
    </Link>
  );
}

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        String
      </Link>
      <nav className="flex items-center gap-2">
        <NavIcon href="/hledat" label="Hledat noty">
          <Search className="h-4 w-4" />
        </NavIcon>
        <NavIcon href="/vyzva" label="Daily Challenge">
          <CalendarCheck className="h-4 w-4" />
        </NavIcon>
        <NavIcon href="/kontakt" label="Kontakt">
          <Mail className="h-4 w-4" />
        </NavIcon>
        {session ? (
          <>
            <NavIcon href="/nahrat" label="Nahrát noty">
              <Upload className="h-4 w-4" />
            </NavIcon>
            <NavIcon href="/profil" label="Můj profil">
              <User className="h-4 w-4" />
            </NavIcon>
          </>
        ) : (
          <>
            <NavIcon href="/prihlaseni" label="Přihlásit se">
              <LogIn className="h-4 w-4" />
            </NavIcon>
            <NavIcon href="/registrace" label="Registrace">
              <UserPlus className="h-4 w-4" />
            </NavIcon>
          </>
        )}
      </nav>
    </header>
  );
}
