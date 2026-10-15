import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">String</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Noty a taby pro hudebníky na jednom místě. Bez zdlouhavého hledání.
      </p>
      <div className="flex gap-3">
        <Button>Přihlásit se</Button>
        <Button variant="outline">Vyhledat noty</Button>
      </div>
    </main>
  );
}