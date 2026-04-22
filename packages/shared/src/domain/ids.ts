import { z } from 'zod';

/**
 * Branded ID types.
 *
 * At runtime an ID is just a string — but tagging it at compile time stops
 * `UserId` ever being passed where `StudentId` was required. Worth the
 * ceremony when you have ~60 tables.
 */
declare const __brand: unique symbol;
export type Branded<T, B> = T & { readonly [__brand]: B };

export type UserId = Branded<string, 'UserId'>;
export type StudentId = Branded<string, 'StudentId'>;
export type StaffId = Branded<string, 'StaffId'>;
export type GuardianId = Branded<string, 'GuardianId'>;
export type SchoolId = Branded<string, 'SchoolId'>;
export type AcademicYearId = Branded<string, 'AcademicYearId'>;
export type TermId = Branded<string, 'TermId'>;
export type FormId = Branded<string, 'FormId'>;
export type StreamId = Branded<string, 'StreamId'>;
export type SubjectId = Branded<string, 'SubjectId'>;
export type CourseOfferingId = Branded<string, 'CourseOfferingId'>;
export type AssignmentId = Branded<string, 'AssignmentId'>;
export type SubmissionId = Branded<string, 'SubmissionId'>;
export type InvoiceId = Branded<string, 'InvoiceId'>;
export type PaymentId = Branded<string, 'PaymentId'>;
export type BankSlipId = Branded<string, 'BankSlipId'>;
export type FileAssetId = Branded<string, 'FileAssetId'>;
export type AnnouncementId = Branded<string, 'AnnouncementId'>;
export type MessageThreadId = Branded<string, 'MessageThreadId'>;

/** Runtime validator for a v4 UUID. */
export const UuidSchema = z.string().uuid({ message: 'Invalid ID' });

/** Cast a runtime string to a branded ID. Only use once you've validated it. */
export const brand = <B>(value: string): Branded<string, B> => value as Branded<string, B>;
