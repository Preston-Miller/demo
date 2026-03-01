# VibeSec Security Report
Repo: Preston-Miller/demo
Scanned: 2026-03-01 02:18:09 UTC
Issues Found: 5

## [SEV-001] CRITICAL -- Generic secret

**File:** .env.example
**Type:** EXAMPLE
**Line:** 7
**Evidence:** `SECRET=sk_live_goat_seller_12345_secret_key`
**Risk:** Sensitive information is stored in a publicly accessible file. An attacker accesses the .env.example file and retrieves the API secret.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the API_SECRET from the .env.example file and store it securely in environment variables.
**Verify:** Check the .env.example file for the absence of API_SECRET.

## [SEV-002] CRITICAL -- Generic secret

**File:** .env.example
**Type:** EXAMPLE
**Line:** 10
**Evidence:** `SECRET=my-super-secret-jwt-key-change-in-production`
**Risk:** Sensitive information is stored in a publicly accessible file. An attacker accesses the .env.example file and retrieves the JWT secret.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the JWT_SECRET from the .env.example file and store it securely in environment variables.
**Verify:** Check the .env.example file for the absence of JWT_SECRET.

## [SEV-003] CRITICAL -- AWS Access Key

**File:** config.js
**Type:** JavaScript
**Line:** 22
**Evidence:** `AKIAIOSFODNN7EXAMPLE`
**Risk:** Sensitive information is stored in a publicly accessible file. An attacker accesses the config.js file and retrieves the AWS access key.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the AWS access key from config.js and store it securely in environment variables.
**Verify:** Check the config.js file for the absence of the AWS access key.

## [SEV-004] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 9
**Evidence:** `API_KEY = 'pk_live_51ABC123def456GHI789jkl'`
**Risk:** Sensitive information is stored in a publicly accessible file. An attacker accesses the public/app.js file and retrieves the internal webhook secret.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the INTERNAL_WEBHOOK_SECRET from public/app.js and store it securely in environment variables.
**Verify:** Check the public/app.js file for the absence of INTERNAL_WEBHOOK_SECRET.

## [SEV-005] CRITICAL -- Generic secret

**File:** public/app.js
**Type:** JavaScript
**Line:** 11
**Evidence:** `SECRET = 'whsec_do_not_commit_this'`
**Risk:** Sensitive information is stored in a publicly accessible file. An attacker accesses the server.js file and retrieves the backup admin password.

**OWASP Category:** Secrets Management
**OWASP References:**
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
**Standard Fix Requirements (OWASP):**
1. Remove hardcoded secrets from source control and rotate exposed credentials.
2. Load secrets from a managed secret store or environment variables at runtime.
3. Add automated secret scanning in CI and block new leaked credentials.

**Fix Steps:**
1. Remove the BACKUP_ADMIN_PASSWORD from server.js and store it securely in environment variables.
**Verify:** Check the server.js file for the absence of BACKUP_ADMIN_PASSWORD.
