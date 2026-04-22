import Link from 'next/link';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, Money, Stat } from '@hha/ui';
import { AlertTriangle, ArrowRight, Banknote, CheckCircle2, FileSearch, ShieldCheck, TrendingUp, Users } from 'lucide-react';

import { SLIPS, STUDENTS } from '@/lib/mock/fixtures';

export default function AdminOverview() {
  const pendingSlips = SLIPS.filter(
    (s) => s.status !== 'RECONCILED' && s.status !== 'FAILED',
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Enrolment"
          value="428"
          trendLabel="+14 vs last term"
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <Stat
          label="Term 2 fees collected"
          value={<Money amount="184320.00" currency="USD" />}
          trendLabel="62% of target"
          trend="up"
          icon={<Banknote className="h-5 w-5" />}
        />
        <Stat
          label="Slip queue"
          value={pendingSlips}
          trendLabel={`Avg resolution: 2h 14m`}
          trend="up"
          icon={<FileSearch className="h-5 w-5" />}
        />
        <Stat
          label="On-time rate"
          value="74%"
          trendLabel="+6 pts vs Term 1"
          trend="up"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Alert tone="info" title="Statement import complete">
        CBZ · Stanbic · ZB · Steward statements imported at 06:00. Reconciliation engine matched
        18 payments automatically overnight.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Fees collected — last 14 days</CardTitle>
              <Link href="/admin/fees" className="text-sm text-heritage-700 hover:underline inline-flex items-center gap-1">
                Open ledger <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-40">
                {[30, 42, 26, 55, 68, 38, 72, 60, 48, 84, 92, 70, 88, 96].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-heritage-500"
                      style={{ height: `${v}%` }}
                    />
                    <span className="text-[10px] text-granite-500">
                      {new Date(Date.now() - (13 - i) * 86400000).getDate()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="hha-label">Via mobile money</p>
                  <p className="mt-1 font-semibold">
                    <Money amount="84200.00" currency="USD" />
                  </p>
                  <p className="text-xs text-granite-500">46% of collections</p>
                </div>
                <div>
                  <p className="hha-label">Via EFT / slip</p>
                  <p className="mt-1 font-semibold">
                    <Money amount="78100.00" currency="USD" />
                  </p>
                  <p className="text-xs text-granite-500">42% of collections</p>
                </div>
                <div>
                  <p className="hha-label">Cash / card</p>
                  <p className="mt-1 font-semibold">
                    <Money amount="22020.00" currency="USD" />
                  </p>
                  <p className="text-xs text-granite-500">12% of collections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Ageing receivables</CardTitle>
              <span className="text-xs text-granite-500">As at today</span>
            </CardHeader>
            <CardContent className="p-0">
              <table className="hha-table">
                <thead>
                  <tr>
                    <th>Bucket</th>
                    <th className="text-right">Invoices</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { bucket: '0–7 days', invoices: 112, amount: '68420.00', pct: 62 },
                    { bucket: '8–30 days', invoices: 48, amount: '29120.00', pct: 26 },
                    { bucket: '31–60 days', invoices: 16, amount: '8800.00', pct: 8 },
                    { bucket: 'Over 60 days', invoices: 9, amount: '4420.00', pct: 4 },
                  ].map((row) => (
                    <tr key={row.bucket}>
                      <td className="font-medium">{row.bucket}</td>
                      <td className="text-right">{row.invoices}</td>
                      <td className="text-right">
                        <Money amount={row.amount} currency="USD" />
                      </td>
                      <td className="text-right text-granite-600">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5" aria-hidden /> Slip queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SLIPS.slice(0, 4).map((slip) => {
                  const student = STUDENTS.find((s) => s.id === slip.studentId);
                  const tone =
                    slip.status === 'RECONCILED'
                      ? 'success'
                      : slip.status === 'FAILED' || slip.status === 'MANUAL_REVIEW'
                      ? 'danger'
                      : 'info';
                  return (
                    <div key={slip.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student ? `${student.firstName} ${student.lastName}` : slip.studentId}
                        </p>
                        <p className="text-xs text-granite-500">
                          {slip.detectedBank ?? 'Bank detecting…'} · {slip.uploadedBy}
                        </p>
                      </div>
                      <Badge tone={tone}>{slip.status.replace('_', ' ').toLowerCase()}</Badge>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/admin/slips"
                className="mt-4 inline-flex w-full items-center justify-center rounded border border-granite-300 bg-white px-3 py-2 text-sm font-medium hover:bg-granite-50"
              >
                Open full queue
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> All staff have 2FA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> Last backup: 04:00
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden /> TLS · AES-256 at rest
                </li>
                <li className="flex items-center gap-2 text-savanna-700">
                  <AlertTriangle className="h-4 w-4" aria-hidden /> 2 password resets pending
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
