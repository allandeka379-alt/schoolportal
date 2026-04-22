import Link from 'next/link';
import { Alert, Badge, Card, CardContent, CardHeader, CardTitle, Money, Stat } from '@hha/ui';
import { ArrowRight, BookOpen, Calendar, Flame, GraduationCap, PiggyBank, Target, TrendingUp } from 'lucide-react';

import { AnnouncementCard } from '@/components/announcement-card';
import {
  ANNOUNCEMENTS,
  ASSIGNMENTS_FOR_FARAI,
  GRADEBOOK_FARAI,
  INVOICES,
  TIMETABLE_FORM3_BLUE,
} from '@/lib/mock/fixtures';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export default function StudentDashboard() {
  // "What is due?" — open assignments, sorted by due date.
  const openAssignments = ASSIGNMENTS_FOR_FARAI.filter((a) => a.status === 'OPEN').slice(0, 3);

  // "How am I doing?" — average across subjects.
  const average =
    GRADEBOOK_FARAI.reduce((sum, row) => sum + row.total, 0) / GRADEBOOK_FARAI.length;

  // "What do I owe?" — the latest invoice with a balance.
  const outstanding = INVOICES.find(
    (i) => i.studentId === 's-farai' && i.status !== 'PAID',
  );

  // "What's next today?" — next timetable slot (hard-coded to Mon for demo consistency).
  const todayLabel = DAY_LABELS[new Date().getDay()];
  const todayKey = todayLabel === 'Sat' || todayLabel === 'Sun' ? 'Mon' : todayLabel;
  const todaySlots = TIMETABLE_FORM3_BLUE.filter((s) => s.day === todayKey).slice(0, 4);

  const topAnnouncements = ANNOUNCEMENTS.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* The four questions. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="What is due"
          value={<span>{openAssignments.length}</span>}
          trendLabel={`Earliest: ${new Date(openAssignments[0]?.dueAt ?? '').toLocaleDateString('en-ZW', { weekday: 'short', day: 'numeric', month: 'short' })}`}
          trend="flat"
          icon={<Target className="h-5 w-5" />}
        />
        <Stat
          label="What is new"
          value={topAnnouncements.length}
          trendLabel="Unread announcements"
          trend="flat"
          icon={<Calendar className="h-5 w-5" />}
        />
        <Stat
          label="How am I doing"
          value={`${average.toFixed(0)}%`}
          trendLabel={average >= 70 ? 'Above class average' : 'Work to do'}
          trend={average >= 70 ? 'up' : 'flat'}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <Stat
          label="What do I owe"
          value={outstanding ? <Money amount={outstanding.balance} currency="USD" /> : 'Nothing'}
          trendLabel={outstanding ? `Due ${new Date(outstanding.dueDate).toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })}` : 'Paid in full'}
          trend={outstanding ? 'flat' : 'up'}
          icon={<PiggyBank className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Due soon. */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Due soon</CardTitle>
              <Link
                href="/student/assignments"
                className="text-sm text-heritage-700 hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {openAssignments.length === 0 ? (
                <p className="p-5 text-sm text-granite-600">Nothing due — a rare and beautiful thing.</p>
              ) : (
                <ul className="divide-y divide-granite-100">
                  {openAssignments.map((a) => {
                    const due = new Date(a.dueAt);
                    const daysLeft = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-granite-50/60">
                        <div
                          className={`h-10 w-1 rounded ${daysLeft <= 1 ? 'bg-msasa-500' : daysLeft <= 3 ? 'bg-savanna-500' : 'bg-heritage-400'}`}
                          aria-hidden
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-granite-900 truncate">{a.title}</p>
                          <p className="text-xs text-granite-600 mt-0.5">
                            {a.subjectCode} · {a.teacher} · Max {a.maxMarks}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-granite-900">
                            {due.toLocaleDateString('en-ZW', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                          <p
                            className={`text-xs ${daysLeft <= 1 ? 'text-msasa-700' : daysLeft <= 3 ? 'text-savanna-700' : 'text-granite-500'}`}
                          >
                            {daysLeft <= 0 ? 'Due today' : `in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Announcements. */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Announcements</CardTitle>
              <Link
                href="/student/messages"
                className="text-sm text-heritage-700 hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {topAnnouncements.map((a) => (
                <AnnouncementCard a={a} key={a.id} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Study streak. */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-savanna-500" aria-hidden />
                Study streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-display-sm text-heritage-950">14 days</p>
              <p className="text-sm text-granite-600 mt-1">Keep it up — longest this term.</p>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 21 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-6 rounded-sm ${i < 14 ? 'bg-savanna-500' : 'bg-granite-200'}`}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-granite-500">
                3 house points earned this week for Savanna.
              </p>
            </CardContent>
          </Card>

          {/* Today's timetable. */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" aria-hidden /> Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {todaySlots.length === 0 ? (
                <p className="p-5 text-sm text-granite-600">No lessons scheduled — it must be the weekend.</p>
              ) : (
                <ul className="divide-y divide-granite-100">
                  {todaySlots.map((s) => (
                    <li key={`${s.day}-${s.start}`} className="flex items-center gap-3 p-3">
                      <div className="font-mono text-xs text-granite-600 w-12">{s.start}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-granite-900">{s.subjectCode}</p>
                        <p className="text-xs text-granite-500">Room {s.room}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* The Quiet Room. */}
          <Alert tone="info" title="The Quiet Room">
            If you would like to speak to the school counsellor in confidence, you can leave a
            message anonymously. <Link href="#" className="underline underline-offset-4">Open the Quiet Room →</Link>
          </Alert>
        </div>
      </div>

      {outstanding ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-savanna-100 text-savanna-800 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-granite-900">
                  {outstanding.term} fees — balance outstanding
                </p>
                <p className="text-xs text-granite-600">
                  <Money amount={outstanding.balance} currency="USD" /> due by{' '}
                  {new Date(outstanding.dueDate).toLocaleDateString('en-ZW', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="outline">EcoCash</Badge>
              <Badge tone="outline">OneMoney</Badge>
              <Badge tone="outline">ZIPIT</Badge>
              <Link
                href="/student/fees"
                className="inline-flex h-10 items-center justify-center rounded bg-heritage-900 px-4 text-sm font-medium text-white hover:bg-heritage-800"
              >
                Pay now
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
