"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface Country {
  /** ISO 3166-1 alpha-2 code — unique select key (dial codes can collide, e.g. US/CA). */
  iso: string;
  name: string;
  dialCode: string;
  /** Regional-indicator emoji flag. */
  flag: string;
}

/** Common dial codes, India first. Extend as needed. */
const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso: "NP", name: "Nepal", dialCode: "+977", flag: "🇳🇵" },
];

const DEFAULT_ISO = "IN";

/**
 * Splits a stored phone string (e.g. `"+91 98765 43210"`) into its dialing
 * country and the national portion. Falls back to the default country when no
 * known dial code prefixes the value.
 */
function splitPhone(raw: string): { iso: string; national: string } {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return { iso: DEFAULT_ISO, national: "" };

  // Longest dial code first so "+1" doesn't shadow "+91" etc.
  const match = [...COUNTRIES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((c) => trimmed.startsWith(c.dialCode));

  if (match) {
    return { iso: match.iso, national: trimmed.slice(match.dialCode.length).trim() };
  }
  return { iso: DEFAULT_ISO, national: trimmed.replace(/^\+/, "").trim() };
}

export interface PhoneInputProps {
  /** Full phone string, e.g. `"+91 9876543210"`. */
  value: string;
  /** Fires with the recombined full string whenever code or number changes. */
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Phone field with a country-code selector (flag + dial code) and a national
 * number input. Emits a single combined string so callers store one value.
 */
export function PhoneInput({
  value,
  onChange,
  id,
  placeholder = "98765 43210",
  className,
  disabled,
}: PhoneInputProps) {
  const initial = useMemo(() => splitPhone(value), [value]);
  const [iso, setIso] = useState(initial.iso);
  const [national, setNational] = useState(initial.national);

  const country =
    COUNTRIES.find((c) => c.iso === iso) ??
    COUNTRIES.find((c) => c.iso === DEFAULT_ISO)!;

  const emit = (nextIso: string, nextNational: string) => {
    const dial = COUNTRIES.find((c) => c.iso === nextIso)?.dialCode ?? "";
    const digits = nextNational.trim();
    onChange(digits ? `${dial} ${digits}` : "");
  };

  const handleCountry = (nextIso: string) => {
    setIso(nextIso);
    emit(nextIso, national);
  };

  const handleNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only phone-meaningful characters.
    const cleaned = e.target.value.replace(/[^\d\s-]/g, "");
    setNational(cleaned);
    emit(iso, cleaned);
  };

  return (
    <div
      className={cn(
        "flex h-10 items-stretch rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        disabled && "opacity-50",
        className,
      )}
    >
      <Select value={iso} onValueChange={handleCountry} disabled={disabled}>
        <SelectTrigger
          aria-label="Country code"
          className="h-full w-fit gap-1 rounded-l-md rounded-r-none border-0 border-r border-input bg-transparent px-2.5 shadow-none focus-visible:ring-0"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-base leading-none">{country.flag}</span>
            <span className="text-sm font-medium text-foreground">
              {country.dialCode}
            </span>
          </span>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {COUNTRIES.map((c) => (
            <SelectItem key={c.iso} value={c.iso}>
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{c.flag}</span>
                <span className="text-sm">{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.dialCode}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={national}
        onChange={handleNumber}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-r-md bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
