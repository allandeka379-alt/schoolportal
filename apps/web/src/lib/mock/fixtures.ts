/**
 * Demo fixtures.
 *
 * This is the "database" for the standalone front-end demo. Every screen
 * reads from here. The shape deliberately mirrors the Prisma schema in
 * packages/database so swapping to a real API later is a straight lift.
 */
export type PortalRole = 'student' | 'teacher' | 'parent' | 'admin' | 'headmaster';
export type RoleKey =
  | 'HEAD_TEACHER'
  | 'BURSAR'
  | 'TEACHER'
  | 'FORM_TEACHER'
  | 'STUDENT'
  | 'GUARDIAN';

export interface DemoAccount {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  portal: PortalRole;
  roles: RoleKey[];
  avatarInitials: string;
  position?: string;
  // For parent → link to one or more students.
  childrenIds?: string[];
  // For student → link to their record.
  studentId?: string;
  // For teacher → link to their staff record.
  staffId?: string;
}

export const DEMO_PASSWORD = 'HHA!Portal2026';

export const ACCOUNTS: readonly DemoAccount[] = [
  {
    id: 'u-head',
    email: 'head@hha.ac.zw',
    password: DEMO_PASSWORD,
    firstName: 'Tendai',
    lastName: 'Makoni',
    portal: 'headmaster',
    roles: ['HEAD_TEACHER'],
    avatarInitials: 'TM',
    position: 'Headmaster',
    staffId: 'sp-head',
  },
  {
    id: 'u-bursar',
    email: 'bursar@hha.ac.zw',
    password: DEMO_PASSWORD,
    firstName: 'Rutendo',
    lastName: 'Chideme',
    portal: 'admin',
    roles: ['BURSAR'],
    avatarInitials: 'RC',
    position: 'Bursar',
    staffId: 'sp-bursar',
  },
  {
    id: 'u-teacher',
    email: 'teacher@hha.ac.zw',
    password: DEMO_PASSWORD,
    firstName: 'Miriam',
    lastName: 'Dziva',
    portal: 'teacher',
    roles: ['TEACHER', 'FORM_TEACHER'],
    avatarInitials: 'MD',
    position: 'Senior Teacher — Mathematics',
    staffId: 'sp-teacher',
  },
  {
    id: 'u-student',
    email: 'student@hha.ac.zw',
    password: DEMO_PASSWORD,
    firstName: 'Farai',
    lastName: 'Moyo',
    portal: 'student',
    roles: ['STUDENT'],
    avatarInitials: 'FM',
    studentId: 's-farai',
  },
  {
    id: 'u-parent',
    email: 'parent@hha.ac.zw',
    password: DEMO_PASSWORD,
    firstName: 'Sekai',
    lastName: 'Moyo',
    portal: 'parent',
    roles: ['GUARDIAN'],
    avatarInitials: 'SM',
    childrenIds: ['s-farai', 's-tanaka'],
  },
];

/* ------------------------------------------------------------------ */
/*  Students                                                          */
/* ------------------------------------------------------------------ */

export interface DemoStudent {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  form: string;
  stream: string;
  house: 'Heritage' | 'Savanna' | 'Msasa' | 'Granite';
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  guardianIds: string[];
  avatarInitials: string;
}

export const STUDENTS: readonly DemoStudent[] = [
  {
    id: 's-farai',
    admissionNo: 'HHA-2023-0042',
    firstName: 'Farai',
    lastName: 'Moyo',
    form: 'Form 3',
    stream: 'Blue',
    house: 'Savanna',
    dateOfBirth: '2010-06-14',
    gender: 'MALE',
    guardianIds: ['u-parent'],
    avatarInitials: 'FM',
  },
  {
    id: 's-tanaka',
    admissionNo: 'HHA-2025-0081',
    firstName: 'Tanaka',
    lastName: 'Moyo',
    form: 'Form 1',
    stream: 'Green',
    house: 'Savanna',
    dateOfBirth: '2012-11-02',
    gender: 'FEMALE',
    guardianIds: ['u-parent'],
    avatarInitials: 'TM',
  },
  {
    id: 's-chipo',
    admissionNo: 'HHA-2023-0045',
    firstName: 'Chipo',
    lastName: 'Banda',
    form: 'Form 3',
    stream: 'Blue',
    house: 'Heritage',
    dateOfBirth: '2010-03-21',
    gender: 'FEMALE',
    guardianIds: [],
    avatarInitials: 'CB',
  },
  {
    id: 's-ruvimbo',
    admissionNo: 'HHA-2023-0049',
    firstName: 'Ruvimbo',
    lastName: 'Sibanda',
    form: 'Form 3',
    stream: 'Blue',
    house: 'Msasa',
    dateOfBirth: '2010-08-09',
    gender: 'FEMALE',
    guardianIds: [],
    avatarInitials: 'RS',
  },
  {
    id: 's-tinashe',
    admissionNo: 'HHA-2023-0051',
    firstName: 'Tinashe',
    lastName: 'Ncube',
    form: 'Form 3',
    stream: 'Blue',
    house: 'Granite',
    dateOfBirth: '2010-02-15',
    gender: 'MALE',
    guardianIds: [],
    avatarInitials: 'TN',
  },
  {
    id: 's-rudo',
    admissionNo: 'HHA-2023-0057',
    firstName: 'Rudo',
    lastName: 'Mutasa',
    form: 'Form 3',
    stream: 'Blue',
    house: 'Heritage',
    dateOfBirth: '2010-05-30',
    gender: 'FEMALE',
    guardianIds: [],
    avatarInitials: 'RM',
  },
];

/* ------------------------------------------------------------------ */
/*  Timetable & subjects                                               */
/* ------------------------------------------------------------------ */

export interface DemoSubject {
  code: string;
  name: string;
  teacher: string;
}

export const SUBJECTS: readonly DemoSubject[] = [
  { code: 'MATH', name: 'Mathematics', teacher: 'Mrs M. Dziva' },
  { code: 'ENGL', name: 'English Language', teacher: 'Mr T. Gondo' },
  { code: 'SHON', name: 'Shona', teacher: 'Mrs F. Chiweshe' },
  { code: 'CHEM', name: 'Chemistry', teacher: 'Mr P. Mhlanga' },
  { code: 'PHYS', name: 'Physics', teacher: 'Ms L. Nyathi' },
  { code: 'BIO', name: 'Biology', teacher: 'Dr K. Madziva' },
  { code: 'HIST', name: 'History', teacher: 'Mr S. Chakanetsa' },
  { code: 'GEOG', name: 'Geography', teacher: 'Mrs A. Dube' },
];

export interface TimetableSlot {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  start: string;
  end: string;
  subjectCode: string;
  room: string;
}

export const TIMETABLE_FORM3_BLUE: readonly TimetableSlot[] = [
  { day: 'Mon', start: '07:30', end: '08:15', subjectCode: 'MATH', room: 'B12' },
  { day: 'Mon', start: '08:20', end: '09:05', subjectCode: 'ENGL', room: 'A04' },
  { day: 'Mon', start: '09:10', end: '09:55', subjectCode: 'CHEM', room: 'L01' },
  { day: 'Mon', start: '10:30', end: '11:15', subjectCode: 'HIST', room: 'A07' },
  { day: 'Tue', start: '07:30', end: '08:15', subjectCode: 'BIO', room: 'L02' },
  { day: 'Tue', start: '08:20', end: '09:05', subjectCode: 'MATH', room: 'B12' },
  { day: 'Tue', start: '09:10', end: '09:55', subjectCode: 'GEOG', room: 'A09' },
  { day: 'Tue', start: '10:30', end: '11:15', subjectCode: 'SHON', room: 'A02' },
  { day: 'Wed', start: '07:30', end: '08:15', subjectCode: 'PHYS', room: 'L03' },
  { day: 'Wed', start: '08:20', end: '09:05', subjectCode: 'ENGL', room: 'A04' },
  { day: 'Wed', start: '09:10', end: '09:55', subjectCode: 'MATH', room: 'B12' },
  { day: 'Thu', start: '07:30', end: '08:15', subjectCode: 'CHEM', room: 'L01' },
  { day: 'Thu', start: '08:20', end: '09:05', subjectCode: 'BIO', room: 'L02' },
  { day: 'Thu', start: '09:10', end: '09:55', subjectCode: 'HIST', room: 'A07' },
  { day: 'Fri', start: '07:30', end: '08:15', subjectCode: 'GEOG', room: 'A09' },
  { day: 'Fri', start: '08:20', end: '09:05', subjectCode: 'SHON', room: 'A02' },
  { day: 'Fri', start: '09:10', end: '09:55', subjectCode: 'PHYS', room: 'L03' },
];

/* ------------------------------------------------------------------ */
/*  Assignments                                                        */
/* ------------------------------------------------------------------ */

export interface DemoAssignment {
  id: string;
  subjectCode: string;
  title: string;
  instructions: string;
  dueAt: string;
  maxMarks: number;
  status: 'OPEN' | 'SUBMITTED' | 'LATE' | 'RETURNED';
  submittedAt?: string;
  markAwarded?: number;
  feedback?: string;
  teacher: string;
  attachments: { name: string; size: string }[];
}

export const ASSIGNMENTS_FOR_FARAI: readonly DemoAssignment[] = [
  {
    id: 'a-math-5',
    subjectCode: 'MATH',
    title: 'Quadratic Equations — Worksheet 5',
    instructions:
      'Complete questions 1–12 on page 84. Show every step of your working. Upload a scan or a clear photograph of each page.',
    dueAt: '2026-04-24T15:00:00Z',
    maxMarks: 40,
    status: 'OPEN',
    teacher: 'Mrs M. Dziva',
    attachments: [{ name: 'Worksheet-5.pdf', size: '312 KB' }],
  },
  {
    id: 'a-chem-3',
    subjectCode: 'CHEM',
    title: 'Ionic Bonding — Practical Write-up',
    instructions:
      'Write up the practical from Tuesday. Include aim, apparatus, method, results table, discussion and conclusion. 600–800 words.',
    dueAt: '2026-04-23T15:00:00Z',
    maxMarks: 30,
    status: 'SUBMITTED',
    submittedAt: '2026-04-22T09:12:00Z',
    teacher: 'Mr P. Mhlanga',
    attachments: [{ name: 'Practical-brief.pdf', size: '186 KB' }],
  },
  {
    id: 'a-hist-2',
    subjectCode: 'HIST',
    title: "First Chimurenga — Essay",
    instructions:
      "Write a 1,200-word essay on the causes, course, and consequences of the First Chimurenga (1896–1897). Use at least three sources.",
    dueAt: '2026-04-28T15:00:00Z',
    maxMarks: 50,
    status: 'OPEN',
    teacher: 'Mr S. Chakanetsa',
    attachments: [],
  },
  {
    id: 'a-eng-7',
    subjectCode: 'ENGL',
    title: 'Comprehension — "The Old Man and the Medal"',
    instructions:
      'Read the passage on pages 42–45 and answer the ten comprehension questions that follow. Submit as a PDF or Word document.',
    dueAt: '2026-04-15T15:00:00Z',
    maxMarks: 25,
    status: 'RETURNED',
    submittedAt: '2026-04-14T18:22:00Z',
    markAwarded: 22,
    feedback:
      'Very strong reading, Farai — particularly on questions 4 and 7. Watch the spelling of "whether" vs "weather" and take another look at question 10 to see how a fuller answer would read.',
    teacher: 'Mr T. Gondo',
    attachments: [{ name: 'Comprehension-brief.pdf', size: '224 KB' }],
  },
  {
    id: 'a-bio-4',
    subjectCode: 'BIO',
    title: 'Photosynthesis — Diagram & Summary',
    instructions:
      'Draw a labelled diagram of the light-dependent reactions and write a 300-word summary. Hand-drawn diagrams photographed clearly are fine.',
    dueAt: '2026-04-20T15:00:00Z',
    maxMarks: 20,
    status: 'LATE',
    submittedAt: '2026-04-21T11:45:00Z',
    teacher: 'Dr K. Madziva',
    attachments: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Gradebook / marks                                                  */
/* ------------------------------------------------------------------ */

export interface GradebookRow {
  subjectCode: string;
  subjectName: string;
  continuous: number;
  midterm: number;
  endterm: number | null;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  position: number;
  trend: 'up' | 'down' | 'flat';
}

export const GRADEBOOK_FARAI: readonly GradebookRow[] = [
  { subjectCode: 'MATH', subjectName: 'Mathematics', continuous: 72, midterm: 68, endterm: null, total: 70, grade: 'B', position: 6, trend: 'up' },
  { subjectCode: 'ENGL', subjectName: 'English Language', continuous: 78, midterm: 82, endterm: null, total: 80, grade: 'A', position: 3, trend: 'up' },
  { subjectCode: 'SHON', subjectName: 'Shona', continuous: 84, midterm: 88, endterm: null, total: 86, grade: 'A', position: 2, trend: 'up' },
  { subjectCode: 'CHEM', subjectName: 'Chemistry', continuous: 65, midterm: 58, endterm: null, total: 61, grade: 'C', position: 11, trend: 'down' },
  { subjectCode: 'PHYS', subjectName: 'Physics', continuous: 71, midterm: 74, endterm: null, total: 73, grade: 'B', position: 7, trend: 'flat' },
  { subjectCode: 'BIO', subjectName: 'Biology', continuous: 69, midterm: 73, endterm: null, total: 71, grade: 'B', position: 8, trend: 'up' },
  { subjectCode: 'HIST', subjectName: 'History', continuous: 81, midterm: 79, endterm: null, total: 80, grade: 'A', position: 4, trend: 'flat' },
  { subjectCode: 'GEOG', subjectName: 'Geography', continuous: 76, midterm: 78, endterm: null, total: 77, grade: 'B', position: 5, trend: 'up' },
];

/* ------------------------------------------------------------------ */
/*  Resources (library)                                                */
/* ------------------------------------------------------------------ */

export interface DemoResource {
  id: string;
  title: string;
  kind: 'Textbook' | 'Notes' | 'Past Paper' | 'Video' | 'Worksheet';
  subjectCode: string;
  size?: string;
  duration?: string;
  bookmarked?: boolean;
  updatedAt: string;
}

export const RESOURCES: readonly DemoResource[] = [
  { id: 'r1', title: 'Form 3 Mathematics Textbook — Chapter 7: Quadratics', kind: 'Textbook', subjectCode: 'MATH', size: '4.2 MB', updatedAt: '2026-03-01', bookmarked: true },
  { id: 'r2', title: 'ZIMSEC 2024 Mathematics Paper 1', kind: 'Past Paper', subjectCode: 'MATH', size: '1.1 MB', updatedAt: '2026-02-14' },
  { id: 'r3', title: 'Shona Poetry — Mabasa Akanaka (Annotated)', kind: 'Notes', subjectCode: 'SHON', size: '620 KB', updatedAt: '2026-03-19', bookmarked: true },
  { id: 'r4', title: 'Chemistry Class Recording — Ionic Bonding', kind: 'Video', subjectCode: 'CHEM', duration: '24 min', updatedAt: '2026-04-18' },
  { id: 'r5', title: 'English Comprehension Worksheet — Term 1', kind: 'Worksheet', subjectCode: 'ENGL', size: '240 KB', updatedAt: '2026-02-28' },
  { id: 'r6', title: 'Biology — Labelled Photosynthesis Diagram', kind: 'Notes', subjectCode: 'BIO', size: '360 KB', updatedAt: '2026-04-15' },
  { id: 'r7', title: 'History Source Pack — First Chimurenga', kind: 'Notes', subjectCode: 'HIST', size: '2.1 MB', updatedAt: '2026-04-10' },
  { id: 'r8', title: 'Physics Past Paper — June 2023 Paper 2', kind: 'Past Paper', subjectCode: 'PHYS', size: '980 KB', updatedAt: '2026-01-22' },
];

/* ------------------------------------------------------------------ */
/*  Announcements                                                      */
/* ------------------------------------------------------------------ */

export interface DemoAnnouncement {
  id: string;
  channel: 'School-wide' | 'Form 3' | 'Mathematics' | 'Parents' | 'Savanna House';
  title: string;
  body: string;
  author: string;
  publishedAt: string;
  requiresAcknowledgement?: boolean;
  pinned?: boolean;
}

export const ANNOUNCEMENTS: readonly DemoAnnouncement[] = [
  {
    id: 'an-1',
    channel: 'School-wide',
    title: 'Term 2 opens Monday 5 May — registration 07:00',
    body: 'Good afternoon. Term 2 begins on Monday 5 May. Registration starts at 07:00 sharp. Full uniform is required. Boarders should arrive on Sunday 4 May between 14:00 and 17:00.',
    author: 'T. Makoni — Head Teacher',
    publishedAt: '2026-04-22T11:00:00Z',
    pinned: true,
    requiresAcknowledgement: true,
  },
  {
    id: 'an-2',
    channel: 'Parents',
    title: 'Term 2 fees now due — multiple payment options available',
    body: 'Term 2 invoices have been issued. Please settle by Friday 9 May. EcoCash, OneMoney, ZIPIT, and direct bank deposit to our CBZ account are all supported through the portal.',
    author: 'R. Chideme — Bursar',
    publishedAt: '2026-04-21T09:30:00Z',
  },
  {
    id: 'an-3',
    channel: 'Form 3',
    title: 'Form 3 parents\' evening — Wednesday 14 May',
    body: 'A reminder that our Form 3 parents\' evening takes place on Wednesday 14 May from 17:00 in the main hall. RSVPs through the portal are appreciated.',
    author: 'M. Dziva — Form Teacher',
    publishedAt: '2026-04-20T14:15:00Z',
  },
  {
    id: 'an-4',
    channel: 'Mathematics',
    title: 'Extra lesson Saturday 26 April',
    body: 'For the Form 3 Blue group: optional extra lesson on quadratics this Saturday, 09:00–11:00 in B12. Bring worksheet 5.',
    author: 'M. Dziva',
    publishedAt: '2026-04-22T07:45:00Z',
  },
  {
    id: 'an-5',
    channel: 'Savanna House',
    title: 'Inter-house athletics — house colours Friday',
    body: 'Savanna, bring your spikes and bring your lungs. Captains to submit final lists by Thursday.',
    author: 'P. Mhlanga — Savanna Housemaster',
    publishedAt: '2026-04-19T16:00:00Z',
  },
];

/* ------------------------------------------------------------------ */
/*  Fees                                                               */
/* ------------------------------------------------------------------ */

export interface DemoInvoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  term: string;
  subtotal: string;
  balance: string;
  status: 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  dueDate: string;
  lineItems: { label: string; amount: string }[];
}

export const INVOICES: readonly DemoInvoice[] = [
  {
    id: 'inv-farai-t1',
    studentId: 's-farai',
    invoiceNumber: 'INV-2026-T1-FM0042',
    term: 'Term 1, 2026',
    subtotal: '1650.00',
    balance: '0.00',
    status: 'PAID',
    dueDate: '2026-02-01',
    lineItems: [
      { label: 'Tuition', amount: '1200.00' },
      { label: 'Development Levy', amount: '200.00' },
      { label: 'ICT Levy', amount: '100.00' },
      { label: 'Sports Levy', amount: '100.00' },
      { label: 'Books & Stationery', amount: '50.00' },
    ],
  },
  {
    id: 'inv-farai-t2',
    studentId: 's-farai',
    invoiceNumber: 'INV-2026-T2-FM0042',
    term: 'Term 2, 2026',
    subtotal: '1650.00',
    balance: '850.00',
    status: 'PARTIALLY_PAID',
    dueDate: '2026-05-09',
    lineItems: [
      { label: 'Tuition', amount: '1200.00' },
      { label: 'Development Levy', amount: '200.00' },
      { label: 'ICT Levy', amount: '100.00' },
      { label: 'Sports Levy', amount: '100.00' },
      { label: 'Books & Stationery', amount: '50.00' },
    ],
  },
  {
    id: 'inv-tanaka-t2',
    studentId: 's-tanaka',
    invoiceNumber: 'INV-2026-T2-TM0081',
    term: 'Term 2, 2026',
    subtotal: '1450.00',
    balance: '1450.00',
    status: 'ISSUED',
    dueDate: '2026-05-09',
    lineItems: [
      { label: 'Tuition', amount: '1050.00' },
      { label: 'Development Levy', amount: '200.00' },
      { label: 'ICT Levy', amount: '100.00' },
      { label: 'Sports Levy', amount: '100.00' },
    ],
  },
];

export interface DemoPayment {
  id: string;
  studentId: string;
  invoiceId: string;
  method: string;
  amount: string;
  reference: string;
  status: 'VERIFIED' | 'RECONCILED' | 'PENDING_VERIFICATION' | 'FAILED';
  paidAt: string;
}

export const PAYMENTS: readonly DemoPayment[] = [
  {
    id: 'pay-1',
    studentId: 's-farai',
    invoiceId: 'inv-farai-t1',
    method: 'EcoCash',
    amount: '1650.00',
    reference: 'EC-20260115-A4F7',
    status: 'RECONCILED',
    paidAt: '2026-01-15T08:33:00Z',
  },
  {
    id: 'pay-2',
    studentId: 's-farai',
    invoiceId: 'inv-farai-t2',
    method: 'CBZ Transfer',
    amount: '800.00',
    reference: 'CBZ-20260418-B12C',
    status: 'RECONCILED',
    paidAt: '2026-04-18T14:02:00Z',
  },
];

/* ------------------------------------------------------------------ */
/*  Bank-slip queue (Admin)                                            */
/* ------------------------------------------------------------------ */

export type SlipStep =
  | 'IMAGE_ENHANCEMENT'
  | 'OCR'
  | 'STRUCTURAL_PARSING'
  | 'ACCOUNT_VERIFICATION'
  | 'STATEMENT_RECONCILIATION'
  | 'ACCOUNT_UPDATE';

export interface DemoSlip {
  id: string;
  studentId: string;
  uploadedBy: string;
  uploadedAt: string;
  status:
    | 'UPLOADED'
    | 'OCR_IN_PROGRESS'
    | 'OCR_COMPLETE'
    | 'PARSED'
    | 'VERIFIED'
    | 'RECONCILED'
    | 'FAILED'
    | 'MANUAL_REVIEW';
  detectedBank?: 'CBZ' | 'Stanbic' | 'ZB' | 'Steward';
  parsedAmount?: string;
  parsedCurrency?: 'USD' | 'ZWG';
  parsedReference?: string;
  confidence?: number;
  failureReason?: string;
  steps: Array<{ step: SlipStep; outcome: 'done' | 'in-progress' | 'failed' | 'pending'; ms?: number; note?: string }>;
}

const STEP_ORDER: SlipStep[] = [
  'IMAGE_ENHANCEMENT',
  'OCR',
  'STRUCTURAL_PARSING',
  'ACCOUNT_VERIFICATION',
  'STATEMENT_RECONCILIATION',
  'ACCOUNT_UPDATE',
];

function buildSteps(upTo: number, failedAt?: number): DemoSlip['steps'] {
  return STEP_ORDER.map((step, idx) => {
    if (failedAt !== undefined && idx === failedAt) return { step, outcome: 'failed' as const };
    if (idx < upTo) return { step, outcome: 'done' as const, ms: 80 + idx * 120 };
    if (idx === upTo && failedAt === undefined) return { step, outcome: 'in-progress' as const };
    return { step, outcome: 'pending' as const };
  });
}

export const SLIPS: readonly DemoSlip[] = [
  {
    id: 'slip-1',
    studentId: 's-farai',
    uploadedBy: 'Sekai Moyo (parent)',
    uploadedAt: '2026-04-22T08:14:00Z',
    status: 'RECONCILED',
    detectedBank: 'CBZ',
    parsedAmount: '800.00',
    parsedCurrency: 'USD',
    parsedReference: 'HHA-2023-0042',
    confidence: 96,
    steps: buildSteps(6),
  },
  {
    id: 'slip-2',
    studentId: 's-tanaka',
    uploadedBy: 'Sekai Moyo (parent)',
    uploadedAt: '2026-04-22T11:03:00Z',
    status: 'VERIFIED',
    detectedBank: 'Stanbic',
    parsedAmount: '1450.00',
    parsedCurrency: 'USD',
    parsedReference: 'HHA-2025-0081',
    confidence: 92,
    steps: [...buildSteps(4), { step: 'STATEMENT_RECONCILIATION', outcome: 'in-progress' as const }, { step: 'ACCOUNT_UPDATE', outcome: 'pending' as const }],
  },
  {
    id: 'slip-3',
    studentId: 's-chipo',
    uploadedBy: 'John Banda (guardian)',
    uploadedAt: '2026-04-22T11:48:00Z',
    status: 'OCR_IN_PROGRESS',
    detectedBank: 'ZB',
    steps: buildSteps(1),
  },
  {
    id: 'slip-4',
    studentId: 's-ruvimbo',
    uploadedBy: 'Ruvimbo Sibanda (student)',
    uploadedAt: '2026-04-22T09:27:00Z',
    status: 'MANUAL_REVIEW',
    detectedBank: 'Steward',
    parsedAmount: '1650.00',
    parsedCurrency: 'USD',
    parsedReference: 'HHA-2023-0049',
    confidence: 74,
    failureReason: 'Teller stamp illegible; confidence below 80% threshold.',
    steps: buildSteps(3),
  },
  {
    id: 'slip-5',
    studentId: 's-tinashe',
    uploadedBy: 'T. Ncube (parent)',
    uploadedAt: '2026-04-21T16:33:00Z',
    status: 'FAILED',
    detectedBank: 'CBZ',
    parsedAmount: '500.00',
    parsedCurrency: 'USD',
    confidence: 88,
    failureReason: 'Beneficiary account on slip does not match any HHA registered account.',
    steps: buildSteps(3, 3),
  },
  {
    id: 'slip-6',
    studentId: 's-rudo',
    uploadedBy: 'Rudo Mutasa (student)',
    uploadedAt: '2026-04-22T12:10:00Z',
    status: 'UPLOADED',
    steps: buildSteps(0),
  },
];

/* ------------------------------------------------------------------ */
/*  Attendance                                                         */
/* ------------------------------------------------------------------ */

export interface AttendanceRow {
  studentId: string;
  name: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export const ATTENDANCE_TODAY_FORM3_BLUE: readonly AttendanceRow[] = STUDENTS.filter(
  (s) => s.form === 'Form 3' && s.stream === 'Blue',
).map((s, i) => ({
  studentId: s.id,
  name: `${s.firstName} ${s.lastName}`,
  status: (['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'PRESENT', 'ABSENT'] as const)[i % 6] ?? 'PRESENT',
}));

/* ------------------------------------------------------------------ */
/*  Calendar events                                                    */
/* ------------------------------------------------------------------ */

export interface DemoEvent {
  id: string;
  title: string;
  kind: 'TERM' | 'EXAM' | 'SPORTS' | 'PARENTS' | 'OTHER';
  date: string;
  time?: string;
  location?: string;
}

export const CALENDAR: readonly DemoEvent[] = [
  { id: 'ev-1', title: 'Term 2 opens', kind: 'TERM', date: '2026-05-05', time: '07:00' },
  { id: 'ev-2', title: 'Inter-house athletics', kind: 'SPORTS', date: '2026-04-25', time: '08:00', location: 'Main field' },
  { id: 'ev-3', title: 'Form 3 parents\' evening', kind: 'PARENTS', date: '2026-05-14', time: '17:00', location: 'Main hall' },
  { id: 'ev-4', title: 'Mid-term examinations begin', kind: 'EXAM', date: '2026-06-08' },
  { id: 'ev-5', title: 'Speech day', kind: 'OTHER', date: '2026-07-19', time: '10:00', location: 'Chapel' },
];
