'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bold,
  CalendarClock,
  Check,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Loader2,
  Plus,
  Send,
  Sigma,
  Upload,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ClassChip } from '@/components/teacher/primitives';
import { TEACHER_CLASSES, classLabel, type TeacherClass } from '@/lib/mock/teacher-extras';

interface Attachment {
  id: string;
  name: string;
  size: string;
}

const SEED_ATTACHMENTS: Attachment[] = [
  { id: 'att-1', name: 'Chapter 4 — Functions.pdf', size: '1.1 MB' },
  { id: 'att-2', name: 'Worked Examples.pdf', size: '640 KB' },
];

const FILES = [
  'Past paper · 2024 Nov.pdf',
  'Revision notes.pdf',
  'Worked set 7.docx',
  'Formula sheet.pdf',
];

export default function NewAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Untitled assignment');
  const [brief, setBrief] = useState(
    `Complete questions 1–12 on page 84. Show every step of your working.

For each quadratic:
  • Identify the coefficients a, b and c.
  • Decide whether to factor, complete the square, or use the quadratic formula — and state your choice.
  • Solve for x, giving both roots.

Upload a clear scan or photograph. Hand-written is preferred.`,
  );
  const [assignedClasses, setAssignedClasses] = useState<TeacherClass[]>([TEACHER_CLASSES[0]!]);
  const [release, setRelease] = useState<'now' | 'scheduled' | 'draft'>('now');
  const [scheduleAt, setScheduleAt] = useState('2026-04-24T08:00');
  const [dueAt, setDueAt] = useState('2026-04-26T23:59');
  const [maxMarks, setMaxMarks] = useState(100);
  const [latePolicy, setLatePolicy] = useState<'reject' | 'no-penalty' | 'penalise'>('penalise');
  const [formats, setFormats] = useState<Set<string>>(new Set(['PDF', 'DOC', 'Image']));
  const [rubric, setRubric] = useState<{ name: string; max: string }[]>([
    { name: 'Method', max: '16' },
    { name: 'Accuracy', max: '16' },
    { name: 'Presentation', max: '8' },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>(SEED_ATTACHMENTS);
  const [attachOpen, setAttachOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<number>(Date.now());
  const [busy, setBusy] = useState<null | 'draft' | 'release'>(null);
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'released'>('draft');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  // Auto-save stub: bumps the savedAt when title/brief change
  useEffect(() => {
    const t = setTimeout(() => setSavedAt(Date.now()), 800);
    return () => clearTimeout(t);
  }, [title, brief, rubric, maxMarks]);

  function toggleClass(c: TeacherClass) {
    setAssignedClasses((curr) =>
      curr.some((x) => x.id === c.id) ? curr.filter((x) => x.id !== c.id) : [...curr, c],
    );
  }

  function toggleFormat(f: string) {
    setFormats((curr) => {
      const next = new Set(curr);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  }

  function saveDraft() {
    setBusy('draft');
    setTimeout(() => {
      setBusy(null);
      setStatus('draft');
      setSavedAt(Date.now());
      setToast('Draft saved — live in your Drafts tab');
      setTimeout(() => router.push('/teacher/assignments'), 900);
    }, 700);
  }

  function doRelease() {
    setConfirmRelease(false);
    setBusy('release');
    setTimeout(() => {
      setBusy(null);
      const released = release === 'scheduled' ? 'scheduled' : 'released';
      setStatus(released);
      setToast(
        release === 'scheduled'
          ? `Scheduled for ${new Date(scheduleAt).toLocaleString('en-ZW', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })} · ${assignedClasses.length} class${assignedClasses.length === 1 ? '' : 'es'}`
          : `Released to ${assignedClasses.length} class${assignedClasses.length === 1 ? '' : 'es'} · students notified`,
      );
      setTimeout(() => router.push('/teacher/assignments'), 1400);
    }, 1100);
  }

  function addAttachment(name: string) {
    const size = ['120 KB', '340 KB', '1.2 MB', '2.4 MB'][Math.floor(Math.random() * 4)];
    setAttachments((curr) => [...curr, { id: `att-${Date.now()}`, name, size: size ?? '300 KB' }]);
    setAttachOpen(false);
    setToast(`Attached "${name}"`);
  }

  function removeAttachment(id: string) {
    setAttachments((curr) => curr.filter((a) => a.id !== id));
  }

  function addRubricRow() {
    setRubric((prev) => [...prev, { name: '', max: '10' }]);
  }

  function removeRubricRow(idx: number) {
    setRubric((prev) => prev.filter((_, i) => i !== idx));
  }

  const statusBadge: { tone: 'warning' | 'brand' | 'success'; label: string } =
    status === 'released'
      ? { tone: 'success', label: 'Released' }
      : status === 'scheduled'
      ? { tone: 'brand', label: 'Scheduled' }
      : { tone: 'warning', label: 'Draft' };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/assignments"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:bg-surface hover:text-ink"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              New assignment
            </p>
            <p className="mt-0.5 text-micro text-muted">
              Auto-saved{' '}
              {new Date(savedAt).toLocaleTimeString('en-ZW', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={statusBadge.tone} dot>
            {statusBadge.label}
          </Badge>
          <button
            type="button"
            onClick={saveDraft}
            disabled={busy !== null}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {busy === 'draft' ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : null}
            {busy === 'draft' ? 'Saving…' : 'Save as draft'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmRelease(true)}
            disabled={busy !== null || assignedClasses.length === 0 || !title.trim()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-50"
          >
            {busy === 'release' ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {busy === 'release'
              ? 'Releasing…'
              : release === 'scheduled'
              ? 'Schedule release'
              : release === 'draft'
              ? 'Keep draft'
              : 'Release'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left — content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title */}
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment title"
            className="w-full border-0 border-b border-transparent bg-transparent py-2 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink placeholder:text-muted/60 focus:border-brand-primary focus:outline-none"
          />

          {/* Rich-text toolbar + body */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <div className="flex items-center gap-1 border-b border-line bg-surface/40 px-2 py-1.5">
              <ToolbarButton icon={Bold} label="Bold" />
              <ToolbarButton icon={Italic} label="Italic" />
              <span className="h-5 w-px bg-line" aria-hidden />
              <ToolbarButton icon={List} label="List" />
              <ToolbarButton icon={Link2} label="Link" />
              <ToolbarButton icon={Sigma} label="Formula" />
              <ToolbarButton icon={ImageIcon} label="Image" />
              <span className="ml-auto pr-2 text-micro text-muted">
                {brief.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={10}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Write the brief. Students will see formatting exactly as you enter it."
              className="w-full border-0 bg-card px-5 py-4 text-small leading-relaxed text-ink placeholder:text-muted focus:outline-none"
            />
          </section>

          {/* Attachments */}
          <section>
            <p className="mb-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Attached readings
            </p>
            <ul className="space-y-2">
              {attachments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 shadow-card-sm"
                >
                  <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                    <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="flex-1 text-small text-ink">{a.name}</span>
                  <span className="text-micro text-muted">{a.size}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    aria-label="Remove attachment"
                    className="rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAttachOpen(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-line bg-card px-4 py-2 text-small font-semibold text-ink transition-colors hover:border-brand-primary/30 hover:bg-surface"
            >
              <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Add attachment
            </button>
          </section>
        </div>

        {/* Right — settings */}
        <aside className="space-y-5 lg:col-span-4">
          <SettingsGroup label="Assign to">
            <div className="flex flex-wrap items-center gap-2">
              {assignedClasses.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleClass(c)}
                  className="group inline-flex items-center gap-1"
                  aria-label={`Remove ${classLabel(c)}`}
                >
                  <ClassChip
                    form={c.form}
                    stream={c.stream}
                    subjectName={c.subjectName}
                    subjectTone={c.subjectTone}
                  />
                  <X className="h-3 w-3 text-muted transition-colors group-hover:text-danger" aria-hidden />
                </button>
              ))}
            </div>
            <p className="mt-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Add another class
            </p>
            <ul className="mt-1 space-y-1">
              {TEACHER_CLASSES.filter((c) => !assignedClasses.some((x) => x.id === c.id)).map(
                (c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => toggleClass(c)}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-micro text-muted transition-colors hover:bg-surface hover:text-ink"
                    >
                      {classLabel(c)}
                      <span className="inline-flex items-center gap-1 text-brand-primary">
                        <Plus className="h-3 w-3" strokeWidth={1.75} /> add
                      </span>
                    </button>
                  </li>
                ),
              )}
              {TEACHER_CLASSES.every((c) => assignedClasses.some((x) => x.id === c.id)) ? (
                <li className="px-2 py-1.5 text-micro italic text-muted">All classes selected.</li>
              ) : null}
            </ul>
          </SettingsGroup>

          <SettingsGroup label="Release">
            <div role="radiogroup" className="space-y-1">
              {(
                [
                  { key: 'now', label: 'Release now' },
                  { key: 'scheduled', label: 'Schedule' },
                  { key: 'draft', label: 'Keep as draft' },
                ] as const
              ).map((o) => (
                <label
                  key={o.key}
                  className={[
                    'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-small transition-colors',
                    release === o.key
                      ? 'border-brand-primary bg-brand-primary/5 text-ink'
                      : 'border-line bg-card text-muted hover:bg-surface',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="release"
                    checked={release === o.key}
                    onChange={() => setRelease(o.key)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={[
                      'h-3.5 w-3.5 flex-none rounded-full border-2',
                      release === o.key ? 'border-brand-primary bg-brand-primary' : 'border-line',
                    ].join(' ')}
                  />
                  {o.label}
                </label>
              ))}
              {release === 'scheduled' ? (
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="mt-2 h-10 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              ) : null}
            </div>
          </SettingsGroup>

          <SettingsGroup label="Due date &amp; time">
            <div className="flex items-center gap-2 rounded-md border border-line bg-card px-3 py-2 text-small text-ink">
              <CalendarClock className="h-4 w-4 text-brand-primary" strokeWidth={1.75} aria-hidden />
              <input
                type="datetime-local"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="flex-1 border-0 bg-transparent text-small text-ink focus:outline-none"
              />
            </div>
          </SettingsGroup>

          <SettingsGroup label="Maximum marks">
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="h-10 w-full rounded-md border border-line bg-card px-3 font-mono text-small tabular-nums text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </SettingsGroup>

          <SettingsGroup label="Rubric">
            <ul className="space-y-2">
              {rubric.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    value={r.name}
                    onChange={(e) =>
                      setRubric((prev) =>
                        prev.map((row, j) => (j === i ? { ...row, name: e.target.value } : row)),
                      )
                    }
                    placeholder="Criterion"
                    className="h-9 flex-1 rounded-md border border-line bg-card px-2 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  <input
                    value={r.max}
                    onChange={(e) =>
                      setRubric((prev) =>
                        prev.map((row, j) => (j === i ? { ...row, max: e.target.value } : row)),
                      )
                    }
                    className="h-9 w-16 rounded-md border border-line bg-card px-2 font-mono text-small tabular-nums text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeRubricRow(i)}
                    aria-label="Remove row"
                    className="rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-danger"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addRubricRow}
              className="mt-2 inline-flex items-center gap-1 text-small font-semibold text-brand-primary hover:underline underline-offset-4"
            >
              <Plus className="h-3 w-3" strokeWidth={1.75} />
              Add criterion
            </button>
          </SettingsGroup>

          <SettingsGroup label="Late policy">
            <select
              value={latePolicy}
              onChange={(e) => setLatePolicy(e.target.value as typeof latePolicy)}
              className="h-10 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            >
              <option value="reject">Reject after deadline</option>
              <option value="no-penalty">Accept without penalty</option>
              <option value="penalise">Accept with penalty per day</option>
            </select>
          </SettingsGroup>

          <SettingsGroup label="Submission formats">
            <div className="flex flex-wrap gap-1.5">
              {['PDF', 'DOC', 'Image', 'Audio', 'Video', 'Text'].map((fmt) => {
                const active = formats.has(fmt);
                return (
                  <button
                    type="button"
                    key={fmt}
                    onClick={() => toggleFormat(fmt)}
                    aria-pressed={active}
                    className={[
                      'inline-flex h-8 items-center rounded-full border px-3 text-micro font-semibold uppercase tracking-[0.12em] transition-colors',
                      active
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-line bg-card text-muted hover:bg-surface',
                    ].join(' ')}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </SettingsGroup>
        </aside>
      </div>

      {attachOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setAttachOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                  Attach
                </p>
                <h3 className="text-h3 text-ink">Pick from your library</h3>
              </div>
              <button
                type="button"
                onClick={() => setAttachOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </header>
            <ul className="divide-y divide-line">
              {FILES.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => addAttachment(name)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface/60"
                  >
                    <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                      <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="flex-1 text-small text-ink">{name}</span>
                    <Plus className="h-4 w-4 text-brand-primary" strokeWidth={1.75} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            <footer className="flex items-center justify-between gap-2 border-t border-line px-5 py-3 text-micro text-muted">
              <span>Or upload a new file from your device</span>
              <button
                type="button"
                onClick={() => addAttachment('Uploaded file.pdf')}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-brand-primary px-4 text-micro font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90"
              >
                <Upload className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                Upload
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {confirmRelease ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmRelease(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
          >
            <header className="border-b border-line px-6 py-4">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                Confirm
              </p>
              <h3 className="text-h3 text-ink">
                {release === 'scheduled' ? 'Schedule this assignment' : 'Release to students'}
              </h3>
            </header>
            <div className="space-y-3 p-6">
              <div className="rounded-md border border-line bg-surface/40 p-4 text-small">
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-1 text-micro text-muted">
                  {assignedClasses.map((c) => classLabel(c)).join(' · ')}
                </p>
                <p className="mt-1 text-micro text-muted">
                  Due{' '}
                  {new Date(dueAt).toLocaleString('en-ZW', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · {maxMarks} marks · {formats.size} formats
                </p>
              </div>
              {release === 'scheduled' ? (
                <p className="text-small text-ink">
                  Will release at{' '}
                  <strong>
                    {new Date(scheduleAt).toLocaleString('en-ZW', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                  . Students are notified then, not now.
                </p>
              ) : (
                <p className="text-small text-ink">
                  Students see the assignment immediately and receive a push + email
                  notification.
                </p>
              )}
            </div>
            <footer className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirmRelease(false)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doRelease}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {release === 'scheduled' ? 'Schedule' : 'Release now'}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-micro font-semibold text-white shadow-card-md"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function SettingsGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="mb-2 text-micro font-semibold uppercase tracking-[0.12em] text-muted"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {children}
    </div>
  );
}

function ToolbarButton({ icon: Icon, label }: { icon: typeof Bold; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
