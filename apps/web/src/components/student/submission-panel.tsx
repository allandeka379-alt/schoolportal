'use client';

import { useEffect, useState } from 'react';
import type { DragEvent as ReactDragEvent } from 'react';
import {
  ArrowRight,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Languages,
  Loader2,
  Save,
  Send,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

/**
 * Submission panel — civic redesign.
 *
 * Flow:
 *   idle → add files (drag/drop or picker) → optional note to teacher
 *   → Submit → confirm modal → processing → submitted state with reference
 *   number + "what happens next" timeline + withdraw affordance.
 */

type Status = 'OPEN' | 'SUBMITTED' | 'LATE' | 'RETURNED';

interface QueuedFile {
  id: string;
  name: string;
  sizeBytes: number;
  progress: number; // 0..100
}

interface Props {
  assignmentId: string;
  status: Status;
  dueAtIso: string;
  submittedAtIso?: string;
  teacherName?: string;
  classLabel?: string;
}

function prettySize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SubmissionPanel({
  status,
  dueAtIso,
  submittedAtIso,
  teacherName = 'Mrs Dziva',
  classLabel = 'Form 4A · Mathematics',
}: Props) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(status !== 'OPEN');
  const [note, setNote] = useState('');
  const [reference, setReference] = useState<string>(() =>
    `SUB-2026-042-${Math.floor(Math.random() * 9000 + 1000)}`,
  );
  const [submittedAt, setSubmittedAt] = useState<string | undefined>(submittedAtIso);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).slice(0, 10);
    const now = Date.now();
    const queued: QueuedFile[] = arr.map((f, i) => ({
      id: `${now}-${i}`,
      name: f.name,
      sizeBytes: f.size,
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...queued]);
    // Simulate upload progress
    queued.forEach((q) => {
      for (let step = 1; step <= 5; step += 1) {
        setTimeout(() => {
          setQueue((prev) =>
            prev.map((item) =>
              item.id === q.id ? { ...item, progress: Math.min(100, item.progress + 20) } : item,
            ),
          );
        }, 160 * step);
      }
    });
  }

  function onDrop(e: ReactDragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  }

  function remove(id: string) {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  }

  function confirmSubmit() {
    setConfirming(false);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setReference(`SUB-2026-042-${Math.floor(Math.random() * 9000 + 1000)}`);
      setSubmittedAt(new Date().toISOString());
      setSubmitted(true);
    }, 1100);
  }

  function withdraw() {
    setSubmitted(false);
    setToast('Submission withdrawn — you can re-upload until the deadline');
  }

  function saveDraft() {
    setToast(`Draft saved · ${queue.length} file${queue.length === 1 ? '' : 's'} kept on device`);
  }

  const anyUploading = queue.some((q) => q.progress < 100);
  const canSubmit = queue.length > 0 && !anyUploading && !submitted && !submitting;
  const isLate = new Date(dueAtIso).getTime() < Date.now();

  if (submitted) {
    return (
      <div className="rounded-lg border border-line bg-card p-6 shadow-card-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-success">
              Submitted
            </p>
            <p className="mt-0.5 text-small font-semibold text-ink">{classLabel}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-small">
          <div>
            <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Reference
            </dt>
            <dd className="mt-1 font-mono text-micro text-ink">{reference}</dd>
          </div>
          <div>
            <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              When
            </dt>
            <dd className="mt-1 text-ink">
              {submittedAt
                ? new Date(submittedAt).toLocaleString('en-ZW', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Just now'}
            </dd>
          </div>
          <div>
            <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Marker
            </dt>
            <dd className="mt-1 text-ink">{teacherName}</dd>
          </div>
          <div>
            <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Status
            </dt>
            <dd className="mt-1">
              <Badge tone="info" dot>
                Waiting mark
              </Badge>
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            What happens next
          </p>
          <ul className="mt-2 space-y-2">
            <TimelineRow
              done
              icon={Send}
              title="Uploaded to school server"
              detail="Files are deduplicated and virus-scanned."
            />
            <TimelineRow
              done
              icon={BellRing}
              title={`${teacherName} notified`}
              detail="Your submission is in the marking queue."
            />
            <TimelineRow
              pending
              icon={Sparkles}
              title="Marking in progress"
              detail="Typical turnaround: 3 school days. You'll get a push when it's returned."
            />
            <TimelineRow
              pending
              icon={Check}
              title="Mark released"
              detail="Mark + teacher comment land on this page and your parent's dashboard."
            />
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={withdraw}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Withdraw &amp; edit
          </button>
        </div>

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

  return (
    <div className="rounded-lg border border-line bg-card p-6 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
        Submit your work
      </p>
      <div className="mt-2 flex items-center gap-2">
        {queue.length === 0 ? (
          <Badge tone="neutral" dot>
            Not yet started
          </Badge>
        ) : anyUploading ? (
          <Badge tone="warning" dot>
            Uploading
          </Badge>
        ) : (
          <Badge tone="brand" dot>
            Ready to submit
          </Badge>
        )}
        <span className="text-micro text-muted">
          <Clock className="mr-1 inline-block h-3 w-3" strokeWidth={1.75} aria-hidden />
          {isLate ? 'Deadline passed' : 'Due ' + new Date(dueAtIso).toLocaleDateString('en-ZW', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
      </div>

      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={[
          'mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors',
          dragActive
            ? 'border-brand-primary bg-brand-primary/[0.04]'
            : 'border-line bg-surface/40 hover:border-brand-primary/50 hover:bg-brand-primary/[0.02]',
        ].join(' ')}
      >
        <Upload className="h-6 w-6 text-brand-primary" strokeWidth={1.75} aria-hidden />
        <p className="mt-3 text-small text-ink">
          Drag files here, or{' '}
          <span className="font-semibold text-brand-primary">click to choose</span>
        </p>
        <p className="mt-1 text-micro text-muted">PDF, DOC, image, audio · up to 50 MB each</p>
        <input
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {/* Upload queue */}
      {queue.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {queue.map((q) => (
            <li key={q.id} className="rounded-md border border-line bg-surface/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <FileText
                  className="h-4 w-4 flex-none text-brand-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-small text-ink">{q.name}</span>
                <span className="text-micro text-muted">{prettySize(q.sizeBytes)}</span>
                {q.progress === 100 ? (
                  <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} aria-hidden />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" strokeWidth={1.75} />
                )}
                <button
                  type="button"
                  onClick={() => remove(q.id)}
                  aria-label="Remove file"
                  className="rounded-full p-1 text-muted transition-colors hover:bg-card hover:text-danger"
                >
                  <X className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    q.progress >= 100 ? 'bg-success' : 'bg-brand-primary'
                  }`}
                  style={{ width: `${q.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Note to teacher */}
      <label className="mt-4 block">
        <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
          Note to {teacherName} (optional)
        </span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="If you struggled with a section or want to flag anything, say so here."
          className="w-full rounded-md border border-line bg-card p-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setConfirming(true)}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
          ) : (
            <>
              Submit
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </>
          )}
        </button>
        <button
          type="button"
          disabled={queue.length === 0 || anyUploading}
          onClick={saveDraft}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-50"
        >
          <Save className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Save draft
        </button>
      </div>

      {/* Late warning */}
      {isLate ? (
        <p className="mt-4 rounded-md border border-warning/30 bg-warning/[0.06] px-3 py-2 text-small text-ink">
          <Clock className="mr-1.5 inline-block h-3.5 w-3.5 text-warning" strokeWidth={1.75} aria-hidden />
          The deadline has passed. Late submissions are accepted but may carry a penalty.
        </p>
      ) : null}

      {/* Translations note */}
      <p className="mt-3 flex items-center gap-1.5 text-micro text-muted">
        <Languages className="h-3 w-3" strokeWidth={1.75} aria-hidden />
        Audio or video feedback is accepted — the teacher can reply in kind.
      </p>

      {/* Confirmation modal */}
      {confirming ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
          onClick={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="border-b border-line px-6 py-4">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                Confirm
              </p>
              <h3 className="mt-1 text-h3 text-ink">Submit to {teacherName}?</h3>
            </header>
            <div className="space-y-3 p-6">
              <div className="rounded-md border border-line bg-surface/40 p-3">
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                  About to upload
                </p>
                <ul className="mt-2 space-y-1 text-small text-ink">
                  {queue.map((q) => (
                    <li key={q.id} className="flex items-center justify-between">
                      <span className="truncate">{q.name}</span>
                      <span className="font-mono text-micro text-muted">
                        {prettySize(q.sizeBytes)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {note.trim() ? (
                <div className="rounded-md border border-line bg-card p-3 text-small italic text-ink">
                  &ldquo;{note.trim()}&rdquo;
                </div>
              ) : null}
              <p className="text-small text-muted">
                You cannot edit after submission, though you can withdraw before the deadline.
              </p>
            </div>
            <footer className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                onClick={confirmSubmit}
              >
                <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Submit {queue.length} file{queue.length === 1 ? '' : 's'}
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

function TimelineRow({
  icon: Icon,
  title,
  detail,
  done,
  pending,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
  done?: boolean;
  pending?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={[
          'mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full',
          done ? 'bg-success text-white' : pending ? 'border border-line bg-card text-muted' : 'bg-muted/20 text-muted',
        ].join(' ')}
      >
        {done ? (
          <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
        ) : (
          <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden />
        )}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">{title}</p>
        <p className="text-micro text-muted">{detail}</p>
      </div>
    </li>
  );
}
