import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@hha/ui';
import { ClipboardList, Clock, FileCheck2, FileClock, Paperclip } from 'lucide-react';

import { ASSIGNMENTS_FOR_FARAI, SUBJECTS } from '@/lib/mock/fixtures';

function subjectName(code: string) {
  return SUBJECTS.find((s) => s.code === code)?.name ?? code;
}

export default function AssignmentsPage() {
  const open = ASSIGNMENTS_FOR_FARAI.filter((a) => a.status === 'OPEN' || a.status === 'LATE');
  const submitted = ASSIGNMENTS_FOR_FARAI.filter((a) => a.status === 'SUBMITTED');
  const returned = ASSIGNMENTS_FOR_FARAI.filter((a) => a.status === 'RETURNED');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Assignments</h2>
        <p className="text-sm text-granite-600 mt-1">
          All assignments across all subjects, sorted by due date. Colour-coded urgency.
        </p>
      </div>

      <Section title="To do" icon={<ClipboardList className="h-4 w-4" />}>
        {open.length === 0 ? (
          <EmptyState title="Nothing outstanding." description="Enjoy the moment." />
        ) : (
          <ul className="divide-y divide-granite-100">
            {open.map((a) => {
              const due = new Date(a.dueAt);
              const days = Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const late = a.status === 'LATE';
              return (
                <li key={a.id} className="flex gap-4 p-5 hover:bg-granite-50/60 transition-colors">
                  <div
                    className={`h-full w-1 rounded-full ${late ? 'bg-msasa-500' : days <= 1 ? 'bg-msasa-500' : days <= 3 ? 'bg-savanna-500' : 'bg-heritage-400'}`}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-granite-900">{a.title}</p>
                        <p className="text-xs text-granite-500 mt-0.5">
                          {subjectName(a.subjectCode)} · {a.teacher}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {due.toLocaleDateString('en-ZW', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p
                          className={`text-xs ${late ? 'text-msasa-700' : days <= 1 ? 'text-msasa-700' : days <= 3 ? 'text-savanna-700' : 'text-granite-500'}`}
                        >
                          {late ? 'Submitted late' : days <= 0 ? 'Due today' : `In ${days} days`}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-granite-700 leading-relaxed">{a.instructions}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {a.attachments.map((att) => (
                        <Badge key={att.name} tone="outline">
                          <Paperclip className="h-3 w-3" aria-hidden /> {att.name} · {att.size}
                        </Badge>
                      ))}
                      <Badge tone="neutral">Max {a.maxMarks} marks</Badge>
                      {late ? <Badge tone="danger">Late penalty applies</Badge> : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Awaiting marking" icon={<FileClock className="h-4 w-4" />}>
        {submitted.length === 0 ? (
          <EmptyState title="Nothing awaiting marking." />
        ) : (
          <ul className="divide-y divide-granite-100">
            {submitted.map((a) => (
              <li key={a.id} className="flex items-center gap-4 p-4">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-granite-500">
                    {subjectName(a.subjectCode)} · submitted{' '}
                    {new Date(a.submittedAt ?? '').toLocaleString('en-ZW', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge tone="info">With teacher</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Returned" icon={<FileCheck2 className="h-4 w-4" />}>
        {returned.length === 0 ? (
          <EmptyState title="No returned work yet." />
        ) : (
          <ul className="divide-y divide-granite-100">
            {returned.map((a) => {
              const pct = Math.round(((a.markAwarded ?? 0) / a.maxMarks) * 100);
              return (
                <li key={a.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-granite-900">{a.title}</p>
                      <p className="text-xs text-granite-500 mt-0.5">
                        {subjectName(a.subjectCode)} · {a.teacher}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-heritage-950">
                        {a.markAwarded}/{a.maxMarks}
                      </p>
                      <p className="text-xs text-granite-500">{pct}%</p>
                    </div>
                  </div>
                  {a.feedback ? (
                    <div className="mt-3 rounded border border-granite-200 bg-granite-50/60 p-3 text-sm text-granite-700 italic">
                      &ldquo;{a.feedback}&rdquo;
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-granite-500" aria-hidden>
            {icon}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
