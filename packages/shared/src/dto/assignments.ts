import { z } from 'zod';

import { DecimalAmountSchema } from '../domain/money';

export const CreateAssignmentSchema = z.object({
  courseOfferingId: z.string().uuid(),
  termId: z.string().uuid(),
  title: z.string().min(3).max(200),
  instructions: z.string().min(1).max(20000),
  visibility: z.enum(['STREAM', 'FORM', 'SPECIFIC_STUDENTS', 'WHOLE_SCHOOL']).default('STREAM'),
  releaseAt: z.string().datetime().optional(),
  dueAt: z.string().datetime(),
  maxMarks: DecimalAmountSchema,
  latePolicy: z.enum(['REJECT', 'ACCEPT_NO_PENALTY', 'PENALISE']).default('PENALISE'),
  latePenaltyPercentPerDay: DecimalAmountSchema.default('0'),
  acceptLateUntil: z.string().datetime().optional(),
  allowMultipleAttempts: z.boolean().default(false),
  attachmentAssetIds: z.array(z.string().uuid()).max(20).default([]),
  rubrics: z
    .array(
      z.object({
        criterion: z.string().min(1).max(200),
        descriptor: z.string().max(2000).optional(),
        maxPoints: DecimalAmountSchema,
      }),
    )
    .max(20)
    .optional(),
  targetStudentIds: z.array(z.string().uuid()).optional(),
});
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;

export const SubmitAssignmentSchema = z.object({
  assignmentId: z.string().uuid(),
  attachmentAssetIds: z.array(z.string().uuid()).min(1).max(10),
  notes: z.string().max(2000).optional(),
});
export type SubmitAssignmentInput = z.infer<typeof SubmitAssignmentSchema>;

export const MarkSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  markAwarded: DecimalAmountSchema,
  feedbackText: z.string().max(5000).optional(),
  rubricScores: z
    .array(
      z.object({
        rubricId: z.string().uuid(),
        points: DecimalAmountSchema,
        comment: z.string().max(2000).optional(),
      }),
    )
    .optional(),
});
export type MarkSubmissionInput = z.infer<typeof MarkSubmissionSchema>;
