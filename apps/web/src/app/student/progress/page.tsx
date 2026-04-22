import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { GRADEBOOK_FARAI } from '@/lib/mock/fixtures';

function gradeTone(grade: string) {
  if (grade === 'A') return 'success';
  if (grade === 'B') return 'info';
  if (grade === 'C') return 'warning';
  return 'danger';
}

export default function ProgressPage() {
  const average =
    GRADEBOOK_FARAI.reduce((sum, row) => sum + row.total, 0) / GRADEBOOK_FARAI.length;
  const best = [...GRADEBOOK_FARAI].sort((a, b) => b.total - a.total)[0];
  const worst = [...GRADEBOOK_FARAI].sort((a, b) => a.total - b.total)[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">My Progress</h2>
        <p className="text-sm text-granite-600 mt-1">
          Term 1, 2026 · continuous assessment, mid-term, and end-of-term, with trend per subject.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="hha-label">Overall average</p>
            <p className="mt-2 font-display text-display-sm text-heritage-950">{average.toFixed(0)}%</p>
            <p className="mt-1 text-sm text-granite-600">Form position: 5 of 28</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Strongest subject</p>
            <p className="mt-2 font-display text-2xl text-heritage-950">{best?.subjectName}</p>
            <p className="mt-1 text-sm text-emerald-700">{best?.total}% · Position {best?.position}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Needs attention</p>
            <p className="mt-2 font-display text-2xl text-heritage-950">{worst?.subjectName}</p>
            <p className="mt-1 text-sm text-msasa-700">{worst?.total}% · Position {worst?.position}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th className="text-right">Continuous</th>
                <th className="text-right">Mid-term</th>
                <th className="text-right">End-term</th>
                <th className="text-right">Total</th>
                <th>Grade</th>
                <th className="text-right">Position</th>
                <th className="text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {GRADEBOOK_FARAI.map((row) => (
                <tr key={row.subjectCode}>
                  <td className="font-medium text-granite-900">{row.subjectName}</td>
                  <td className="text-right font-mono tabular-nums">{row.continuous}%</td>
                  <td className="text-right font-mono tabular-nums">{row.midterm}%</td>
                  <td className="text-right text-granite-400 font-mono">
                    {row.endterm ?? '—'}
                  </td>
                  <td className="text-right font-mono tabular-nums font-semibold text-heritage-950">
                    {row.total}%
                  </td>
                  <td>
                    <Badge tone={gradeTone(row.grade)}>{row.grade}</Badge>
                  </td>
                  <td className="text-right text-granite-600">{row.position}</td>
                  <td className="text-right">
                    {row.trend === 'up' ? (
                      <TrendingUp className="inline h-4 w-4 text-emerald-600" aria-label="Improving" />
                    ) : row.trend === 'down' ? (
                      <TrendingDown className="inline h-4 w-4 text-msasa-600" aria-label="Declining" />
                    ) : (
                      <span className="text-granite-400" aria-label="Steady">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>End-of-term report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-granite-700">
            Your end-of-term report will be released on{' '}
            <strong className="text-granite-900">Friday 15 April</strong> after review and approval
            by your form teacher and the head. It will be available here as a signed PDF, and your
            parents will receive a notification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
