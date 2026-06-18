"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const [current, setCurrent] = useState("en");
  const currentLang = LANGUAGES.find((l) => l.code === current)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={
            className ??
            "flex items-center gap-1.5 h-9 px-3 rounded-full border border-border hover:border-primary/40 hover:bg-primary-subtle data-[state=open]:border-primary/40 transition-all duration-150 outline-none"
          }
          aria-label="Select language"
        >
          <Globe className="size-3.5 text-foreground shrink-0" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            {currentLang.code}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 p-1.5 rounded-xl border border-border shadow-[0_8px_30px_rgba(61,111,142,0.12)]"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setCurrent(lang.code)}
            className={`rounded-lg cursor-pointer px-3 py-2.5 text-sm transition-colors ${
              current === lang.code
                ? "text-primary font-semibold bg-primary-subtle"
                : "text-foreground focus:bg-primary-subtle focus:text-primary"
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
