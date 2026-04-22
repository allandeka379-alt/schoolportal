# @hha/web

The HHA Portal web app.

## Development

```bash
# from the repo root
pnpm --filter @hha/web dev
# → http://localhost:3000
```

## Demo accounts

All use the password `HHA!Portal2026`:

| Email               | Portal  |
| ------------------- | ------- |
| `student@hha.ac.zw` | Student |
| `teacher@hha.ac.zw` | Teacher |
| `parent@hha.ac.zw`  | Parent  |
| `bursar@hha.ac.zw`  | Admin   |
| `head@hha.ac.zw`    | Admin   |

## Structure

```
src/
├── app/
│   ├── (root page redirects to portal or sign-in)
│   ├── sign-in/              # Shared sign-in
│   ├── student/              # Student portal + 6 sub-pages
│   ├── teacher/              # Teacher portal + 7 sub-pages
│   ├── parent/               # Parent portal + 6 sub-pages
│   └── admin/                # Admin back-office + 8 sub-pages
├── components/               # Shared header/sidebar/cards
└── lib/
    ├── auth/                 # Cookie-based demo auth with role routing
    └── mock/fixtures.ts      # The "database" for the demo
```

## Design tokens

The design language is defined in `packages/config/tailwind/preset.cjs`.
Four families: **heritage** (navy, default primary), **savanna** (gold
accent), **msasa** (red, urgency only), **granite** (neutral scaffolding).

## Swapping to a real API

Every fixture in `src/lib/mock/fixtures.ts` shapes its data the way the
Prisma schema models it — `studentId`, `admissionNo`, `house`, and so on.
When the API lands, each page becomes a `fetch(...)` against the
corresponding endpoint, with no UI changes required.
