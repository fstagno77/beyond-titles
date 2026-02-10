# Authentication

## Overview

Beyond Titles does not implement a traditional user authentication system. There are no accounts, login or server-side sessions. The only controlled access mechanism concerns the SJT survey v1.0, which is password-protected.

## Public Access

All features are freely accessible:

- Behavioural & Competency-Based Survey
- System Activity Log
- Changelog

## SJT Survey Protection

The Situational Judgement Test v1.0 survey is under development and is protected by a hardcoded password.

### Access Flow

```
User selects SJT v1.0 from the selector
    ↓
Check localStorage('beyond-titles-sjt-auth')
    ├── === 'true' → Start survey (skip modal)
    └── !== 'true' → Show password modal
                         ↓
                     User enters password
                         ↓
                     Validation: input === 'gigroup2026'
                         ├── Correct → localStorage.set('beyond-titles-sjt-auth', 'true')
                         │              → Start survey
                         └── Wrong → Show error, allow retry
```

### Implementation Details

| Aspect | Detail |
|---|---|
| Password | `gigroup2026` (hardcoded in `survey.js`) |
| Persistence | `localStorage` key `beyond-titles-sjt-auth` |
| Expiry | None (valid until localStorage is cleared) |
| Rate limiting | None |
| Encryption | None |

::: warning Security
The password is visible in the client-side source code. This is intentional for a prototype — a server-side mechanism would be needed in production.
:::

## Roles and Permissions

There are no user roles in the current system. The distinction is only between:

| Level | Access |
|---|---|
| Public | Behavioural & Competency-Based Survey, results |
| SJT (post password) | All public + SJT v1.0 Survey |
