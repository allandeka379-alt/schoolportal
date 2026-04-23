'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileSearch,
  Loader2,
  RefreshCw,
  Upload,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SLIPS, STUDENTS } from '@/lib/mock/fixtures';

const STEP_LABELS = {
  IMAGE_ENHANCEMENT: 'Image enhancement',
  OCR: 'Optical character recognition',
  STRUCTURAL_PARSING: 'Structural parsing',
  ACCOUNT_VERIFICATION: 'Account verification',
  STATEMENT_RECONCILIATION: 'Statement reconciliation',
  ACCOUNT_UPDATE: 'Account update & receipt',
} as const;

const STEP_DESCRIPTIONS = {
  IMAGE_ENHANCEMENT: 'Deskew, crop, contrast-adjust.',
  OCR: 'Extract every printed field via Document AI.',
  STRUCTURAL_PARSING: 'Match bank-specific slip template.',
  ACCOUNT_VERIFICATION: 'Beneficiary account matches registered JHS account.',
  STATEMENT_RECONCILIATION: 'Cross-reference against imported bank statement.',
  ACCOUNT_UPDATE: 'Update ledger, credit student, issue receipt.',
} as const;

type SlipStatus = string;

function statusTone(s: SlipStatus): 'success' | 'danger' | 'info' | 'warning' {
  if (s === 'RECONCILED' || s === 'VERIFIED') return 'success';
  if (s === 'FAILED' || s === 'MANUAL_REVIEW') return 'danger';
  if (s === 'OCR_IN_PROGRESS') return 'warning';
  return 'info';
}

interface LocalSlip {
  id: string;
  status: string;
  overrideNote?: string;
  receiptRef?: string;
}

export default function SlipQueuePage() {
  const [overrides, setOverrides] = useState<Record<string, LocalSlip>>({});
  const [activeId, setActiveId] = useState<string>('slip-2');
  const [busy, setBusy] = useState<null | 'approve' | 'reject' | 'import' | 'refresh'>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const slips = useMemo(
    () =>
      SLIPS.map((s) => {
        const o = overrides[s.id];
        return {
          ...s,
          status: o?.status ?? s.status,
          overrideNote: o?.overrideNote,
          receiptRef: o?.receiptRef,
        };
      }),
    [overrides],
  );

  const active = slips.find((s) => s.id === activeId) ?? slips[0]!;
  const activeStudent = STUDENTS.find((s) => s.id === active.studentId)!;

  function approve() {
    setBusy('approve');
    setTimeout(() => {
      const ref = `RCPT-${Date.now().toString().slice(-6)}`;
      setOverrides((o) => ({
        ...o,
        [active.id]: { id: active.id, status: 'RECONCILED', receiptRef: ref },
      }));
      setBusy(null);
      setToast(`Approved · receipt ${ref} sent to parent`);
    }, 1400);
  }

  function reject(note: string) {
    setBusy('reject');
    setRejectOpen(false);
    setTimeout(() => {
      setOverrides((o) => ({
        ...o,
        [active.id]: { id: active.id, status: 'FAILED', overrideNote: note },
      }));
      setBusy(null);
      setToast('Rejected · parent notified to re-upload');
    }, 900);
  }

  function importStatements() {
    setBusy('import');
    setTimeout(() => {
      setBusy(null);
      setToast('Imported 4 bank statements · 18 new auto-matches');
    }, 1600);
  }

  function refreshQueue() {
    setBusy('refresh');
    setTimeout(() => {
      setBusy(null);
      setToast('Queue refreshed');
    }, 700);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">Admin · reconciliation</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            Bank-slip queue
          </h1>
          <p className="mt-2 text-small text-muted">
            Six-step pipeline: enhance → OCR → parse → verify → reconcile → credit. Fraud is
            blocked at reconciliation — no balance clears without the deposit on our statement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={importStatements}
            disabled={busy === 'import'}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            {busy === 'import' ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {busy === 'import' ? 'Importing…' : 'Import statements'}
          </button>
          <button
            type="button"
            onClick={refreshQueue}
            disabled={busy === 'refresh'}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-60"
          >
            {busy === 'refresh' ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            {busy === 'refresh' ? 'Refreshing…' : 'Refresh queue'}
          </button>
        </div>
      </header>

      {/* Status tiles */}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {(
          [
            { key: 'UPLOADED', tone: 'info' as const, label: 'Uploaded' },
            { key: 'OCR_IN_PROGRESS', tone: 'warning' as const, label: 'OCR in progress' },
            { key: 'VERIFIED', tone: 'success' as const, label: 'Verified' },
            { key: 'RECONCILED', tone: 'success' as const, label: 'Reconciled' },
            { key: 'MANUAL_REVIEW', tone: 'danger' as const, label: 'Manual review' },
            { key: 'FAILED', tone: 'danger' as const, label: 'Failed' },
          ]
        ).map((s) => {
          const count = slips.filter(
            (sl) =>
              sl.status === s.key ||
              (s.key === 'UPLOADED' && sl.status === 'OCR_COMPLETE'),
          ).length;
          return (
            <li key={s.key} className="rounded-lg border border-line bg-card p-4 shadow-card-sm">
              <Badge tone={s.tone} dot>
                {s.label}
              </Badge>
              <p className="mt-2 text-h2 tabular-nums text-ink">{count}</p>
            </li>
          );
        })}
      </ul>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Queue */}
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-3">
          <header className="border-b border-line px-5 py-3.5">
            <h2 className="text-small font-semibold text-ink">Queue</h2>
            <p className="text-micro text-muted">
              {slips.length} slips tracked · click a row to inspect
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-small">
              <thead>
                <tr className="bg-surface/60 text-left">
                  <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Slip
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Student
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Bank
                  </th>
                  <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Claimed
                  </th>
                  <th className="px-4 py-3 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Conf.
                  </th>
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {slips.map((slip) => {
                  const student = STUDENTS.find((s) => s.id === slip.studentId);
                  return (
                    <tr
                      key={slip.id}
                      onClick={() => setActiveId(slip.id)}
                      className={[
                        'cursor-pointer border-t border-line transition-colors',
                        slip.id === active.id ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/40',
                      ].join(' ')}
                    >
                      <td className="px-5 py-3">
                        <div className="font-mono text-micro text-ink">{slip.id}</div>
                        <div className="text-micro text-muted">
                          {new Date(slip.uploadedAt).toLocaleString('en-ZW', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-small text-ink">
                        {student ? `${student.firstName} ${student.lastName}` : slip.studentId}
                        <div className="text-micro text-muted">{slip.uploadedBy}</div>
                      </td>
                      <td className="px-4 py-3 text-small text-ink">{slip.detectedBank ?? '—'}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ink">
                        {slip.parsedAmount
                          ? `${slip.parsedCurrency ?? 'USD'} ${slip.parsedAmount}`
                          : <span className="text-muted">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                        {slip.confidence !== undefined ? `${slip.confidence}%` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusTone(slip.status)} dot>
                          {slip.status.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Slip detail */}
        <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm lg:col-span-2">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                <FileSearch className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h2 className="text-small font-semibold text-ink">Slip detail</h2>
                <p className="text-micro text-muted">
                  {activeStudent.firstName} {activeStudent.lastName} · {active.detectedBank}
                </p>
              </div>
            </div>
            <Badge tone={statusTone(active.status)} dot>
              {active.status.replace(/_/g, ' ').toLowerCase()}
            </Badge>
          </header>
          <div className="p-5">
            <div className="mb-5 flex h-40 items-center justify-center rounded-lg border border-line bg-surface/60 text-muted">
              <div className="text-center">
                <p className="text-small font-semibold text-ink">Slip preview</p>
                <p className="mt-1 text-micro text-muted">Stanbic deposit · USD 1,450.00</p>
              </div>
            </div>

            <dl className="mb-5 grid grid-cols-2 gap-y-2 text-small">
              <dt className="text-muted">Amount</dt>
              <dd className="text-right font-bold tabular-nums text-ink">
                {active.parsedAmount
                  ? `${active.parsedCurrency ?? 'USD'} ${active.parsedAmount}`
                  : '—'}
              </dd>
              <dt className="text-muted">Reference</dt>
              <dd className="text-right font-mono tabular-nums text-ink">
                {active.parsedReference ?? '—'}
              </dd>
              <dt className="text-muted">Bank</dt>
              <dd className="text-right text-ink">{active.detectedBank ?? '—'}</dd>
              <dt className="text-muted">OCR confidence</dt>
              <dd className="text-right font-mono tabular-nums text-ink">{active.confidence}%</dd>
              {active.receiptRef ? (
                <>
                  <dt className="text-muted">Receipt</dt>
                  <dd className="text-right font-mono tabular-nums text-success">
                    {active.receiptRef}
                  </dd>
                </>
              ) : null}
              {active.overrideNote ? (
                <>
                  <dt className="text-muted">Reject reason</dt>
                  <dd className="text-right text-danger">{active.overrideNote}</dd>
                </>
              ) : null}
            </dl>

            {/* Pipeline steps */}
            <ol className="space-y-3">
              {active.steps.map((s, i) => {
                // If the slip has been RECONCILED or FAILED via override, adjust the final step
                const isFinalStep = i === active.steps.length - 1;
                const reconciled = active.status === 'RECONCILED';
                const failed = active.status === 'FAILED';
                const outcome =
                  isFinalStep && reconciled
                    ? 'done'
                    : isFinalStep && failed
                    ? 'failed'
                    : s.outcome;
                const stepTone =
                  outcome === 'done'
                    ? 'success'
                    : outcome === 'failed'
                    ? 'danger'
                    : outcome === 'in-progress'
                    ? 'warning'
                    : 'neutral';
                const circleColor =
                  outcome === 'done'
                    ? 'bg-success text-white'
                    : outcome === 'failed'
                    ? 'bg-danger text-white'
                    : outcome === 'in-progress'
                    ? 'bg-warning text-white'
                    : 'border border-line bg-card text-muted';
                return (
                  <li key={s.step} className="flex gap-3">
                    <div
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-micro font-bold ${circleColor}`}
                      aria-hidden
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-small font-semibold text-ink">{STEP_LABELS[s.step]}</p>
                        <Badge tone={stepTone} dot>
                          {outcome}
                        </Badge>
                      </div>
                      <p className="text-micro text-muted">{STEP_DESCRIPTIONS[s.step]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setRejectOpen(true)}
                disabled={busy !== null || active.status === 'FAILED' || active.status === 'RECONCILED'}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/5 text-small font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-40"
              >
                <XCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Reject
              </button>
              <button
                type="button"
                onClick={approve}
                disabled={busy !== null || active.status === 'RECONCILED' || active.status === 'FAILED'}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-40"
              >
                {busy === 'approve' ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
                ) : active.status === 'RECONCILED' ? (
                  <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                ) : (
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                )}
                {busy === 'approve'
                  ? 'Crediting…'
                  : active.status === 'RECONCILED'
                  ? 'Credited'
                  : 'Approve & credit'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {rejectOpen ? (
        <RejectModal
          slipId={active.id}
          onClose={() => setRejectOpen(false)}
          onConfirm={(note) => reject(note)}
        />
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

function RejectModal({
  slipId,
  onClose,
  onConfirm,
}: {
  slipId: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState<string>('Reference number does not match our statement.');
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!note.trim()) return;
          onConfirm(note.trim());
        }}
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-danger">
              Reject slip
            </p>
            <h2 className="text-h3 text-ink">{slipId}</h2>
          </div>
        </header>
        <div className="space-y-4 p-6">
          <label className="block">
            <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Reason · shown to parent
            </span>
            <textarea
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border border-line bg-card p-3 text-small text-ink placeholder:text-muted focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/20"
            />
          </label>
          <p className="rounded-md border border-warning/30 bg-warning/[0.06] p-3 text-small text-ink">
            Parent is notified by SMS and in-app. They can re-upload the corrected slip immediately.
          </p>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-danger px-4 text-small font-semibold text-white transition hover:bg-danger/90"
          >
            <XCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Reject &amp; notify
          </button>
        </footer>
      </form>
    </div>
  );
}
