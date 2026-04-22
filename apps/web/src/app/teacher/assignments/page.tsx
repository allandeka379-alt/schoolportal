import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { Plus } from 'lucide-react';

import { ASSIGNMENTS_FOR_FARAI, SUBJECTS } from '@/lib/mock/fixtures';

export default function TeacherAssignmentsPage() {
  const mine = ASSIGNMENTS_FOR_FARAI.filter((a) => a.subjectCode === 'MATH');
  function subjectName(code: string) {
    return SUBJECTS.find((s) => s.code === code)?.name ?? code;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Assignments</h2>
          <p className="text-sm text-granite-600 mt-1">
            Create, schedule, and re-use. The assignment bank saves you a Sunday evening.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> New assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Class</th>
                <th>Due</th>
                <th className="text-right">Submitted</th>
                <th className="text-right">Marked</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mine.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.title}</td>
                  <td>Form 3 Blue</td>
                  <td>{new Date(a.dueAt).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })}</td>
                  <td className="text-right">14 / 28</td>
                  <td className="text-right">2 / 14</td>
                  <td className="text-right">
                    <Badge tone={a.status === 'OPEN' ? 'info' : 'success'}>
                      {a.status.toLowerCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
              {[
                { t: 'Linear Graphs — Worksheet 4', c: 'Form 3 Green', d: 'Apr 18', sub: '25 / 26', mk: '25 / 25', st: 'closed' },
                { t: 'Calculus — Differentiation basics', c: 'Form 4 Blue', d: 'Apr 29', sub: '5 / 14', mk: '0 / 5', st: 'open' },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="font-medium">{row.t}</td>
                  <td>{row.c}</td>
                  <td>{row.d}</td>
                  <td className="text-right">{row.sub}</td>
                  <td className="text-right">{row.mk}</td>
                  <td className="text-right">
                    <Badge tone={row.st === 'open' ? 'info' : 'success'}>{row.st}</Badge>
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
