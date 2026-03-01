# Goat Seller App

A simple goat marketplace with **intentional security vulnerabilities**—the kind that coding agents often introduce when building "quick" demos or MVPs. Use this app for security training, CTF-style exercises, or testing whether an agent can find and fix the issues.

## Run the app

```bash
npm install
npm start
```

Open http://localhost:3000

## Intended vulnerabilities (do not fix if using for training)

### Backend (Node/Express)

| Issue | Location | Description |
|-------|----------|-------------|
| **Hardcoded secrets** | `server.js`, `config.js`, `.env.example` | `ADMIN_PASSWORD`, `API_SECRET_KEY`, `BACKUP_ADMIN_PASSWORD`, `DEBUG_API_TOKEN` in source; `config.js` has DB password, Stripe keys, AWS keys, JWT secret, SMTP password; `.env.example` has real-looking secrets. |
| **SQL injection** | `GET /api/goats/search?q=`, `GET /api/goats/:id`, `POST /api/goats`, `DELETE /api/goats/:id` | User input concatenated into SQL. No parameterized queries. |
| **Verbose errors** | Error handlers | `err.message` and `err.stack` sent to client, exposing internals. |
| **No auth on mutations** | `POST /api/goats`, `DELETE /api/goats/:id` | Anyone can add or delete any goat; no login or ownership check. |
| **Weak “auth”** | `POST /api/login` | Plain-text password comparison, no hashing. Predictable cookies. |
| **Insecure cookies** | Login response | `httpOnly: false` so cookies are readable by JS (XSS can steal them). `isAdmin` in cookie is trivial to forge. |
| **IDOR** | `DELETE /api/goats/:id` | No check that the requester owns the goat; any id can be deleted. |
| **Sensitive data in admin** | `GET /api/admin/stats` | Returns `API_SECRET_KEY`, Stripe key, JWT secret to anyone with admin cookie. |
| **Debug endpoint** | `GET /api/debug/health` | Returns `DEBUG_API_TOKEN` and `config.database.password` with no auth. |

### Frontend

| Issue | Location | Description |
|-------|----------|-------------|
| **Stored/reflected XSS** | `app.js` `renderGoats()`, `showSearchResults()` | Goat name, breed, description and search query inserted with `innerHTML` / template literals into DOM without sanitization. |
| **Password in plain text field** | `index.html` login form | Password input is `type="text"` instead of `type="password"`. |
| **Client-side secrets** | `public/app.js` | `PUBLIC_API_KEY`, `ANALYTICS_ID`, `INTERNAL_WEBHOOK_SECRET` hardcoded; visible in browser/source. |

### Vulnerable dependencies (pinned versions with known CVEs)

| Package | Version | Known issues |
|---------|---------|--------------|
| `lodash` | 4.17.15 | Prototype pollution (CVE-2020-8203, CVE-2021-23337) |
| `minimist` | 1.2.5 | Prototype pollution (CVE-2021-44906) |
| `axios` | 0.21.2 | CVE-2022-21624, CVE-2023-45857 |
| `express` | 4.17.1 | Older version; upgrade to 4.18+ for fixes |

Run `npm audit` to see reported vulnerabilities.

### General

- No CSRF protection on state-changing requests.
- No rate limiting or input validation.
- No HTTPS or secure cookie flags.

## Example attacks (for testing)

- **SQL injection (search):**  
  Try search: `' OR '1'='1` or `'; DROP TABLE goats;--`
- **SQL injection (id):**  
  Request: `GET /api/goats/1 OR 1=1`
- **XSS (goat name):**  
  Add a goat with name: `<img src=x onerror="alert(document.cookie)">`
- **XSS (search):**  
  Search for: `<script>alert(1)</script>`
- **Cookie tampering:**  
  Set `isAdmin=true` in cookies and visit `/admin.html`

Fix these in a secure branch or as an exercise.
