import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';
import { Megaphone, Plus } from 'lucide-react';

import { AnnouncementCard } from '@/components/announcement-card';
import { ANNOUNCEMENTS } from '@/lib/mock/fixtures';

export default function AnnouncementsAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Announcements</h2>
          <p className="text-sm text-granite-600 mt-1">
            Author, schedule, and track acknowledgement. SMS fallback for parents who haven&rsquo;t
            opened the portal in 7 days.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Compose
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" aria-hidden /> Compose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {['School-wide', 'Form 3', 'Parents', 'Savanna House', 'Mathematics'].map((c) => (
              <Badge key={c} tone="outline">
                {c}
              </Badge>
            ))}
          </div>
          <input
            className="w-full h-10 rounded border border-granite-300 bg-white px-3 text-sm"
            placeholder="Title — short, specific"
          />
          <textarea
            className="w-full rounded border border-granite-300 bg-white p-3 text-sm"
            rows={4}
            placeholder="Write the announcement. Markdown supported. Shona and Ndebele translations will be drafted for you, for review before publishing."
          />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-granite-300" /> Pin
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-granite-300" defaultChecked /> Auto-translate
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-granite-300" /> Require acknowledgement
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-granite-300" /> SMS fallback
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Save draft</Button>
            <Button variant="ghost">Schedule…</Button>
            <Button>Publish now</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
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
