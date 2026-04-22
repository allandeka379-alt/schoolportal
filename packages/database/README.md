# @hha/database

Prisma schema, migrations, and typed client for the HHA Portal.

## Layout

```
packages/database/
├── prisma/
│   └── schema.prisma      # The full domain model — ten sections, mapped to the proposal.
├── src/
│   ├── client.ts          # Singleton PrismaClient (dev-HMR-safe).
│   ├── index.ts           # Barrel re-export for consumers.
│   └── seed/              # Opinionated dev seed — see below.
└── generated/
    └── client/            # Output of `prisma generate` — ignored by git.
```

## Quick start

```bash
# 1. Start the database (from repo root)
pnpm docker:up

# 2. Create the schema
pnpm db:migrate

# 3. Populate the dev seed
pnpm db:seed

# 4. Open the Prisma Studio browser UI
pnpm db:studio
```

## Test accounts created by the seed

All use password `HHA!Portal2026`:

| Email                | Role          |
| -------------------- | ------------- |
| head@hha.ac.zw       | Head Teacher  |
| bursar@hha.ac.zw     | Bursar        |
| teacher@hha.ac.zw    | Teacher       |
| student@hha.ac.zw    | Student       |
| parent@hha.ac.zw     | Parent        |

## Schema organisation

The schema is deliberately split into ten commented sections, each mapped back
to a section of the original proposal:

1. **Identity & Access** — users, credentials, MFA, sessions, roles, consents.
2. **Organisational structure** — academic year, term, form, stream, house.
3. **People** — students, staff, guardians, and the explicit relationships
   between them (Section 9's grandparent-who-pays-but-doesn't-receive-reports
   case is modelled natively).
4. **Academic workspace** — course offerings, assignments, submissions,
   rubrics, annotations, gradebook, reports with a three-stage approval flow.
5. **Resources / Library** — resources, bookmarks, "Ask the Librarian" requests.
6. **Communications** — announcements (with translations and acknowledgements),
   messaging threads, moderation, notifications, push tokens.
7. **Fees & Payments** — fee structures, invoices, reminders, payments across
   eleven Zimbabwean payment methods, bank statement lines.
8. **Document intelligence** — bank-slip uploads, OCR events, pipeline audit.
9. **Events, well-being, community, career** — calendar, RSVP, Quiet Room,
   career corner, alumni.
10. **System** — file assets (with virus scan status), audit log.

## Conventions

- **UUIDs** everywhere; integers only for ordinal counters.
- **Table names** are `snake_case` via `@@map`; model names remain PascalCase.
- **Decimals** for money — never floats.
- **Soft delete** via `deletedAt` where retention policy demands it; hard
  delete otherwise. See `docs/adr/0003-soft-delete.md`.
- **Timezones** stored as UTC `timestamptz`; rendered in `Africa/Harare`.
- **Audit trail** — every privileged write should emit an `AuditLog` row.
