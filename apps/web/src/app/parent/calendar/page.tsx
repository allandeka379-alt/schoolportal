import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { CalendarCheck } from 'lucide-react';

import { CALENDAR } from '@/lib/mock/fixtures';

const KIND_TONE = {
  TERM: 'info',
  EXAM: 'warning',
  SPORTS: 'success',
  PARENTS: 'info',
  OTHER: 'neutral',
} as const;

export default function ParentCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Calendar</h2>
        <p className="text-sm text-granite-600 mt-1">
          Term dates, exams, fixtures, parents&rsquo; evenings. RSVP where needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-granite-100">
            {CALENDAR.map((e) => (
              <li key={e.id} className="flex items-center gap-4 p-4">
                <div className="flex-none w-16 text-center">
                  <p className="text-xs uppercase tracking-wider text-granite-500">
                    {new Date(e.date).toLocaleDateString('en-ZW', { month: 'short' })}
                  </p>
                  <p className="font-display text-xl text-heritage-950">
                    {new Date(e.date).getDate()}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-granite-900">{e.title}</p>
                  <p className="text-xs text-granite-500 mt-0.5">
                    {e.time ? `${e.time} · ` : ''}
                    {e.location ?? 'Harare Heritage Academy'}
                  </p>
                </div>
                <Badge tone={KIND_TONE[e.kind]}>{e.kind.toLowerCase()}</Badge>
                {e.kind === 'PARENTS' ? (
                  <button className="rounded border border-heritage-300 bg-white px-3 py-1 text-xs font-medium hover:bg-heritage-50 inline-flex items-center gap-1">
                    <CalendarCheck className="h-3 w-3" aria-hidden /> RSVP
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
