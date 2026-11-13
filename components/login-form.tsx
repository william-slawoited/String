"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.username({
      username,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Přihlášení se nezdařilo.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex justify-center p-6 pt-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Přihlášení</CardTitle>
          <CardDescription>Vítej zpět na String.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Uživatelské jméno</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="bg-foreground text-background hover:bg-foreground/80">
              {loading ? "Přihlašuji..." : "Přihlásit se"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Nemáš účet?{" "}
              <Link href="/registrace" className="underline">
                Zaregistruj se
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
