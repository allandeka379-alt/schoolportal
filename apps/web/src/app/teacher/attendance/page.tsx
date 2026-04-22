import { Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import { ATTENDANCE_TODAY_FORM3_BLUE } from '@/lib/mock/fixtures';

export default function AttendancePage() {
  const today = new Date().toLocaleDateString('en-ZW', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const stats = {
    present: ATTENDANCE_TODAY_FORM3_BLUE.filter((r) => r.status === 'PRESENT').length,
    late: ATTENDANCE_TODAY_FORM3_BLUE.filter((r) => r.status === 'LATE').length,
    absent: ATTENDANCE_TODAY_FORM3_BLUE.filter((r) => r.status === 'ABSENT').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Register</h2>
        <p className="text-sm text-granite-600 mt-1">
          Form 3 Blue · {today} · morning session. Parents of unexcused absences are auto-notified.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="hha-label">Present</p>
            <p className="mt-1 font-display text-xl text-heritage-950">{stats.present}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Late</p>
            <p className="mt-1 font-display text-xl text-savanna-700">{stats.late}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Absent</p>
            <p className="mt-1 font-display text-xl text-msasa-700">{stats.absent}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Mark register</CardTitle>
          <Button>Save register</Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-granite-100">
            {ATTENDANCE_TODAY_FORM3_BLUE.map((row) => (
              <li key={row.studentId} className="flex items-center gap-3 p-3">
                <Avatar name={row.name} size="sm" />
                <p className="flex-1 text-sm font-medium">{row.name}</p>
                <div className="flex rounded border border-granite-300 bg-white overflow-hidden">
                  <Pill selected={row.status === 'PRESENT'} tone="ok">
                    <CheckCircle2 className="h-4 w-4" /> P
                  </Pill>
                  <Pill selected={row.status === 'LATE'} tone="warn">
                    <Clock className="h-4 w-4" /> L
                  </Pill>
                  <Pill selected={row.status === 'EXCUSED'} tone="info">
                    E
                  </Pill>
                  <Pill selected={row.status === 'ABSENT'} tone="danger">
                    <XCircle className="h-4 w-4" /> A
                  </Pill>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Pill({
  children,
  selected,
  tone,
}: {
  children: React.ReactNode;
  selected?: boolean;
  tone: 'ok' | 'warn' | 'info' | 'danger';
}) {
  const colours = {
    ok: 'bg-emerald-500 text-white',
    warn: 'bg-savanna-500 text-white',
    info: 'bg-heritage-500 text-white',
    danger: 'bg-msasa-500 text-white',
  } as const;
  return (
    <button
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
        selected ? colours[tone] : 'text-granite-600 hover:bg-granite-100'
      }`}
    >
      {children}
    </button>
  );
}
