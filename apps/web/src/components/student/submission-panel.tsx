'use client';

import { useState } from 'react';
import type { DragEvent as ReactDragEvent } from 'react';
import { ArrowRight, FileText, Upload, X } from 'lucide-react';

import { SectionEyebrow, StatusPill } from './primitives';

/**
 * Submission panel — §07 of the spec.
 *
 * Responsibilities (demo-grade — no real upload):
 *   - Status line (reflects live submission state)
 *   - Drag-and-drop zone with hover state
 *   - Upload queue with progress bar, file size, remove button
 *   - Submit button (disabled while any file is uploading)
 *   - "Save as draft" secondary action
 *   - Confirmation modal before final submit
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
}

export function SubmissionPanel({ status, dueAtIso, submittedAtIso }: Props) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(status !== 'OPEN');

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

    // Simulate upload progress.
    queued.forEach((q) => {
      const tick = () => {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === q.id
              ? { ...item, progress: Math.min(100, item.progress + 20) }
              : item,
          ),
        );
      };
      for (let step = 1; step <= 5; step += 1) {
        setTimeout(tick, 160 * step);
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

  const anyUploading = queue.some((q) => q.progress < 100);
  const canSubmit = queue.length > 0 && !anyUploading && !submitted;

  if (submitted) {
    return (
      <div className="rounded border border-sand bg-white p-8">
        <SectionEyebrow>Submission</SectionEyebrow>
        <div className="mt-3 flex items-center gap-2">
          <StatusPill state="submitted" />
          {submittedAtIso ? (
            <span className="font-sans text-[12px] text-stone">
              {new Date(submittedAtIso).toLocaleString('en-ZW', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          ) : null}
        </div>
        <p className="mt-4 font-serif text-[15px] leading-relaxed text-stone">
          Your work has been received. Reference{' '}
          <span className="font-mono text-[13px] text-ink">
            SUB-2026-042-{Math.floor(Math.random() * 9000 + 1000)}
          </span>
          .
        </p>
        <button
          type="button"
          className="mt-6 inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-4 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          onClick={() => setSubmitted(false)}
        >
          Withdraw submission
        </button>
      </div>
    );
  }

  return (
    <div className="rounded border border-sand bg-white p-8">
      <SectionEyebrow>Submit your work</SectionEyebrow>
      <p className="mt-2 flex items-center gap-2 font-sans text-[13px] text-stone">
        Status:{' '}
        {queue.length === 0 ? (
          <StatusPill state="draft">not yet started</StatusPill>
        ) : anyUploading ? (
          <StatusPill state="pending">uploading</StatusPill>
        ) : (
          <StatusPill state="pending">ready to submit</StatusPill>
        )}
      </p>

      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={[
          'mt-6 flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed px-4 py-8 text-center transition-colors',
          dragActive ? 'border-terracotta bg-sand-light' : 'border-stone/40 bg-cream hover:bg-sand-light/30',
        ].join(' ')}
      >
        <Upload className="h-6 w-6 text-earth" strokeWidth={1.5} aria-hidden />
        <p className="mt-3 font-sans text-[14px] text-ink">
          Drag files here, or{' '}
          <span className="font-semibold text-terracotta">click to choose</span>
        </p>
        <p className="mt-1 font-sans text-[12px] text-stone">
          PDF, DOC, image, audio · up to 50 MB each
        </p>
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
            <li
              key={q.id}
              className="rounded border border-sand bg-sand-light/40 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                <span className="min-w-0 flex-1 truncate font-sans text-[13px] text-ink">
                  {q.name}
                </span>
                <span className="font-sans text-[11px] text-stone">
                  {(q.sizeBytes / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => remove(q.id)}
                  aria-label="Remove file"
                  className="text-stone hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                <div
                  className={`h-full transition-all duration-300 ease-out-soft ${
                    q.progress >= 100 ? 'bg-ok' : 'bg-terracotta'
                  }`}
                  style={{ width: `${q.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setConfirming(true)}
          className="btn-terracotta w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          disabled={queue.length === 0 || anyUploading}
          className="w-full font-sans text-[13px] text-stone hover:text-ink disabled:opacity-50"
        >
          Save as draft
        </button>
      </div>

      {/* Late warning */}
      {new Date(dueAtIso).getTime() < Date.now() ? (
        <p className="mt-4 rounded border border-ochre/30 bg-ochre/10 px-3 py-2 font-sans text-[12px] text-earth">
          The deadline has passed. Late submissions are accepted but may carry a penalty.
        </p>
      ) : null}

      {/* Confirmation modal */}
      {confirming ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-md rounded border border-sand bg-white p-6 shadow-e3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-[22px] text-ink">Submit this work?</h3>
            <p className="mt-2 font-serif text-[15px] text-stone">
              You will not be able to edit after submission, though you may withdraw before the
              deadline.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded border border-sand bg-white px-5 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-terracotta"
                onClick={() => {
                  setConfirming(false);
                  setSubmitted(true);
                }}
              >
                Yes, submit
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
