import { Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { SUBJECTS, TIMETABLE_FORM3_BLUE } from '@/lib/mock/fixtures';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
const PERIODS = [
  { start: '07:30', end: '08:15' },
  { start: '08:20', end: '09:05' },
  { start: '09:10', end: '09:55' },
  { start: '10:30', end: '11:15' },
];

export default function TimetablePage() {
  function lookup(day: (typeof DAYS)[number], start: string) {
    return TIMETABLE_FORM3_BLUE.find((s) => s.day === day && s.start === start);
  }
  function subjectName(code: string) {
    return SUBJECTS.find((s) => s.code === code)?.name ?? code;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Timetable</h2>
        <p className="text-sm text-granite-600 mt-1">
          Form 3 Blue · reflects real room allocations and same-day substitutions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This week</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="hha-table">
            <thead>
              <tr>
                <th className="w-28">Period</th>
                {DAYS.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((p) => (
                <tr key={p.start}>
                  <td className="align-top font-mono text-xs text-granite-600">
                    {p.start}–{p.end}
                  </td>
                  {DAYS.map((d) => {
                    const slot = lookup(d, p.start);
                    return (
                      <td key={d} className="align-top">
                        {slot ? (
                          <div className="rounded border border-heritage-200 bg-heritage-50/60 px-3 py-2">
                            <p className="text-sm font-medium text-heritage-950">
                              {subjectName(slot.subjectCode)}
                            </p>
                            <p className="text-xs text-granite-600 mt-0.5">Room {slot.room}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-granite-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
