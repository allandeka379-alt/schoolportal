/**
 * Tiny hand-rolled PDF generator.
 *
 * Produces a real, valid PDF (PDF-1.4) with Helvetica + Helvetica-Bold fonts.
 * No external dependencies. The output opens correctly in Adobe, Chrome,
 * Preview, and Acrobat Reader.
 *
 * Usage:
 *   downloadPdf(
 *     'report-card.pdf',
 *     buildReportCard({...}),
 *   );
 */

interface TextLine {
  text: string;
  x?: number;
  y: number; // from bottom of page in points (595 wide × 842 tall — A4)
  size?: number;
  bold?: boolean;
  color?: [number, number, number]; // 0-1 RGB, default black
}

interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: [number, number, number]; // 0-1 RGB, default transparent
  stroke?: [number, number, number];
}

interface PdfDoc {
  pages: { lines: TextLine[]; rects?: Rectangle[] }[];
}

/** Escape text for the PDF content stream. */
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildContentStream(page: PdfDoc['pages'][number]): string {
  const chunks: string[] = [];
  // Rectangles first (behind text)
  for (const r of page.rects ?? []) {
    if (r.fill) {
      const [fr, fg, fb] = r.fill;
      chunks.push(`${fr.toFixed(3)} ${fg.toFixed(3)} ${fb.toFixed(3)} rg`);
      chunks.push(`${r.x} ${r.y} ${r.w} ${r.h} re`);
      chunks.push('f');
    }
    if (r.stroke) {
      const [sr, sg, sb] = r.stroke;
      chunks.push(`${sr.toFixed(3)} ${sg.toFixed(3)} ${sb.toFixed(3)} RG`);
      chunks.push(`${r.x} ${r.y} ${r.w} ${r.h} re`);
      chunks.push('S');
    }
  }
  chunks.push('BT');
  for (const line of page.lines) {
    const size = line.size ?? 11;
    const font = line.bold ? '/F2' : '/F1';
    const x = line.x ?? 50;
    const [r, g, b] = line.color ?? [0, 0, 0];
    chunks.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`);
    chunks.push(`${font} ${size} Tf`);
    chunks.push(`1 0 0 1 ${x} ${line.y} Tm`);
    chunks.push(`(${esc(line.text)}) Tj`);
  }
  chunks.push('ET');
  return chunks.join('\n');
}

export function renderPdf(doc: PdfDoc): Uint8Array {
  const pageCount = doc.pages.length;
  // Object layout:
  // 1 — Catalog
  // 2 — Pages
  // 3 — Font F1 (Helvetica)
  // 4 — Font F2 (Helvetica-Bold)
  // 5+ — Page objects (one per page)
  // 5+pageCount+ — Content streams (one per page)

  const pageObjIds: number[] = [];
  const streamObjIds: number[] = [];
  for (let i = 0; i < pageCount; i += 1) {
    pageObjIds.push(5 + i);
    streamObjIds.push(5 + pageCount + i);
  }

  const buffer: Uint8Array[] = [];
  const offsets: number[] = [];
  let cursor = 0;
  function write(s: string) {
    const bytes = new TextEncoder().encode(s);
    buffer.push(bytes);
    cursor += bytes.length;
  }
  function writeBytes(b: Uint8Array) {
    buffer.push(b);
    cursor += b.length;
  }

  write('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n');

  // Object 1 — Catalog
  offsets[1] = cursor;
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2 — Pages
  offsets[2] = cursor;
  const kids = pageObjIds.map((id) => `${id} 0 R`).join(' ');
  write(`2 0 obj\n<< /Type /Pages /Count ${pageCount} /Kids [${kids}] >>\nendobj\n`);

  // Object 3 — Font F1
  offsets[3] = cursor;
  write(
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
  );

  // Object 4 — Font F2 (Bold)
  offsets[4] = cursor;
  write(
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
  );

  // Page objects
  for (let i = 0; i < pageCount; i += 1) {
    const id = pageObjIds[i]!;
    const streamId = streamObjIds[i]!;
    offsets[id] = cursor;
    write(
      `${id} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>\nendobj\n`,
    );
  }

  // Content streams
  for (let i = 0; i < pageCount; i += 1) {
    const page = doc.pages[i]!;
    const id = streamObjIds[i]!;
    const content = buildContentStream(page);
    offsets[id] = cursor;
    write(`${id} 0 obj\n<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n`);
    write(content);
    write('\nendstream\nendobj\n');
  }

  const xrefStart = cursor;
  const objectCount = 4 + pageCount * 2 + 1;
  write(`xref\n0 ${objectCount}\n`);
  write('0000000000 65535 f \n');
  for (let i = 1; i < objectCount; i += 1) {
    const off = offsets[i] ?? 0;
    write(`${String(off).padStart(10, '0')} 00000 n \n`);
  }
  write(`trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`);

  // Concat buffers
  let total = 0;
  for (const b of buffer) total += b.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const b of buffer) {
    out.set(b, pos);
    pos += b.length;
  }
  return out;
}

/** Convert a Uint8Array into a Blob and trigger a browser download. */
export function downloadBlob(bytes: Uint8Array, filename: string, mime = 'application/pdf') {
  // Clone into a fresh ArrayBuffer so TS is happy across Node/SharedArrayBuffer shapes.
  const buf = new Uint8Array(bytes.length);
  buf.set(bytes);
  const blob = new Blob([buf.buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Small delay so the browser can start the download before we revoke.
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadPdf(filename: string, doc: PdfDoc) {
  const bytes = renderPdf(doc);
  downloadBlob(bytes, filename, 'application/pdf');
}

// ─────────────────────────────────────────────────────────────────────────────
// Report card builder — standard end-of-term structure
// ─────────────────────────────────────────────────────────────────────────────

export interface ReportCardSubject {
  code: string;
  name: string;
  teacher: string;
  initials: string;
  ca: number; // /40
  exam: number; // /60
  total: number; // /100
  grade: string; // A/B/C/D/E
  position: number; // class position in subject
  classSize: number;
  classAverage: number;
  comment: string;
}

export interface ReportCardData {
  studentName: string;
  admissionNo?: string;
  house?: string;
  age?: number;
  form: string;
  term: string;
  year: string | number;
  releasedOn: string;
  termAverage: number; // 0-100
  grade: string;
  position: number;
  classSize: number;
  attendance: number; // 0-100
  daysAbsent?: number;
  daysLate?: number;
  conduct?: string;
  leadership?: string;
  housePoints?: number;
  formTeacher: string;
  formTeacherComment: string;
  headmasterName?: string;
  headmasterComment?: string;
  nextTermStarts?: string;
  feesDueAmount?: string; // e.g. "2,760.00"
  feesDueBy?: string;
  subjects: ReportCardSubject[];
}

const BRAND: [number, number, number] = [0.796, 0.196, 0.129]; // Terracotta #CB3221
const INK: [number, number, number] = [0.043, 0.047, 0.059]; // Near-black
const MUTED: [number, number, number] = [0.412, 0.447, 0.49]; // Slate
const LINE: [number, number, number] = [0.89, 0.9, 0.92]; // Light line
const SURFACE: [number, number, number] = [0.976, 0.98, 0.984]; // Very light

export function buildReportCard(data: ReportCardData): PdfDoc {
  // Page 1 — banner, student block, KPIs, first chunk of subjects
  // Page 2 — remaining subjects, conduct, form + HM comments, fees, signatures
  //
  // Each subject row renders a 2-line cell: top row for code/ca/exam/total/etc,
  // second row for the teacher's per-subject comment (wrapped).
  const SUBJECTS_PER_PAGE_1 = 4;

  const page1: { lines: TextLine[]; rects: Rectangle[] } = { lines: [], rects: [] };
  const page2: { lines: TextLine[]; rects: Rectangle[] } = { lines: [], rects: [] };

  // ─── Page 1 ────────────────────────────────────────────────────────────
  drawHeader(page1, data, 'End-of-term report');
  drawStudentBlock(page1, data);
  drawKpiRow(page1, data);
  drawAttendanceStrip(page1, data);

  const subjectsP1 = data.subjects.slice(0, SUBJECTS_PER_PAGE_1);
  const subjectsP2 = data.subjects.slice(SUBJECTS_PER_PAGE_1);

  page1.lines.push({
    text: 'SUBJECT RESULTS',
    x: 50,
    y: 512,
    size: 10,
    bold: true,
    color: BRAND,
  });
  page1.lines.push({
    text: 'CA out of 40 · Exam out of 60 · Total out of 100',
    x: 160,
    y: 512,
    size: 8,
    color: MUTED,
  });

  drawSubjectTableHeader(page1, 498);
  let y1 = 474;
  subjectsP1.forEach((s) => {
    y1 = drawSubjectRow(page1, s, y1);
  });

  pageFooter(page1, data, 1, 2);

  // ─── Page 2 ────────────────────────────────────────────────────────────
  drawHeader(page2, data, 'End-of-term report · continued');

  page2.lines.push({
    text: 'SUBJECT RESULTS (continued)',
    x: 50,
    y: 776,
    size: 10,
    bold: true,
    color: BRAND,
  });

  drawSubjectTableHeader(page2, 760);
  let y2 = 736;
  subjectsP2.forEach((s) => {
    y2 = drawSubjectRow(page2, s, y2);
  });

  // Conduct + house strip
  y2 -= 12;
  const conductY = y2;
  page2.rects.push({ x: 50, y: conductY - 54, w: 495, h: 60, fill: SURFACE, stroke: LINE });
  const conductBlocks = [
    { label: 'CONDUCT', value: data.conduct ?? '—' },
    { label: 'LEADERSHIP', value: data.leadership ?? '—' },
    { label: 'HOUSE POINTS', value: String(data.housePoints ?? 0) },
    { label: 'HOUSE', value: data.house ?? 'Savanna' },
  ];
  const cbW = 124;
  conductBlocks.forEach((b, i) => {
    const x = 56 + i * cbW;
    page2.lines.push({
      text: b.label,
      x,
      y: conductY - 20,
      size: 8,
      bold: true,
      color: MUTED,
    });
    page2.lines.push({
      text: b.value,
      x,
      y: conductY - 38,
      size: 12,
      bold: true,
      color: INK,
    });
  });

  // Form teacher comment
  y2 = conductY - 80;
  page2.lines.push({
    text: "FORM TEACHER'S COMMENT",
    x: 50,
    y: y2,
    size: 9,
    bold: true,
    color: BRAND,
  });
  page2.lines.push({
    text: data.formTeacher,
    x: 50,
    y: y2 - 14,
    size: 10,
    bold: true,
    color: INK,
  });
  const ftLines = wrap(data.formTeacherComment, 95);
  ftLines.forEach((ln, i) => {
    page2.lines.push({ text: ln, x: 50, y: y2 - 30 - i * 12, size: 10, color: INK });
  });

  // Headmaster comment
  const hmY = y2 - 38 - ftLines.length * 12;
  page2.lines.push({
    text: "HEADMASTER'S COMMENT",
    x: 50,
    y: hmY,
    size: 9,
    bold: true,
    color: BRAND,
  });
  page2.lines.push({
    text: data.headmasterName ?? 'Mr T. Moyo',
    x: 50,
    y: hmY - 14,
    size: 10,
    bold: true,
    color: INK,
  });
  const hmLines = wrap(data.headmasterComment ?? '', 95);
  hmLines.forEach((ln, i) => {
    page2.lines.push({ text: ln, x: 50, y: hmY - 30 - i * 12, size: 10, color: INK });
  });

  // Term logistics — next term + fees
  const logY = hmY - 38 - hmLines.length * 12 - 10;
  page2.rects.push({ x: 50, y: logY - 50, w: 495, h: 50, fill: SURFACE, stroke: LINE });
  const logBlocks = [
    { label: 'NEXT TERM BEGINS', value: data.nextTermStarts ?? '—' },
    {
      label: 'FEES DUE',
      value: data.feesDueAmount
        ? `USD ${data.feesDueAmount}${data.feesDueBy ? ' · by ' + data.feesDueBy : ''}`
        : '—',
    },
  ];
  logBlocks.forEach((b, i) => {
    const x = 56 + i * 248;
    page2.lines.push({
      text: b.label,
      x,
      y: logY - 18,
      size: 8,
      bold: true,
      color: MUTED,
    });
    page2.lines.push({
      text: b.value,
      x,
      y: logY - 36,
      size: 11,
      bold: true,
      color: INK,
    });
  });

  // Signatures (three cells)
  const sigY = 110;
  const sigCells = [
    { label: 'Form Teacher', name: data.formTeacher },
    { label: 'Headmaster', name: data.headmasterName ?? 'Mr T. Moyo' },
    { label: 'Date', name: data.releasedOn },
  ];
  sigCells.forEach((c, i) => {
    const x = 50 + i * 170;
    page2.rects.push({ x, y: sigY, w: 155, h: 1, fill: MUTED });
    page2.lines.push({
      text: c.label.toUpperCase(),
      x,
      y: sigY - 16,
      size: 8,
      bold: true,
      color: MUTED,
    });
    page2.lines.push({ text: c.name, x, y: sigY - 30, size: 10, color: INK });
  });

  pageFooter(page2, data, 2, 2);

  return { pages: [page1, page2] };
}

// ── drawing helpers ─────────────────────────────────────────────────────

function drawHeader(
  page: { lines: TextLine[]; rects: Rectangle[] },
  data: ReportCardData,
  subtitle: string,
) {
  // Terracotta band
  page.rects.push({ x: 0, y: 792, w: 595, h: 50, fill: BRAND });
  page.lines.push({
    text: 'HARARE HERITAGE ACADEMY',
    x: 50,
    y: 814,
    size: 16,
    bold: true,
    color: [1, 1, 1],
  });
  page.lines.push({
    text: `${subtitle} · ${data.term} ${data.year} · Issued ${data.releasedOn}`,
    x: 50,
    y: 798,
    size: 9,
    color: [1, 0.93, 0.86],
  });
  // Thin accent rule under band
  page.rects.push({ x: 0, y: 790, w: 595, h: 2, fill: [0.95, 0.3, 0.2] });
}

function drawStudentBlock(
  page: { lines: TextLine[]; rects: Rectangle[] },
  data: ReportCardData,
) {
  page.lines.push({
    text: data.studentName,
    x: 50,
    y: 762,
    size: 20,
    bold: true,
    color: INK,
  });
  const pieces = [
    data.form,
    data.admissionNo ? `Adm. ${data.admissionNo}` : null,
    data.house ? `${data.house} House` : null,
    data.age !== undefined ? `Age ${data.age}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ');
  page.lines.push({ text: pieces, x: 50, y: 746, size: 10, color: MUTED });
}

function drawKpiRow(
  page: { lines: TextLine[]; rects: Rectangle[] },
  data: ReportCardData,
) {
  const blocks = [
    { label: 'TERM AVERAGE', value: `${data.termAverage}%` },
    { label: 'GRADE', value: data.grade, accent: true },
    { label: 'CLASS POSITION', value: `${data.position} / ${data.classSize}` },
    { label: 'ATTENDANCE', value: `${data.attendance}%` },
  ];
  const blockW = 118;
  const blockH = 62;
  const startX = 50;
  blocks.forEach((b, i) => {
    const x = startX + i * (blockW + 8);
    const y = 668;
    page.rects.push({ x, y, w: blockW, h: blockH, fill: SURFACE, stroke: LINE });
    page.lines.push({
      text: b.label,
      x: x + 10,
      y: y + blockH - 15,
      size: 7,
      bold: true,
      color: MUTED,
    });
    page.lines.push({
      text: b.value,
      x: x + 10,
      y: y + 20,
      size: b.accent ? 22 : 18,
      bold: true,
      color: b.accent ? gradeColor(b.value) : INK,
    });
  });
}

function drawAttendanceStrip(
  page: { lines: TextLine[]; rects: Rectangle[] },
  data: ReportCardData,
) {
  const y = 630;
  const items = [
    { label: 'DAYS ABSENT', value: String(data.daysAbsent ?? 0) },
    { label: 'LATE MARKS', value: String(data.daysLate ?? 0) },
    { label: 'CONDUCT', value: data.conduct ?? 'Good' },
    { label: 'HOUSE POINTS', value: String(data.housePoints ?? 0) },
  ];
  const itemW = 118;
  items.forEach((it, i) => {
    const x = 50 + i * (itemW + 8);
    page.lines.push({ text: it.label, x, y, size: 7, bold: true, color: MUTED });
    page.lines.push({
      text: it.value,
      x: x + 85,
      y,
      size: 9,
      bold: true,
      color: INK,
    });
  });
  // separator line below strip
  page.rects.push({ x: 50, y: y - 8, w: 495, h: 0.5, fill: LINE });
}

const COL = {
  code: 56,
  subject: 90,
  ca: 244,
  exam: 278,
  total: 322,
  grade: 372,
  position: 408,
  classAvg: 460,
  teacher: 500,
};

function drawSubjectTableHeader(
  page: { lines: TextLine[]; rects: Rectangle[] },
  y: number,
) {
  page.rects.push({ x: 50, y: y - 6, w: 495, h: 18, fill: SURFACE });
  page.lines.push({ text: 'Code', x: COL.code, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Subject', x: COL.subject, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'CA', x: COL.ca, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Exam', x: COL.exam, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Total', x: COL.total, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Grade', x: COL.grade, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Pos.', x: COL.position, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Avg', x: COL.classAvg, y, size: 8, bold: true, color: MUTED });
  page.lines.push({ text: 'Teacher', x: COL.teacher, y, size: 8, bold: true, color: MUTED });
}

/** Draws a subject row with primary data line + wrapped comment line.
 *  Returns the new cursor Y after the row. */
function drawSubjectRow(
  page: { lines: TextLine[]; rects: Rectangle[] },
  s: ReportCardSubject,
  startY: number,
): number {
  const wrapped = wrap(s.comment, 105);
  const lineCount = Math.max(1, Math.min(wrapped.length, 3));
  const rowHeight = 18 + lineCount * 10 + 4;
  // background stripe for readability
  page.rects.push({
    x: 50,
    y: startY - rowHeight + 6,
    w: 495,
    h: rowHeight,
    fill: [0.992, 0.992, 0.995],
  });
  // Primary row
  page.lines.push({ text: s.code, x: COL.code, y: startY, size: 9, bold: true, color: MUTED });
  page.lines.push({ text: s.name, x: COL.subject, y: startY, size: 10, color: INK });
  page.lines.push({
    text: `${s.ca}/40`,
    x: COL.ca,
    y: startY,
    size: 9,
    color: INK,
  });
  page.lines.push({
    text: `${s.exam}/60`,
    x: COL.exam,
    y: startY,
    size: 9,
    color: INK,
  });
  page.lines.push({
    text: `${s.total}`,
    x: COL.total,
    y: startY,
    size: 10,
    bold: true,
    color: INK,
  });
  page.lines.push({
    text: s.grade,
    x: COL.grade,
    y: startY,
    size: 10,
    bold: true,
    color: gradeColor(s.grade),
  });
  page.lines.push({
    text: `${s.position}/${s.classSize}`,
    x: COL.position,
    y: startY,
    size: 9,
    color: INK,
  });
  page.lines.push({
    text: `${s.classAverage}%`,
    x: COL.classAvg,
    y: startY,
    size: 9,
    color: MUTED,
  });
  page.lines.push({
    text: s.initials,
    x: COL.teacher,
    y: startY,
    size: 9,
    bold: true,
    color: MUTED,
  });
  // Comment
  wrapped.slice(0, 3).forEach((ln, i) => {
    page.lines.push({
      text: ln,
      x: COL.subject,
      y: startY - 14 - i * 10,
      size: 8,
      color: MUTED,
    });
  });
  // Underline between rows
  page.rects.push({ x: 50, y: startY - rowHeight + 4, w: 495, h: 0.5, fill: LINE });
  return startY - rowHeight;
}

function pageFooter(
  page: { lines: TextLine[]; rects: Rectangle[] },
  data: ReportCardData,
  n: number,
  total: number,
) {
  page.lines.push({
    text: `${data.studentName} · ${data.term} ${data.year} · Page ${n} of ${total}`,
    x: 50,
    y: 28,
    size: 8,
    color: MUTED,
  });
  page.lines.push({
    text: 'Watermarked with the parent\u2019s login and download timestamp.',
    x: 320,
    y: 28,
    size: 8,
    color: MUTED,
  });
}

function gradeColor(grade: string): [number, number, number] {
  const g = grade.toUpperCase().charAt(0);
  if (g === 'A') return [0.137, 0.482, 0.255]; // success
  if (g === 'B') return [0.796, 0.196, 0.129]; // brand
  if (g === 'C') return [0.75, 0.486, 0.055]; // warn
  return [0.722, 0.212, 0.165]; // danger
}

function shortTeacher(full: string): string {
  // "Mrs M. Dziva" stays
  if (full.length <= 14) return full;
  const parts = full.split(' ');
  if (parts.length <= 2) return full;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

function wrap(text: string, chars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= chars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// Statement / receipt / generic document builder
// ─────────────────────────────────────────────────────────────────────────────

export interface GenericDocData {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  fields?: { label: string; value: string }[];
  body?: string;
  lines?: { label: string; value: string }[]; // rows at the bottom
  footer?: string;
}

export function buildGenericDoc(data: GenericDocData): PdfDoc {
  const lines: TextLine[] = [];
  const rects: Rectangle[] = [];

  rects.push({ x: 0, y: 792, w: 595, h: 50, fill: BRAND });
  lines.push({
    text: 'HARARE HERITAGE ACADEMY',
    x: 50,
    y: 812,
    size: 16,
    bold: true,
    color: [1, 1, 1],
  });
  if (data.eyebrow) {
    lines.push({ text: data.eyebrow, x: 50, y: 796, size: 10, color: [1, 0.93, 0.86] });
  }

  lines.push({ text: data.title, x: 50, y: 760, size: 22, bold: true, color: INK });
  if (data.subtitle) {
    lines.push({ text: data.subtitle, x: 50, y: 742, size: 11, color: MUTED });
  }

  let y = 700;
  if (data.fields) {
    for (const f of data.fields) {
      lines.push({ text: f.label.toUpperCase(), x: 50, y, size: 8, bold: true, color: MUTED });
      lines.push({ text: f.value, x: 200, y, size: 11, color: INK });
      y -= 22;
    }
    y -= 10;
  }

  if (data.body) {
    const wrapped = wrap(data.body, 82);
    for (const ln of wrapped) {
      lines.push({ text: ln, x: 50, y, size: 10, color: INK });
      y -= 14;
    }
    y -= 10;
  }

  if (data.lines) {
    rects.push({ x: 50, y: y - 6, w: 495, h: 18, fill: SURFACE });
    lines.push({ text: 'ITEM', x: 56, y, size: 9, bold: true, color: MUTED });
    lines.push({ text: 'AMOUNT', x: 450, y, size: 9, bold: true, color: MUTED });
    y -= 20;
    for (const row of data.lines) {
      lines.push({ text: row.label, x: 56, y, size: 10, color: INK });
      lines.push({ text: row.value, x: 450, y, size: 10, color: INK });
      y -= 18;
    }
  }

  if (data.footer) {
    lines.push({ text: data.footer, x: 50, y: 40, size: 8, color: MUTED });
  }

  return { pages: [{ lines, rects }] };
}
