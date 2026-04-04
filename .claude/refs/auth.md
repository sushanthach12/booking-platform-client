# Authentication

## Storage

Browser **cookies** only — no server session, no NextAuth, no localStorage.
Cookie utilities: `setCookie`, `getCookie`, `deleteCookie` in `src/lib/utils/cookies.ts`.

| Cookie key                              | Value                                         |
| --------------------------------------- | --------------------------------------------- |
| `auth_token` (`COOKIE_KEYS.AUTH_TOKEN`) | JWT string (30-day expiry)                    |
| `auth_user` (`COOKIE_KEYS.AUTH_USER`)   | JSON-serialized `User` object (30-day expiry) |

Post-login redirect stored in `sessionStorage` key `redirectAfterLogin`, consumed by `AuthDialog`.

## Auth Flow (working path)

```
AuthDialog
  → getAuthUseCase().login()
    → AuthRepository.login()  ← real fetch() POST /auth/login
      → saveAuthData()  ← writes token + user to cookies (auth_token, auth_user)
        → window.location.reload()
```

## Auth Pages — STUBS

`/signin`, `/signup`, `/forgot-password`, `/reset-password` are **stubs**.

- Forms use uncontrolled inputs
- No validation
- Logs to console only — `saveAuthData()` not called
- No API wired

## Social Login

`AuthRepository.socialLogin(provider, email?)` — real HTTP `POST ${API_BASE}/auth/social/${provider}`.

## Route Protection

**None server-side.** No `middleware.ts`. Protection is entirely client-side.
Cookie check (`getCookie(COOKIE_KEYS.AUTH_TOKEN)`) happens after hydration in client components.

## Remaining Auth Gaps

- Auth page templates (`/signin`, `/signup`, `/forgot-password`, `/reset-password`) do not yet call `saveAuthData()` — forms log to console only.
- No `middleware.ts` — add one for server-side route enforcement when needed.
- See `src/domain/constants/api.constant.ts` for all planned auth endpoints.
