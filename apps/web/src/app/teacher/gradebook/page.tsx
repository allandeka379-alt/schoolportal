import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { AlertTriangle, Download, Upload } from 'lucide-react';

import { STUDENTS } from '@/lib/mock/fixtures';

// Build a pseudo-random but stable gradebook grid.
const COLUMNS = [
  { label: 'W1', type: 'Assignment' },
  { label: 'W2', type: 'Assignment' },
  { label: 'W3', type: 'Assignment' },
  { label: 'CA1', type: 'Continuous' },
  { label: 'MT', type: 'Mid-term' },
  { label: 'W5', type: 'Assignment' },
  { label: 'Total', type: 'Total' },
];

function seed(i: number, j: number) {
  return ((i * 7 + j * 13 + 37) % 35) + 60;
}

export default function GradebookPage() {
  const students = STUDENTS.filter((s) => s.form === 'Form 3' && s.stream === 'Blue');
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Gradebook</h2>
          <p className="text-sm text-granite-600 mt-1">
            Form 3 Blue · Mathematics · Term 1 2026 · CA 40 / MT 20 / EOT 40
          </p>
        </div>
        <div className="flex gap-2">
          <button className="hha-nav-link">
            <Upload className="h-4 w-4" /> Import from photo
          </button>
          <button className="hha-nav-link">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="hha-table">
            <thead>
              <tr>
                <th className="sticky left-0 bg-granite-50 z-10">Student</th>
                {COLUMNS.map((c) => (
                  <th key={c.label} className="text-center">
                    <div>{c.label}</div>
                    <div className="text-[10px] font-normal text-granite-500">{c.type}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => {
                const rowValues = COLUMNS.slice(0, -1).map((_, j) => seed(i, j));
                const total = Math.round(rowValues.reduce((sum, v) => sum + v, 0) / rowValues.length);
                const outlier = rowValues.some((v) => v > 95);
                return (
                  <tr key={s.id}>
                    <td className="sticky left-0 bg-white z-10 font-medium">
                      {s.firstName} {s.lastName}
                    </td>
                    {rowValues.map((v, j) => (
                      <td key={j} className={`text-center font-mono tabular-nums ${v > 95 ? 'text-savanna-700 font-semibold' : ''}`}>
                        {v}
                      </td>
                    ))}
                    <td className="text-center font-mono tabular-nums font-semibold text-heritage-950">
                      {total}
                      {outlier ? (
                        <AlertTriangle className="inline ml-1 h-3.5 w-3.5 text-savanna-600" aria-label="Outlier" />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-granite-500">
        <AlertTriangle className="inline h-3 w-3 text-savanna-600" aria-hidden /> marks above 95%
        are flagged so you can confirm they were not mistyped before a report is generated.
      </p>
    </div>
  );
}
