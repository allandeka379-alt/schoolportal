import { Avatar, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { AnnouncementCard } from '@/components/announcement-card';
import { ANNOUNCEMENTS } from '@/lib/mock/fixtures';

const CONVERSATIONS = [
  {
    with: 'Mrs M. Dziva',
    subject: 'Maths · Farai · Worksheet 5',
    last: 'I\'ll send the worksheet through WhatsApp before Saturday — thank you.',
    time: '22 Apr 09:45',
    unread: 0,
  },
  {
    with: 'Mr T. Gondo',
    subject: 'English · Farai · Literature comprehension',
    last: 'Farai\'s reading is coming along well. See his returned mark on question 7.',
    time: '21 Apr 16:10',
    unread: 2,
  },
  {
    with: 'Mrs R. Chideme (Bursar)',
    subject: 'Term 2 fees — sibling discount',
    last: 'The 5% sibling discount has been applied to Tanaka\'s invoice. Thank you.',
    time: '20 Apr 14:22',
    unread: 1,
  },
];

export default function ParentMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Messages</h2>
        <p className="text-sm text-granite-600 mt-1">
          Talk directly to any of your children&rsquo;s teachers — no numbers exchanged, all
          logged, all within school hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-granite-100">
              {CONVERSATIONS.map((c) => (
                <li key={c.with + c.subject} className="flex items-start gap-3 p-4 hover:bg-granite-50/60">
                  <Avatar name={c.with} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-granite-900 truncate">{c.with}</p>
                      <span className="text-xs text-granite-500">· {c.subject}</span>
                    </div>
                    <p className="text-sm text-granite-700 mt-0.5 truncate">{c.last}</p>
                    <p className="text-xs text-granite-500 mt-1">{c.time}</p>
                  </div>
                  {c.unread > 0 ? (
                    <span className="rounded-full bg-heritage-900 px-2 py-0.5 text-xs font-semibold text-white">
                      {c.unread}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>From the school</CardTitle>
          </CardHeader>
          <CardContent>
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <AnnouncementCard a={a} key={a.id} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
