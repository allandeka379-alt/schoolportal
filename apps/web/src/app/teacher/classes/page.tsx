import { Avatar, Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { Users } from 'lucide-react';

import { STUDENTS } from '@/lib/mock/fixtures';

export default function ClassesPage() {
  const form3blue = STUDENTS.filter((s) => s.form === 'Form 3' && s.stream === 'Blue');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">My Classes</h2>
        <p className="text-sm text-granite-600 mt-1">
          Your teaching load — two form 3 Maths classes and one form 4 Additional Maths set.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Form 3 Blue · Maths', count: 28, avg: 74 },
          { label: 'Form 3 Green · Maths', count: 26, avg: 71 },
          { label: 'Form 4 Blue · Add Maths', count: 14, avg: 68 },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent>
              <p className="hha-label">Class</p>
              <h3 className="mt-1 text-lg font-semibold text-heritage-950">{c.label}</h3>
              <div className="mt-4 flex justify-between text-sm text-granite-600">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" aria-hidden /> {c.count} students
                </span>
                <span>Avg {c.avg}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form 3 Blue · roster</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission #</th>
                <th>House</th>
                <th className="text-right">Maths</th>
                <th className="text-right">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {form3blue.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                      <span className="font-medium text-granite-900">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-granite-700">{s.admissionNo}</td>
                  <td>
                    <Badge tone="outline">{s.house}</Badge>
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    {[82, 58, 74, 66, 79, 71, 64][i] ?? 70}%
                  </td>
                  <td className="text-right font-mono tabular-nums text-granite-700">
                    {[98, 94, 86, 99, 92, 88, 95][i] ?? 95}%
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
