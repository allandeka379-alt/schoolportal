import { Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { AnnouncementCard } from '@/components/announcement-card';
import { ANNOUNCEMENTS } from '@/lib/mock/fixtures';

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Announcements &amp; Messages</h2>
        <p className="text-sm text-granite-600 mt-1">
          School-wide, form, subject, and house channels. Messages are moderated and logged.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {ANNOUNCEMENTS.map((a) => (
            <AnnouncementCard a={a} key={a.id} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
