# Styling Guide

## Tailwind v4 — CSS-first

**No `tailwind.config.*` file.** Configuration is entirely in `src/app/globals.css`.

```css
@import "tailwindcss"; /* v4 entry */
@import "tw-animate-css";
```

## Design Tokens (defined in `globals.css` `:root`)

| Token             | Purpose             |
| ----------------- | ------------------- |
| `--primary`       | Brand primary color |
| `--radius`        | Base border radius  |
| `--header-height` | Fixed header height |
| sidebar tokens    | Sidebar dimensions  |
| chart tokens      | Chart color palette |

## Dark Mode

```css
@custom-variant dark (.dark); /* class strategy, not media query */
```

Toggle by adding/removing `.dark` class on `<html>`.

## Key Syntax Changes (v4 vs v3)

| Use this (v4)                  | Not this (v3)                        |
| ------------------------------ | ------------------------------------ |
| `bg-linear-to-r`               | `bg-gradient-to-r`                   |
| CSS variables in `globals.css` | `tailwind.config.ts` theme extension |

## Utility Helper

```typescript
import { cn } from "@/lib/utils";
// cn() = clsx() + tailwind-merge
```

Always use `cn()` for conditional or merged class strings — never string concatenation.

## Fonts

- `--font-display` → `Fraunces` (headings)
- `--font-sans` → `Poppins` (body)
  Both loaded via `next/font/google` in `src/app/layout.tsx`.

## Shadcn Components

Live in `src/components/ui/` — new-york style, zinc base, CSS variables.
Extend via CVA variants. Never override inline — add a variant instead.

## Responsive Breakpoints

Standard Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`.
