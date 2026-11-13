"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  const label = dark ? "Světlý režim" : "Tmavý režim";
  const Icon = dark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="group inline-flex h-9 flex-row-reverse items-center rounded-md bg-foreground px-2.5 text-background transition-colors hover:bg-foreground/80 focus-visible:bg-foreground/80"
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-300 ease-out group-hover:mr-2 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        {label}
      </span>
    </button>
  );
}
