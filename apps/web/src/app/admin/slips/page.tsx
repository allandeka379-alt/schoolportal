import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Money, Stepper } from '@hha/ui';
import { CheckCircle2, FileSearch, XCircle } from 'lucide-react';

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

function statusTone(s: string) {
  if (s === 'RECONCILED' || s === 'VERIFIED') return 'success';
  if (s === 'FAILED' || s === 'MANUAL_REVIEW') return 'danger';
  return 'info';
}

export default function SlipQueuePage() {
  // Pick the slip under active review for the detail pane.
  const active = SLIPS.find((s) => s.id === 'slip-2')!;
  const activeStudent = STUDENTS.find((s) => s.id === active.studentId)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Bank-slip queue</h2>
          <p className="text-sm text-granite-600 mt-1">
            Six-step pipeline: enhance → OCR → parse → verify → reconcile → credit. Fraud is
            blocked at reconciliation — no balance clears without the deposit on our statement.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import statements</Button>
          <Button>Refresh queue</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['UPLOADED', 'OCR_IN_PROGRESS', 'VERIFIED', 'RECONCILED', 'MANUAL_REVIEW', 'FAILED'] as const).map((s) => {
          const count = SLIPS.filter((sl) => sl.status === s || (s === 'UPLOADED' && sl.status === 'OCR_COMPLETE')).length;
          return (
            <Card key={s}>
              <CardContent>
                <p className="hha-label">{s.replace(/_/g, ' ').toLowerCase()}</p>
                <p className="mt-1 font-display text-xl text-heritage-950">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="hha-table">
              <thead>
                <tr>
                  <th>Slip</th>
                  <th>Student</th>
                  <th>Bank</th>
                  <th className="text-right">Claimed</th>
                  <th className="text-right">Conf.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {SLIPS.map((slip) => {
                  const student = STUDENTS.find((s) => s.id === slip.studentId);
                  return (
                    <tr key={slip.id} className={slip.id === active.id ? 'bg-heritage-50/60' : ''}>
                      <td>
                        <div className="font-mono text-xs text-granite-700">{slip.id}</div>
                        <div className="text-[11px] text-granite-500">
                          {new Date(slip.uploadedAt).toLocaleString('en-ZW', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="text-sm">
                        {student ? `${student.firstName} ${student.lastName}` : slip.studentId}
                        <div className="text-xs text-granite-500">{slip.uploadedBy}</div>
                      </td>
                      <td>{slip.detectedBank ?? '—'}</td>
                      <td className="text-right">
                        {slip.parsedAmount ? (
                          <Money amount={slip.parsedAmount} currency={slip.parsedCurrency ?? 'USD'} />
                        ) : (
                          <span className="text-granite-400">—</span>
                        )}
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {slip.confidence !== undefined ? `${slip.confidence}%` : '—'}
                      </td>
                      <td>
                        <Badge tone={statusTone(slip.status)}>
                          {slip.status.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5" aria-hidden /> Slip detail
              </CardTitle>
              <p className="mt-1 text-xs text-granite-500">
                {activeStudent.firstName} {activeStudent.lastName} · {active.detectedBank} ·{' '}
                {new Date(active.uploadedAt).toLocaleString('en-ZW')}
              </p>
            </div>
            <Badge tone={statusTone(active.status)}>
              {active.status.replace(/_/g, ' ').toLowerCase()}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-granite-200 bg-granite-50/70 h-40 flex items-center justify-center text-granite-400 mb-5">
              <div className="text-center">
                <p className="text-sm">Slip preview</p>
                <p className="text-xs mt-1">Stanbic deposit · USD 1,450.00</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-y-2 text-sm mb-5">
              <dt className="text-granite-600">Amount</dt>
              <dd className="text-right font-mono tabular-nums">
                {active.parsedAmount ? (
                  <Money amount={active.parsedAmount} currency={active.parsedCurrency ?? 'USD'} bold />
                ) : '—'}
              </dd>
              <dt className="text-granite-600">Reference</dt>
              <dd className="text-right font-mono tabular-nums">{active.parsedReference ?? '—'}</dd>
              <dt className="text-granite-600">Bank</dt>
              <dd className="text-right">{active.detectedBank ?? '—'}</dd>
              <dt className="text-granite-600">OCR confidence</dt>
              <dd className="text-right font-mono tabular-nums">{active.confidence}%</dd>
            </dl>

            <Stepper
              items={active.steps.map((s) => ({
                key: s.step,
                label: STEP_LABELS[s.step],
                description: STEP_DESCRIPTIONS[s.step],
                status:
                  s.outcome === 'done'
                    ? 'done'
                    : s.outcome === 'failed'
                    ? 'failed'
                    : s.outcome === 'in-progress'
                    ? 'in-progress'
                    : 'pending',
              }))}
            />

            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1">
                <XCircle className="h-4 w-4" /> Reject
              </Button>
              <Button className="flex-1">
                <CheckCircle2 className="h-4 w-4" /> Approve &amp; credit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
