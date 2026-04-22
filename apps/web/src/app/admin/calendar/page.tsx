import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { Plus } from 'lucide-react';

import { CALENDAR } from '@/lib/mock/fixtures';

export default function AdminCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Calendar</h2>
          <p className="text-sm text-granite-600 mt-1">
            Master school calendar — term dates, exams, sports, parent meetings, speech day.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Add event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-granite-100">
            {CALENDAR.map((e) => (
              <li key={e.id} className="flex items-center gap-4 p-4">
                <div className="flex-none w-16 text-center border-r border-granite-200 pr-4">
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
                <Badge tone="outline">{e.kind.toLowerCase()}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
