import { Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { AnnouncementCard } from '@/components/announcement-card';
import { ANNOUNCEMENTS } from '@/lib/mock/fixtures';

export default function TeacherMessages() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Messages &amp; Announcements</h2>
        <p className="text-sm text-granite-600 mt-1">
          Staff-room, departmental, and parent-teacher channels. Messages are moderated and
          logged — no personal numbers exchanged.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
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
