/**
 * Unified "school" mock domain — the single source of truth that stitches
 * together data used across multiple portals.
 *
 * This layer sits above `fixtures.ts` and the per-portal `*-extras.ts`
 * files. It adds the cross-cutting entities that were previously inline:
 * receipts, audit log, announcements with audience targeting, the master
 * calendar, and admin reports. Every id is stable so the same object can
 * be rendered from any portal.
 */

import {
  ACCOUNTS,
  ANNOUNCEMENTS,
  CALENDAR,
  INVOICES,
  PAYMENTS,
  SLIPS,
  STUDENTS,
  SUBJECTS,
  type DemoAccount,
  type DemoStudent,
} from './fixtures';

/* ------------------------------------------------------------------ */
/*  Receipts — every reconciled payment produces a digital receipt    */
/* ------------------------------------------------------------------ */

export type ReceiptMethod =
  | 'CBZ Transfer'
  | 'Stanbic Slip'
  | 'ZB Slip'
  | 'Steward Slip'
  | 'EcoCash'
  | 'OneMoney'
  | 'InnBucks'
  | 'ZIPIT'
  | 'Cash'
  | 'Card';

export type ReceiptStatus = 'RECONCILED' | 'VERIFIED' | 'PENDING' | 'FAILED';

export interface SchoolReceipt {
  id: string;
  ref: string;
  studentId: string;
  studentName: string;
  form: string;
  invoiceRef: string;
  method: ReceiptMethod;
  amount: number;
  currency: 'USD' | 'ZWL';
  issuedAt: string;   // ISO
  issuedBy: string;   // staff name
  status: ReceiptStatus;
  slipId?: string;
  notes?: string;
}

/**
 * Fabricated receipts — anchored against the canonical STUDENTS roster so
 * admin/receipts can link back to a real student page.
 */
export const RECEIPTS: readonly SchoolReceipt[] = [
  {
    id: 'rcp-1',
    ref: 'RCT-20260422-A4F7',
    studentId: 's-farai',
    studentName: 'Farai Moyo',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-F.MOYO',
    method: 'CBZ Transfer',
    amount: 800,
    currency: 'USD',
    issuedAt: '2026-04-22T14:02:00Z',
    issuedBy: 'Rutendo Chideme',
    status: 'RECONCILED',
    slipId: 'slip-farai-1',
  },
  {
    id: 'rcp-2',
    ref: 'RCT-20260422-9B12',
    studentId: 's-tanaka',
    studentName: 'Tanaka Moyo',
    form: 'Form 1 Green',
    invoiceRef: 'INV-2026-T2-T.MOYO',
    method: 'Stanbic Slip',
    amount: 1450,
    currency: 'USD',
    issuedAt: '2026-04-22T11:03:00Z',
    issuedBy: 'Rutendo Chideme',
    status: 'VERIFIED',
    slipId: 'slip-tanaka-1',
    notes: 'Awaiting statement match — expected tomorrow 06:00',
  },
  {
    id: 'rcp-3',
    ref: 'RCT-20260422-5C8D',
    studentId: 's-chipo',
    studentName: 'Chipo Banda',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-C.BANDA',
    method: 'EcoCash',
    amount: 1650,
    currency: 'USD',
    issuedAt: '2026-04-22T08:14:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
  },
  {
    id: 'rcp-4',
    ref: 'RCT-20260421-1A2E',
    studentId: 's-rudo',
    studentName: 'Rudo Mutasa',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-R.MUTASA',
    method: 'ZIPIT',
    amount: 500,
    currency: 'USD',
    issuedAt: '2026-04-21T18:30:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
    notes: 'Partial payment · balance carried',
  },
  {
    id: 'rcp-5',
    ref: 'RCT-20260421-7D4B',
    studentId: 's-tinashe',
    studentName: 'Tinashe Ncube',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-T.NCUBE',
    method: 'CBZ Transfer',
    amount: 500,
    currency: 'USD',
    issuedAt: '2026-04-21T16:33:00Z',
    issuedBy: 'Rutendo Chideme',
    status: 'FAILED',
    notes: 'Bank reference mismatch — slip returned to parent for reupload',
  },
  {
    id: 'rcp-6',
    ref: 'RCT-20260421-3F2A',
    studentId: 's-ruvimbo',
    studentName: 'Ruvimbo Sibanda',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-R.SIBANDA',
    method: 'OneMoney',
    amount: 1650,
    currency: 'USD',
    issuedAt: '2026-04-21T10:15:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
  },
  {
    id: 'rcp-7',
    ref: 'RCT-20260420-8E91',
    studentId: 's-farai',
    studentName: 'Farai Moyo',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-F.MOYO',
    method: 'InnBucks',
    amount: 450,
    currency: 'USD',
    issuedAt: '2026-04-20T15:47:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
    notes: 'Uniform levy · Term 2',
  },
  {
    id: 'rcp-8',
    ref: 'RCT-20260120-4E2A',
    studentId: 's-farai',
    studentName: 'Farai Moyo',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T1-F.MOYO',
    method: 'EcoCash',
    amount: 1650,
    currency: 'USD',
    issuedAt: '2026-01-15T08:33:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
    notes: 'Term 1 final settlement',
  },
  {
    id: 'rcp-9',
    ref: 'RCT-20260419-2B7C',
    studentId: 's-chipo',
    studentName: 'Chipo Banda',
    form: 'Form 3 Blue',
    invoiceRef: 'INV-2026-T2-C.BANDA-UNIF',
    method: 'Cash',
    amount: 120,
    currency: 'USD',
    issuedAt: '2026-04-19T13:22:00Z',
    issuedBy: 'Rutendo Chideme',
    status: 'RECONCILED',
    notes: 'Walk-in · uniform only',
  },
  {
    id: 'rcp-10',
    ref: 'RCT-20260419-9A3F',
    studentId: 's-tanaka',
    studentName: 'Tanaka Moyo',
    form: 'Form 1 Green',
    invoiceRef: 'INV-2026-T2-T.MOYO-TRP',
    method: 'EcoCash',
    amount: 45,
    currency: 'USD',
    issuedAt: '2026-04-19T07:05:00Z',
    issuedBy: 'System · Paynow',
    status: 'RECONCILED',
    notes: 'Athletics day trip — Chapman',
  },
];

export const RECEIPTS_KPIS = {
  last7DaysCount: RECEIPTS.filter(
    (r) => Date.parse(r.issuedAt) > Date.parse('2026-04-15T00:00:00Z'),
  ).length,
  last7DaysAmount: RECEIPTS.filter(
    (r) =>
      r.status === 'RECONCILED' &&
      Date.parse(r.issuedAt) > Date.parse('2026-04-15T00:00:00Z'),
  ).reduce((sum, r) => sum + r.amount, 0),
  failedCount: RECEIPTS.filter((r) => r.status === 'FAILED').length,
  pendingReconcile: RECEIPTS.filter((r) => r.status === 'VERIFIED').length,
} as const;

/* ------------------------------------------------------------------ */
/*  Audit log — privileged writes, immutable                           */
/* ------------------------------------------------------------------ */

export type AuditSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'ALERT';

export interface AuditEntry {
  id: string;
  at: string;           // ISO
  actor: string;
  actorRole: 'HEADMASTER' | 'BURSAR' | 'TEACHER' | 'SYSTEM' | 'IT_ADMIN' | 'PARENT';
  action: string;
  resource: string;
  resourceLabel?: string;
  severity: AuditSeverity;
  ip?: string;
  summary?: string;
}

export const AUDIT_LOG: readonly AuditEntry[] = [
  {
    id: 'aud-1',
    at: '2026-04-22T11:48:00Z',
    actor: 'Rutendo Chideme',
    actorRole: 'BURSAR',
    action: 'slip.approved',
    resource: 'slip-farai-1',
    resourceLabel: 'Farai Moyo · CBZ slip',
    severity: 'INFO',
    ip: '196.43.12.78',
    summary: 'Marked as reconciled against CBZ statement line 142 — USD 800.00',
  },
  {
    id: 'aud-2',
    at: '2026-04-22T11:32:00Z',
    actor: 'Miriam Dziva',
    actorRole: 'TEACHER',
    action: 'gradebook.write',
    resource: 'gb-form3b-math',
    resourceLabel: 'Form 3 Blue · Mathematics · Worksheet 5',
    severity: 'INFO',
    ip: '196.43.12.82',
    summary: 'Published 28 marks · average 72.4%',
  },
  {
    id: 'aud-3',
    at: '2026-04-22T11:21:00Z',
    actor: 'Tendai Makoni',
    actorRole: 'HEADMASTER',
    action: 'announcement.publish',
    resource: 'an-term2-open',
    resourceLabel: 'Term 2 opens — registration Monday 05 May',
    severity: 'NOTICE',
    ip: '196.43.12.71',
    summary: 'Audience: school-wide · SMS fallback: on · Ack required: yes',
  },
  {
    id: 'aud-4',
    at: '2026-04-22T09:02:00Z',
    actor: 'System',
    actorRole: 'SYSTEM',
    action: 'statement.import',
    resource: 'CBZ-01234567890',
    resourceLabel: 'CBZ current · daily feed',
    severity: 'INFO',
    summary: '142 transactions imported · 18 auto-matched · 4 await manual review',
  },
  {
    id: 'aud-5',
    at: '2026-04-22T08:48:00Z',
    actor: 'System',
    actorRole: 'SYSTEM',
    action: 'reconcile.batch',
    resource: 'batch-20260422',
    severity: 'INFO',
    summary: '18 payments auto-reconciled · 0 false positives · avg confidence 0.96',
  },
  {
    id: 'aud-6',
    at: '2026-04-22T07:15:00Z',
    actor: 'Miriam Dziva',
    actorRole: 'TEACHER',
    action: 'attendance.record',
    resource: 'att-form3b-2026-04-22-AM',
    resourceLabel: 'Form 3 Blue · AM register',
    severity: 'INFO',
    ip: '196.43.12.82',
    summary: '27 of 28 present · 1 absent (Tinashe Ncube · medical)',
  },
  {
    id: 'aud-7',
    at: '2026-04-21T22:18:00Z',
    actor: 'IT Admin',
    actorRole: 'IT_ADMIN',
    action: 'user.unlock',
    resource: 'u-tinashe-parent',
    resourceLabel: 'Mrs M. Ncube (parent of Tinashe)',
    severity: 'WARNING',
    ip: '196.43.12.50',
    summary: 'Account unlocked after 5 failed sign-in attempts · identity verified by phone',
  },
  {
    id: 'aud-8',
    at: '2026-04-21T16:44:00Z',
    actor: 'Rutendo Chideme',
    actorRole: 'BURSAR',
    action: 'invoice.waive',
    resource: 'inv-2026-T2-RM',
    resourceLabel: 'Invoice · Rumbi Moyo · USD 120.00 trip levy',
    severity: 'ALERT',
    ip: '196.43.12.78',
    summary: 'Hardship waiver approved by Headmaster — reference HM-APP-0417',
  },
  {
    id: 'aud-9',
    at: '2026-04-21T16:30:00Z',
    actor: 'Tendai Makoni',
    actorRole: 'HEADMASTER',
    action: 'approval.sign',
    resource: 'HM-APP-0417',
    resourceLabel: 'Waiver · Rumbi Moyo · trip levy',
    severity: 'NOTICE',
    ip: '196.43.12.71',
    summary: 'Approved with note: "Family communicated hardship — waive for this term only"',
  },
  {
    id: 'aud-10',
    at: '2026-04-21T16:02:00Z',
    actor: 'System',
    actorRole: 'SYSTEM',
    action: 'backup.complete',
    resource: 'daily-backup-20260421',
    severity: 'INFO',
    summary: 'Off-site backup · 4.2 GB · SHA-256 matched · retention 90 days',
  },
  {
    id: 'aud-11',
    at: '2026-04-21T14:12:00Z',
    actor: 'Mr P. Mhlanga',
    actorRole: 'TEACHER',
    action: 'resource.publish',
    resource: 'res-chem-bonding-2026',
    resourceLabel: 'Chemistry · Ionic bonding · revision notes',
    severity: 'INFO',
    ip: '196.43.12.88',
    summary: 'Shared to Form 3 Blue + Form 3 Gold',
  },
  {
    id: 'aud-12',
    at: '2026-04-21T12:58:00Z',
    actor: 'Sekai Moyo',
    actorRole: 'PARENT',
    action: 'slip.upload',
    resource: 'slip-farai-1',
    resourceLabel: 'CBZ deposit slip · USD 800.00',
    severity: 'INFO',
    ip: '196.43.100.14',
    summary: 'Mobile upload · 2 pages · OCR confidence 0.94',
  },
  {
    id: 'aud-13',
    at: '2026-04-21T10:34:00Z',
    actor: 'Tendai Makoni',
    actorRole: 'HEADMASTER',
    action: 'reports.sign',
    resource: 'rpt-form3b-t2-2026',
    resourceLabel: 'Form 3 Blue · Term 2 report sample',
    severity: 'NOTICE',
    ip: '196.43.12.71',
    summary: 'Signed 4 of 32 report cards · 28 remain',
  },
  {
    id: 'aud-14',
    at: '2026-04-20T21:11:00Z',
    actor: 'IT Admin',
    actorRole: 'IT_ADMIN',
    action: 'session.timeout',
    resource: 'u-bursar',
    severity: 'INFO',
    summary: 'Idle session expired after 30 minutes',
  },
  {
    id: 'aud-15',
    at: '2026-04-20T18:33:00Z',
    actor: 'Miriam Dziva',
    actorRole: 'TEACHER',
    action: 'assignment.create',
    resource: 'a-math-5',
    resourceLabel: 'Form 3 Blue · Quadratic Equations — Worksheet 5',
    severity: 'INFO',
    ip: '196.43.12.82',
    summary: 'Due 24 Apr 15:00 · auto-release 21 Apr 07:00',
  },
];

/* ------------------------------------------------------------------ */
/*  School events — unified calendar                                   */
/* ------------------------------------------------------------------ */

export type EventKind =
  | 'TERM'
  | 'EXAM'
  | 'SPORT'
  | 'PARENT_MEETING'
  | 'SPEECH_DAY'
  | 'PUBLIC_HOLIDAY'
  | 'INSET'
  | 'DEADLINE'
  | 'TRIP';

export type EventAudience = 'SCHOOL' | 'FORM_1' | 'FORM_2' | 'FORM_3' | 'FORM_4' | 'STAFF' | 'PARENTS' | 'BOARDERS';

export interface SchoolEvent {
  id: string;
  date: string;        // YYYY-MM-DD
  endDate?: string;
  time?: string;
  kind: EventKind;
  title: string;
  location?: string;
  audience: EventAudience[];
  description?: string;
  requiresRsvp?: boolean;
}

export const SCHOOL_EVENTS: readonly SchoolEvent[] = [
  {
    id: 'ev-t2-open',
    date: '2026-05-05',
    kind: 'TERM',
    title: 'Term 2 opens — registration 07:00',
    location: 'Main hall',
    audience: ['SCHOOL'],
    description: 'Boarders arrive Sunday 4 May, 14:00–17:00. Full uniform required.',
  },
  {
    id: 'ev-parents-f4',
    date: '2026-04-27',
    time: '16:00',
    kind: 'PARENT_MEETING',
    title: 'Form 4 parent evening · ZIMSEC briefing',
    location: 'Main hall',
    audience: ['FORM_4', 'PARENTS'],
    description: 'Registration, fee schedule, ZIMSEC registration, pastoral update. 90 minutes.',
    requiresRsvp: true,
  },
  {
    id: 'ev-midterm-exam-f3',
    date: '2026-05-12',
    endDate: '2026-05-16',
    kind: 'EXAM',
    title: 'Form 3 mid-term exams',
    location: 'Exam hall',
    audience: ['FORM_3'],
    description: 'Mathematics · English · Shona · Chemistry · Physics · History · Geography · Biology.',
  },
  {
    id: 'ev-sports-day',
    date: '2026-05-23',
    time: '08:00',
    kind: 'SPORT',
    title: 'Sports day — all forms',
    location: 'HHA field',
    audience: ['SCHOOL', 'PARENTS'],
    description: 'House competition: Heritage · Savanna · Msasa · Granite.',
  },
  {
    id: 'ev-speech-day',
    date: '2026-06-13',
    time: '10:00',
    kind: 'SPEECH_DAY',
    title: 'Speech & prize-giving day',
    location: 'HHA quadrangle',
    audience: ['SCHOOL', 'PARENTS'],
    description: 'Guest of honour: Dr S. Moyo · academic and sporting awards · end-of-term choir.',
  },
  {
    id: 'ev-f1-trip',
    date: '2026-05-08',
    kind: 'TRIP',
    title: 'Form 1 geography trip · Epworth balancing rocks',
    location: 'Epworth',
    audience: ['FORM_1'],
    description: 'Depart 07:30, return 16:00. Packed lunch provided.',
  },
  {
    id: 'ev-inset',
    date: '2026-05-02',
    kind: 'INSET',
    title: 'Staff INSET day · no lessons',
    audience: ['STAFF'],
    description: 'Marking moderation + Q3 CPD sessions.',
  },
  {
    id: 'ev-fees-deadline',
    date: '2026-04-30',
    kind: 'DEADLINE',
    title: 'Term 2 fees first-instalment due',
    audience: ['PARENTS'],
    description: 'At least 50% of Term 2 invoice settled by 30 April to avoid late-payment review.',
  },
  {
    id: 'ev-holiday-workers',
    date: '2026-05-01',
    kind: 'PUBLIC_HOLIDAY',
    title: "Workers' Day · public holiday",
    audience: ['SCHOOL'],
  },
  {
    id: 'ev-swim-gala',
    date: '2026-05-30',
    time: '09:00',
    kind: 'SPORT',
    title: 'Swim gala · HHA invitational',
    location: 'HHA pool',
    audience: ['SCHOOL', 'PARENTS'],
    description: 'Individual events + house relays. Parents welcome.',
  },
  {
    id: 'ev-board',
    date: '2026-05-18',
    time: '17:30',
    kind: 'PARENT_MEETING',
    title: 'Board meeting · Q2 financial review',
    location: "Headmaster's office",
    audience: ['STAFF'],
  },
];

/* ------------------------------------------------------------------ */
/*  Reports catalogue                                                  */
/* ------------------------------------------------------------------ */

export type ReportFormat = 'PDF' | 'Excel' | 'CSV' | 'PDF & Excel';
export type ReportCategory = 'STATUTORY' | 'BOARD' | 'OPERATIONAL' | 'ACADEMIC';

export interface AdminReport {
  id: string;
  name: string;
  category: ReportCategory;
  format: ReportFormat;
  updatedAt: string;
  owner: string;
  cadence: 'weekly' | 'monthly' | 'termly' | 'annually' | 'on demand';
  description: string;
}

export const ADMIN_REPORTS: readonly AdminReport[] = [
  {
    id: 'rpt-fees-weekly',
    name: 'Term 2 fees collection — weekly',
    category: 'OPERATIONAL',
    format: 'PDF & Excel',
    updatedAt: '2026-04-22',
    owner: 'Bursary',
    cadence: 'weekly',
    description:
      'Collection against budget by method (EcoCash · bank · cash). Ageing receivables attached as a second sheet.',
  },
  {
    id: 'rpt-zimsec-reg',
    name: 'ZIMSEC candidate registration — Form 4',
    category: 'STATUTORY',
    format: 'CSV',
    updatedAt: '2026-04-18',
    owner: 'Academic office',
    cadence: 'annually',
    description:
      'Format conforms to ZIMSEC 2026 schema. Signed off by the Headmaster before upload.',
  },
  {
    id: 'rpt-stat-enrol',
    name: 'Ministry statutory return — enrolment Q2',
    category: 'STATUTORY',
    format: 'Excel',
    updatedAt: '2026-04-15',
    owner: 'Head of Academic',
    cadence: 'termly',
    description:
      'Enrolment by form, stream, gender, house. Includes new intake and leavers with reasons.',
  },
  {
    id: 'rpt-board-fin',
    name: 'Board financial summary — monthly',
    category: 'BOARD',
    format: 'PDF',
    updatedAt: '2026-03-31',
    owner: 'Bursary',
    cadence: 'monthly',
    description:
      'Revenue vs budget · cash position · ageing receivables · three-term projection.',
  },
  {
    id: 'rpt-attendance-summary',
    name: 'Attendance summary — Form 1–4',
    category: 'OPERATIONAL',
    format: 'Excel',
    updatedAt: '2026-04-12',
    owner: 'Deputy Head (Pastoral)',
    cadence: 'weekly',
    description:
      'AM/PM attendance by form, with lateness flags and unexplained-absence list.',
  },
  {
    id: 'rpt-acad-term',
    name: 'End-of-term academic performance',
    category: 'ACADEMIC',
    format: 'PDF',
    updatedAt: '2026-04-08',
    owner: 'Deputy Head (Academic)',
    cadence: 'termly',
    description:
      'Per-form cohort averages · pass rates · subject heatmap · top gainers · students of concern.',
  },
  {
    id: 'rpt-safeguarding',
    name: 'Safeguarding quarterly',
    category: 'BOARD',
    format: 'PDF',
    updatedAt: '2026-03-28',
    owner: 'Designated Safeguarding Lead',
    cadence: 'termly',
    description:
      'Case volume · response times · referrals · open incidents (redacted for board audience).',
  },
  {
    id: 'rpt-teaching-quality',
    name: 'Teaching-quality quarterly',
    category: 'ACADEMIC',
    format: 'PDF & Excel',
    updatedAt: '2026-03-28',
    owner: 'Deputy Head (Academic)',
    cadence: 'termly',
    description:
      'Learning-walk outcomes · CPD completion · appraisal cycle status · observed-lesson ratings.',
  },
  {
    id: 'rpt-ops-quarter',
    name: 'Operations — asset & maintenance',
    category: 'OPERATIONAL',
    format: 'Excel',
    updatedAt: '2026-03-20',
    owner: 'Operations',
    cadence: 'termly',
    description:
      'Boarding, transport, grounds, IT tickets. Budget tracking and open works list.',
  },
];

/* ------------------------------------------------------------------ */
/*  Announcements — with audience targeting & acknowledgements        */
/* ------------------------------------------------------------------ */

export type AnnouncementAudience =
  | 'SCHOOL'
  | 'FORM_1'
  | 'FORM_2'
  | 'FORM_3'
  | 'FORM_4'
  | 'FORM_3B'
  | 'STAFF'
  | 'PARENTS'
  | 'BOARDERS'
  | 'SAVANNA_HOUSE'
  | 'HERITAGE_HOUSE'
  | 'MSASA_HOUSE'
  | 'GRANITE_HOUSE';

export interface SchoolAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience[];
  audienceSize: number;
  urgent: boolean;
  pinned: boolean;
  publishedAt: string;
  publishedBy: string;
  publishedByRole: 'HEADMASTER' | 'BURSAR' | 'DEPUTY' | 'DSL' | 'HEAD_OF_HOUSE' | 'FORM_TEACHER';
  translatedTo: ('SN' | 'ND')[];
  smsFallback: boolean;
  requiresAck: boolean;
  ackCount?: number;
  views?: number;
}

export const SCHOOL_ANNOUNCEMENTS: readonly SchoolAnnouncement[] = [
  {
    id: 'an-term2-open',
    title: 'Term 2 opens Monday 5 May — registration 07:00 sharp',
    body:
      'Full uniform is required. Boarders should arrive on Sunday 4 May between 14:00 and 17:00. Day scholars report to the main hall for assembly at 07:45.',
    audience: ['SCHOOL'],
    audienceSize: 428,
    urgent: true,
    pinned: true,
    publishedAt: '2026-04-22T11:21:00Z',
    publishedBy: 'Tendai Makoni',
    publishedByRole: 'HEADMASTER',
    translatedTo: ['SN', 'ND'],
    smsFallback: true,
    requiresAck: true,
    ackCount: 312,
    views: 401,
  },
  {
    id: 'an-t2-fees',
    title: 'Term 2 fees due · invoices now available',
    body:
      'Invoices have been issued. EcoCash, OneMoney, ZIPIT, and direct bank deposits to our CBZ account are supported through the portal. First instalment due 30 April.',
    audience: ['PARENTS'],
    audienceSize: 284,
    urgent: false,
    pinned: true,
    publishedAt: '2026-04-20T09:15:00Z',
    publishedBy: 'Rutendo Chideme',
    publishedByRole: 'BURSAR',
    translatedTo: ['SN', 'ND'],
    smsFallback: true,
    requiresAck: false,
    views: 251,
  },
  {
    id: 'an-f4-pte',
    title: 'Form 4 parent evening · Monday 27 April, 16:00',
    body:
      'Attendance required for every Form 4 family. ZIMSEC registration, fee schedule, and pastoral update. Please RSVP through the portal.',
    audience: ['FORM_4', 'PARENTS'],
    audienceSize: 78,
    urgent: false,
    pinned: false,
    publishedAt: '2026-04-18T14:00:00Z',
    publishedBy: 'Mrs L. Matanda',
    publishedByRole: 'DEPUTY',
    translatedTo: ['SN'],
    smsFallback: false,
    requiresAck: true,
    ackCount: 66,
    views: 74,
  },
  {
    id: 'an-admissions-open',
    title: 'Open morning · Form 1 intake · Saturday 10 May',
    body:
      'Prospective Form 1 parents are warmly invited to visit the academy between 09:00 and 12:00. RSVP through the portal or the admissions office.',
    audience: ['PARENTS', 'SCHOOL'],
    audienceSize: 600,
    urgent: false,
    pinned: false,
    publishedAt: '2026-04-18T08:30:00Z',
    publishedBy: 'Ms B. Mutero',
    publishedByRole: 'DEPUTY',
    translatedTo: ['SN', 'ND'],
    smsFallback: false,
    requiresAck: false,
    views: 187,
  },
  {
    id: 'an-form3-b-field',
    title: 'Form 3 Blue · Mathematics revision Saturday',
    body:
      'Saturday 26 April, 09:00–11:00 in B12. Bring your Worksheet 5 and Paper 2 from March. Optional but highly recommended ahead of mid-term exams.',
    audience: ['FORM_3B'],
    audienceSize: 28,
    urgent: false,
    pinned: false,
    publishedAt: '2026-04-17T18:42:00Z',
    publishedBy: 'Mrs M. Dziva',
    publishedByRole: 'FORM_TEACHER',
    translatedTo: [],
    smsFallback: false,
    requiresAck: false,
    views: 24,
  },
  {
    id: 'an-boarders-power',
    title: 'Boarders · scheduled power maintenance Saturday 04:00–06:00',
    body:
      'ZETDC have notified us of a planned outage. Generators will cover essentials but please charge devices on Friday evening.',
    audience: ['BOARDERS', 'PARENTS'],
    audienceSize: 112,
    urgent: false,
    pinned: false,
    publishedAt: '2026-04-17T16:10:00Z',
    publishedBy: 'Mr H. Makwenda',
    publishedByRole: 'HEAD_OF_HOUSE',
    translatedTo: [],
    smsFallback: true,
    requiresAck: false,
    views: 98,
  },
  {
    id: 'an-safeguarding-reminder',
    title: 'Safeguarding · reminder to all staff',
    body:
      "Term 2 safeguarding briefing is compulsory before the first period on Monday 5 May. Designated Safeguarding Lead: Mrs L. Matanda.",
    audience: ['STAFF'],
    audienceSize: 42,
    urgent: false,
    pinned: false,
    publishedAt: '2026-04-16T07:00:00Z',
    publishedBy: 'Tendai Makoni',
    publishedByRole: 'HEADMASTER',
    translatedTo: [],
    smsFallback: false,
    requiresAck: true,
    ackCount: 41,
    views: 42,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function findStudent(id: string): DemoStudent | undefined {
  return STUDENTS.find((s) => s.id === id);
}

export function findAccount(id: string): DemoAccount | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}

export function receiptsByStudent(studentId: string): SchoolReceipt[] {
  return RECEIPTS.filter((r) => r.studentId === studentId);
}

export function audienceLabel(a: AnnouncementAudience): string {
  const map: Record<AnnouncementAudience, string> = {
    SCHOOL: 'Whole school',
    FORM_1: 'Form 1',
    FORM_2: 'Form 2',
    FORM_3: 'Form 3',
    FORM_4: 'Form 4',
    FORM_3B: 'Form 3 Blue',
    STAFF: 'Staff',
    PARENTS: 'Parents',
    BOARDERS: 'Boarders',
    SAVANNA_HOUSE: 'Savanna House',
    HERITAGE_HOUSE: 'Heritage House',
    MSASA_HOUSE: 'Msasa House',
    GRANITE_HOUSE: 'Granite House',
  };
  return map[a];
}

export function eventAudienceLabel(a: EventAudience): string {
  const map: Record<EventAudience, string> = {
    SCHOOL: 'Whole school',
    FORM_1: 'Form 1',
    FORM_2: 'Form 2',
    FORM_3: 'Form 3',
    FORM_4: 'Form 4',
    STAFF: 'Staff',
    PARENTS: 'Parents',
    BOARDERS: 'Boarders',
  };
  return map[a];
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

/* Re-export some originals so callers can import from one place. */
export {
  ACCOUNTS,
  ANNOUNCEMENTS,
  CALENDAR,
  INVOICES,
  PAYMENTS,
  SLIPS,
  STUDENTS,
  SUBJECTS,
};
