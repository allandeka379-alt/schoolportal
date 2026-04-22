import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { GRADEBOOK_FARAI, STUDENTS } from '@/lib/mock/fixtures';

export default function ParentProgressPage() {
  const farai = STUDENTS.find((s) => s.id === 's-farai')!;
  const avg = GRADEBOOK_FARAI.reduce((s, r) => s + r.total, 0) / GRADEBOOK_FARAI.length;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Progress</h2>
        <p className="text-sm text-granite-600 mt-1">
          Real-time view of every mark, as soon as the teacher releases it.
        </p>
      </div>

      <div className="flex gap-2">
        <button className="rounded-full bg-heritage-900 px-4 py-1.5 text-sm font-medium text-white">
          Farai — Form 3 Blue
        </button>
        <button className="rounded-full border border-granite-300 bg-white px-4 py-1.5 text-sm font-medium text-granite-700 hover:bg-granite-50">
          Tanaka — Form 1 Green
        </button>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>
              {farai.firstName} {farai.lastName} · Term 1 2026
            </CardTitle>
            <p className="mt-1 text-sm text-granite-600">Average {avg.toFixed(0)}% · Position 5 of 28</p>
          </div>
          <button className="rounded border border-granite-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-granite-50">
            Download report (PDF)
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Teacher</th>
                <th className="text-right">Mark</th>
                <th>Grade</th>
                <th className="text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {GRADEBOOK_FARAI.map((row) => (
                <tr key={row.subjectCode}>
                  <td className="font-medium">{row.subjectName}</td>
                  <td className="text-granite-600 text-xs">Mrs M. Dziva · {row.subjectCode}</td>
                  <td className="text-right font-mono tabular-nums">{row.total}%</td>
                  <td>
                    <Badge tone={row.grade === 'A' ? 'success' : row.grade === 'B' ? 'info' : row.grade === 'C' ? 'warning' : 'danger'}>
                      {row.grade}
                    </Badge>
                  </td>
                  <td className="text-right">
                    {row.trend === 'up' ? (
                      <TrendingUp className="inline h-4 w-4 text-emerald-600" />
                    ) : row.trend === 'down' ? (
                      <TrendingDown className="inline h-4 w-4 text-msasa-600" />
                    ) : (
                      <span className="text-granite-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
