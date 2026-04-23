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
// Report card builder
// ─────────────────────────────────────────────────────────────────────────────

export interface ReportCardData {
  studentName: string;
  form: string;
  term: string;
  year: string | number;
  releasedOn: string;
  termAverage: number; // 0-100
  grade: string;
  position: number;
  classSize: number;
  attendance: number; // 0-100
  formTeacher: string;
  formTeacherComment: string;
  subjects: {
    code: string;
    name: string;
    score: number; // 0-100
    grade: string;
    classAverage: number;
    teacher: string;
    comment?: string;
  }[];
  headmasterName?: string;
}

const BRAND: [number, number, number] = [0.796, 0.196, 0.129]; // Terracotta #CB3221
const INK: [number, number, number] = [0.043, 0.047, 0.059]; // Near-black
const MUTED: [number, number, number] = [0.412, 0.447, 0.49]; // Slate
const LINE: [number, number, number] = [0.89, 0.9, 0.92]; // Light line
const SURFACE: [number, number, number] = [0.976, 0.98, 0.984]; // Very light

export function buildReportCard(data: ReportCardData): PdfDoc {
  const lines: TextLine[] = [];
  const rects: Rectangle[] = [];

  // Header band
  rects.push({ x: 0, y: 792, w: 595, h: 50, fill: BRAND });
  lines.push({
    text: 'HARARE HERITAGE ACADEMY',
    x: 50,
    y: 812,
    size: 18,
    bold: true,
    color: [1, 1, 1],
  });
  lines.push({
    text: 'End-of-term report · Issued ' + data.releasedOn,
    x: 50,
    y: 796,
    size: 10,
    color: [1, 0.93, 0.86],
  });

  // Student block
  lines.push({ text: data.studentName, x: 50, y: 760, size: 22, bold: true, color: INK });
  lines.push({
    text: `${data.form} · ${data.term} ${data.year}`,
    x: 50,
    y: 742,
    size: 11,
    color: MUTED,
  });

  // Key stats row — 4 blocks
  const blocks = [
    { label: 'TERM AVERAGE', value: `${data.termAverage}%` },
    { label: 'GRADE', value: data.grade },
    { label: 'POSITION', value: `${data.position} / ${data.classSize}` },
    { label: 'ATTENDANCE', value: `${data.attendance}%` },
  ];
  const blockW = 125;
  const blockH = 60;
  const blockStartX = 50;
  blocks.forEach((b, i) => {
    const x = blockStartX + i * (blockW + 8);
    const y = 660;
    rects.push({ x, y, w: blockW, h: blockH, fill: SURFACE, stroke: LINE });
    lines.push({ text: b.label, x: x + 10, y: y + blockH - 15, size: 8, bold: true, color: MUTED });
    lines.push({ text: b.value, x: x + 10, y: y + 20, size: 18, bold: true, color: INK });
  });

  // Subjects header
  const tableTop = 620;
  lines.push({ text: 'SUBJECT RESULTS', x: 50, y: tableTop, size: 10, bold: true, color: BRAND });

  // Table header row
  const tableStartY = tableTop - 22;
  rects.push({ x: 50, y: tableStartY - 6, w: 495, h: 18, fill: SURFACE });
  lines.push({ text: 'Subject', x: 56, y: tableStartY, size: 9, bold: true, color: MUTED });
  lines.push({ text: 'Score', x: 300, y: tableStartY, size: 9, bold: true, color: MUTED });
  lines.push({ text: 'Grade', x: 360, y: tableStartY, size: 9, bold: true, color: MUTED });
  lines.push({ text: 'Class avg', x: 420, y: tableStartY, size: 9, bold: true, color: MUTED });
  lines.push({ text: 'Teacher', x: 495, y: tableStartY, size: 9, bold: true, color: MUTED });

  // Table rows
  let rowY = tableStartY - 20;
  const rowH = 22;
  data.subjects.forEach((s, i) => {
    if (i % 2 === 1) {
      rects.push({ x: 50, y: rowY - 6, w: 495, h: rowH - 2, fill: [0.988, 0.988, 0.99] });
    }
    lines.push({ text: s.name, x: 56, y: rowY, size: 10, color: INK });
    lines.push({ text: `${s.score}%`, x: 300, y: rowY, size: 10, color: INK });
    lines.push({ text: s.grade, x: 360, y: rowY, size: 10, bold: true, color: gradeColor(s.grade) });
    lines.push({ text: `${s.classAverage}%`, x: 420, y: rowY, size: 10, color: MUTED });
    lines.push({ text: shortTeacher(s.teacher), x: 495, y: rowY, size: 9, color: MUTED });
    rowY -= rowH;
  });

  // Form teacher comment
  const commentTop = rowY - 40;
  lines.push({ text: `FORM TEACHER COMMENT`, x: 50, y: commentTop, size: 9, bold: true, color: BRAND });
  lines.push({ text: data.formTeacher, x: 50, y: commentTop - 14, size: 10, bold: true, color: INK });

  const wrappedComment = wrap(data.formTeacherComment, 82);
  wrappedComment.forEach((ln, i) => {
    lines.push({
      text: ln,
      x: 50,
      y: commentTop - 32 - i * 14,
      size: 10,
      color: INK,
    });
  });

  // Signature block
  const sigY = 90;
  rects.push({ x: 50, y: sigY - 10, w: 495, h: 1, fill: LINE });
  lines.push({
    text: 'Signed digitally by the Headmaster · ' + data.releasedOn,
    x: 50,
    y: sigY - 26,
    size: 9,
    color: MUTED,
  });
  lines.push({
    text: data.headmasterName ?? 'Mr T. Moyo · Headmaster',
    x: 50,
    y: sigY - 42,
    size: 10,
    bold: true,
    color: INK,
  });
  lines.push({
    text: 'This PDF is watermarked with the parent\u2019s name and download timestamp.',
    x: 50,
    y: 40,
    size: 8,
    color: MUTED,
  });

  return { pages: [{ lines, rects }] };
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
