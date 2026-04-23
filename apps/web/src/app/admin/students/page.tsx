'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { EditorialAvatar } from '@/components/student/primitives';
import { STUDENTS } from '@/lib/mock/fixtures';

export default function StudentsPage() {
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STUDENTS;
    return STUDENTS.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.admissionNo} ${s.house} ${s.form} ${s.stream}`
        .toLowerCase()
        .includes(q),
    );
  }, [query]);
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
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-line bg-card pl-9 pr-9 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Search by name, admission number, parent name…"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Add student
        </button>
      </div>

      {/* Roster */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="border-b border-line px-5 py-3.5">
          <h2 className="text-small font-semibold text-ink">Roster</h2>
          <p className="text-micro text-muted">
            Showing {filtered.length} of {STUDENTS.length} students
          </p>
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
              {filtered.map((s) => (
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

      {addOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setAddOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                  Enrol
                </p>
                <h3 className="text-h3 text-ink">Add a new student</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAddOpen(false);
              }}
              className="space-y-4 p-6"
            >
              <p className="rounded-md border border-info/25 bg-info/[0.04] p-3 text-small text-ink">
                The full admissions flow (medical, next-of-kin, prior school) runs from this
                starting record.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                    First name
                  </span>
                  <input
                    required
                    className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                    Surname
                  </span>
                  <input
                    required
                    className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                    Form
                  </span>
                  <select className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                    <option>Form 1</option>
                    <option>Form 2</option>
                    <option>Form 3</option>
                    <option>Form 4</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                    House
                  </span>
                  <select className="h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                    <option>Savanna</option>
                    <option>Heritage</option>
                    <option>Msasa</option>
                    <option>Granite</option>
                  </select>
                </label>
              </div>
              <footer className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-4 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Continue admissions
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}
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
