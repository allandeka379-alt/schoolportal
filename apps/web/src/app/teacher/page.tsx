import Link from 'next/link';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, Stat } from '@hha/ui';
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Clock, TrendingDown } from 'lucide-react';

import { ASSIGNMENTS_FOR_FARAI } from '@/lib/mock/fixtures';

export default function TeacherConsole() {
  const submitted = ASSIGNMENTS_FOR_FARAI.filter((a) => a.status === 'SUBMITTED' || a.status === 'LATE');

  // Early-warning list — students whose recent marks or attendance have dipped.
  const earlyWarning = [
    { id: 's-chipo', name: 'Chipo Banda', reason: 'Maths dropped from 74% → 58%', tone: 'danger' as const },
    { id: 's-tinashe', name: 'Tinashe Ncube', reason: 'Missed 3 of the last 5 submissions', tone: 'warning' as const },
    { id: 's-rudo', name: 'Rudo Mutasa', reason: 'Attendance 86% this term', tone: 'warning' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Lessons today" value="4" trendLabel="Next: Form 3 Blue at 07:30" trend="flat" icon={<Clock className="h-5 w-5" />} />
        <Stat label="Awaiting marking" value="18" trendLabel="Down from 24 yesterday" trend="up" icon={<ClipboardCheck className="h-5 w-5" />} />
        <Stat label="Class average" value="74%" trendLabel="+2% since mid-term" trend="up" />
        <Stat label="Early-warning" value={earlyWarning.length} trendLabel="Students to check in with" trend="down" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Awaiting my marking</CardTitle>
              <Link href="/teacher/marking" className="text-sm text-heritage-700 hover:underline inline-flex items-center gap-1">
                Open marking queue <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-granite-100">
                {submitted.map((a) => (
                  <li key={a.id} className="flex items-center gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-granite-900">{a.title}</p>
                      <p className="text-xs text-granite-500 mt-0.5">
                        {a.subjectCode} · Farai Moyo · submitted{' '}
                        {new Date(a.submittedAt ?? '').toLocaleString('en-ZW', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {a.status === 'LATE' ? (
                      <Badge tone="warning">Late</Badge>
                    ) : (
                      <Badge tone="info">New</Badge>
                    )}
                  </li>
                ))}
                <li className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-granite-900">Quadratic Equations — Worksheet 5</p>
                    <p className="text-xs text-granite-500 mt-0.5">MATH · 14 of 28 submitted · 14 outstanding</p>
                  </div>
                  <Badge tone="neutral">14 / 28</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class analytics — Form 3 Blue Mathematics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="hha-label">Average</p>
                  <p className="font-display text-xl text-heritage-950 mt-1">74%</p>
                </div>
                <div>
                  <p className="hha-label">Submission rate</p>
                  <p className="font-display text-xl text-heritage-950 mt-1">91%</p>
                </div>
                <div>
                  <p className="hha-label">On-time rate</p>
                  <p className="font-display text-xl text-heritage-950 mt-1">84%</p>
                </div>
              </div>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D', 'E'].map((grade, i) => {
                  const counts = [4, 9, 10, 3, 2];
                  const count = counts[i] ?? 0;
                  const pct = (count / 28) * 100;
                  return (
                    <div key={grade} className="flex items-center gap-3">
                      <span className="w-4 text-xs text-granite-600">{grade}</span>
                      <div className="flex-1 h-4 rounded bg-granite-100 overflow-hidden">
                        <div
                          className="h-full bg-heritage-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-granite-600 tabular-nums">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-msasa-600" aria-hidden />
                Early warning list
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-granite-100">
                {earlyWarning.map((w) => (
                  <li key={w.id} className="p-4">
                    <p className="text-sm font-medium text-granite-900">{w.name}</p>
                    <p className="text-xs text-granite-600 mt-0.5 flex items-center gap-1.5">
                      <TrendingDown className="h-3 w-3 text-msasa-600" aria-hidden />
                      {w.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Alert tone="info" title="CPD reminder">
            Your annual CPD log is at 12 of 30 hours. The new ZIMTA workshop on active-learning
            mathematics counts for 6 hours.
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> Reports progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-granite-700">
                You have drafted <strong>24 of 28</strong> end-of-term comments for Form 3 Blue.
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-granite-100 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '86%' }} />
              </div>
              <p className="mt-2 text-xs text-granite-500">
                After drafting, the form teacher and the head both sign off before a parent sees
                anything.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
