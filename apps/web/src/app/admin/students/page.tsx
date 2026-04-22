import { Avatar, Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@hha/ui';
import { Search } from 'lucide-react';

import { STUDENTS } from '@/lib/mock/fixtures';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Students</h2>
        <p className="text-sm text-granite-600 mt-1">
          428 enrolled · 52 new this year. Digital admission files, medical summaries, next-of-kin.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-granite-400" aria-hidden />
          <Input className="pl-9" placeholder="Search by name, admission number, parent name…" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission #</th>
                <th>Form</th>
                <th>House</th>
                <th>Guardian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                      <div>
                        <p className="font-medium">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-granite-500">
                          {new Date(s.dateOfBirth).toLocaleDateString('en-ZW', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{s.admissionNo}</td>
                  <td>
                    {s.form} {s.stream}
                  </td>
                  <td>
                    <Badge tone="outline">{s.house}</Badge>
                  </td>
                  <td className="text-granite-700">
                    {s.guardianIds.length > 0 ? 'Sekai Moyo (Mother)' : 'On file'}
                  </td>
                  <td>
                    <Badge tone="success">active</Badge>
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
