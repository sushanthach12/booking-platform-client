# Authentication

## Storage

Browser **cookies** only — no server session, no NextAuth, no localStorage.
Cookie utilities: `setCookie`, `getCookie`, `deleteCookie` in `src/lib/utils/cookies.ts`.

| Cookie key                              | Value                                         |
| --------------------------------------- | --------------------------------------------- |
| `auth_token` (`COOKIE_KEYS.AUTH_TOKEN`) | JWT string (30-day expiry)                    |
| `auth_user` (`COOKIE_KEYS.AUTH_USER`)   | JSON-serialized `User` object (30-day expiry) |

Post-login redirect stored in `sessionStorage` key `redirectAfterLogin`, consumed by `AuthDialog`.

## Auth Flow (modal path)

```
AuthDialog
  → getAuthUseCase().login()
    → AuthRepository.login()  ← real fetch() POST /auth/login
      → saveAuthData()  ← writes token + user to cookies (auth_token, auth_user)
        → window.location.reload()
```

## Auth Flow (page path — /signin, /signup)

```
SignInTemplate / SignUpTemplate  ("use client")
  → getAuthUseCase().login() / .signup()
    → AuthRepository  ← real HTTP
      → saveAuthData()  ← writes token + user to cookies
        → router.push(redirect || "/")
```

Both `/signin` and `/signup` fully call `saveAuthData()`. Forgot-password and reset-password are also wired to real HTTP.

## Social Login

`AuthRepository.socialLogin(provider, email?)` — real HTTP `POST ${API_BASE}/auth/social/${provider}`.

## Route Protection

**None server-side.** No `middleware.ts`. Protection is entirely client-side via the `useAuthGuard` hook (`src/hooks/use-auth-guard.ts`).

```typescript
// Check cookie → redirect if not authenticated
const { isAuthenticated, user } = useAuthGuard({ redirectTo: "/signin" });
```

Cookie check (`getCookie(COOKIE_KEYS.AUTH_TOKEN)`) happens after hydration in client components.

## AuthUseCase Methods

```typescript
login(credentials)      // POST /auth/login
signup(credentials)     // POST /auth/signup
forgotPassword(email)   // POST /auth/forgot-password
resetPassword(data)     // POST /auth/reset-password
socialLogin(provider)   // POST /auth/social/:provider
validateToken()         // GET  /auth/verify-token
logout()                // POST /auth/logout
getCurrentUser()        // reads from cookie
getToken()              // reads from cookie
isAuthenticated()       // boolean check
saveAuthData(response)  // writes token + user to cookies
clearAuthData()         // clears both cookies
```

## Remaining Auth Gaps

- No `middleware.ts` — add one for server-side route enforcement when needed.
- See `src/domain/constants/api.constant.ts` for all auth endpoints.
