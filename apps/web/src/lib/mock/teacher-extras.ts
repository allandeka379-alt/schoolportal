/**
 * Teacher-specific fixtures — extends base fixtures with data the
 * redesigned teacher portal needs.
 *
 * Kept separate so the other portals stay untouched. Shape mirrors the
 * Prisma schema: each class has an id, form, stream, subject, and
 * pulled-in student ids.
 */
import { STUDENTS } from './fixtures';

export const ME_TEACHER = {
  title: 'Mrs',
  firstName: 'Miriam',
  lastName: 'Dziva',
  email: 'teacher@hha.ac.zw',
  subject: 'Mathematics',
  isFormTeacher: true,
  formTeacherOf: 'Form 4A',
  isHod: false,
  avatarInitials: 'MD',
} as const;

/* ------------------------------------------------------------------ */
/*  Classes                                                            */
/* ------------------------------------------------------------------ */

export interface TeacherClass {
  id: string;
  subjectCode: string;
  subjectName: string;
  subjectTone: 'ochre' | 'terracotta' | 'earth' | 'sage';
  form: string;
  stream: string;
  studentIds: string[];
  averagePercent: number;
  attendancePercent: number;
  submissionPercent: number;
  atRiskCount: number;
  isFormTeacher: boolean;
  roomDefault: string;
}

export const TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'class-4a-math',
    subjectCode: 'MATH',
    subjectName: 'Mathematics',
    subjectTone: 'ochre',
    form: '4',
    stream: 'A',
    studentIds: ['s-farai', 's-chipo', 's-ruvimbo', 's-tinashe', 's-rudo'],
    averagePercent: 76,
    attendancePercent: 96,
    submissionPercent: 92,
    atRiskCount: 0,
    isFormTeacher: true,
    roomDefault: 'B-4',
  },
  {
    id: 'class-4b-math',
    subjectCode: 'MATH',
    subjectName: 'Mathematics',
    subjectTone: 'ochre',
    form: '4',
    stream: 'B',
    studentIds: ['s-tanaka'],
    averagePercent: 71,
    attendancePercent: 94,
    submissionPercent: 86,
    atRiskCount: 1,
    isFormTeacher: false,
    roomDefault: 'B-4',
  },
  {
    id: 'class-3a-math',
    subjectCode: 'MATH',
    subjectName: 'Mathematics',
    subjectTone: 'ochre',
    form: '3',
    stream: 'A',
    studentIds: ['s-farai'],
    averagePercent: 68,
    attendancePercent: 91,
    submissionPercent: 79,
    atRiskCount: 2,
    isFormTeacher: false,
    roomDefault: 'B-2',
  },
  {
    id: 'class-3b-math',
    subjectCode: 'MATH',
    subjectName: 'Mathematics',
    subjectTone: 'ochre',
    form: '3',
    stream: 'B',
    studentIds: [],
    averagePercent: 73,
    attendancePercent: 95,
    submissionPercent: 88,
    atRiskCount: 0,
    isFormTeacher: false,
    roomDefault: 'B-2',
  },
];

export function classLabel(c: Pick<TeacherClass, 'form' | 'stream' | 'subjectName'>): string {
  return `${c.form}${c.stream} · ${c.subjectName}`;
}

export const TOTAL_STUDENTS_TAUGHT = TEACHER_CLASSES.reduce(
  (sum, c) => sum + Math.max(c.studentIds.length, 28),
  0,
);

/* ------------------------------------------------------------------ */
/*  Today's lesson schedule                                            */
/* ------------------------------------------------------------------ */

export interface TeacherLesson {
  id: string;
  classId: string;
  start: string;
  end: string;
  room: string;
  topic: string;
  registerTaken: boolean;
  isCurrent: boolean;
}

export const TEACHER_TODAY: readonly TeacherLesson[] = [
  {
    id: 'l1',
    classId: 'class-4a-math',
    start: '07:30',
    end: '08:15',
    room: 'B-4',
    topic: 'Quadratic Equations · recap + quiz',
    registerTaken: false,
    isCurrent: false,
  },
  {
    id: 'l2',
    classId: 'class-3b-math',
    start: '10:00',
    end: '10:45',
    room: 'B-2',
    topic: 'Algebraic Manipulation — factor theorem',
    registerTaken: true,
    isCurrent: true,
  },
  {
    id: 'l3',
    classId: 'class-4b-math',
    start: '11:00',
    end: '11:45',
    room: 'B-4',
    topic: 'Revision — past paper walkthrough',
    registerTaken: false,
    isCurrent: false,
  },
  {
    id: 'l4',
    classId: 'class-3a-math',
    start: '13:00',
    end: '13:45',
    room: 'B-2',
    topic: 'Functions — introduction',
    registerTaken: false,
    isCurrent: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Attention-today items (console zone 2)                             */
/* ------------------------------------------------------------------ */

export type AttentionTone = 'overdue' | 'warning' | 'info';

export interface AttentionItem {
  id: string;
  tone: AttentionTone;
  label: string;
  detail: string;
  href: string;
}

export const ATTENTION_ITEMS: readonly AttentionItem[] = [
  {
    id: 'a1',
    tone: 'overdue',
    label: 'Form 4A register not yet taken',
    detail: 'Period 1 — 07:30',
    href: '/teacher/attendance',
  },
  {
    id: 'a2',
    tone: 'warning',
    label: '3 parent messages awaiting reply',
    detail: 'Oldest from yesterday',
    href: '/teacher/messages',
  },
  {
    id: 'a3',
    tone: 'info',
    label: '18 submissions ready to mark',
    detail: 'Form 4A · Problem Set 7',
    href: '/teacher/marking/a-math-5',
  },
  {
    id: 'a4',
    tone: 'info',
    label: '2 end-of-term comments remaining',
    detail: 'Form 4A — 30 of 32 done',
    href: '/teacher/reports',
  },
];

/* ------------------------------------------------------------------ */
/*  Marking queue (console + full marking workspace)                   */
/* ------------------------------------------------------------------ */

export interface MarkingQueueItem {
  assignmentId: string;
  classId: string;
  classLabel: string;
  title: string;
  submitted: number;
  total: number;
  dueLabel: string;
  overdue: boolean;
  status: 'to-mark' | 'marked-pending-release' | 'in-progress';
}

export const MARKING_QUEUE: readonly MarkingQueueItem[] = [
  {
    assignmentId: 'a-math-5',
    classId: 'class-4a-math',
    classLabel: '4A · Mathematics',
    title: 'Problem Set 7 — Quadratic Equations',
    submitted: 18,
    total: 32,
    dueLabel: 'due in 2 days',
    overdue: false,
    status: 'in-progress',
  },
  {
    assignmentId: 'a-math-4',
    classId: 'class-3b-math',
    classLabel: '3B · Mathematics',
    title: 'Chapter 3 Worksheet',
    submitted: 28,
    total: 30,
    dueLabel: 'overdue by 1d',
    overdue: true,
    status: 'to-mark',
  },
  {
    assignmentId: 'a-math-test2',
    classId: 'class-4b-math',
    classLabel: '4B · Mathematics',
    title: 'Test 2 — Functions (marked)',
    submitted: 28,
    total: 30,
    dueLabel: 'ready to release',
    overdue: false,
    status: 'marked-pending-release',
  },
];

/* ------------------------------------------------------------------ */
/*  Marking workspace — submissions for "Problem Set 7 · 4A"            */
/* ------------------------------------------------------------------ */

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  studentAvgPercent: number;
  submittedAgo: string;
  status: 'marked' | 'to-mark' | 'late' | 'flagged' | 'not-submitted';
  mark?: number;
  outOf: number;
  files: { name: string; size: string }[];
}

export const SUBMISSIONS_PS7: readonly Submission[] = [
  { id: 'sub-1', studentId: 's-farai',     studentName: 'Farai Moyo',         studentAvgPercent: 78, submittedAgo: 'yesterday 19:42', status: 'to-mark',        outOf: 100, files: [{ name: 'Worksheet-Farai.pdf', size: '420 KB' }] },
  { id: 'sub-2', studentId: 's-chipo',     studentName: 'Chipo Banda',        studentAvgPercent: 72, submittedAgo: 'yesterday 20:15', status: 'to-mark',        outOf: 100, files: [{ name: 'PS7-Chipo.pdf', size: '380 KB' }] },
  { id: 'sub-3', studentId: 's-ruvimbo',   studentName: 'Ruvimbo Sibanda',    studentAvgPercent: 81, submittedAgo: '2d ago',          status: 'marked', mark: 86, outOf: 100, files: [{ name: 'Sibanda-PS7.pdf', size: '440 KB' }] },
  { id: 'sub-4', studentId: 's-tinashe',   studentName: 'Tinashe Ncube',      studentAvgPercent: 64, submittedAgo: '1d ago',          status: 'late',           outOf: 100, files: [{ name: 'PS7.jpg', size: '3.1 MB' }] },
  { id: 'sub-5', studentId: 's-rudo',      studentName: 'Rudo Mutasa',        studentAvgPercent: 74, submittedAgo: 'yesterday 21:02', status: 'to-mark',        outOf: 100, files: [{ name: 'PS7-Rudo.pdf', size: '520 KB' }] },
  { id: 'sub-6', studentId: 's-kundai',    studentName: 'Kundai Mashingaidze',studentAvgPercent: 68, submittedAgo: 'yesterday 18:20', status: 'to-mark',        outOf: 100, files: [{ name: 'Mashingaidze.pdf', size: '360 KB' }] },
  { id: 'sub-7', studentId: 's-tapiwa',    studentName: 'Tapiwa Ndlovu',      studentAvgPercent: 65, submittedAgo: '3d ago',          status: 'flagged', mark: 42, outOf: 100, files: [{ name: 'PS7-Ndlovu.pdf', size: '410 KB' }] },
  { id: 'sub-8', studentId: 's-rutendo',   studentName: 'Rutendo Chigumba',   studentAvgPercent: 89, submittedAgo: 'yesterday 20:30', status: 'marked', mark: 94, outOf: 100, files: [{ name: 'Chigumba.pdf', size: '480 KB' }] },
  { id: 'sub-9', studentId: 's-anesu',     studentName: 'Anesu Matanhire',    studentAvgPercent: 77, submittedAgo: 'today 07:10',     status: 'to-mark',        outOf: 100, files: [{ name: 'PS7.pdf', size: '396 KB' }] },
  { id: 'sub-10', studentId: 's-blessing', studentName: 'Blessing Chatora',   studentAvgPercent: 71, submittedAgo: '2d ago',          status: 'marked', mark: 78, outOf: 100, files: [{ name: 'Chatora-PS7.pdf', size: '410 KB' }] },
  { id: 'sub-11', studentId: 's-takudzwa', studentName: 'Takudzwa Nyoka',     studentAvgPercent: 83, submittedAgo: 'yesterday 17:55', status: 'to-mark',        outOf: 100, files: [{ name: 'Nyoka.pdf', size: '452 KB' }] },
  { id: 'sub-12', studentId: 's-mazvita',  studentName: 'Mazvita Ruzive',     studentAvgPercent: 69, submittedAgo: '—',               status: 'not-submitted',  outOf: 100, files: [] },
];

/* ------------------------------------------------------------------ */
/*  Early-warning list (§14)                                           */
/* ------------------------------------------------------------------ */

export type EarlyWarningTrigger = 'mark-drop' | 'attendance-drop' | 'missing-submissions';

export interface EarlyWarningEntry {
  studentId: string;
  studentName: string;
  classId: string;
  trigger: EarlyWarningTrigger;
  triggerDetail: string;
  suggestedAction: string;
}

export const EARLY_WARNING: readonly EarlyWarningEntry[] = [
  {
    studentId: 's-chipo',
    studentName: 'Chipo Banda',
    classId: 'class-3a-math',
    trigger: 'mark-drop',
    triggerDetail: 'Maths: 74% → 58% over last 3 assessments',
    suggestedAction: 'Contact parent · review with HOD',
  },
  {
    studentId: 's-tinashe',
    studentName: 'Tinashe Ncube',
    classId: 'class-3a-math',
    trigger: 'missing-submissions',
    triggerDetail: 'Missed 3 of the last 5 assignments',
    suggestedAction: 'Schedule check-in',
  },
  {
    studentId: 's-rudo',
    studentName: 'Rudo Mutasa',
    classId: 'class-4b-math',
    trigger: 'attendance-drop',
    triggerDetail: 'Attendance 86% (down from 96%)',
    suggestedAction: 'Contact parent',
  },
];

/* ------------------------------------------------------------------ */
/*  Messages                                                           */
/* ------------------------------------------------------------------ */

export type MessageTab = 'parents' | 'students' | 'staff';

export interface TeacherThread {
  id: string;
  tab: MessageTab;
  with: string;
  withRole: string;
  lastSnippet: string;
  lastAgo: string;
  unread: number;
  subject: string;
  // Parent-only: the child in question.
  childStudentId?: string;
  childStudentName?: string;
  childForm?: string;
  childAvg?: number;
  childAvgTrend?: 'up' | 'flat' | 'down';
  childAttendance?: number;
}

export const TEACHER_THREADS: readonly TeacherThread[] = [
  {
    id: 'th-1',
    tab: 'parents',
    with: 'Mr Ndlovu',
    withRole: "Tapiwa's father",
    subject: "Tapiwa's declining marks",
    lastSnippet: 'Thank you — we\'ll work with him this weekend.',
    lastAgo: '10 min ago',
    unread: 1,
    childStudentId: 's-tapiwa',
    childStudentName: 'Tapiwa Ndlovu',
    childForm: 'Form 4A',
    childAvg: 65,
    childAvgTrend: 'down',
    childAttendance: 87,
  },
  {
    id: 'th-2',
    tab: 'parents',
    with: 'Mrs Banda',
    withRole: "Chipo's mother",
    subject: 'Request for remediation lesson',
    lastSnippet: "Would Saturday morning work for an extra session?",
    lastAgo: '2 h ago',
    unread: 2,
    childStudentId: 's-chipo',
    childStudentName: 'Chipo Banda',
    childForm: 'Form 3A',
    childAvg: 58,
    childAvgTrend: 'down',
    childAttendance: 94,
  },
  {
    id: 'th-3',
    tab: 'parents',
    with: 'Mr Moyo',
    withRole: "Farai's father",
    subject: 'Parents evening — booking confirmation',
    lastSnippet: "Confirmed for 14 May, 17:15.",
    lastAgo: 'yesterday',
    unread: 0,
    childStudentId: 's-farai',
    childStudentName: 'Farai Moyo',
    childForm: 'Form 4A',
    childAvg: 78,
    childAvgTrend: 'up',
    childAttendance: 96,
  },
  {
    id: 'th-4',
    tab: 'students',
    with: 'Form 4A (class channel)',
    withRole: 'Class group',
    subject: 'Saturday lesson reminder',
    lastSnippet: '09:00 in B-4. Bring Worksheet 5.',
    lastAgo: '3 h ago',
    unread: 0,
  },
  {
    id: 'th-5',
    tab: 'students',
    with: 'Farai Moyo',
    withRole: 'Form 4A',
    subject: 'Question about quadratic factoring',
    lastSnippet: 'Factoring would have worked — see the first hint.',
    lastAgo: 'yesterday',
    unread: 0,
  },
  {
    id: 'th-6',
    tab: 'staff',
    with: 'Maths Department',
    withRole: 'Department channel',
    subject: 'Paper 2 moderation — rotas',
    lastSnippet: 'Mr Phiri: I can cover 4B Thursday.',
    lastAgo: '4 h ago',
    unread: 1,
  },
  {
    id: 'th-7',
    tab: 'staff',
    with: 'T. Makoni (Head)',
    withRole: 'Headmaster',
    subject: 'End-of-term report sign-off',
    lastSnippet: 'Please submit final comments by Friday.',
    lastAgo: 'yesterday',
    unread: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  Reports — students needing end-of-term comments                    */
/* ------------------------------------------------------------------ */

export interface ReportSubject {
  studentId: string;
  studentName: string;
  classId: string;
  classLabel: string;
  commentStatus: 'written' | 'draft' | 'not-started';
  marks: {
    ca1: number;
    ca2: number;
    midterm: number;
    endterm: number;
    total: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    position: number;
    classSize: number;
    classAverage: number;
    attendance: number;
    trend: 'up' | 'flat' | 'down';
  };
  commentDraft?: string;
}

export const REPORT_SUBJECTS: readonly ReportSubject[] = [
  {
    studentId: 's-farai',
    studentName: 'Farai Moyo',
    classId: 'class-4a-math',
    classLabel: '4A · Mathematics',
    commentStatus: 'draft',
    marks: { ca1: 78, ca2: 82, midterm: 75, endterm: 84, total: 80, grade: 'A', position: 8, classSize: 32, classAverage: 76, attendance: 96, trend: 'up' },
    commentDraft:
      'Farai has shown sustained application this term, particularly in algebraic reasoning. His working is now clearly laid out — a welcome change from earlier in the year. To push into the A-band consistently, he should focus on exam-condition pace.',
  },
  {
    studentId: 's-chipo',
    studentName: 'Chipo Banda',
    classId: 'class-4a-math',
    classLabel: '4A · Mathematics',
    commentStatus: 'not-started',
    marks: { ca1: 58, ca2: 52, midterm: 48, endterm: 54, total: 53, grade: 'D', position: 27, classSize: 32, classAverage: 76, attendance: 94, trend: 'down' },
  },
  {
    studentId: 's-ruvimbo',
    studentName: 'Ruvimbo Sibanda',
    classId: 'class-4a-math',
    classLabel: '4A · Mathematics',
    commentStatus: 'written',
    marks: { ca1: 82, ca2: 86, midterm: 80, endterm: 88, total: 85, grade: 'A', position: 4, classSize: 32, classAverage: 76, attendance: 98, trend: 'up' },
    commentDraft:
      'A thoroughly strong term. Ruvimbo asks the questions the quieter students are thinking. Her end-term paper was the cleanest presentation of simultaneous equations I saw across the cohort.',
  },
  {
    studentId: 's-tinashe',
    studentName: 'Tinashe Ncube',
    classId: 'class-4a-math',
    classLabel: '4A · Mathematics',
    commentStatus: 'not-started',
    marks: { ca1: 62, ca2: 58, midterm: 60, endterm: 66, total: 62, grade: 'C', position: 22, classSize: 32, classAverage: 76, attendance: 88, trend: 'flat' },
  },
];

/* ------------------------------------------------------------------ */
/*  Gradebook matrix                                                   */
/* ------------------------------------------------------------------ */

export interface GradebookCell {
  value: number | null;
  edited?: boolean;
  outlier?: boolean;
}

export interface GradebookRow {
  studentId: string;
  name: string;
  cells: GradebookCell[]; // columns aligned with GRADEBOOK_COLUMNS
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  trend: 'up' | 'flat' | 'down';
}

export const GRADEBOOK_COLUMNS = [
  { key: 'ca1', label: 'CA1', kind: 'ca', max: 100 },
  { key: 'ca2', label: 'CA2', kind: 'ca', max: 100 },
  { key: 'ca3', label: 'CA3', kind: 'ca', max: 100 },
  { key: 'ca4', label: 'CA4', kind: 'ca', max: 100 },
  { key: 'midterm', label: 'Mid-term', kind: 'mid', max: 100 },
  { key: 'endterm', label: 'End-term', kind: 'end', max: 100 },
] as const;

function seed(i: number, j: number, base: number) {
  return ((i * 7 + j * 11 + base) % 40) + 58;
}

function rowFor(student: { id: string; firstName: string; lastName: string }, i: number): GradebookRow {
  const cells: GradebookCell[] = GRADEBOOK_COLUMNS.map((_, j) => ({
    value: seed(i, j, 13),
  }));
  // Sprinkle an outlier + a recent edit for visual interest.
  if (i === 2) cells[2] = { value: 96, outlier: true };
  if (i === 4) cells[0] = { value: 70, edited: true };
  const sum = cells.reduce((s, c) => s + (c.value ?? 0), 0);
  const total = Math.round(sum / cells.length);
  const grade: GradebookRow['grade'] =
    total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : total >= 50 ? 'D' : 'E';
  const trend: GradebookRow['trend'] = i % 3 === 0 ? 'up' : i % 3 === 1 ? 'flat' : 'down';
  return {
    studentId: student.id,
    name: `${student.firstName} ${student.lastName}`,
    cells,
    total,
    grade,
    trend,
  };
}

export const GRADEBOOK_ROWS: GradebookRow[] = STUDENTS.filter(
  (s) => s.form === 'Form 3' && s.stream === 'Blue',
).map((s, i) => rowFor(s, i));

// Synthesise a few more rows to make the matrix feel populated.
for (let i = STUDENTS.length; i < STUDENTS.length + 8; i += 1) {
  const fake = {
    id: `s-fake-${i}`,
    firstName: ['Tanaka', 'Tafara', 'Kuziva', 'Pride', 'Tadiwa', 'Simba', 'Lovemore', 'Nyasha'][i - STUDENTS.length] ?? 'Student',
    lastName: ['Phiri', 'Chinyama', 'Masvingo', 'Hove', 'Gonese', 'Tavaziva', 'Mauto', 'Chawasarira'][i - STUDENTS.length] ?? 'Name',
  };
  GRADEBOOK_ROWS.push(rowFor(fake, i));
}

export const GRADEBOOK_SUMMARY = {
  average: Math.round(GRADEBOOK_ROWS.reduce((s, r) => s + r.total, 0) / GRADEBOOK_ROWS.length),
  median: 74,
  high: Math.max(...GRADEBOOK_ROWS.map((r) => r.total)),
  low: Math.min(...GRADEBOOK_ROWS.map((r) => r.total)),
  gradeDistribution: (['A', 'B', 'C', 'D', 'E'] as const).map((g) => ({
    grade: g,
    count: GRADEBOOK_ROWS.filter((r) => r.grade === g).length,
  })),
} as const;

/* ------------------------------------------------------------------ */
/*  Greeting helper (duplicate of student's for teacher context)       */
/* ------------------------------------------------------------------ */
export function greetingFor(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
