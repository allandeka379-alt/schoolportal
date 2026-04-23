import { CheckCircle2, FileSearch, RefreshCw, Upload, XCircle } from 'lucide-react';

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
  ACCOUNT_VERIFICATION: 'Beneficiary account matches registered HHA account.',
  STATEMENT_RECONCILIATION: 'Cross-reference against imported bank statement.',
  ACCOUNT_UPDATE: 'Update ledger, credit student, issue receipt.',
} as const;

function statusTone(s: string): 'success' | 'danger' | 'info' | 'warning' {
  if (s === 'RECONCILED' || s === 'VERIFIED') return 'success';
  if (s === 'FAILED' || s === 'MANUAL_REVIEW') return 'danger';
  if (s === 'OCR_IN_PROGRESS') return 'warning';
  return 'info';
}

export default function SlipQueuePage() {
  const active = SLIPS.find((s) => s.id === 'slip-2')!;
  const activeStudent = STUDENTS.find((s) => s.id === active.studentId)!;

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
          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface">
            <Upload className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Import statements
          </button>
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md">
            <RefreshCw className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Refresh queue
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
          const count = SLIPS.filter(
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
            <p className="text-micro text-muted">{SLIPS.length} slips tracked</p>
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
                {SLIPS.map((slip) => {
                  const student = STUDENTS.find((s) => s.id === slip.studentId);
                  return (
                    <tr
                      key={slip.id}
                      className={[
                        'border-t border-line transition-colors hover:bg-surface/40',
                        slip.id === active.id ? 'bg-brand-primary/[0.06]' : '',
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
                <p className="mt-1 text-micro text-muted">
                  Stanbic deposit · USD 1,450.00
                </p>
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
            </dl>

            {/* Pipeline steps */}
            <ol className="space-y-3">
              {active.steps.map((s, i) => {
                const stepTone =
                  s.outcome === 'done'
                    ? 'success'
                    : s.outcome === 'failed'
                    ? 'danger'
                    : s.outcome === 'in-progress'
                    ? 'warning'
                    : 'neutral';
                const circleColor =
                  s.outcome === 'done'
                    ? 'bg-success text-white'
                    : s.outcome === 'failed'
                    ? 'bg-danger text-white'
                    : s.outcome === 'in-progress'
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
                          {s.outcome}
                        </Badge>
                      </div>
                      <p className="text-micro text-muted">{STEP_DESCRIPTIONS[s.step]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 flex gap-2">
              <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/5 text-small font-semibold text-danger transition-colors hover:bg-danger/10">
                <XCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Reject
              </button>
              <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-brand-primary text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Approve &amp; credit
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
