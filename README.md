# HHA Portal — Harare Heritage Academy

> One portal. Every stakeholder. Zero paper circulars. A digital home that
> reflects the standards of the school itself.

This repository is the implementation of the _HHA Portal Proposal_ — a
unified web platform for students, teachers, administration, and parents at
Harare Heritage Academy.

The current state of this repository is a **front-end demo**: the four
portals (Student, Teacher, Parent, Admin) are fully clickable against
mock data that mirrors the Prisma domain model. The mock data covers every
section of the proposal — including the six-step bank-slip reader pipeline,
eleven Zimbabwe payment methods, a full gradebook, an early-warning list,
and a live fees ledger.

## Run the demo

```bash
# 1. Install (from the repo root)
pnpm install

# 2. Start the web app
pnpm --filter @hha/web dev

# 3. Open http://localhost:3000
```

### Demo accounts

All accounts share the same password: **`HHA!Portal2026`**

| Email               | Portal  | Role                      | What to look at                                                   |
| ------------------- | ------- | ------------------------- | ----------------------------------------------------------------- |
| `student@hha.ac.zw` | Student | Farai Moyo, Form 3 Blue   | Dashboard, assignments, library, progress, timetable, fees       |
| `teacher@hha.ac.zw` | Teacher | Mrs Dziva, Maths          | Console, marking queue, gradebook, attendance register           |
| `parent@hha.ac.zw`  | Parent  | Sekai Moyo (two children) | Multi-child view, progress, fees with slip pipeline, messages   |
| `bursar@hha.ac.zw`  | Admin   | Bursar                    | Fees ledger, slip queue with six-step pipeline, receipts        |
| `head@hha.ac.zw`    | Admin   | Head Teacher              | Overview, announcements, calendar, audit log                    |

There is a quick-fill row under the sign-in form for convenience.

## What the demo covers

Every section of the proposal has a visible counterpart:

| Proposal section                              | Where it lives in the demo                         |
| --------------------------------------------- | -------------------------------------------------- |
| §4 Student experience                         | `/student/*` — all 7 pages                         |
| §5 Teacher experience                         | `/teacher/*` — console, marking, gradebook, etc.   |
| §6 Administration                             | `/admin` overview + `/admin/students`              |
| §7 Fees, payments, bank-slip reader           | `/admin/slips` (six-step Stepper), `/parent/fees`  |
| §8 Announcements & community                  | `/admin/announcements`, every portal sidebar       |
| §9 Parent & guardian portal                   | `/parent/*` — multi-child, guardian access matrix  |
| §10 Security, privacy, data governance        | `/admin/audit` — audit log                         |
| §11 Technology stack                          | See the repository structure below                 |
| §12 Implementation roadmap                    | See `docs/adr/` (architecture decisions)           |

## Repository layout

```
hha-portal/
├── apps/
│   └── web/               # Next.js 14 app — the demo
├── packages/
│   ├── config/            # Shared TypeScript / ESLint / Tailwind configs
│   ├── database/          # Prisma schema (full domain model)
│   ├── shared/            # Framework-agnostic DTOs, Zimbabwe utilities,
│   │                      #   permission matrix, money/i18n helpers
│   ├── auth/              # JWT, argon2, TOTP, permission resolver
│   └── ui/                # Design-token React components
├── docs/
└── package.json           # pnpm workspace + turbo root
```

### The shared packages

Although the demo is front-end-only, these packages were written to be
reused by the eventual API and mobile client:

- **`@hha/database`** — The full Prisma schema covering all ten proposal
  sections: identity, organisational structure, students/staff/guardians,
  academics (assignments, submissions, gradebook, reports with a three-stage
  approval flow), resources, communications, fees & payments, bank-slip OCR,
  events/well-being, and the audit log.
- **`@hha/shared`** — Domain primitives that are just as useful client-side:
  Zimbabwean phone normalisation (EcoCash/NetOne/Telecel prefixes), national
  ID format validation, bank detection from slip text, the eleven supported
  payment methods, branded ID types, decimal money arithmetic, and the
  permission matrix that drives role-based access.
- **`@hha/auth`** — Server-side auth primitives ready to be plugged into any
  Node service: Ed25519 JWT signing, argon2id password hashing, RFC-6238
  TOTP, and a pure permission resolver with exhaustive unit tests.
- **`@hha/ui`** — A small, restrained component library. Tokens come from
  `packages/config/tailwind/preset.cjs`: Heritage navy, Savanna gold, Msasa
  red, Granite neutral. Source Serif 4 for headings, Inter for body,
  JetBrains Mono for money and reference numbers.

## Technology choices (matches §11 of the proposal)

- **Web** — Next.js 14 with the App Router
- **UI** — Tailwind CSS, custom component library, restrained design tokens
- **Types** — TypeScript everywhere, strict mode
- **Monorepo** — pnpm workspaces + Turborepo
- **Database (for eventual API)** — PostgreSQL via Prisma
- **Payments (planned)** — Paynow primary, direct CBZ/Stanbic/ZB/Steward
  integrations
- **OCR (planned)** — Google Document AI with Tesseract fallback

## Design language

From §2 of the proposal: _"considered typography, restrained colour, and
meaningful hierarchy — because our learners and parents deserve the same
design care a bank customer receives."_

The design system encodes this:

- **Colour** is restrained. The heritage navy is the default primary; gold
  is an accent used sparingly; red is reserved for urgency. No decorative
  colour.
- **Typography** uses a humanist serif (Source Serif 4) for institutional
  headlines paired with a neutral sans (Inter) for body text — the same
  convention serious banks and newspapers use.
- **Money** always renders with the currency code first and the digits in a
  mono font with tabular numerals so amounts in tables line up column-wise.
- **Each portal** carries a thin accent stripe at the top — heritage for
  Student and Parent, savanna for Teacher, granite for Admin — so a user
  glancing between two tabs always knows which role they are in.

## Demo data

The mock fixtures live in `apps/web/src/lib/mock/fixtures.ts`. They include:

- Six Form 3 students, plus Farai's sibling Tanaka in Form 1
- Ten ZIMSEC-aligned subjects across Form 3 Blue
- 17-slot weekly timetable with real rooms
- Five assignments for Farai in mixed states (open, submitted, late,
  returned with feedback)
- A full gradebook with trends per subject
- Three invoices (one paid, two outstanding), two payments
- Six bank-slip uploads at every stage of the six-step pipeline —
  `UPLOADED`, `OCR_IN_PROGRESS`, `VERIFIED`, `RECONCILED`, `MANUAL_REVIEW`,
  `FAILED` — so the Admin slip queue renders every state.
- Five announcements across the school-wide, form, subject, parents, and
  house channels.

## Roadmap

The next steps (deliberately out of scope for this demo) would be:

1. Stand up the NestJS API against the existing Prisma schema.
2. Replace the mock-data imports with tRPC/REST calls.
3. Wire up Paynow for real payment initiation.
4. Wire up Google Document AI for real slip OCR.
5. Add a worker process for scheduled jobs (statement imports,
   reminder emails, nightly backups).
6. Pilot launch to one form, per §12 of the proposal.

## Conventions

- **Commits** follow Conventional Commits, enforced by commitlint.
- **Formatting** is Prettier; imports are sorted by `simple-import-sort`.
- **Types** are strict everywhere except the demo app, where a couple of
  flags are relaxed (`noUnusedLocals`, `noUncheckedIndexedAccess`) to keep
  mock-data iteration fast.
- **Branded IDs** (`UserId`, `StudentId`, …) are used in the shared
  package to prevent cross-entity confusion.
- **Money** is a decimal string — never a JS number.

---

Respectfully,
Digital Transformation Committee — Harare Heritage Academy
