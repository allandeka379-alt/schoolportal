/**
 * Extended student-specific fixtures for the redesigned student portal.
 *
 * Kept separate from the base `fixtures.ts` so the existing portals keep
 * working unchanged. Everything here is a pure extension and re-exposes a
 * few base entities via selectors so student pages only import from one
 * place.
 */
import {
  ASSIGNMENTS_FOR_FARAI,
  type DemoAssignment,
  STUDENTS,
  type DemoStudent,
  SUBJECTS,
} from './fixtures';

/* ------------------------------------------------------------------ */
/*  Student profile helper                                             */
/* ------------------------------------------------------------------ */

export const ME_STUDENT: DemoStudent = STUDENTS.find((s) => s.id === 's-farai')!;

export const CURRENT_TERM = {
  label: 'Term 2, 2026',
  weekNumber: 5,
  averagePercent: 76,
  classPositionOptedIn: true,
  classPosition: 8,
  classSize: 32,
} as const;

/* ------------------------------------------------------------------ */
/*  Assignments — enriched with the fields the detail page needs       */
/* ------------------------------------------------------------------ */

export interface RubricRow {
  criterion: string;
  descriptor: string;
  maxPoints: number;
}

export interface AssignmentDetail extends DemoAssignment {
  lineMaxMarks: number;
  body: string;
  rubric: RubricRow[];
  weighting: 'Continuous' | 'Mid-Term' | 'End-Term';
}

/**
 * Rich detail per assignment. Keyed by assignment ID so the detail route
 * is a pure lookup.
 */
export const ASSIGNMENT_DETAILS: Record<string, AssignmentDetail> = Object.fromEntries(
  ASSIGNMENTS_FOR_FARAI.map((a) => {
    const body = detailBodyFor(a);
    return [
      a.id,
      {
        ...a,
        lineMaxMarks: a.maxMarks,
        body,
        rubric: rubricFor(a),
        weighting: 'Continuous' as const,
      },
    ];
  }),
);

function detailBodyFor(a: DemoAssignment): string {
  if (a.subjectCode === 'MATH') {
    return [
      'Work through questions 1–12 on page 84 of your textbook. Show every step of your working — marks will be awarded for method as well as the final answer.',
      '',
      'For each quadratic:',
      '• Identify the coefficients a, b and c.',
      '• Decide whether to factor, complete the square, or use the quadratic formula — and state your choice.',
      '• Solve for x, giving both roots.',
      '',
      'Upload a clear scan or photograph of each page. Hand-written work on lined paper is preferred over typed — this assignment is about understanding your working, not your typography.',
    ].join('\n');
  }
  if (a.subjectCode === 'CHEM') {
    return [
      'Write up the Tuesday practical as a formal report. The structure follows the usual:',
      '',
      '1. Aim — one clear sentence.',
      '2. Apparatus — a labelled diagram.',
      '3. Method — numbered steps, past tense.',
      '4. Results — the observations table we recorded on the board.',
      '5. Discussion — explain the ionic bonds formed and why the products took the shape they did.',
      '6. Conclusion — one paragraph.',
      '',
      'Between 600 and 800 words. Submit as a single PDF.',
    ].join('\n');
  }
  if (a.subjectCode === 'HIST') {
    return [
      'Write a 1,200-word essay on the causes, course, and consequences of the First Chimurenga (1896–1897).',
      '',
      'Your argument should be your own, but it must rest on at least three sources — including one primary source from the period. The school archive has several; Mrs Chirove is available during library period to help you find them.',
      '',
      'Structure is yours to choose, but I expect an introduction that states your argument clearly, a body that supports it, and a conclusion that considers why the event still matters. Reference your sources using the school footnote style.',
    ].join('\n');
  }
  if (a.subjectCode === 'BIO') {
    return [
      'Draw a labelled diagram of the light-dependent reactions of photosynthesis. Include the thylakoid membrane, photosystems I and II, the electron transport chain, and the splitting of water.',
      '',
      'Beneath the diagram, write a 300-word summary explaining what happens at each stage and why the reactions are called "light-dependent". Hand-drawn diagrams photographed clearly are perfectly acceptable.',
    ].join('\n');
  }
  return a.instructions;
}

function rubricFor(a: DemoAssignment): RubricRow[] {
  if (a.subjectCode === 'MATH') {
    return [
      { criterion: 'Method', descriptor: 'Clear choice of technique, stepwise working', maxPoints: 16 },
      { criterion: 'Accuracy', descriptor: 'Correct arithmetic and algebraic manipulation', maxPoints: 16 },
      { criterion: 'Presentation', descriptor: 'Legible, logical, well-organised', maxPoints: 8 },
    ];
  }
  if (a.subjectCode === 'CHEM') {
    return [
      { criterion: 'Method', descriptor: 'Procedural clarity', maxPoints: 8 },
      { criterion: 'Results', descriptor: 'Observations table and diagrams', maxPoints: 10 },
      { criterion: 'Discussion', descriptor: 'Reasoning from first principles', maxPoints: 12 },
    ];
  }
  return [];
}

/* ------------------------------------------------------------------ */
/*  Recent marks (dashboard zone 5)                                    */
/* ------------------------------------------------------------------ */

export interface RecentMark {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  mark: number;
  outOf: number;
  returnedAgo: string;
}

export const RECENT_MARKS: readonly RecentMark[] = [
  {
    id: 'rm-1',
    subjectCode: 'ENGL',
    subjectName: 'English',
    title: 'Comprehension — The Old Man and the Medal',
    mark: 22,
    outOf: 25,
    returnedAgo: '2 days ago',
  },
  {
    id: 'rm-2',
    subjectCode: 'SHON',
    subjectName: 'Shona',
    title: 'Mabasa Akanaka — Poetry analysis',
    mark: 34,
    outOf: 40,
    returnedAgo: '4 days ago',
  },
  {
    id: 'rm-3',
    subjectCode: 'CHEM',
    subjectName: 'Chemistry',
    title: 'Atomic structure worksheet',
    mark: 16,
    outOf: 30,
    returnedAgo: '1 week ago',
  },
];

/* ------------------------------------------------------------------ */
/*  Fees summary (dashboard zone 6)                                    */
/* ------------------------------------------------------------------ */

export const FEES_SUMMARY = {
  termLabel: 'Term 2, 2026',
  currency: 'USD' as const,
  totalDue: '850.00',
  paid: '620.00',
  outstanding: '230.00',
  status: 'PARTIAL' as 'PAID' | 'PARTIAL' | 'OVERDUE',
  breakdown: [
    { label: 'Tuition', due: '650.00', paid: '520.00', balance: '130.00' },
    { label: 'ICT Levy', due: '100.00', paid: '100.00', balance: '0.00' },
    { label: 'Sports Levy', due: '60.00', paid: '0.00', balance: '60.00' },
    { label: 'Books & Stationery', due: '40.00', paid: '0.00', balance: '40.00' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Public announcements (extra for the /announcements feed)           */
/* ------------------------------------------------------------------ */

export interface StudentAnnouncement {
  id: string;
  category: 'Urgent' | 'Academic' | 'Event' | 'General';
  author: string;
  publishedAgo: string;
  publishedAt: string;
  pinned: boolean;
  unread: boolean;
  acknowledged: boolean;
  title: string;
  body: string;
}

export const STUDENT_ANNOUNCEMENTS: readonly StudentAnnouncement[] = [
  {
    id: 'ann-1',
    category: 'Urgent',
    author: "Headmaster's Office",
    publishedAgo: '2 hours ago',
    publishedAt: '2026-04-22T12:00:00Z',
    pinned: true,
    unread: true,
    acknowledged: false,
    title: 'Sports Day rescheduled to 2 May',
    body:
      'Due to expected rainfall on Friday, Sports Day has been moved from 25 April to Saturday 2 May. House captains, please notify your teams by end of day. The programme and bus arrangements remain the same; parents will be emailed separately.',
  },
  {
    id: 'ann-2',
    category: 'Academic',
    author: 'Examinations Office',
    publishedAgo: 'yesterday',
    publishedAt: '2026-04-21T14:00:00Z',
    pinned: false,
    unread: true,
    acknowledged: false,
    title: 'ZIMSEC O-Level registration closes Friday',
    body:
      'Form 4 candidates must confirm their ZIMSEC subject selections by Friday 25 April. Log in to the portal and visit Profile → Examinations to confirm or amend.',
  },
  {
    id: 'ann-3',
    category: 'Event',
    author: 'Library',
    publishedAgo: '2 days ago',
    publishedAt: '2026-04-20T09:00:00Z',
    pinned: false,
    unread: false,
    acknowledged: false,
    title: 'Library Week begins Monday',
    body:
      'A free book drive, author readings with Petina Gappah, and the Form 3 reading competition finals. Full programme in the library or under Events in the portal.',
  },
  {
    id: 'ann-4',
    category: 'General',
    author: "Headmaster's Office",
    publishedAgo: '3 days ago',
    publishedAt: '2026-04-19T13:00:00Z',
    pinned: false,
    unread: false,
    acknowledged: false,
    title: 'Mid-term break notice',
    body:
      'School closes Friday 24 April at 12:30. Boarders may be collected any time between 13:00 and 17:00. Classes resume Wednesday 29 April.',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Today's timetable (single-day preview for dashboard)               */
/* ------------------------------------------------------------------ */

export interface TodaySlot {
  start: string;
  subject: string;
  teacher?: string;
  room?: string;
  kind: 'class' | 'break' | 'lunch';
  current?: boolean;
}

export const TODAY_SLOTS: readonly TodaySlot[] = [
  { start: '07:30', subject: 'Mathematics', teacher: 'Mrs Dziva', room: 'B-4', kind: 'class' },
  { start: '08:30', subject: 'English', teacher: 'Ms Sithole', room: 'A-2', kind: 'class' },
  { start: '09:30', subject: 'Break', kind: 'break' },
  { start: '10:00', subject: 'Biology', teacher: 'Ms Banda', room: 'Lab 1', kind: 'class', current: true },
  { start: '11:00', subject: 'Shona', teacher: 'Mr Mutasa', room: 'A-5', kind: 'class' },
  { start: '12:00', subject: 'Lunch', kind: 'lunch' },
  { start: '13:00', subject: 'History', teacher: 'Mr Chakanetsa', room: 'A-7', kind: 'class' },
  { start: '14:00', subject: 'Sports', room: 'Main field', kind: 'class' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function subjectNameByCode(code: string): string {
  return SUBJECTS.find((s) => s.code === code)?.name ?? code;
}

/** Returns "due today", "due tomorrow", "due in 5 days", "due next week" */
export function dueLabel(dueAtIso: string): { label: string; tone: 'due-today' | 'soon' | 'later' | 'overdue' } {
  const due = new Date(dueAtIso);
  const now = new Date();
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, tone: 'overdue' };
  if (diff === 0) return { label: 'due today', tone: 'due-today' };
  if (diff === 1) return { label: 'due tomorrow', tone: 'soon' };
  if (diff <= 3) return { label: `due in ${diff} days`, tone: 'soon' };
  if (diff <= 7) return { label: `due in ${diff} days`, tone: 'later' };
  return { label: `due in ${Math.ceil(diff / 7)} weeks`, tone: 'later' };
}

/** "Good morning" / "Good afternoon" / "Good evening" */
export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
