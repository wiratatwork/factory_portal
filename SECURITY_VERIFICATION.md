# Security Verification Checklist

## Prerequisites
1. Start Keycloak + factory portal: `docker compose up -d` in `factory_portal/`
2. Start app-1 stack: `docker compose up -d` in `app-1/`
3. Demo user: `demo` / `demo`

## JWT Validation (`/api/jwt/probe`)
Protected with Keycloak JWT bearer validation (issuer, audience, signature, expiry).

| Case | Expected |
|------|----------|
| No token | 401 |
| Valid access token | 200 |
| Expired token | 401 |
| Tampered signature | 401 |
| Wrong audience | 401 |

Example:
```powershell
curl http://localhost:5001/api/jwt/probe
curl -H "Authorization: Bearer <access_token>" http://localhost:5001/api/jwt/probe
```

## BFF Session (`/api/bff/auth/session`, `/api/me`)
- Browser holds HttpOnly cookie only (no access/refresh token in sessionStorage)
- `/api/me` requires valid BFF session cookie
- **Fail-closed**: access tokens are cryptographically validated before any session is created or reported as authenticated; unvalidated JWT claims are never trusted

| Case | Expected |
|------|----------|
| Valid login callback | Session cookie set, `/api/bff/auth/session` returns `authenticated: true` |
| Token exchange OK but invalid/tampered access token | No session cookie; redirect to login with `error=token_validation_failed` |
| Session with expired access token + invalid refresh | Session cleared; `/api/bff/auth/session` returns `authenticated: false` |
| Session refresh returns token that fails validation | Session cleared; `/api/bff/auth/session` returns `authenticated: false` |

Example (factory portal):
```powershell
curl -c cookies.txt -b cookies.txt http://localhost:4200/api/bff/auth/session
# After valid login, expect authenticated: true
# After logout or invalid session, expect authenticated: false
```

## SSO Tile Flow
1. Login at `http://localhost:4200/login`
2. Open tile **Web App** -> `http://localhost:4201/?sso=1`
3. Expected: app-1 home without login prompt when Keycloak SSO session exists
4. If no SSO session: app-1 shows login button (`/login?sso=failed`)

## Keycloak Session Policy (realm import)
Configured in `factory_portal/keycloak/realm-toyota.json`:
- SSO idle timeout: 1800s (30 min)
- SSO max lifespan: 36000s (10 h)
- Access token lifespan: 300s (5 min)

## CSP / XSS
Security headers configured in:
- `factory_portal/frontend/nginx.conf`
- `app-1/frontend/nginx.conf`

Factory portal removed CDN Tailwind + inline scripts; Tailwind is build-time via PostCSS.

## Logout
- App logout clears BFF cookie and redirects to Keycloak logout
- Global Keycloak logout ends SSO for other apps/tabs
