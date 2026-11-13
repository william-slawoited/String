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

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: username,
      username,
    });

    setLoading(false);

    if (error) {
      setError(error.message ?? "Registrace se nezdařila.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex justify-center p-6 pt-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Registrace</CardTitle>
          <CardDescription>Vytvoř si účet na String.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Uživatelské jméno</Label>
              <Input
                id="username"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Heslo (min. 8 znaků)</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="bg-foreground text-background hover:bg-foreground/80">
              {loading ? "Vytvářím účet..." : "Zaregistrovat se"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Už máš účet?{" "}
              <Link href="/prihlaseni" className="underline">
                Přihlas se
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
