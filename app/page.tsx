import { Button } from "@/components/ui/button";
 
export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <Button className="bg-black text-white hover:bg-black/80">
          Přihlásit se
        </Button>
      </div>
 
      <h1 className="text-5xl font-bold tracking-tight">String</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Noty a taby pro hudebníky na jednom místě. Bez zdlouhavého hledání.
      </p>
 
      <Button size="lg" className="h-14 w-full max-w-sm bg-black px-10 text-lg text-white hover:bg-black/80">
        Vyhledat noty
      </Button>
    </main>
  );
}
 