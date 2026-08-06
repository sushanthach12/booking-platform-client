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

`AuthRepository.socialLogin(provider, idToken)` — real HTTP `POST /auth/social/google`
with body `{idToken}`.

**Google is the only provider with a backend route.** The `provider` union still allows
`facebook` and `apple`; those 404. The repository also builds this one URL by hand instead
of going through `apiUrl()`, so it ignores `API_INTERNAL_URL` on SSR.

## Route Protection

**None server-side.** No `middleware.ts`. Protection is entirely client-side via the `useAuthGuard` hook (`src/hooks/use-auth-guard.ts`).

```typescript
// Check cookie → redirect if not authenticated
const { isAuthenticated, user } = useAuthGuard({ redirectTo: "/signin" });
```

Cookie check (`getCookie(COOKIE_KEYS.AUTH_TOKEN)`) happens after hydration in client components.

## AuthUseCase Methods

```typescript
login(credentials); // POST /auth/login          → OTP challenge, no tokens yet
signup(credentials); // POST /auth/register      → OTP challenge, no account yet
verifyOtp(email, otp, context); // POST /auth/verify-otp   → tokens
resendOtp(email, context); // POST /auth/resend-otp
forgotPassword(email); // POST /auth/forgot-password
resetPassword(data); // POST /auth/reset-password
socialLogin("google", idToken); // POST /auth/social/google
becomeHost(); // PATCH /auth/become-host          → reissued tokens
refreshToken(); // POST /auth/refresh
validateToken(token); // GET  /users/profile      (no dedicated verify route)
logout(); // POST /auth/logout
getCurrentUser(); // reads from cookie
getToken(); // reads from cookie
isAuthenticated(); // boolean check
saveAuthData(response); // writes token + user to cookies
clearAuthData(); // clears both cookies
```

Login and signup are **two-step**: both return an OTP challenge, and tokens only arrive
from `verifyOtp`.

## Remaining Auth Gaps

- No `middleware.ts` — add one for server-side route enforcement when needed.
- See `src/domain/constants/api.constant.ts` for all auth endpoints.
