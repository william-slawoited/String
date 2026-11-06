import Link from "next/link";
import { headers } from "next/headers";
import {
  CalendarCheck,
  LogIn,
  Search,
  Upload,
  User,
  UserPlus,
} from "lucide-react";
import { auth } from "@/lib/auth";

function NavItem({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group inline-flex h-9 items-center rounded-md bg-black px-2.5 text-white transition-colors hover:bg-black/80 focus-visible:bg-black/80"
    >
      {children}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}

export async function SiteHeader() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <header className="flex items-center gap-4 border-b px-4 py-3 sm:px-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        String
      </Link>
      <nav aria-label="Hlavní navigace" className="flex items-center gap-2">
        <NavItem href="/hledat" label="Hledat noty">
          <Search className="h-4 w-4 shrink-0" />
        </NavItem>
        {session && (
          <NavItem href="/nahrat" label="Nahrát noty">
            <Upload className="h-4 w-4 shrink-0" />
          </NavItem>
        )}
        <NavItem href="/vyzva" label="Daily Challenge">
          <CalendarCheck className="h-4 w-4 shrink-0" />
        </NavItem>
        <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />
        {session ? (
          <NavItem href="/profil" label="Můj profil">
            <User className="h-4 w-4 shrink-0" />
          </NavItem>
        ) : (
          <>
            <NavItem href="/prihlaseni" label="Přihlásit se">
              <LogIn className="h-4 w-4 shrink-0" />
            </NavItem>
            <NavItem href="/registrace" label="Registrace">
              <UserPlus className="h-4 w-4 shrink-0" />
            </NavItem>
          </>
        )}
      </nav>
    </header>
  );
}
