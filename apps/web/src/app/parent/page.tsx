import { Alert, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { AnnouncementCard } from '@/components/announcement-card';
import { ChildCard } from '@/components/child-card';
import { ANNOUNCEMENTS, INVOICES, STUDENTS } from '@/lib/mock/fixtures';

export default function ParentOverview() {
  const farai = STUDENTS.find((s) => s.id === 's-farai')!;
  const tanaka = STUDENTS.find((s) => s.id === 's-tanaka')!;

  const faraiOutstanding = INVOICES.find(
    (i) => i.studentId === 's-farai' && i.status !== 'PAID',
  )?.balance;
  const tanakaOutstanding = INVOICES.find(
    (i) => i.studentId === 's-tanaka' && i.status !== 'PAID',
  )?.balance;

  const parentAnnouncements = ANNOUNCEMENTS.filter(
    (a) => a.channel === 'Parents' || a.channel === 'School-wide' || a.channel === 'Form 3',
  );

  return (
    <div className="space-y-6">
      <Alert tone="warning" title="Term 2 fees due 9 May">
        You have outstanding balances on 2 of 2 invoices. Pay by EcoCash, OneMoney, ZIPIT, or a
        direct bank deposit — we&rsquo;ll reconcile the slip for you automatically.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChildCard
          child={farai}
          average={75}
          attendance={96}
          outstandingBalance={faraiOutstanding}
          pendingAssignments={3}
        />
        <ChildCard
          child={tanaka}
          average={82}
          attendance={99}
          outstandingBalance={tanakaOutstanding}
          pendingAssignments={1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Announcements for parents</CardTitle>
            </CardHeader>
            <CardContent>
              {parentAnnouncements.map((a) => (
                <AnnouncementCard a={a} key={a.id} />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This week</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-granite-500 w-16">Fri 25</span>
                  <span>Inter-house athletics — Farai running 400m for Savanna.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-granite-500 w-16">Mon 5</span>
                  <span>Term 2 opens. Registration 07:00.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs text-granite-500 w-16">Wed 14</span>
                  <span>Form 3 parents&rsquo; evening, 17:00 — please RSVP.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Alert tone="info" title="Language preference">
            You are reading in English. You can switch to ChiShona or isiNdebele at any time from
            your profile.
          </Alert>
        </div>
      </div>
    </div>
  );
}
