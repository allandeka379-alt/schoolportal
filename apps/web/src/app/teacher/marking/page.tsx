import { Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hha/ui';
import { CheckCircle2, CircleDot, Mic2, PenSquare } from 'lucide-react';

import { STUDENTS } from '@/lib/mock/fixtures';

const SUBMISSIONS = STUDENTS.filter((s) => s.form === 'Form 3' && s.stream === 'Blue').map((s, i) => ({
  student: s,
  status: (['MARKED', 'NEW', 'NEW', 'LATE', 'NEW', 'MARKED'] as const)[i % 6] ?? 'NEW',
  mark: [35, null, null, null, null, 28][i] as number | null,
  submittedAt: ['2026-04-22T07:15:00Z', '2026-04-22T09:02:00Z', '2026-04-22T10:14:00Z', '2026-04-22T12:40:00Z', '2026-04-22T14:20:00Z', '2026-04-21T18:45:00Z'][i],
}));

export default function MarkingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Marking</h2>
        <p className="text-sm text-granite-600 mt-1">
          Quadratic Equations — Worksheet 5 · Form 3 Blue · 14 of 28 submitted
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Submission list */}
        <aside className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Submissions</CardTitle>
              <div className="flex gap-1">
                <Badge tone="info">New 4</Badge>
                <Badge tone="warning">Late 1</Badge>
                <Badge tone="success">Marked 2</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-granite-100">
                {SUBMISSIONS.map((sub, i) => (
                  <li
                    key={sub.student.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-granite-50/60 ${i === 1 ? 'bg-heritage-50/60' : ''}`}
                  >
                    <Avatar name={`${sub.student.firstName} ${sub.student.lastName}`} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-granite-900 truncate">
                        {sub.student.firstName} {sub.student.lastName}
                      </p>
                      <p className="text-xs text-granite-500">
                        {new Date(sub.submittedAt).toLocaleString('en-ZW', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {sub.status === 'MARKED' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Marked" />
                    ) : sub.status === 'LATE' ? (
                      <Badge tone="warning">Late</Badge>
                    ) : (
                      <CircleDot className="h-4 w-4 text-heritage-600" aria-label="New" />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* Marking pane */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Chipo Banda · Worksheet 5</CardTitle>
                <p className="mt-1 text-xs text-granite-500">Submitted 22 Apr 09:02</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <Mic2 className="h-4 w-4" /> Record audio feedback
                </Button>
                <Button>
                  <CheckCircle2 className="h-4 w-4" /> Return to student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-granite-200 bg-granite-50/70 h-72 flex flex-col items-center justify-center text-granite-400">
                <PenSquare className="h-8 w-8 mb-2" aria-hidden />
                <p className="text-sm">PDF preview — highlight, tick, cross, comment</p>
                <p className="text-xs mt-1">(page 1 of 3)</p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mark">Mark awarded (of 40)</Label>
                  <Input id="mark" type="number" placeholder="e.g. 28" />
                </div>
                <div>
                  <Label htmlFor="grade">Grade band</Label>
                  <select
                    id="grade"
                    defaultValue="C"
                    className="h-10 w-full rounded border border-granite-300 bg-white px-3 text-sm"
                  >
                    <option value="A">A · 80–100</option>
                    <option value="B">B · 70–79</option>
                    <option value="C">C · 60–69</option>
                    <option value="D">D · 50–59</option>
                    <option value="E">E · below 50</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="feedback">Written feedback</Label>
                <textarea
                  id="feedback"
                  rows={5}
                  className="w-full rounded border border-granite-300 bg-white p-3 text-sm focus-visible:outline-none focus-visible:border-heritage-500 focus-visible:shadow-focus"
                  placeholder="Well done on questions 1–8; remember to factor before applying the quadratic formula. Try question 10 again using completing the square."
                />
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="text-granite-500">Comment bank:</span>
                  {['Strong working shown', 'Watch your signs', 'Try factoring first', 'Iwe wakabudirira — go further'].map(
                    (c) => (
                      <button key={c} className="rounded border border-granite-300 bg-white px-2 py-0.5 hover:bg-granite-50">
                        {c}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
