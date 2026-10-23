import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const instant = false;

export default async function ProfilPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/prihlaseni");
  }

  const { user } = session;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>Tvůj profil na String</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Oblíbené noty</p>
            <p className="text-sm">Zatím žádné.</p>
          </div>
          <LogoutButton />
        </CardContent>
      </Card>
    </main>
  );
}
