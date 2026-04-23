import { Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EditorialAvatar } from '@/components/student/primitives';
import { STUDENTS } from '@/lib/mock/fixtures';

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Admin · roster</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Students
        </h1>
        <p className="mt-2 text-small text-muted">
          428 enrolled · 52 new this year. Digital admission files, medical summaries, next-of-kin.
        </p>
      </header>

      {/* KPI tiles */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Enrolled" value="428" sub="Active students" tone="brand" />
        <KpiTile label="New this year" value="52" sub="Intake" tone="success" />
        <KpiTile label="Boarders" value="183" sub="43% of school" />
        <KpiTile label="Prefects" value="24" sub="House leadership" tone="success" />
      </ul>

      {/* Search */}
      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[280px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Search by name, admission number, parent name…"
          />
        </div>
      </div>

      {/* Roster */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Roster</h2>
          <p className="text-micro text-muted">{STUDENTS.length} students on file</p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-surface/60 text-left">
                <th className="px-5 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Student
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Admission #
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Form
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  House
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Guardian
                </th>
                <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s) => (
                <tr key={s.id} className="border-t border-line hover:bg-surface/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <EditorialAvatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                      <div>
                        <p className="text-small font-semibold text-ink">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-micro text-muted">
                          {new Date(s.dateOfBirth).toLocaleDateString('en-ZW', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-micro text-muted">{s.admissionNo}</td>
                  <td className="px-4 py-3 text-small text-ink">
                    {s.form} {s.stream}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{s.house}</Badge>
                  </td>
                  <td className="px-4 py-3 text-small text-ink">
                    {s.guardianIds.length > 0 ? 'Sekai Moyo (Mother)' : 'On file'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="success" dot>
                      Active
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  const valueColor =
    tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : tone === 'brand' ? 'text-brand-primary' : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={`mt-2 text-h2 tabular-nums ${valueColor}`}>{value}</p>
      {sub ? <p className="mt-1 text-micro text-muted">{sub}</p> : null}
    </li>
  );
}
