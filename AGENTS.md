# AGENTS.md

> Read this file before every task. The global `engineering-standards` skill applies
> to all code. This file provides project-specific context that overrides or extends it.

---

## Project

```
name    : [rumah-kosim]
stack   : [svelte]
arch    : [Strict Layered Architecture (Controllers -> Services -> Repositories -> Database)]
db      : [MySQL]
```

## Active Stack Rules

<!-- Uncomment one or more: -->
<!-- go | typescript | react | laravel | flutter -->

```
stacks: [svelte]
```

## Folder Structure

```
src/
├── app.css                   # Global CSS & Tailwind Base
├── app.d.ts                  # TypeScript types/declarations
├── app.html                  # SvelteKit HTML template page
├── hooks.server.js           # Server-side hooks (middleware)
├── lib/                      # Shared internal libraries
│   ├── assets/               # Static images & backgrounds
│   ├── components/           # Reusable UI Svelte Components
│   ├── constants/            # Global Constants (strings, configs, locations)
│   ├── db.js                 # MySQL Connection Pool
│   ├── server/               # Server-only logic
│   │   ├── admin-guard.js    # Route access authorization check
│   │   ├── repositories/     # Data access repositories (SQL queries)
│   │   ├── services/         # Business logic services
│   │   ├── utils/            # Logging and JSON response wrappers
│   │   └── validations/      # Zod validation schemas
│   ├── services/             # Frontend API integration services
│   ├── stores/               # Svelte store state managers
│   └── utils/                # General utility functions
└── routes/                   # SvelteKit routes
    ├── +layout.svelte        # Global layout configuration
    ├── +page.svelte          # Root landing page (redirects)
    ├── admin/                # Admin Panel views
    │   ├── +page.svelte      # Admin Page dashboard
    │   ├── api/              # Admin-specific APIs (+server.js)
    │   └── components/       # Admin-specific components
    ├── api/                  # Main backend API endpoints
    └── client/               # Customer-facing views (about, shop, login, profile, signup, checkout)
```

## Error Code Registry

| Code               | Status | Meaning                           |
| ------------------ | ------ | --------------------------------- |
| `VALIDATION_ERROR` | 422    | Input validation failed           |
| `UNAUTHENTICATED`  | 401    | Missing or invalid token          |
| `UNAUTHORIZED`     | 403    | Insufficient permissions          |
| `NOT_FOUND`        | 404    | Resource does not exist           |
| `CONFLICT`         | 409    | Duplicate or constraint violation |
| `INTERNAL_ERROR`   | 500    | Unexpected failure                |

## Agent Constraints

Must:

- Propose approach before touching more than one file.
- Add new strings/colors to constants files before referencing them.
- Ask before installing a new dependency.

Must not:

- Create or rename folders without approval.
- Leave any TODO, placeholder, or debug output in final code.
- Write inline color values, string literals, or magic numbers.
- Exceed 150 lines per file or 30 lines per function.
