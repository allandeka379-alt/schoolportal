/**
 * Barrel export for the database package.
 *
 * Consumers should import the typed client and enum types from here so that
 * the `@prisma/client` path stays an internal implementation detail.
 */
export * from './client';
export * from '../generated/client';
