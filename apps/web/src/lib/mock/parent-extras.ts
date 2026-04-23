/**
 * Parent-portal fixtures. Extends the base fixtures; kept separate so other
 * portals stay untouched.
 *
 * The Moyo family used for the demo:
 *   - Sekai Moyo (Mrs) — parent account
 *   - Farai Moyo    — Form 4A, 15, boarder
 *   - Tanaka Moyo   — Form 1B, 12, day scholar
 *   - Rumbi Moyo    — Form 2A (second daughter), 13, day scholar — added for
 *                     a more multi-child feel
 */
export const ME_PARENT = {
  title: 'Mrs',
  firstName: 'Sekai',
  lastName: 'Moyo',
  email: 'parent@hha.ac.zw',
  displayName: 'Mrs Moyo',
  preferredLanguage: 'EN' as const,
  avatarInitials: 'SM',
} as const;

/* ------------------------------------------------------------------ */
/*  Children                                                           */
/* ------------------------------------------------------------------ */

export interface ParentChild {
  id: string;
  firstName: string;
  lastName: string;
  form: string;
  formTeacher: string;
  house: string;
  boardingStatus: 'Day' | 'Weekly boarder' | 'Full boarder';
  termAveragePercent: number;
  termAverageTrend: 'up' | 'flat' | 'down';
  deltaFromLastTerm: number;
  attendancePercent: number;
  classPosition: number;
  classSize: number;
  attentionItems: number;
  avatarInitials: string;
  colourTone: 'terracotta' | 'ochre' | 'earth' | 'sage';
  marksNewToday?: boolean;
  lastIncident?: string;
}

export const PARENT_CHILDREN: ParentChild[] = [
  {
    id: 's-farai',
    firstName: 'Farai',
    lastName: 'Moyo',
    form: 'Form 4A',
    formTeacher: 'Mrs Dziva',
    house: 'Savanna',
    boardingStatus: 'Day',
    termAveragePercent: 78,
    termAverageTrend: 'up',
    deltaFromLastTerm: 4,
    attendancePercent: 96,
    classPosition: 8,
    classSize: 32,
    attentionItems: 2,
    avatarInitials: 'FM',
    colourTone: 'terracotta',
    marksNewToday: true,
    lastIncident: 'House points awarded in English',
  },
  {
    id: 's-rumbi',
    firstName: 'Rumbi',
    lastName: 'Moyo',
    form: 'Form 2A',
    formTeacher: 'Mr Gondo',
    house: 'Heritage',
    boardingStatus: 'Day',
    termAveragePercent: 82,
    termAverageTrend: 'up',
    deltaFromLastTerm: 3,
    attendancePercent: 99,
    classPosition: 5,
    classSize: 30,
    attentionItems: 0,
    avatarInitials: 'RM',
    colourTone: 'ochre',
  },
  {
    id: 's-tanaka',
    firstName: 'Tanaka',
    lastName: 'Moyo',
    form: 'Form 1B',
    formTeacher: 'Ms Banda',
    house: 'Savanna',
    boardingStatus: 'Day',
    termAveragePercent: 71,
    termAverageTrend: 'down',
    deltaFromLastTerm: -6,
    attendancePercent: 89,
    classPosition: 18,
    classSize: 28,
    attentionItems: 1,
    avatarInitials: 'TM',
    colourTone: 'earth',
    marksNewToday: false,
  },
];

export function findChild(id: string): ParentChild {
  return PARENT_CHILDREN.find((c) => c.id === id) ?? PARENT_CHILDREN[0]!;
}

/* ------------------------------------------------------------------ */
/*  Per-child progress snapshot                                        */
/* ------------------------------------------------------------------ */

export interface SubjectRow {
  subjectCode: string;
  subjectName: string;
  teacher: string;
  percent: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  trend: 'up' | 'flat' | 'down';
  classAverage: number;
  hasNewMark: boolean;
}

const GRADES_FARAI: SubjectRow[] = [
  { subjectCode: 'MATH', subjectName: 'Mathematics', teacher: 'Mrs Dziva',      percent: 80, grade: 'A', trend: 'up',   classAverage: 76, hasNewMark: true  },
  { subjectCode: 'ENGL', subjectName: 'English',     teacher: 'Mr Gondo',       percent: 71, grade: 'B', trend: 'flat', classAverage: 73, hasNewMark: false },
  { subjectCode: 'SHON', subjectName: 'Shona',       teacher: 'Mrs Chiweshe',   percent: 88, grade: 'A', trend: 'up',   classAverage: 78, hasNewMark: false },
  { subjectCode: 'HIST', subjectName: 'History',     teacher: 'Mr Chakanetsa',  percent: 69, grade: 'B', trend: 'down', classAverage: 72, hasNewMark: true  },
  { subjectCode: 'BIO',  subjectName: 'Biology',     teacher: 'Dr Madziva',     percent: 81, grade: 'A', trend: 'up',   classAverage: 74, hasNewMark: false },
  { subjectCode: 'GEOG', subjectName: 'Geography',   teacher: 'Mrs Dube',       percent: 75, grade: 'B', trend: 'up',   classAverage: 70, hasNewMark: false },
  { subjectCode: 'PHYS', subjectName: 'Physics',     teacher: 'Ms Nyathi',      percent: 72, grade: 'B', trend: 'up',   classAverage: 68, hasNewMark: false },
  { subjectCode: 'CHEM', subjectName: 'Chemistry',   teacher: 'Mr Mhlanga',     percent: 74, grade: 'B', trend: 'flat', classAverage: 71, hasNewMark: false },
];

const GRADES_RUMBI: SubjectRow[] = [
  { subjectCode: 'MATH', subjectName: 'Mathematics', teacher: 'Mr Phiri',       percent: 85, grade: 'A', trend: 'up',   classAverage: 74, hasNewMark: false },
  { subjectCode: 'ENGL', subjectName: 'English',     teacher: 'Mrs Sithole',    percent: 88, grade: 'A', trend: 'up',   classAverage: 75, hasNewMark: true  },
  { subjectCode: 'SHON', subjectName: 'Shona',       teacher: 'Mrs Mutasa',     percent: 79, grade: 'B', trend: 'flat', classAverage: 76, hasNewMark: false },
  { subjectCode: 'HIST', subjectName: 'History',     teacher: 'Mr Chakanetsa',  percent: 81, grade: 'A', trend: 'up',   classAverage: 72, hasNewMark: false },
  { subjectCode: 'BIO',  subjectName: 'Biology',     teacher: 'Ms Banda',       percent: 83, grade: 'A', trend: 'up',   classAverage: 74, hasNewMark: false },
  { subjectCode: 'GEOG', subjectName: 'Geography',   teacher: 'Mrs Dube',       percent: 77, grade: 'B', trend: 'flat', classAverage: 71, hasNewMark: false },
  { subjectCode: 'PHYS', subjectName: 'Physics',     teacher: 'Ms Nyathi',      percent: 78, grade: 'B', trend: 'up',   classAverage: 69, hasNewMark: false },
  { subjectCode: 'ART',  subjectName: 'Art',         teacher: 'Mr Shoko',       percent: 86, grade: 'A', trend: 'up',   classAverage: 74, hasNewMark: false },
];

const GRADES_TANAKA: SubjectRow[] = [
  { subjectCode: 'MATH', subjectName: 'Mathematics', teacher: 'Mrs Dziva',      percent: 65, grade: 'C', trend: 'down', classAverage: 73, hasNewMark: true  },
  { subjectCode: 'ENGL', subjectName: 'English',     teacher: 'Ms Sithole',     percent: 72, grade: 'B', trend: 'flat', classAverage: 72, hasNewMark: false },
  { subjectCode: 'SHON', subjectName: 'Shona',       teacher: 'Mrs Chiweshe',   percent: 81, grade: 'A', trend: 'up',   classAverage: 75, hasNewMark: false },
  { subjectCode: 'HIST', subjectName: 'History',     teacher: 'Mr Chakanetsa',  percent: 68, grade: 'B', trend: 'flat', classAverage: 70, hasNewMark: false },
  { subjectCode: 'BIO',  subjectName: 'Biology',     teacher: 'Ms Banda',       percent: 74, grade: 'B', trend: 'up',   classAverage: 73, hasNewMark: false },
  { subjectCode: 'GEOG', subjectName: 'Geography',   teacher: 'Mrs Dube',       percent: 70, grade: 'B', trend: 'flat', classAverage: 69, hasNewMark: false },
  { subjectCode: 'PHYS', subjectName: 'Physics',     teacher: 'Ms Nyathi',      percent: 66, grade: 'C', trend: 'down', classAverage: 68, hasNewMark: false },
  { subjectCode: 'CHEM', subjectName: 'Chemistry',   teacher: 'Mr Mhlanga',     percent: 69, grade: 'B', trend: 'flat', classAverage: 71, hasNewMark: false },
];

export function gradesFor(childId: string): SubjectRow[] {
  if (childId === 's-rumbi') return GRADES_RUMBI;
  if (childId === 's-tanaka') return GRADES_TANAKA;
  return GRADES_FARAI;
}

/* ------------------------------------------------------------------ */
/*  Attention items (per-child, surfaced on the dashboard)             */
/* ------------------------------------------------------------------ */

export type AttentionTone = 'overdue' | 'warning' | 'info';

export interface ParentAttention {
  id: string;
  childId: string;
  tone: AttentionTone;
  label: string;
  detail: string;
  href: string;
}

export const PARENT_ATTENTION: readonly ParentAttention[] = [
  {
    id: 'pa-1',
    childId: 's-farai',
    tone: 'overdue',
    label: 'Term 2 fees — USD 230.00 outstanding',
    detail: 'Due Friday 9 May',
    href: '/parent/fees',
  },
  {
    id: 'pa-2',
    childId: 's-farai',
    tone: 'warning',
    label: 'Permission slip — Science Fair trip',
    detail: 'Due Friday · 2 May trip',
    href: '/parent/calendar',
  },
  {
    id: 'pa-3',
    childId: 's-farai',
    tone: 'info',
    label: 'Message from Mrs Dziva awaiting reply',
    detail: 'Mathematics · sent yesterday',
    href: '/parent/messages',
  },
  {
    id: 'pa-4',
    childId: 's-tanaka',
    tone: 'warning',
    label: 'Term 2 report — please acknowledge',
    detail: "Released 2 days ago · Tanaka's",
    href: '/parent/reports',
  },
];

export function attentionFor(childId: string): ParentAttention[] {
  return PARENT_ATTENTION.filter((a) => a.childId === childId);
}

/* ------------------------------------------------------------------ */
/*  Attendance history — calendar heatmap data                         */
/* ------------------------------------------------------------------ */

export type AttendanceDayKind = 'present' | 'absent-unexcused' | 'absent-excused' | 'late' | 'excused-leave' | 'weekend' | 'holiday' | 'future';

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  kind: AttendanceDayKind;
  note?: string;
}

/** Build a term's worth of attendance days for the heatmap. */
export function buildAttendance(childId: string): AttendanceDay[] {
  const start = new Date('2026-05-05'); // Term 2 start
  const days: AttendanceDay[] = [];
  for (let i = 0; i < 70; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const iso = d.toISOString().slice(0, 10);
    const future = d.getTime() > Date.now() + 14 * 86400000;
    let kind: AttendanceDayKind = 'present';
    let note: string | undefined;
    if (dow === 0 || dow === 6) kind = 'weekend';
    else if (future) kind = 'future';
    else if (iso === '2026-05-15') kind = 'holiday';
    else {
      // Sprinkle absences & latenesses in a child-specific seed.
      const seed = (i * 7 + childId.length) % 17;
      if (childId === 's-tanaka' && (seed === 3 || seed === 9 || seed === 13)) {
        kind = seed === 3 ? 'absent-unexcused' : seed === 9 ? 'late' : 'absent-excused';
        note = seed === 3 ? 'No reason provided' : seed === 9 ? 'Arrived 08:15' : 'Dental appointment';
      } else if (childId === 's-farai' && seed === 11) {
        kind = 'late';
        note = 'Transport';
      }
    }
    days.push({ date: iso, kind, note });
  }
  return days;
}

export interface AttendanceEntry {
  id: string;
  date: string;
  childId: string;
  type: 'absent-full-day' | 'absent-periods' | 'late-arrival';
  status: 'excused' | 'unexcused' | 'under-review';
  reason?: string;
  periodsMissed?: string;
  document?: string;
}

export const RECENT_ABSENCES: readonly AttendanceEntry[] = [
  {
    id: 'ae-1',
    date: '2026-06-12',
    childId: 's-tanaka',
    type: 'absent-full-day',
    status: 'unexcused',
    reason: undefined,
    periodsMissed: 'All periods',
  },
  {
    id: 'ae-2',
    date: '2026-06-05',
    childId: 's-tanaka',
    type: 'absent-full-day',
    status: 'excused',
    reason: 'Dental appointment (Dr Mabika)',
    document: 'dentist-note.pdf',
    periodsMissed: 'All periods',
  },
  {
    id: 'ae-3',
    date: '2026-05-28',
    childId: 's-tanaka',
    type: 'late-arrival',
    status: 'excused',
    reason: 'Bus broke down',
    periodsMissed: 'Period 1',
  },
  {
    id: 'ae-4',
    date: '2026-05-20',
    childId: 's-farai',
    type: 'late-arrival',
    status: 'excused',
    reason: 'Transport',
    periodsMissed: 'Period 1 (5 min late)',
  },
];

/* ------------------------------------------------------------------ */
/*  Fees — family total with per-child breakdown                       */
/* ------------------------------------------------------------------ */

export interface FeeLine {
  label: string;
  due: number;
  paid: number;
}

export interface ChildFees {
  childId: string;
  siblingDiscount: number; // percent applied as a line-credit
  lines: FeeLine[];
}

export const FAMILY_FEES: readonly ChildFees[] = [
  {
    childId: 's-farai',
    siblingDiscount: 0,
    lines: [
      { label: 'Tuition', due: 450, paid: 450 },
      { label: 'Laboratory Levy', due: 30, paid: 0 },
      { label: 'Sports & Extracurricular', due: 20, paid: 20 },
      { label: 'Examination Registration', due: 30, paid: 0 },
      { label: 'ICT Levy', due: 100, paid: 0 },
      { label: 'Books & Stationery', due: 50, paid: 0 },
    ],
  },
  {
    childId: 's-rumbi',
    siblingDiscount: 5,
    lines: [
      { label: 'Tuition', due: 420, paid: 420 },
      { label: 'Sports & Extracurricular', due: 20, paid: 20 },
      { label: 'ICT Levy', due: 80, paid: 80 },
      { label: 'Books & Stationery', due: 40, paid: 40 },
    ],
  },
  {
    childId: 's-tanaka',
    siblingDiscount: 5,
    lines: [
      { label: 'Tuition', due: 380, paid: 150 },
      { label: 'Sports & Extracurricular', due: 20, paid: 0 },
      { label: 'ICT Levy', due: 80, paid: 0 },
      { label: 'Books & Stationery', due: 40, paid: 0 },
    ],
  },
];

export function sumChildFees(f: ChildFees) {
  const due = f.lines.reduce((s, l) => s + l.due, 0);
  const paid = f.lines.reduce((s, l) => s + l.paid, 0);
  const discountAmt = Math.round(due * (f.siblingDiscount / 100) * 100) / 100;
  return {
    due,
    paid,
    discountAmt,
    outstanding: Math.max(0, due - paid - discountAmt),
  };
}

export const FAMILY_FEES_SUMMARY = (() => {
  const totals = FAMILY_FEES.reduce(
    (acc, cf) => {
      const s = sumChildFees(cf);
      return {
        due: acc.due + s.due,
        paid: acc.paid + s.paid,
        discount: acc.discount + s.discountAmt,
        outstanding: acc.outstanding + s.outstanding,
      };
    },
    { due: 0, paid: 0, discount: 0, outstanding: 0 },
  );
  return totals;
})();

export const PAYMENT_HISTORY = [
  { id: 'ph1', when: '15 Jan 2026', method: 'EcoCash', amount: 450, child: 'Farai Moyo', reference: 'EC-20260115-A4F7', status: 'reconciled' },
  { id: 'ph2', when: '14 Jan 2026', method: 'CBZ Transfer', amount: 420, child: 'Rumbi Moyo', reference: 'CBZ-20260114-R2P0', status: 'reconciled' },
  { id: 'ph3', when: '14 Jan 2026', method: 'Bank slip', amount: 150, child: 'Tanaka Moyo', reference: 'SLIP-20260114-T1', status: 'reconciled' },
  { id: 'ph4', when: '12 Jan 2026', method: 'EcoCash', amount: 20, child: 'Farai Moyo', reference: 'EC-20260112-S2F', status: 'reconciled' },
  { id: 'ph5', when: '10 Jan 2026', method: 'OneMoney', amount: 120, child: 'Rumbi Moyo', reference: 'OM-20260110-B1M', status: 'reconciled' },
] as const;

/* ------------------------------------------------------------------ */
/*  Reports                                                            */
/* ------------------------------------------------------------------ */

export type ConductRating = 'Excellent' | 'Good' | 'Satisfactory' | 'Needs improvement';

export interface ReportSubjectRow {
  code: string;
  name: string;
  teacher: string;
  ca: number; // Continuous assessment out of 40
  exam: number; // End-of-term exam out of 60
  total: number; // Combined 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  position: number; // position in subject class
  classSize: number;
  classAverage: number;
  comment: string;
  initials: string; // subject teacher initials for sign-off
}

export interface ParentReport {
  id: string;
  childId: string;
  term: string;
  year: number;
  releasedOn: string;
  average: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  position: number;
  classSize: number;
  attendance: number;
  daysAbsent: number;
  daysLate: number;
  conduct: ConductRating;
  leadership: string; // e.g. "Form prefect" or "—"
  housePoints: number;
  formTeacherName: string;
  formTeacherComment: string;
  headmasterName: string;
  headmasterComment: string;
  nextTermStarts: string; // plain text date
  feesDueAmount: string; // e.g. "2,760.00"
  feesDueBy: string; // plain text date
  subjects: ReportSubjectRow[];
  acknowledged: boolean;
  current: boolean;
}

function teacherInitials(name: string): string {
  const parts = name.replace(/^(Mr|Mrs|Ms|Dr)\s+/i, '').split(/\s+/);
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase();
  return `${(parts[0] ?? '').charAt(0)}${(parts[parts.length - 1] ?? '').charAt(0)}`.toUpperCase();
}

function letterGrade(total: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B';
  if (total >= 60) return 'C';
  if (total >= 50) return 'D';
  return 'E';
}

interface SubjectSeed {
  code: string;
  name: string;
  teacher: string;
  total: number; // out of 100
  caRatio: number; // 0-1, portion of the total coming from CA
  classSize: number;
  classAverage: number;
  position: number;
  comment: string;
}

function buildSubjects(seeds: SubjectSeed[]): ReportSubjectRow[] {
  return seeds.map((s) => {
    const ca = Math.round(s.total * s.caRatio * 0.4); // CA weighted to /40
    const examScaled = Math.round(s.total * (1 - s.caRatio) * 0.6); // Exam weighted to /60
    // Bring CA+Exam into /100 at target total: scale so CA out of 40 + exam out of 60 adds up ≈ total
    const caMark = Math.min(40, Math.max(0, Math.round((s.total * 0.4) + (ca - 16) * 0.4)));
    const examMark = Math.min(60, Math.max(0, s.total - caMark));
    return {
      code: s.code,
      name: s.name,
      teacher: s.teacher,
      ca: caMark,
      exam: examMark,
      total: s.total,
      grade: letterGrade(s.total),
      position: s.position,
      classSize: s.classSize,
      classAverage: s.classAverage,
      comment: s.comment,
      initials: teacherInitials(s.teacher),
    };
  });
}

const FARAI_T2_SUBJECTS = buildSubjects([
  {
    code: 'MATH',
    name: 'Mathematics',
    teacher: 'Mrs M. Dziva',
    total: 80,
    caRatio: 0.85,
    classSize: 32,
    classAverage: 76,
    position: 6,
    comment:
      'A really encouraging term. Farai shows genuine pleasure in problem-solving. Push him to set his work out step-by-step in exams — his instinct is to jump to the answer.',
  },
  {
    code: 'ENGL',
    name: 'English Language',
    teacher: 'Mr T. Gondo',
    total: 71,
    caRatio: 0.62,
    classSize: 32,
    classAverage: 73,
    position: 14,
    comment:
      'Farai reads widely and his vocabulary is strong. The focus next term is essay structure — he tends to run paragraphs together when a clearer break would help the argument.',
  },
  {
    code: 'SHON',
    name: 'Shona',
    teacher: 'Mrs F. Chiweshe',
    total: 88,
    caRatio: 0.55,
    classSize: 32,
    classAverage: 78,
    position: 3,
    comment:
      'Excellent. Farai writes with warmth and cultural precision. He should be encouraged to enter the inter-schools essay competition.',
  },
  {
    code: 'HIST',
    name: 'History',
    teacher: 'Mr L. Chakanetsa',
    total: 69,
    caRatio: 0.45,
    classSize: 30,
    classAverage: 72,
    position: 16,
    comment:
      'A quieter term. Farai knows the material but his exam answers lack depth — practise writing timed paragraphs using the PEEL framework.',
  },
  {
    code: 'BIO',
    name: 'Biology',
    teacher: 'Dr A. Madziva',
    total: 81,
    caRatio: 0.58,
    classSize: 28,
    classAverage: 74,
    position: 5,
    comment:
      'Sharp practical sense and good diagrams. Revisit the enzyme chapter — a couple of details were missed in the end-of-term paper.',
  },
  {
    code: 'GEOG',
    name: 'Geography',
    teacher: 'Mrs P. Dube',
    total: 75,
    caRatio: 0.5,
    classSize: 30,
    classAverage: 70,
    position: 9,
    comment:
      'Thorough coursework on the Zambezi basin. Map-work is a clear strength. Next term: climate graphs.',
  },
  {
    code: 'PHYS',
    name: 'Physics',
    teacher: 'Ms S. Nyathi',
    total: 72,
    caRatio: 0.48,
    classSize: 28,
    classAverage: 68,
    position: 8,
    comment:
      'Solid understanding of mechanics. Work on units and significant figures — easy marks were missed in the calculation paper.',
  },
  {
    code: 'CHEM',
    name: 'Chemistry',
    teacher: 'Mr P. Mhlanga',
    total: 74,
    caRatio: 0.55,
    classSize: 28,
    classAverage: 71,
    position: 7,
    comment:
      'Diligent practical work. Balancing equations has improved noticeably — keep reviewing the mole concept.',
  },
]);

const RUMBI_T2_SUBJECTS = buildSubjects([
  {
    code: 'MATH',
    name: 'Mathematics',
    teacher: 'Mr J. Phiri',
    total: 85,
    caRatio: 0.6,
    classSize: 30,
    classAverage: 74,
    position: 4,
    comment:
      'Rumbi&rsquo;s reasoning is a pleasure to mark. She should now push for full solutions, including checking her answers.',
  },
  {
    code: 'ENGL',
    name: 'English Language',
    teacher: 'Mrs R. Sithole',
    total: 88,
    caRatio: 0.65,
    classSize: 30,
    classAverage: 75,
    position: 2,
    comment:
      'Wonderful writing, thoughtful and personal. Ready for GCSE-style comprehension next term.',
  },
  {
    code: 'SHON',
    name: 'Shona',
    teacher: 'Mrs F. Mutasa',
    total: 79,
    caRatio: 0.55,
    classSize: 30,
    classAverage: 76,
    position: 8,
    comment:
      'Fluent and confident. Essay structure is the next step — we are working on paragraph cohesion.',
  },
  {
    code: 'HIST',
    name: 'History',
    teacher: 'Mr L. Chakanetsa',
    total: 81,
    caRatio: 0.5,
    classSize: 30,
    classAverage: 72,
    position: 5,
    comment:
      'Strong coursework on 20th-century Southern Africa. Encourage wider reading beyond the textbook.',
  },
  {
    code: 'BIO',
    name: 'Biology',
    teacher: 'Ms N. Banda',
    total: 83,
    caRatio: 0.58,
    classSize: 28,
    classAverage: 74,
    position: 4,
    comment:
      'Excellent practicals. Diagrams are neat and well-labelled. Ready for the inter-schools science quiz.',
  },
  {
    code: 'GEOG',
    name: 'Geography',
    teacher: 'Mrs P. Dube',
    total: 77,
    caRatio: 0.52,
    classSize: 30,
    classAverage: 71,
    position: 7,
    comment:
      'Map skills are strong. Work on extended writing — her 6-mark answers need more specific examples.',
  },
  {
    code: 'PHYS',
    name: 'Physics',
    teacher: 'Ms S. Nyathi',
    total: 78,
    caRatio: 0.48,
    classSize: 28,
    classAverage: 69,
    position: 6,
    comment:
      'Good grasp of the syllabus. Pay attention to graph-drawing — axis labels and scales need to be checked.',
  },
  {
    code: 'ART',
    name: 'Art & Design',
    teacher: 'Mr K. Shoko',
    total: 86,
    caRatio: 0.85,
    classSize: 20,
    classAverage: 74,
    position: 3,
    comment:
      'A very promising portfolio. Rumbi&rsquo;s charcoal work this term is expressive and technically sound.',
  },
]);

const TANAKA_T2_SUBJECTS = buildSubjects([
  {
    code: 'MATH',
    name: 'Mathematics',
    teacher: 'Mrs M. Dziva',
    total: 65,
    caRatio: 0.55,
    classSize: 28,
    classAverage: 73,
    position: 19,
    comment:
      'Tanaka has the ability but the absences have shown. Priority next term is catching up on the indices chapter.',
  },
  {
    code: 'ENGL',
    name: 'English Language',
    teacher: 'Ms R. Sithole',
    total: 72,
    caRatio: 0.6,
    classSize: 28,
    classAverage: 72,
    position: 12,
    comment:
      'Capable reader. Her essays have good ideas but presentation lets them down — we are working on neatness.',
  },
  {
    code: 'SHON',
    name: 'Shona',
    teacher: 'Mrs F. Chiweshe',
    total: 81,
    caRatio: 0.55,
    classSize: 28,
    classAverage: 75,
    position: 4,
    comment:
      'Tanaka&rsquo;s strongest subject. She speaks with confidence in class discussions and should aim for an A next term.',
  },
  {
    code: 'HIST',
    name: 'History',
    teacher: 'Mr L. Chakanetsa',
    total: 68,
    caRatio: 0.48,
    classSize: 28,
    classAverage: 70,
    position: 15,
    comment:
      'Interested and engaged in lessons. Her exam paper was rushed — we will practise timing next term.',
  },
  {
    code: 'BIO',
    name: 'Biology',
    teacher: 'Ms N. Banda',
    total: 74,
    caRatio: 0.55,
    classSize: 28,
    classAverage: 73,
    position: 10,
    comment:
      'Good improvement since Term 1. Her practical report was one of the clearest in the class.',
  },
  {
    code: 'GEOG',
    name: 'Geography',
    teacher: 'Mrs P. Dube',
    total: 70,
    caRatio: 0.5,
    classSize: 28,
    classAverage: 69,
    position: 13,
    comment:
      'Steady progress. Focus area is extended writing; keep building those 6-mark answers.',
  },
  {
    code: 'PHYS',
    name: 'Physics',
    teacher: 'Ms S. Nyathi',
    total: 66,
    caRatio: 0.45,
    classSize: 28,
    classAverage: 68,
    position: 16,
    comment:
      'Gaps in the circuits unit were evident. Additional tutoring is in place for Term 3.',
  },
  {
    code: 'CHEM',
    name: 'Chemistry',
    teacher: 'Mr P. Mhlanga',
    total: 69,
    caRatio: 0.52,
    classSize: 28,
    classAverage: 71,
    position: 14,
    comment:
      'Willing and hard-working in the lab. We need to shore up her symbol equations ahead of Paper 1.',
  },
]);

const FARAI_T1_SUBJECTS = buildSubjects([
  { code: 'MATH', name: 'Mathematics', teacher: 'Mrs M. Dziva', total: 76, caRatio: 0.8, classSize: 32, classAverage: 74, position: 10, comment: 'Good start. Keep up the algebra practice.' },
  { code: 'ENGL', name: 'English Language', teacher: 'Mr T. Gondo', total: 70, caRatio: 0.6, classSize: 32, classAverage: 71, position: 16, comment: 'Writing is developing nicely. Focus on introductions.' },
  { code: 'SHON', name: 'Shona', teacher: 'Mrs F. Chiweshe', total: 83, caRatio: 0.55, classSize: 32, classAverage: 76, position: 5, comment: 'Consistent strong performance.' },
  { code: 'HIST', name: 'History', teacher: 'Mr L. Chakanetsa', total: 72, caRatio: 0.45, classSize: 30, classAverage: 70, position: 12, comment: 'Settled well. Read around the topics.' },
  { code: 'BIO', name: 'Biology', teacher: 'Dr A. Madziva', total: 76, caRatio: 0.55, classSize: 28, classAverage: 72, position: 8, comment: 'Good practicals.' },
  { code: 'GEOG', name: 'Geography', teacher: 'Mrs P. Dube', total: 73, caRatio: 0.5, classSize: 30, classAverage: 69, position: 10, comment: 'Map skills solid.' },
  { code: 'PHYS', name: 'Physics', teacher: 'Ms S. Nyathi', total: 70, caRatio: 0.45, classSize: 28, classAverage: 67, position: 12, comment: 'Mechanics understood well.' },
  { code: 'CHEM', name: 'Chemistry', teacher: 'Mr P. Mhlanga', total: 71, caRatio: 0.55, classSize: 28, classAverage: 70, position: 10, comment: 'Keep revising the periodic table.' },
]);

const TANAKA_T1_SUBJECTS = buildSubjects([
  { code: 'MATH', name: 'Mathematics', teacher: 'Mrs M. Dziva', total: 74, caRatio: 0.55, classSize: 28, classAverage: 72, position: 11, comment: 'A strong first term.' },
  { code: 'ENGL', name: 'English Language', teacher: 'Ms R. Sithole', total: 75, caRatio: 0.6, classSize: 28, classAverage: 71, position: 10, comment: 'Confident written work.' },
  { code: 'SHON', name: 'Shona', teacher: 'Mrs F. Chiweshe', total: 82, caRatio: 0.55, classSize: 28, classAverage: 75, position: 5, comment: 'Lovely oral recitation.' },
  { code: 'HIST', name: 'History', teacher: 'Mr L. Chakanetsa', total: 76, caRatio: 0.48, classSize: 28, classAverage: 70, position: 8, comment: 'Engaged in lessons.' },
  { code: 'BIO', name: 'Biology', teacher: 'Ms N. Banda', total: 78, caRatio: 0.55, classSize: 28, classAverage: 73, position: 7, comment: 'Clear practical reports.' },
  { code: 'GEOG', name: 'Geography', teacher: 'Mrs P. Dube', total: 75, caRatio: 0.5, classSize: 28, classAverage: 69, position: 9, comment: 'Solid map skills.' },
  { code: 'PHYS', name: 'Physics', teacher: 'Ms S. Nyathi', total: 77, caRatio: 0.45, classSize: 28, classAverage: 67, position: 8, comment: 'Good effort.' },
  { code: 'CHEM', name: 'Chemistry', teacher: 'Mr P. Mhlanga', total: 80, caRatio: 0.52, classSize: 28, classAverage: 70, position: 5, comment: 'Excellent start to the subject.' },
]);

const HM_COMMENT_GOOD =
  'A strong term. This is the kind of form-wide contribution that makes Harare Heritage Academy a proud place. Keep going — the second half of the year is the one that shows character.';
const HM_COMMENT_MIXED =
  'The marks are mixed but the character is not. I have every confidence that a settled term 3, supported by close contact between the home and the school, will put this pupil back on track.';
const HM_COMMENT_EXCELLENT =
  'An outstanding term. Congratulations to the pupil, the parents and the teachers who have supported this effort. We expect great things in the final term.';

export const PARENT_REPORTS: readonly ParentReport[] = [
  {
    id: 'rep-farai-t2-26',
    childId: 's-farai',
    term: 'Term 2',
    year: 2026,
    releasedOn: '14 April 2026',
    average: 78,
    grade: 'A',
    position: 8,
    classSize: 32,
    attendance: 96,
    daysAbsent: 3,
    daysLate: 2,
    conduct: 'Good',
    leadership: 'Form prefect',
    housePoints: 48,
    formTeacherName: 'Mr T. Chikova',
    formTeacherComment:
      'Farai has had a strong term. His mathematical reasoning has matured visibly, and his written work shows the care of a reader who pays attention. The one area to watch is consistency in examination conditions — Mrs Dziva and I would welcome a brief conversation at our next meeting about pacing. Overall, this is the kind of term that builds a Form 4 pupil into a confident Form 5.',
    headmasterName: 'Mr T. Moyo',
    headmasterComment: HM_COMMENT_GOOD,
    nextTermStarts: 'Tuesday 5 May 2026',
    feesDueAmount: '2,760.00',
    feesDueBy: 'Friday 9 May 2026',
    subjects: FARAI_T2_SUBJECTS,
    acknowledged: false,
    current: true,
  },
  {
    id: 'rep-rumbi-t2-26',
    childId: 's-rumbi',
    term: 'Term 2',
    year: 2026,
    releasedOn: '14 April 2026',
    average: 82,
    grade: 'A',
    position: 5,
    classSize: 30,
    attendance: 99,
    daysAbsent: 1,
    daysLate: 0,
    conduct: 'Excellent',
    leadership: 'House vice-captain (Heritage)',
    housePoints: 62,
    formTeacherName: 'Mr T. Gondo',
    formTeacherComment:
      'Rumbi is a diligent and curious pupil. She asks the questions the quieter pupils are thinking, which is an enormous gift to her class. Her English comprehension is now a clear strength; we should push her to apply the same thoroughness to her Shona essays, where fluency is beginning to outpace her discipline of structure.',
    headmasterName: 'Mr T. Moyo',
    headmasterComment: HM_COMMENT_EXCELLENT,
    nextTermStarts: 'Tuesday 5 May 2026',
    feesDueAmount: '2,640.00',
    feesDueBy: 'Friday 9 May 2026',
    subjects: RUMBI_T2_SUBJECTS,
    acknowledged: true,
    current: true,
  },
  {
    id: 'rep-tanaka-t2-26',
    childId: 's-tanaka',
    term: 'Term 2',
    year: 2026,
    releasedOn: '14 April 2026',
    average: 71,
    grade: 'B',
    position: 18,
    classSize: 28,
    attendance: 89,
    daysAbsent: 9,
    daysLate: 5,
    conduct: 'Satisfactory',
    leadership: '—',
    housePoints: 22,
    formTeacherName: 'Ms P. Banda',
    formTeacherComment:
      "Tanaka has had a mixed term. She is by nature a hard worker, but she has been absent more than we would like and the missed lessons have shown in her marks. I would very much appreciate a short meeting to agree a plan for Term 3. The form is ready to welcome her back — we just need to get her into the room consistently.",
    headmasterName: 'Mr T. Moyo',
    headmasterComment: HM_COMMENT_MIXED,
    nextTermStarts: 'Tuesday 5 May 2026',
    feesDueAmount: '2,520.00',
    feesDueBy: 'Friday 9 May 2026',
    subjects: TANAKA_T2_SUBJECTS,
    acknowledged: false,
    current: true,
  },
  {
    id: 'rep-farai-t1-26',
    childId: 's-farai',
    term: 'Term 1',
    year: 2026,
    releasedOn: '7 January 2026',
    average: 74,
    grade: 'B',
    position: 11,
    classSize: 32,
    attendance: 98,
    daysAbsent: 2,
    daysLate: 1,
    conduct: 'Good',
    leadership: '—',
    housePoints: 38,
    formTeacherName: 'Mr T. Chikova',
    formTeacherComment:
      'A settling term. Farai took a little time to find his rhythm after the Christmas break, but by mid-term he was back to his usual level. The spark in his English essays is very welcome.',
    headmasterName: 'Mr T. Moyo',
    headmasterComment: HM_COMMENT_GOOD,
    nextTermStarts: 'Tuesday 20 January 2026',
    feesDueAmount: '2,700.00',
    feesDueBy: 'Friday 24 January 2026',
    subjects: FARAI_T1_SUBJECTS,
    acknowledged: true,
    current: false,
  },
  {
    id: 'rep-tanaka-t1-26',
    childId: 's-tanaka',
    term: 'Term 1',
    year: 2026,
    releasedOn: '7 January 2026',
    average: 77,
    grade: 'B',
    position: 12,
    classSize: 28,
    attendance: 97,
    daysAbsent: 3,
    daysLate: 2,
    conduct: 'Good',
    leadership: '—',
    housePoints: 34,
    formTeacherName: 'Ms P. Banda',
    formTeacherComment:
      'A positive first term. Tanaka made friends across her form and settled in quickly. Her Shona teacher noted her confidence in oral recitation.',
    headmasterName: 'Mr T. Moyo',
    headmasterComment: HM_COMMENT_GOOD,
    nextTermStarts: 'Tuesday 20 January 2026',
    feesDueAmount: '2,500.00',
    feesDueBy: 'Friday 24 January 2026',
    subjects: TANAKA_T1_SUBJECTS,
    acknowledged: true,
    current: false,
  },
];

export function reportsFor(childId: string) {
  return PARENT_REPORTS.filter((r) => r.childId === childId);
}

/* ------------------------------------------------------------------ */
/*  Announcements (parent-scoped)                                      */
/* ------------------------------------------------------------------ */

export type ParentAnnouncementCategory = 'Urgent' | 'Academic' | 'Event' | 'Fees' | 'General';

export interface ParentAnnouncement {
  id: string;
  category: ParentAnnouncementCategory;
  author: string;
  ago: string;
  publishedAt: string;
  pinned: boolean;
  unread: boolean;
  acknowledged: boolean;
  requiresAcknowledgement: boolean;
  title: string;
  body: string;
}

export const PARENT_ANNOUNCEMENTS: readonly ParentAnnouncement[] = [
  {
    id: 'pa-1',
    category: 'Urgent',
    author: "Headmaster's Office",
    ago: 'This morning',
    publishedAt: '2026-04-22T08:00:00Z',
    pinned: true,
    unread: true,
    acknowledged: false,
    requiresAcknowledgement: true,
    title: 'Early dismissal Friday 25 April',
    body:
      'Due to the staff inset training, school will close at 12:30 on Friday 25 April. Please arrange transport accordingly. Boarders will have supervised study until regular collection times. Day scholars should be collected by 13:00.',
  },
  {
    id: 'pa-2',
    category: 'Academic',
    author: 'Examinations Office',
    ago: 'Yesterday',
    publishedAt: '2026-04-21T10:00:00Z',
    pinned: false,
    unread: true,
    acknowledged: false,
    requiresAcknowledgement: true,
    title: 'Term 2 report cards available',
    body:
      'Term 2 reports have been released. You will find them under Reports in your portal. Parent acknowledgement is appreciated within 14 days. If you would like a meeting to discuss the report, you may book a slot through the Meetings page.',
  },
  {
    id: 'pa-3',
    category: 'Event',
    author: "Headmaster's Office",
    ago: '2 days ago',
    publishedAt: '2026-04-20T14:00:00Z',
    pinned: false,
    unread: false,
    acknowledged: false,
    requiresAcknowledgement: false,
    title: 'Annual prize-giving — save the date',
    body:
      'The 2026 prize-giving ceremony will be held on Saturday 19 July at 10:00. Full details, including the programme and seating allocations, will follow in June. We hope you will be able to join us.',
  },
  {
    id: 'pa-4',
    category: 'Fees',
    author: 'Bursary',
    ago: '3 days ago',
    publishedAt: '2026-04-19T09:00:00Z',
    pinned: false,
    unread: false,
    acknowledged: false,
    requiresAcknowledgement: false,
    title: 'Term 3 fee invoices issued',
    body:
      'Term 3 invoices have been issued and are visible on your Fees page. The payment deadline is Friday 9 May. EcoCash, OneMoney, InnBucks, ZIPIT, direct bank deposit, and upload-a-slip are all supported.',
  },
  {
    id: 'pa-5',
    category: 'General',
    author: 'Admissions',
    ago: '1 week ago',
    publishedAt: '2026-04-15T09:00:00Z',
    pinned: false,
    unread: false,
    acknowledged: false,
    requiresAcknowledgement: false,
    title: 'Open morning for Form 1 applicants — Saturday 10 May',
    body:
      'If you know families considering HHA for the next academic year, our open morning runs from 09:00 to 12:00 on Saturday 10 May. Tours will leave from the main hall every half hour.',
  },
];

/* ------------------------------------------------------------------ */
/*  Messages (parent inbox)                                            */
/* ------------------------------------------------------------------ */

export interface ParentThread {
  id: string;
  with: string;
  withRole: string;
  subject: string;
  childId: string;
  childName: string;
  lastSnippet: string;
  ago: string;
  unread: boolean;
  needsReply: boolean;
  category: 'academic' | 'pastoral' | 'administrative' | 'celebratory';
}

export const PARENT_THREADS: readonly ParentThread[] = [
  {
    id: 'pt-1',
    with: 'Mrs M. Dziva',
    withRole: "Mathematics · Farai's teacher",
    subject: "Re: Farai's recent marks",
    childId: 's-farai',
    childName: 'Farai',
    lastSnippet: 'He has the ability — what\'s changed is consistency with his working.',
    ago: '2 hours ago',
    unread: true,
    needsReply: true,
    category: 'academic',
  },
  {
    id: 'pt-2',
    with: 'Mr T. Chikova',
    withRole: "Form teacher · 4A",
    subject: 'Term 2 form update',
    childId: 's-farai',
    childName: 'Farai',
    lastSnippet: "An update on Farai's pastoral progress and upcoming activities.",
    ago: 'yesterday',
    unread: false,
    needsReply: false,
    category: 'pastoral',
  },
  {
    id: 'pt-3',
    with: 'Bursary',
    withRole: "Bursar's office",
    subject: 'Payment confirmation — Term 2 · Tanaka',
    childId: 's-tanaka',
    childName: 'Tanaka',
    lastSnippet: 'Your payment of USD 150 has been received and applied.',
    ago: '2 days ago',
    unread: false,
    needsReply: false,
    category: 'administrative',
  },
  {
    id: 'pt-4',
    with: 'School Office',
    withRole: 'Admin',
    subject: 'Science fair permission slip — reminder',
    childId: 's-farai',
    childName: 'Farai',
    lastSnippet: 'Please confirm permission by Friday.',
    ago: '3 days ago',
    unread: false,
    needsReply: true,
    category: 'administrative',
  },
  {
    id: 'pt-5',
    with: 'Mr Gondo',
    withRole: "English · Rumbi's teacher",
    subject: "A note on Rumbi's reading",
    childId: 's-rumbi',
    childName: 'Rumbi',
    lastSnippet: 'She read ahead of the class this week — she enjoyed the passage.',
    ago: '5 days ago',
    unread: false,
    needsReply: false,
    category: 'celebratory',
  },
];

export const CONVERSATION_SAMPLE = [
  { from: 'them', body: 'Good afternoon, Mrs Moyo. I noticed Farai\'s last assessment was below his usual.', at: 'Yesterday 15:20' },
  { from: 'me',   body: "Good afternoon, Mrs Dziva. Thank you for flagging. Is this about the Test 2 or a more recent piece?", at: 'Yesterday 15:45' },
  { from: 'them', body: 'It was Problem Set 7 this week. He had the ability clearly — what I noticed was uneven working in the middle questions.', at: 'Yesterday 16:02' },
  { from: 'me',   body: 'That tracks with what we\'re seeing at home. He has been rushing through homework. Would you have time for a short call next week?', at: 'Yesterday 18:30' },
  { from: 'them', body: "He has the ability — what's changed is consistency with his working. Let's arrange Thursday 15:30 if that suits you.", at: '2 hours ago' },
] as const;

/* ------------------------------------------------------------------ */
/*  Calendar & meetings                                                */
/* ------------------------------------------------------------------ */

export type ParentCalendarKind = 'academic' | 'sports' | 'cultural' | 'parent-only' | 'holiday' | 'trip';

export interface ParentEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: ParentCalendarKind;
  time?: string;
  location?: string;
  affectedChildIds: string[];
  rsvp?: 'yes' | 'no' | 'maybe' | null;
  requiresPermission?: boolean;
  permissionGranted?: boolean;
}

export const PARENT_EVENTS: readonly ParentEvent[] = [
  { id: 'ev-1', date: '2026-04-25', title: 'Inter-house athletics', kind: 'sports', time: '08:00', location: 'Main field', affectedChildIds: ['s-farai', 's-tanaka'], rsvp: 'yes' },
  { id: 'ev-2', date: '2026-04-25', title: 'Early dismissal (12:30)', kind: 'academic', time: '12:30', affectedChildIds: ['s-farai', 's-rumbi', 's-tanaka'] },
  { id: 'ev-3', date: '2026-05-02', title: 'Science Fair trip', kind: 'trip', time: '08:00', location: 'Harare Science Centre', affectedChildIds: ['s-farai'], requiresPermission: true, permissionGranted: false },
  { id: 'ev-4', date: '2026-05-05', title: 'Term 2 opens', kind: 'academic', time: '07:00', affectedChildIds: ['s-farai', 's-rumbi', 's-tanaka'] },
  { id: 'ev-5', date: '2026-05-14', title: "Form 4 parents' evening", kind: 'parent-only', time: '17:00', location: 'Main hall', affectedChildIds: ['s-farai'], rsvp: null },
  { id: 'ev-6', date: '2026-05-22', title: 'Rumbi choir concert', kind: 'cultural', time: '18:00', location: 'Chapel', affectedChildIds: ['s-rumbi'], rsvp: 'yes' },
  { id: 'ev-7', date: '2026-06-08', title: 'Mid-term examinations begin', kind: 'academic', affectedChildIds: ['s-farai', 's-rumbi', 's-tanaka'] },
  { id: 'ev-8', date: '2026-07-19', title: 'Annual prize-giving', kind: 'cultural', time: '10:00', location: 'Chapel', affectedChildIds: ['s-farai', 's-rumbi', 's-tanaka'], rsvp: null },
];

/* Meetings */

export interface MeetingTeacher {
  id: string;
  name: string;
  subject: string;
  childId: string;
}

export const MEETING_TEACHERS: MeetingTeacher[] = [
  { id: 'mt-1', name: 'Mrs Dziva', subject: 'Mathematics',  childId: 's-farai' },
  { id: 'mt-2', name: 'Mr Gondo',  subject: 'English',      childId: 's-farai' },
  { id: 'mt-3', name: 'Mr Chakanetsa', subject: 'History',  childId: 's-farai' },
  { id: 'mt-4', name: 'Dr Madziva', subject: 'Biology',     childId: 's-farai' },
  { id: 'mt-5', name: 'Mr Chikova', subject: 'Form teacher · 4A', childId: 's-farai' },
];

export type SlotState = 'available' | 'booked-mine' | 'booked-other' | 'break';

export const MEETING_SLOTS = ['17:00', '17:10', '17:20', '17:30', '17:40', 'Break', '18:00', '18:10', '18:20', '18:30'];

/** Deterministic but varied slot grid for the demo. */
export function slotState(teacherIdx: number, slotIdx: number): SlotState {
  const label = MEETING_SLOTS[slotIdx]!;
  if (label === 'Break') return 'break';
  const seed = (teacherIdx * 7 + slotIdx * 3) % 11;
  if (teacherIdx === 0 && slotIdx === 1) return 'booked-mine';
  if (seed === 0) return 'booked-other';
  if (seed === 1) return 'booked-other';
  return 'available';
}

/* ------------------------------------------------------------------ */
/*  Greeting helper                                                    */
/* ------------------------------------------------------------------ */

export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Simple-English context line for the greeting, per §05.
 * Reports one of: "had a full day", "was absent from N periods", "arrived late", etc.
 */
export function todayContext(childId: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const att = buildAttendance(childId);
  const todayDay = att.find((d) => d.date === today);
  if (!todayDay) return 'had a full day at school';
  if (todayDay.kind === 'present') return 'had a full day at school';
  if (todayDay.kind === 'late') return 'arrived late this morning';
  if (todayDay.kind === 'absent-unexcused') return 'was marked absent today';
  if (todayDay.kind === 'absent-excused') return 'was absent today (excused)';
  if (todayDay.kind === 'weekend') return 'is enjoying the weekend';
  if (todayDay.kind === 'holiday') return "is at home today — it's a public holiday";
  return 'had a full day at school';
}
