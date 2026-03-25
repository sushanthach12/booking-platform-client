# Next.js Coding Rules

> These rules apply to every file in this project. Follow them in all code you write,
> review, or refactor. No exceptions without explicit discussion.

---

## 1. Data Flow — One Direction, Always

Data flows **down** through props and **up** through callbacks or events. Never sideways.

```
Server / External API
        ↓
  Server Components  (fetch, transform, pass as props)
        ↓
  Client Components  (receive props, render, dispatch user actions)
        ↓
  State / Store      (only for cross-cutting UI state — NOT server data)
```

**Rules:**

- Server Components own data fetching. Never fetch in a Client Component what a Server
  Component above it can fetch and pass down.
- Props are the primary data channel between components. If you find yourself reaching
  for a store to share something that could be a prop, use the prop.
- Client Components receive data as props. They do not initiate data fetches unless the
  fetch is triggered by a user interaction (search, pagination, form submit).

---

## 2. `useEffect` — Last Resort, Not First Instinct

`useEffect` is the escape hatch for synchronizing with external systems (DOM APIs,
subscriptions, timers). It is **not** for data derivation, data fetching, or reacting
to state changes that could be handled by derived values or event handlers.

### ❌ Never use `useEffect` for:

```tsx
// Deriving state from props — use useMemo or compute inline
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Fetching data on mount in a Client Component — use Server Component or TanStack Query
useEffect(() => {
  fetch('/api/users')
    .then((r) => r.json())
    .then(setUsers);
}, []);

// Reacting to a state change — use the event handler that caused the change
useEffect(() => {
  if (isOpen) doSomething();
}, [isOpen]);

// Syncing two pieces of state — derive one from the other
useEffect(() => {
  setIsValid(email.includes('@'));
}, [email]);
```

### ✅ Acceptable `useEffect` uses:

```tsx
// Subscribing to an external store / event emitter
useEffect(() => {
  const sub = externalStore.subscribe(handler);
  return () => sub.unsubscribe();
}, []);

// Setting up a third-party DOM library (chart, map, editor)
useEffect(() => {
  const chart = new ChartLib(ref.current, options);
  return () => chart.destroy();
}, []);

// Browser-only APIs that cannot run on the server
useEffect(() => {
  document.title = pageTitle;
}, [pageTitle]);
```

### Decision tree before writing `useEffect`:

1. Can this be computed from existing state/props inline or with `useMemo`? → Do that.
2. Can this logic live in the event handler that triggers the change? → Do that.
3. Can the data come from the Server Component above? → Do that.
4. Is this genuinely synchronising with an external system? → `useEffect` is acceptable.

---

## 3. Component Architecture

### Layer your components — never mix concerns

| Layer                        | Purpose                     | Rules                                                   |
| ---------------------------- | --------------------------- | ------------------------------------------------------- |
| **Page** (`app/**/page.tsx`) | Route entry, data fetching  | Server Component only. No interactivity.                |
| **Layout** (`layout.tsx`)    | Persistent shell            | Server Component. No data fetching beyond session/user. |
| **Feature**                  | Self-contained domain slice | Can be client or server. Owns its sub-tree.             |
| **UI / Primitive**           | Pure presentational         | Always client-safe. No data fetching, no store access.  |

### Rules:

- A `page.tsx` is always a Server Component. It fetches data, transforms it, and passes
  it to Feature components as props.
- Feature components can be Server or Client. Decide based on whether they need event
  handlers, browser APIs, or hooks. Default to Server; opt into Client only when needed.
- UI/primitive components (`components/ui/`) are pure: given the same props, they render
  the same output. No side effects, no store reads.
- `"use client"` is a boundary, not a default. Add it only to the component that
  genuinely needs it. Children that don't need it should remain server-renderable.

### File structure per feature:

```
src/
├── app/
│   └── (feature)/
│       ├── page.tsx              # Server Component — fetch + compose
│       └── [id]/
│           └── page.tsx
├── features/
│   └── [feature-name]/
│       ├── components/           # Feature-specific components
│       │   ├── [Feature]List.tsx
│       │   └── [Feature]Card.tsx
│       ├── hooks/                # Feature-specific hooks
│       │   └── use[Feature].ts
│       ├── actions/              # Server Actions for this feature
│       │   └── [feature].actions.ts
│       ├── types.ts              # Types local to this feature
│       └── utils.ts              # Pure helper functions
├── components/
│   └── ui/                       # Shared primitives (Button, Input, Modal…)
└── lib/
    ├── db.ts                     # DB client singleton
    └── auth.ts                   # Auth helpers
```

---

## 4. State Management

### What belongs where

| State type          | Where it lives                     | Examples                              |
| ------------------- | ---------------------------------- | ------------------------------------- |
| **Server state**    | Server Components + cache          | DB records, API responses             |
| **URL state**       | `searchParams` / `useSearchParams` | Filters, pagination, tabs             |
| **Local UI state**  | `useState` in the owning component | Modal open, input focus               |
| **Shared UI state** | Store (Zustand / Redux)            | Auth user, theme, cart, notifications |
| **Form state**      | React Hook Form                    | All form fields and errors            |

**Server state does not go in the store.** Never copy API responses into Zustand/Redux.
That is what Server Components and caching (Next.js `fetch` cache, React cache) are for.

### Zustand rules (if used):

```ts
// ✅ One slice per domain concern
// store/auth.store.ts
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// ✅ Select only what you need — avoid subscribing to the whole store
const user = useAuthStore((s) => s.user); // ✅
const store = useAuthStore(); // ❌ re-renders on any store change

// ✅ Actions live inside the store, not scattered in components
// ❌ Never mutate store state directly from components with ad-hoc logic
```

**Store file rules:**

- One file per domain slice: `auth.store.ts`, `cart.store.ts`, `ui.store.ts`
- Each slice file exports exactly one hook (`useAuthStore`, `useCartStore`)
- Actions are defined inside `create()` — not in components
- No derived state in the store — compute it at the call site with `useMemo` or selectors
- No async logic inline in `set()` — use dedicated action functions or middleware

### Redux Toolkit rules (if used):

```ts
// ✅ One slice per feature
// store/features/cart.slice.ts
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: { addItem, removeItem, clearCart },
});

// ✅ Async logic in createAsyncThunk — never in components
// ✅ Use RTK Query for ALL server data fetching — not useEffect + fetch
// ✅ Selectors live alongside the slice, exported for reuse
export const selectCartTotal = (state: RootState) => ...
```

---

## 5. Custom Hooks

Hooks are for **reusable stateful logic**, not for extracting a block of JSX or grouping
unrelated code.

### Rules:

- A hook must have a single, clear responsibility named in its own name:
  `useProductFilters`, `useInfiniteScroll`, `useDebounce` — not `usePageLogic`.
- Hooks that only call other hooks and return values are composition hooks — fine.
- Hooks must not contain JSX. If you're returning JSX from a hook, make it a component.
- Hooks that wrap `useEffect` must clean up after themselves (return a cleanup function).
- If a hook file grows beyond ~80 lines it probably has more than one responsibility.
  Split it.

```ts
// ✅ Single responsibility
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ❌ Kitchen sink hook — split this up
function usePageLogic() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => { fetch('/api/user').then(...) }, []);  // ❌
  useEffect(() => { fetch('/api/products').then(...) }, []); // ❌
  ...
}
```

---

## 6. Server Actions

Server Actions are the **only** way to mutate server-side data from the client.
Never `POST` to an API route from a Client Component for mutations.

```ts
// ✅ features/orders/actions/order.actions.ts
'use server';

export async function createOrder(data: CreateOrderDto) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const validated = CreateOrderSchema.parse(data);
  const order = await db.order.create({ data: validated });

  revalidatePath('/orders');
  return order;
}
```

**Rules:**

- All Server Actions live in `features/[name]/actions/` or `app/**/actions.ts`.
- Every action validates its input with Zod before touching the database.
- Every action checks auth before doing anything.
- Actions call `revalidatePath` or `revalidateTag` after mutations so the UI stays fresh.
- Actions return either data or a typed error shape — never throw raw errors to the client.

---

## 7. TypeScript

- **No `any`.** If you don't know the type, use `unknown` and narrow it.
- **No type assertions (`as X`)** unless you can explain why narrowing is impossible.
- All props interfaces are explicit — no implicit `{}` or `object` prop types.
- All Server Action inputs and outputs are typed with Zod schemas that double as TS types
  (`z.infer<typeof Schema>`).
- Shared domain types live in `features/[name]/types.ts`. Never re-define the same
  shape in two places.
- `interface` for object shapes, `type` for unions, intersections, and mapped types.

---

## 8. Clean Code Checklist

Before committing any component or hook, verify:

- [ ] No `useEffect` that could be replaced by derived state, a memo, or a Server Component
- [ ] No data fetching in Client Components on mount (unless user-triggered)
- [ ] Component has a single, clear responsibility
- [ ] Props are the minimum needed — not passing the whole entity when only `id` and `name` are used
- [ ] No inline anonymous functions passed as props that will cause unnecessary re-renders
      (wrap in `useCallback` if the child is memoised, or extract to a named function)
- [ ] No magic strings or numbers — use constants or enums
- [ ] Store selectors are granular — subscribing to only the slice of state needed
- [ ] Server Actions validate input with Zod and check auth before any DB call
- [ ] TypeScript is strict — no `any`, no unchecked assertions

---

## 9. Naming Conventions

| Thing               | Convention               | Example                               |
| ------------------- | ------------------------ | ------------------------------------- |
| Components          | PascalCase               | `ProductCard`, `OrderList`            |
| Hooks               | camelCase prefixed `use` | `useProductFilters`                   |
| Server Actions      | camelCase verb-noun      | `createOrder`, `updateProfile`        |
| Store files         | camelCase + `.store.ts`  | `auth.store.ts`                       |
| Slice files (Redux) | camelCase + `.slice.ts`  | `cart.slice.ts`                       |
| Types / interfaces  | PascalCase               | `CreateOrderDto`, `UserProfile`       |
| Constants           | SCREAMING_SNAKE_CASE     | `MAX_RETRY_COUNT`                     |
| Files               | kebab-case               | `product-card.tsx`, `use-debounce.ts` |
| Feature folders     | kebab-case               | `features/order-management/`          |

---

## 10. What Claude Must Do When Working in This Codebase

1. **Before writing a Client Component**, ask: can this be a Server Component? Default to server.
2. **Before writing `useEffect`**, run through the decision tree in Rule 2. If it doesn't
   pass, find the alternative.
3. **Before reading from the store**, ask: is this truly cross-cutting UI state, or is it
   server data that should come from a Server Component prop?
4. **Before adding a new store slice**, check if `searchParams` or local `useState` is enough.
5. **When adding a Server Action**, always add Zod validation and auth check as the first two lines.
6. **When creating a new feature**, scaffold the full folder structure from Rule 3 — don't
   dump files in the root of `components/`.
7. **When refactoring**, removing a `useEffect` is almost always an improvement. Justify
   keeping any existing one before leaving it in place.
