import { z } from 'zod';

/**
 * Cursor pagination — preferred for feeds (announcements, messages, slip
 * queue) where the dataset grows without bound.
 */
export const CursorPageParamsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});
export type CursorPageParams = z.infer<typeof CursorPageParamsSchema>;

export interface CursorPage<T> {
  readonly items: T[];
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
}

/** Offset pagination — fine for small, bounded tables (staff roster, forms). */
export const OffsetPageParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
});
export type OffsetPageParams = z.infer<typeof OffsetPageParamsSchema>;

export interface OffsetPage<T> {
  readonly items: T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}

export function buildOffsetPage<T>(items: T[], total: number, params: OffsetPageParams): OffsetPage<T> {
  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
  };
}
