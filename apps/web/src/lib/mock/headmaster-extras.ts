/**
 * Headmaster-portal fixtures.
 *
 * Everything here is deliberately academic in focus — teaching, learning,
 * pastoral oversight, safeguarding, and the people responsible for those.
 * Financial, operational, and enrolment concerns are not in this portal.
 */

export const ME_HEADMASTER = {
  title: 'Mr',
  firstName: 'Tendai',
  lastName: 'Makoni',
  email: 'head@jhs.ac.zw',
  display: 'T. Makoni',
  avatarInitials: 'TM',
} as const;

export const SCHOOL_STATE = {
  learnersTotal: 1240,
  learnersPresent: 1218,
  attendancePercent: 98.2,
  status: 'operational' as const,
  dateLabel: 'Thursday, 22 April 2026',
  termLabel: 'Term 2, Week 5',
};

/* ------------------------------------------------------------------ */
/*  Bridge KPIs                                                        */
/* ------------------------------------------------------------------ */

export const BRIDGE_KPIS = [
  { key: 'cohort-avg', label: 'Cohort average', value: '76.2%', deltaLabel: '+1.4 vs last term', trend: 'up' as const },
  { key: 'pass-rate', label: 'Pass rate', value: '84%', deltaLabel: '+0.9 pp', trend: 'up' as const },
  { key: 'at-risk', label: 'At-risk students', value: '18', deltaLabel: 'down from 24', trend: 'down-good' as const },
  { key: 'safeguarding', label: 'Open safeguarding', value: '3', deltaLabel: 'under DSL management', trend: 'flat' as const },
];

/* ------------------------------------------------------------------ */
/*  Decisions queue (Bridge zone 3)                                     */
/* ------------------------------------------------------------------ */

export type DecisionUrgency = 'urgent' | 'this-week' | 'this-month';
export type DecisionCategory =
  | 'safeguarding'
  | 'staff-appraisal'
  | 'curriculum'
  | 'reports'
  | 'teaching-quality'
  | 'policy'
  | 'student-exception';

export interface Decision {
  id: string;
  category: DecisionCategory;
  title: string;
  context: string;
  urgency: DecisionUrgency;
  submittedAgo: string;
  deadline: string;
  submittedBy: string;
  canDelegate: boolean;
}

export const DECISIONS: readonly Decision[] = [
  {
    id: 'dec-1',
    category: 'safeguarding',
    title: 'External referral decision — Form 3B case',
    context: 'DSL recommends external referral to Social Services.',
    urgency: 'urgent',
    submittedAgo: '2 hours ago',
    deadline: 'within 24h',
    submittedBy: 'DSL (Mrs Gumbo)',
    canDelegate: false,
  },
  {
    id: 'dec-2',
    category: 'staff-appraisal',
    title: 'Mathematics department appraisal sign-off (6 files)',
    context: 'HOD-submitted appraisal outcomes for sign-off.',
    urgency: 'this-week',
    submittedAgo: '1 day ago',
    deadline: 'decision by Friday',
    submittedBy: 'HOD Mathematics (Mr Tadyanemhandu)',
    canDelegate: true,
  },
  {
    id: 'dec-3',
    category: 'curriculum',
    title: 'History scheme of work — Form 4 redesign',
    context: 'HOD requested Term 3 rollout.',
    urgency: 'this-week',
    submittedAgo: '3 days ago',
    deadline: 'before Term 3 planning',
    submittedBy: 'HOD Humanities (Mr Ndaba)',
    canDelegate: true,
  },
  {
    id: 'dec-4',
    category: 'reports',
    title: 'Release Term 2 report cards for Form 4 (32 students)',
    context: 'All HODs and Form Teachers signed off.',
    urgency: 'this-week',
    submittedAgo: '2 hours ago',
    deadline: 'before Friday release window',
    submittedBy: 'Deputy Head (Academic)',
    canDelegate: false,
  },
  {
    id: 'dec-5',
    category: 'teaching-quality',
    title: 'Follow-up conversation — Form 4B Mathematics',
    context: 'Learning walk surfaced a specific support need.',
    urgency: 'this-month',
    submittedAgo: '5 days ago',
    deadline: 'this term',
    submittedBy: 'Deputy Head (Academic)',
    canDelegate: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Cohort performance by form (Bridge zone 4)                         */
/* ------------------------------------------------------------------ */

export const FORM_AVERAGES = [
  { form: 'Form 1', avg: 78.1 },
  { form: 'Form 2', avg: 74.3 },
  { form: 'Form 3', avg: 71.4 },
  { form: 'Form 4', avg: 76.2 },
  { form: 'Form 5', avg: 73.0 },
  { form: 'Form 6', avg: 81.4 },
];

export const COHORT_TREND = [
  { term: 'T1 2024', avg: 70.2 },
  { term: 'T2 2024', avg: 71.8 },
  { term: 'T3 2024', avg: 73.1 },
  { term: 'T1 2025', avg: 73.9 },
  { term: 'T2 2025', avg: 74.8 },
  { term: 'T2 2026', avg: 76.2 },
];

/* ------------------------------------------------------------------ */
/*  Subject performance (Academic Intelligence, §05/06)                */
/* ------------------------------------------------------------------ */

export const SUBJECT_AVERAGES = [
  { code: 'SHO', name: 'Shona', avg: 82.1, threeYear: 80.0 },
  { code: 'BIO', name: 'Biology', avg: 80.4, threeYear: 78.0 },
  { code: 'MATH', name: 'Mathematics', avg: 76.2, threeYear: 74.1 },
  { code: 'ENG', name: 'English', avg: 74.1, threeYear: 73.9 },
  { code: 'CHEM', name: 'Chemistry', avg: 73.0, threeYear: 72.0 },
  { code: 'GEO', name: 'Geography', avg: 71.9, threeYear: 72.4 },
  { code: 'PHYS', name: 'Physics', avg: 69.8, threeYear: 72.8 },
  { code: 'HIST', name: 'History', avg: 67.2, threeYear: 71.0 },
];

/* Heatmap: form 4 classes × subjects */

export const HEATMAP_FORM = 'Form 4';
export const HEATMAP_CLASSES = ['4A', '4B', '4C', '4D', '4E'] as const;
export const HEATMAP_SUBJECTS = ['MATH', 'ENG', 'SHO', 'BIO', 'CHEM', 'PHYS', 'HIST', 'GEO'] as const;

export const HEATMAP_DATA: number[][] = [
  [80, 74, 85, 82, 76, 72, 68, 73], // 4A
  [73, 71, 79, 76, 70, 65, 64, 69], // 4B
  [76, 78, 83, 71, 70, 68, 67, 72], // 4C
  [68, 73, 80, 67, 66, 64, 69, 75], // 4D
  [82, 72, 81, 85, 80, 78, 71, 74], // 4E
];

/* ------------------------------------------------------------------ */
/*  Subject drill — Mathematics classes                                */
/* ------------------------------------------------------------------ */

export const MATHS_DEPARTMENT = {
  name: 'Mathematics',
  hod: 'Mr Tadyanemhandu',
  teacherCount: 8,
  classCount: 12,
  subjectAvg: 76.2,
  trendDelta: 1.9,
  passRate: 82,
  atRiskInSubject: 3,
};

export const MATHS_CLASSES = [
  { label: '4E', teacher: 'Mrs Dziva',          avg: 82.0 },
  { label: '5A', teacher: 'Mr Tadyanemhandu',   avg: 80.8 },
  { label: '4A', teacher: 'Mrs Dziva',          avg: 80.2 },
  { label: '6A', teacher: 'Mr Mushore',         avg: 79.7 },
  { label: '3A', teacher: 'Mr Mabika',          avg: 77.1 },
  { label: '2B', teacher: 'Mr Chikova',         avg: 76.4 },
  { label: '1A', teacher: 'Mrs Sibanda',        avg: 75.2 },
  { label: '4B', teacher: 'Mrs Sithole',        avg: 73.1 },
  { label: '3B', teacher: 'Mrs Ruzvidzo',       avg: 71.8 },
  { label: '5B', teacher: 'Mr Mukwada',         avg: 70.4 },
];

/* ------------------------------------------------------------------ */
/*  At-risk register                                                   */
/* ------------------------------------------------------------------ */

export interface AtRiskRow {
  id: string;
  studentName: string;
  form: string;
  trigger: string;
  since: string;
  owner: string;
  ownerRole: string;
  underReview: boolean;
  cumulative: boolean;
}

export const AT_RISK_ROWS: readonly AtRiskRow[] = [
  { id: 'ar-1', studentName: 'Tapiwa N.',     form: '4A', trigger: 'Avg dropped 12 points',                 since: '3 weeks', owner: 'Mrs Dziva',        ownerRole: 'FT', underReview: true,  cumulative: false },
  { id: 'ar-2', studentName: 'Farai N.',      form: '5B', trigger: 'Attendance <80% + avg drop',             since: '2 weeks', owner: 'Mr Chikova',       ownerRole: 'FT', underReview: true,  cumulative: true  },
  { id: 'ar-3', studentName: 'Kundai M.',     form: '3A', trigger: '3 consecutive non-submissions',         since: '1 week',  owner: 'Mr Nyoni',         ownerRole: 'FT', underReview: true,  cumulative: false },
  { id: 'ar-4', studentName: 'Rumbi S.',      form: '2B', trigger: 'Parent concern raised',                  since: '5 days',  owner: 'Mrs Matizha',      ownerRole: 'FT', underReview: false, cumulative: false },
  { id: 'ar-5', studentName: 'Takunda R.',    form: '6A', trigger: 'Dropped position by 14',                 since: '2 weeks', owner: 'Mr Tadyanemhandu', ownerRole: 'FT', underReview: true,  cumulative: false },
  { id: 'ar-6', studentName: 'Chido M.',      form: '3B', trigger: 'Pastoral flag (staff-raised)',           since: '4 days',  owner: 'Mrs Gumbo',        ownerRole: 'DSL',underReview: true,  cumulative: true  },
  { id: 'ar-7', studentName: 'Tatenda Z.',    form: '4D', trigger: 'Avg drop + attendance',                  since: '10 days', owner: 'Mrs Matanda',      ownerRole: 'FT', underReview: false, cumulative: true  },
  { id: 'ar-8', studentName: 'Nyasha P.',     form: '1C', trigger: 'Missed 4 assignments',                   since: '1 week',  owner: 'Mrs Banda',        ownerRole: 'FT', underReview: false, cumulative: false },
  { id: 'ar-9', studentName: 'Blessing C.',   form: '2A', trigger: 'Avg dropped 9 points',                   since: '12 days', owner: 'Mr Gondo',         ownerRole: 'FT', underReview: true,  cumulative: false },
  { id: 'ar-10', studentName: 'Anesu M.',     form: '4B', trigger: 'Parent concern raised',                  since: '3 days',  owner: 'Mrs Sithole',      ownerRole: 'FT', underReview: false, cumulative: false },
];

export const AT_RISK_RIBBON = {
  onRegister: 18,
  previous: 24,
  newThisWeek: 2,
  cumulative: AT_RISK_ROWS.filter((r) => r.cumulative).length,
  recovered30d: 7,
};

export const AT_RISK_MONTHLY = [
  { month: 'May 2025', count: 22 },
  { month: 'Jun 2025', count: 25 },
  { month: 'Jul 2025', count: 20 },
  { month: 'Aug 2025', count: 14 },
  { month: 'Sep 2025', count: 17 },
  { month: 'Oct 2025', count: 19 },
  { month: 'Nov 2025', count: 21 },
  { month: 'Dec 2025', count: 11 },
  { month: 'Jan 2026', count: 23 },
  { month: 'Feb 2026', count: 24 },
  { month: 'Mar 2026', count: 20 },
  { month: 'Apr 2026', count: 18 },
];

export const FT_LOAD = [
  { ft: 'Mrs Dziva',        form: '4A', atRisk: 3, underReview: 2, notes: '' },
  { ft: 'Mr Chikova',       form: '5B', atRisk: 4, underReview: 3, notes: 'Heaviest load — check in this week' },
  { ft: 'Mr Nyoni',         form: '3A', atRisk: 2, underReview: 2, notes: '' },
  { ft: 'Mrs Matizha',      form: '2B', atRisk: 2, underReview: 1, notes: '' },
  { ft: 'Mr Tadyanemhandu', form: '6A', atRisk: 3, underReview: 2, notes: 'HOD workload already heavy' },
  { ft: 'Mrs Matanda',      form: '4D', atRisk: 2, underReview: 1, notes: '' },
  { ft: 'Mrs Banda',        form: '1C', atRisk: 1, underReview: 0, notes: '' },
  { ft: 'Mr Gondo',         form: '2A', atRisk: 1, underReview: 1, notes: '' },
];

/* ------------------------------------------------------------------ */
/*  Teaching Quality                                                   */
/* ------------------------------------------------------------------ */

export const TEACHING_KPIS = [
  { label: 'Teaching staff', value: '68', sub: 'no change', trend: 'flat' as const },
  { label: 'CPD on track', value: '91%', sub: '+3 pp', trend: 'up' as const },
  { label: 'Peer observation', value: '74%', sub: '+11 pp', trend: 'up' as const },
  { label: 'Walks this term', value: '18', sub: 'planned', trend: 'flat' as const },
  { label: 'On leave today', value: '2', sub: 'stable', trend: 'flat' as const },
];

export const APPRAISAL_COMPLETION = [
  { dept: 'Mathematics',  complete: 8, total: 8 },
  { dept: 'English',      complete: 7, total: 7 },
  { dept: 'Sciences',     complete: 7, total: 8 },
  { dept: 'Humanities',   complete: 7, total: 9 },
  { dept: 'Languages',    complete: 6, total: 6 },
  { dept: 'Arts',         complete: 4, total: 6 },
  { dept: 'Sports & PE',  complete: 5, total: 5 },
  { dept: 'Commerce',     complete: 4, total: 5 },
];

export const LEARNING_WALKS = [
  { id: 'W-042', className: 'Math 4B',  teacher: 'Mrs Sithole',  observer: 'HM',             date: 'Mon 26 Apr',  status: 'scheduled' as const },
  { id: 'W-041', className: 'Hist 4A',  teacher: 'Mr Ndaba',     observer: 'HOD Humanities', date: 'Wed 28 Apr',  status: 'scheduled' as const },
  { id: 'W-040', className: 'Phys 4B',  teacher: 'Mr Chirunga',  observer: 'Deputy Head',    date: 'Fri 30 Apr',  status: 'scheduled' as const },
  { id: 'W-039', className: 'Eng 3B',   teacher: 'Ms Sithole',   observer: 'HM',             date: 'Last Mon',    status: 'complete' as const },
  { id: 'W-038', className: 'Bio 5A',   teacher: 'Ms Banda',     observer: 'HOD Sciences',   date: 'Last Tue',    status: 'complete' as const },
  { id: 'W-037', className: 'Math 6A',  teacher: 'Mr Mushore',   observer: 'HM',             date: '2 weeks ago', status: 'complete' as const },
];

/* ------------------------------------------------------------------ */
/*  Reports approval                                                   */
/* ------------------------------------------------------------------ */

export const REPORTS_PROGRESS = [
  { stage: 'Drafted by subject teacher',   complete: 32, total: 32 },
  { stage: 'HOD reviewed',                  complete: 29, total: 32 },
  { stage: 'Form teacher wrote overall',    complete: 25, total: 32 },
  { stage: 'Headmaster approved',           complete: 19, total: 32 },
  { stage: 'Released to parents',           complete: 14, total: 32 },
];

export interface ClassSetForReview {
  id: string;
  classLabel: string;
  form: string;
  totalStudents: number;
  flagged: number;
  hodsApproved: boolean;
  ftComplete: boolean;
  stage: 'hod-review' | 'ft-overall' | 'hm-approval' | 'released';
}

export const CLASS_SETS: readonly ClassSetForReview[] = [
  { id: 'cs-4a', classLabel: 'Form 4A', form: '4', totalStudents: 32, flagged: 2, hodsApproved: true,  ftComplete: true,  stage: 'hm-approval' },
  { id: 'cs-4b', classLabel: 'Form 4B', form: '4', totalStudents: 30, flagged: 1, hodsApproved: true,  ftComplete: true,  stage: 'hm-approval' },
  { id: 'cs-4c', classLabel: 'Form 4C', form: '4', totalStudents: 28, flagged: 0, hodsApproved: true,  ftComplete: false, stage: 'ft-overall' },
  { id: 'cs-3a', classLabel: 'Form 3A', form: '3', totalStudents: 30, flagged: 1, hodsApproved: true,  ftComplete: true,  stage: 'hm-approval' },
  { id: 'cs-5b', classLabel: 'Form 5B', form: '5', totalStudents: 24, flagged: 3, hodsApproved: false, ftComplete: false, stage: 'hod-review' },
  { id: 'cs-6a', classLabel: 'Form 6A', form: '6', totalStudents: 18, flagged: 0, hodsApproved: true,  ftComplete: true,  stage: 'released' },
];

export interface StudentForReview {
  id: string;
  name: string;
  form: string;
  flagged: boolean;
  atRisk: boolean;
  reviewed: boolean;
  summary: {
    average: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    position: number;
    classSize: number;
    attendance: number;
  };
  ftComment: string;
}

export const REVIEW_STUDENTS: readonly StudentForReview[] = [
  { id: 'rv-1', name: 'Tendai Moyo',          form: '4A', flagged: false, atRisk: false, reviewed: true,  summary: { average: 80, grade: 'A', position: 8,  classSize: 32, attendance: 96 }, ftComment: 'A composed term. Tendai leads quietly — the class follows.' },
  { id: 'rv-2', name: 'Rutendo Chigumba',     form: '4A', flagged: true,  atRisk: false, reviewed: false, summary: { average: 85, grade: 'A', position: 4,  classSize: 32, attendance: 98 }, ftComment: 'Rutendo has had a strong term but struggled in moderation — the HOD is following up. Keep an eye on the maths trend line.' },
  { id: 'rv-3', name: 'Kundai Mashingaidze',  form: '4A', flagged: false, atRisk: false, reviewed: false, summary: { average: 72, grade: 'B', position: 14, classSize: 32, attendance: 94 }, ftComment: 'A recovering term after a slow start. Kundai&rsquo;s reading comprehension has markedly improved.' },
  { id: 'rv-4', name: 'Farai Nyoni',          form: '4A', flagged: false, atRisk: false, reviewed: false, summary: { average: 78, grade: 'B', position: 10, classSize: 32, attendance: 95 }, ftComment: 'Farai&rsquo;s methodical approach in sciences continues to pay off; he should push into the A band next term.' },
  { id: 'rv-5', name: 'Tapiwa Ndlovu',        form: '4A', flagged: true,  atRisk: true,  reviewed: false, summary: { average: 65, grade: 'C', position: 27, classSize: 32, attendance: 87 }, ftComment: 'A difficult term for Tapiwa. The pattern of absence is the priority — marks follow presence.' },
];

/* ------------------------------------------------------------------ */
/*  Safeguarding                                                       */
/* ------------------------------------------------------------------ */

export const SAFEGUARDING_RIBBON = {
  activeCases: 3,
  needsReview: 1,
  externalReports30d: 0,
  avgResolutionDays: 14,
};

export const SAFEGUARDING_CATEGORIES = [
  { category: 'Peer-on-peer concerns', count: 18 },
  { category: 'Mental health referrals', count: 13 },
  { category: 'Parent-raised concerns', count: 9 },
  { category: 'Staff-raised concerns', count: 5 },
  { category: 'External referrals received', count: 2 },
];

/* ------------------------------------------------------------------ */
/*  Strategic goals (OKRs)                                             */
/* ------------------------------------------------------------------ */

export interface Objective {
  id: string;
  title: string;
  owner: string;
  progressPercent: number;
  state: 'complete' | 'on-track' | 'at-risk';
  sub: string;
}

export const OBJECTIVES: readonly Objective[] = [
  { id: 'o1', title: 'Cohort avg to 78%',               owner: 'Deputy Head (Academic)', progressPercent: 92, state: 'on-track',  sub: '76.2% of 78% target' },
  { id: 'o2', title: 'Reduce at-risk students by 20%',  owner: 'Deputy Head (Pastoral)', progressPercent: 75, state: 'on-track',  sub: '18 from baseline 24' },
  { id: 'o3', title: 'A+ in safeguarding audit',        owner: 'DSL',                    progressPercent: 100, state: 'complete',  sub: 'Achieved March 2026' },
  { id: 'o4', title: 'Launch History scheme redesign',  owner: 'HOD Humanities',         progressPercent: 40, state: 'at-risk',   sub: 'Term 3 rollout planned' },
  { id: 'o5', title: '40h CPD per teacher',              owner: 'Deputy Head (Academic)', progressPercent: 91, state: 'on-track',  sub: '91% on target' },
  { id: 'o6', title: 'Peer observation programme',       owner: 'Deputy Head (Academic)', progressPercent: 74, state: 'on-track',  sub: '74% participation' },
  { id: 'o7', title: 'Every teacher observed 2+ times',  owner: 'Deputy Head (Academic)', progressPercent: 66, state: 'on-track',  sub: '45 of 68 staff' },
  { id: 'o8', title: 'Pastoral load balance',            owner: 'Deputy Head (Pastoral)', progressPercent: 100, state: 'complete',  sub: 'Within policy on all FTs' },
];

export const KEY_RESULTS = [
  { label: 'Academic average (cohort)',       target: '78.0%', current: '76.2%', status: 'on-track' as const },
  { label: 'ZIMSEC pass rate (O-Level)',      target: '85%',   current: '83%',   status: 'below' as const },
  { label: 'At-risk students (end of term)',  target: '<15',   current: '18',    status: 'near' as const },
  { label: 'Teacher retention',                target: '97%',   current: '95.8%', status: 'below' as const },
  { label: 'CPD hours delivered',              target: '2,720', current: '1,640', status: 'behind' as const },
  { label: 'Learning walks completed',         target: '40',    current: '23',    status: 'on-track' as const },
  { label: 'Report cards released on time',    target: '100%',  current: '100%',  status: 'on-target' as const },
];

export const INITIATIVES = [
  { name: 'History Scheme Redesign',      owner: 'HOD Humanities',      percent: 60, status: 'Active',      next: 'Pilot Term 3' },
  { name: 'Form 7 Stream Launch',          owner: 'Dep. Head (Academic)',percent: 30, status: 'Planning',    next: 'Recruitment June' },
  { name: 'Pastoral Care Programme',       owner: 'DSL',                 percent: 60, status: 'Active',      next: 'Staff training May' },
  { name: 'Peer Observation Framework',    owner: 'Dep. Head (Academic)',percent: 74, status: 'Active',      next: 'Full rollout' },
  { name: 'AI-Assisted Marking Pilot',     owner: 'HOD Mathematics',     percent: 25, status: 'Early stage', next: 'Trial Term 3' },
];

/* ------------------------------------------------------------------ */
/*  Alerts stream                                                      */
/* ------------------------------------------------------------------ */

export interface HeadmasterAlert {
  id: string;
  category: 'safeguarding' | 'at-risk' | 'academic' | 'reports' | 'staff';
  message: string;
  ago: string;
  actionLabel?: string;
  actionHref?: string;
  urgent?: boolean;
}

export const HEAD_ALERTS: readonly HeadmasterAlert[] = [
  { id: 'al-1', category: 'safeguarding', message: 'DSL has escalated a Form 3B case for your review',  ago: '11 min ago', actionLabel: 'Open case',     actionHref: '/headmaster/approvals', urgent: true },
  { id: 'al-2', category: 'at-risk',      message: 'New cumulative trigger: student moved to cumulative at-risk status', ago: '47 min ago', actionLabel: 'Open register', actionHref: '/headmaster/at-risk' },
  { id: 'al-3', category: 'academic',     message: 'Form 4B mathematics mock results released — cohort avg 73.1%',        ago: '2h 14m ago', actionLabel: 'View results',  actionHref: '/headmaster/subjects' },
  { id: 'al-4', category: 'reports',      message: 'Form 4A reports passed HOD review — ready for Headmaster',             ago: '4h 22m ago', actionLabel: 'Review set',    actionHref: '/headmaster/reports' },
  { id: 'al-5', category: 'staff',        message: 'Peer-observation window closes next Friday',                            ago: 'yesterday',  actionLabel: 'Open walks',    actionHref: '/headmaster/teaching' },
];

/* ------------------------------------------------------------------ */
/*  Delegates (Profile page §15)                                       */
/* ------------------------------------------------------------------ */

export const DELEGATES = [
  { name: 'Mr Kwaramba',  role: 'Deputy Head (Academic)',  scope: 'Routine academic approvals, learning walks',           active: true },
  { name: 'Mrs Mukangara',role: 'Deputy Head (Pastoral)',  scope: 'At-risk register, pastoral escalations',                active: true },
  { name: 'Mrs Gumbo',    role: 'DSL',                     scope: 'Safeguarding case management (concurrence only)',        active: true },
  { name: 'Subject HODs', role: 'Per department',          scope: 'Subject-specific curriculum decisions',                  active: true },
];

/* ------------------------------------------------------------------ */
/*  Board pack sections                                                */
/* ------------------------------------------------------------------ */

export const BOARD_SECTIONS = [
  { id: 'hm-report',   title: "Headmaster's academic report",   status: 'draft' as const,     due: 'for review' },
  { id: 'cohort',      title: 'Cohort performance',              status: 'complete' as const,  due: 'ready' },
  { id: 'subjects',    title: 'Subject highlights',              status: 'complete' as const,  due: 'ready' },
  { id: 'at-risk',     title: 'At-risk summary (aggregated)',    status: 'complete' as const,  due: 'ready' },
  { id: 'teaching',    title: 'Teaching quality',                status: 'complete' as const,  due: 'ready' },
  { id: 'safeguarding',title: 'Safeguarding summary',            status: 'pending-dsl' as const,due: 'awaiting DSL sign-off' },
  { id: 'okrs',        title: 'Academic strategic progress',     status: 'complete' as const,  due: 'ready' },
  { id: 'matters',     title: 'Matters for decision',            status: 'draft' as const,     due: 'for review' },
];
