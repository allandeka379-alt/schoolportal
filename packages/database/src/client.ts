import { PrismaClient } from '../generated/client';

/**
 * Lazily-instantiated singleton PrismaClient.
 *
 * In dev, Next.js HMR and NestJS watch mode both reload modules aggressively;
 * without the globalThis cache we leak a connection per reload and exhaust
 * Postgres' `max_connections` within a few minutes. In production, a single
 * process holds a single client, so the guard is a no-op.
 */
type GlobalWithPrisma = typeof globalThis & {
  __hhaPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalWithPrisma;

const logLevels =
  process.env.NODE_ENV === 'production'
    ? (['error', 'warn'] as const)
    : (['query', 'error', 'warn'] as const);

export const prisma: PrismaClient =
  globalForPrisma.__hhaPrisma ??
  new PrismaClient({
    log: [...logLevels],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__hhaPrisma = prisma;
}

export type Database = typeof prisma;
