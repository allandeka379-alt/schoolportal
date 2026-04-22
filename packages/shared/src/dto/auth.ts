import { z } from 'zod';

export const SignInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256),
  rememberDevice: z.boolean().optional(),
  mfaCode: z.string().regex(/^\d{6}$/).optional(),
});
export type SignInRequest = z.infer<typeof SignInRequestSchema>;

export const SignInResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int().positive(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    displayName: z.string().nullable(),
    preferredLocale: z.enum(['EN', 'SN', 'ND']),
    roles: z.array(z.string()),
    schoolId: z.string().uuid(),
    mfaRequired: z.boolean().optional(),
  }),
});
export type SignInResponse = z.infer<typeof SignInResponseSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(20),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const PasswordResetRequestSchema = z.object({
  email: z.string().email(),
});
export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(20),
  newPassword: z
    .string()
    .min(12, 'Use at least 12 characters')
    .max(256)
    .refine((p) => /[A-Z]/.test(p), 'Include an uppercase letter')
    .refine((p) => /[a-z]/.test(p), 'Include a lowercase letter')
    .refine((p) => /\d/.test(p), 'Include a digit'),
});
export type PasswordResetConfirm = z.infer<typeof PasswordResetConfirmSchema>;
