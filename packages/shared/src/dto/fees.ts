import { z } from 'zod';

import { CurrencyCodeSchema, DecimalAmountSchema } from '../domain/money';

export const InitiatePaymentSchema = z
  .object({
    invoiceId: z.string().uuid().optional(),
    studentId: z.string().uuid(),
    method: z.enum([
      'ECOCASH',
      'ONEMONEY',
      'INNBUCKS',
      'ZIPIT',
      'BANK_TRANSFER_CBZ',
      'BANK_TRANSFER_STANBIC',
      'BANK_TRANSFER_ZB',
      'BANK_TRANSFER_STEWARD',
      'CARD_VISA',
      'CARD_MASTERCARD',
      'CASH_AT_BURSARY',
      'NOSTRO_USD_TRANSFER',
    ]),
    amount: DecimalAmountSchema,
    currency: CurrencyCodeSchema,
    payerPhoneE164: z.string().optional(),
    payerEmail: z.string().email().optional(),
    returnUrl: z.string().url().optional(),
  })
  .refine(
    (d) =>
      d.method !== 'ECOCASH' &&
      d.method !== 'ONEMONEY' &&
      d.method !== 'INNBUCKS'
        ? true
        : !!d.payerPhoneE164,
    { message: 'payerPhoneE164 required for mobile money', path: ['payerPhoneE164'] },
  );
export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;

export const PaymentResponseSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(['PENDING_VERIFICATION', 'VERIFIED', 'RECONCILED', 'FAILED', 'REJECTED']),
  reference: z.string(),
  redirectUrl: z.string().url().optional(),
  pollUrl: z.string().url().optional(),
});
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

export const IssueInvoicesSchema = z.object({
  termId: z.string().uuid(),
  formId: z.string().uuid().optional(),
  boardingStatus: z.enum(['DAY', 'WEEKLY_BOARDER', 'FULL_BOARDER']).optional(),
  dueDate: z.string().date(),
  notes: z.string().max(1000).optional(),
});
export type IssueInvoicesInput = z.infer<typeof IssueInvoicesSchema>;

export const SendReminderSchema = z.object({
  invoiceIds: z.array(z.string().uuid()).min(1),
  tone: z.enum(['GENTLE', 'FIRM', 'FINAL']),
});
export type SendReminderInput = z.infer<typeof SendReminderSchema>;
