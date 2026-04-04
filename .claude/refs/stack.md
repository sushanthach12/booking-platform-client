# Tech Stack

| Concern           | Library / tool                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Framework         | Next.js 16.1.4 (App Router only — no `pages/`)                                            |
| React             | 19.2.3                                                                                    |
| Language          | TypeScript 5.x, `strict: true`                                                            |
| Package manager   | pnpm (`pnpm-lock.yaml`)                                                                   |
| Styling           | Tailwind CSS v4 (CSS-first, `@import "tailwindcss"` in `globals.css`) + `tw-animate-css`  |
| UI kit            | shadcn/ui-style — style: new-york, baseColor: zinc, cssVariables: true                    |
| Icons             | `lucide-react`                                                                            |
| Primitives        | `radix-ui` umbrella + scoped `@radix-ui/react-*`                                          |
| Variants          | `class-variance-authority` (CVA), `clsx`, `tailwind-merge` → `cn()` in `src/lib/utils.ts` |
| Dates             | `date-fns` + `react-day-picker`                                                           |
| Global state      | Redux Toolkit + redux-saga (`search`, `upload` slices)                                    |
| DI                | tsyringe + `reflect-metadata` (decorators enabled)                                        |
| Fonts             | `Fraunces` (`--font-display`) + `Poppins` (`--font-sans`) via `next/font/google`          |
| Images            | External: `images.unsplash.com` only (configured in `next.config.ts`)                     |
| URL serialization | `query-string` ^9                                                                         |
| Resizable panels  | `react-resizable-panels` ^4                                                               |
| **Not used**      | React Query, Axios, Zod, yup, react-hook-form, Prisma, Drizzle, NextAuth                  |
