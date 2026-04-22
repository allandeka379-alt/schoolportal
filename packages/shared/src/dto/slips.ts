import { z } from 'zod';

import { CurrencyCodeSchema, DecimalAmountSchema } from '../domain/money';

/**
 * The request a parent makes when uploading a bank-deposit slip. The actual
 * image upload is a separate multipart request; this DTO links the resulting
 * file asset to a student and (optionally) an invoice.
 */
export const UploadSlipSchema = z.object({
  studentId: z.string().uuid(),
  invoiceId: z.string().uuid().optional(),
  originalAssetId: z.string().uuid(),
  claimedAmount: DecimalAmountSchema.optional(),
  claimedCurrency: CurrencyCodeSchema.optional(),
  claimedDepositedOn: z.string().date().optional(),
  notes: z.string().max(500).optional(),
});
export type UploadSlipInput = z.infer<typeof UploadSlipSchema>;

/**
 * A slip progresses through six steps. The UI renders this as a stepper so
 * parents can see exactly where their upload is.
 */
export const SlipStatusSchema = z.enum([
  'UPLOADED',
  'OCR_IN_PROGRESS',
  'OCR_COMPLETE',
  'PARSED',
  'VERIFIED',
  'RECONCILED',
  'FAILED',
  'REJECTED',
  'MANUAL_REVIEW',
]);
export type SlipStatus = z.infer<typeof SlipStatusSchema>;

export const SlipDetailResponseSchema = z.object({
  id: z.string().uuid(),
  status: SlipStatusSchema,
  detectedBank: z.string().nullable(),
  parsedAmount: DecimalAmountSchema.nullable(),
  parsedCurrency: CurrencyCodeSchema.nullable(),
  parsedDepositedOn: z.string().date().nullable(),
  parsedAccountNumber: z.string().nullable(),
  confidenceScore: z.number().min(0).max(100).nullable(),
  failureReason: z.string().nullable(),
  steps: z.array(
    z.object({
      step: z.enum([
        'IMAGE_ENHANCEMENT',
        'OCR',
        'STRUCTURAL_PARSING',
        'ACCOUNT_VERIFICATION',
        'STATEMENT_RECONCILIATION',
        'ACCOUNT_UPDATE',
      ]),
      outcome: z.enum(['STARTED', 'SUCCEEDED', 'FAILED', 'SKIPPED']),
      startedAt: z.string().datetime().optional(),
      durationMs: z.number().int().optional(),
      detail: z.record(z.unknown()).optional(),
    }),
  ),
});
export type SlipDetailResponse = z.infer<typeof SlipDetailResponseSchema>;
