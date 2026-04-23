'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Eye,
  MessageSquare,
  Search,
  UserCog,
  X,
} from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import {
  AT_RISK_MONTHLY,
  AT_RISK_RIBBON,
  AT_RISK_ROWS,
  FORM_AVERAGES,
  FT_LOAD,
  SCHOOL_STATE,
  type AtRiskRow,
} from '@/lib/mock/headmaster-extras';

type StatusFilter = 'all' | 'under-review' | 'monitoring' | 'cumulative';

/**
 * Administrator · Students.
 *
 * Monitoring destination. Every row in the at-risk register opens a
 * drawer with the student's context: marks arc, attendance heatmap,
 * owner, recent decisions. Owner can be changed inline and a message
 * can be sent to the form teacher.
 */
export default function StudentsPage() {
  const attendancePct = SCHOOL_STATE.attendancePercent;
  const enrolment = SCHOOL_STATE.learnersTotal;
  const present = SCHOOL_STATE.learnersPresent;
  const absent = enrolment - present;

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all');
  const [preview, setPreview] = useState<AtRiskRow | null>(null);
  const [ownerOverrides, setOwnerOverrides] = useState<Record<string, { owner: string; role: string }>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const forms = useMemo(() => {
    return ['all', ...Array.from(new Set(AT_RISK_ROWS.map((r) => r.form)))];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AT_RISK_ROWS.filter((r) => {
      if (selectedForm !== 'all' && r.form !== selectedForm) return false;
      if (statusFilter === 'under-review' && !r.underReview) return false;
      if (statusFilter === 'monitoring' && r.underReview) return false;
      if (statusFilter === 'cumulative' && !r.cumulative) return false;
      if (!q) return true;
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.trigger.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.form.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter, selectedForm]);

  function effectiveOwner(r: AtRiskRow) {
    return ownerOverrides[r.id] ?? { owner: r.owner, role: r.ownerRole };
  }

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Students"
        title="Student monitoring"
        subtitle={`${enrolment.toLocaleString('en-ZW')} learners enrolled · ${present.toLocaleString(
          'en-ZW',
        )} present today (${attendancePct}%) · ${AT_RISK_RIBBON.onRegister} on the at-risk register.`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Enrolment"
          value={enrolment.toLocaleString('en-ZW')}
          deltaLabel="+14 new this term"
          trend="up"
        />
        <KPICard
          label="Present today"
          value={`${attendancePct}%`}
          deltaLabel={`${absent} absent / leave`}
          trend="flat"
        />
        <KPICard
          label="At-risk register"
          value={String(AT_RISK_RIBBON.onRegister)}
          deltaLabel={`down from ${AT_RISK_RIBBON.previous} last term`}
          trend="down-good"
        />
        <KPICard
          label="Recovered (30d)"
          value={String(AT_RISK_RIBBON.recovered30d)}
          deltaLabel="returned to above-threshold"
          trend="up"
        />
      </div>

      {/* Two-column — performance by year group + at-risk monthly */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3" title="Performance by year group" sub="Term 2, 2026">
          <div className="space-y-1 pt-2">
            {FORM_AVERAGES.map((f) => (
              <ChartBar
                key={f.form}
                label={f.form}
                value={f.avg}
                tone={f.avg >= 78 ? 'good' : f.avg >= 72 ? 'default' : 'warn'}
                sub={`${f.avg.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="mt-5 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            Form 3 is 3.6pts below the school average; expect increased support from Deputy Head
            (Academic). Form 6 leads the school this term.
          </div>
        </Panel>

        <Panel className="lg:col-span-2" title="At-risk · 12-month trend" sub="Current month highlighted">
          <div className="mt-2 grid h-40 grid-cols-12 items-end gap-1">
            {AT_RISK_MONTHLY.map((m, i) => {
              const max = Math.max(...AT_RISK_MONTHLY.map((x) => x.count));
              const h = (m.count / max) * 100;
              const isLast = i === AT_RISK_MONTHLY.length - 1;
              return (
                <div key={m.month} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] tabular-nums text-stone">{m.count}</span>
                  <div
                    className={[
                      'w-full rounded-t transition-all',
                      isLast ? 'bg-terracotta' : 'bg-earth/60',
                    ].join(' ')}
                    style={{ height: `${h}%` }}
                  />
                </div>
              );
            })}
          </div>
          <ul className="mt-2 grid grid-cols-12 gap-1 font-mono text-[9px] uppercase tracking-[0.08em] text-stone">
            {AT_RISK_MONTHLY.map((m) => (
              <li key={m.month} className="truncate text-center">
                {m.month.split(' ')[0]}
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-sand pt-4 text-center">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">Now</dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-ink">
                {AT_RISK_RIBBON.onRegister}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">New</dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-danger">
                {AT_RISK_RIBBON.newThisWeek}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
                Cumulative
              </dt>
              <dd className="mt-1 font-display text-[22px] tabular-nums text-ink">
                {AT_RISK_RIBBON.cumulative}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      {/* At-risk register */}
      <Panel
        title="At-risk register"
        sub={`${filtered.length} of ${AT_RISK_ROWS.length} students · click a row to open the case`}
      >
        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, trigger, owner, form…"
              className="h-10 w-full rounded border border-sand bg-white pl-9 pr-9 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-stone hover:bg-sand-light hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ) : null}
          </div>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="h-10 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light focus:border-terracotta focus:outline-none"
          >
            {forms.map((f) => (
              <option key={f} value={f}>
                {f === 'all' ? 'All forms' : `Form ${f}`}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 rounded border border-sand bg-white p-0.5 font-sans text-[12px] font-medium">
            {(
              [
                { key: 'all' as const, label: 'All' },
                { key: 'under-review' as const, label: 'Under review' },
                { key: 'monitoring' as const, label: 'Monitoring' },
                { key: 'cumulative' as const, label: 'Cumulative' },
              ]
            ).map((t) => {
              const active = statusFilter === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStatusFilter(t.key)}
                  className={[
                    'rounded-sm px-3 py-1.5 transition-colors',
                    active ? 'bg-ink text-cream' : 'text-stone hover:text-ink',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded border border-dashed border-sand px-6 py-10 text-center">
            <p className="font-display text-[16px] text-ink">No matches.</p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Try clearing a filter, or broadening the search.
            </p>
          </div>
        ) : (
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-sand-light/40 text-left">
                  <th className="px-5 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Student
                  </th>
                  <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Form
                  </th>
                  <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Trigger
                  </th>
                  <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Since
                  </th>
                  <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Owner
                  </th>
                  <th className="px-3 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    Status
                  </th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const owner = effectiveOwner(r);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setPreview(r)}
                      className="cursor-pointer border-t border-sand-light hover:bg-sand-light/40"
                    >
                      <td className="px-5 py-3 font-sans font-medium text-ink">
                        {r.studentName}
                        {r.cumulative ? (
                          <span className="ml-2 rounded-sm bg-[#FBEBEA] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#B0362A]">
                            cumulative
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 font-mono tabular-nums text-stone">{r.form}</td>
                      <td className="px-3 py-3 font-sans text-ink">{r.trigger}</td>
                      <td className="px-3 py-3 font-mono text-[12px] tabular-nums text-stone">{r.since}</td>
                      <td className="px-3 py-3">
                        <span className="font-sans text-ink">{owner.owner}</span>
                        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
                          {owner.role}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {r.underReview ? (
                          <span className="inline-flex items-center rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                            under review
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-sm bg-sand px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                            monitoring
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview(r);
                            }}
                            aria-label="View case"
                            className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                          >
                            <Eye className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setToast(`Message sent to ${owner.owner}`);
                            }}
                            aria-label="Message owner"
                            className="rounded p-1.5 text-stone hover:bg-sand hover:text-ink"
                          >
                            <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* FT load */}
      <Panel
        title="Form-teacher workload"
        sub="Where is the pastoral load concentrated?"
        href="/headmaster/teachers"
        hrefLabel="Open teachers"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form teacher
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Form
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  On register
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Under review
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Distribution
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {FT_LOAD.map((row) => {
                const load = row.atRisk + row.underReview;
                const max = Math.max(...FT_LOAD.map((x) => x.atRisk + x.underReview));
                const pct = (load / max) * 100;
                return (
                  <tr
                    key={row.ft}
                    onClick={() =>
                      setToast(`${row.ft} · Form ${row.form} · ${load} cases — opening caseload…`)
                    }
                    className="cursor-pointer border-t border-sand-light hover:bg-sand-light/40"
                  >
                    <td className="px-4 py-3 font-sans font-medium text-ink">{row.ft}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-stone">{row.form}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {row.atRisk}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {row.underReview}
                    </td>
                    <td className="px-4 py-3 w-[36%] min-w-[160px]">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                        <div
                          className={[
                            'h-full rounded-full',
                            load >= 5 ? 'bg-danger' : load >= 3 ? 'bg-ochre' : 'bg-earth',
                          ].join(' ')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[12px] text-stone">
                      {row.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Methodology aside */}
      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-5">
        <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          How a student gets on the register
        </p>
        <p className="mt-2 max-w-[80ch] font-serif text-[15px] leading-relaxed text-ink">
          A student joins the at-risk register when one of four triggers fires: an average drop
          exceeding 10 points over three consecutive assessments, attendance below 80%, three
          consecutive non-submissions, or a parent or staff concern. The form teacher owns the case
          by default; safeguarding concerns transfer to the DSL immediately.
        </p>
      </aside>

      {preview ? (
        <CaseDrawer
          row={preview}
          owner={effectiveOwner(preview)}
          onClose={() => setPreview(null)}
          onChangeOwner={(owner, role) => {
            setOwnerOverrides((curr) => ({ ...curr, [preview.id]: { owner, role } }));
            setToast(`Owner changed to ${owner} (${role})`);
          }}
          onMessage={(who) => setToast(`Message drafted to ${who}`)}
          onClearFromRegister={() => {
            setPreview(null);
            setToast(`${preview.studentName} cleared from register — monitoring continues`);
          }}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 font-sans text-[12px] font-semibold text-cream shadow-e3"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drawer                                                              */
/* ------------------------------------------------------------------ */

function CaseDrawer({
  row,
  owner,
  onClose,
  onChangeOwner,
  onMessage,
  onClearFromRegister,
}: {
  row: AtRiskRow;
  owner: { owner: string; role: string };
  onClose: () => void;
  onChangeOwner: (who: string, role: string) => void;
  onMessage: (who: string) => void;
  onClearFromRegister: () => void;
}) {
  const marks = useMemo(() => buildMarksTrend(row.studentName), [row.studentName]);
  const attendance = useMemo(() => buildAttendance(row.studentName), [row.studentName]);
  const [delegateOpen, setDelegateOpen] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              At-risk case
            </p>
            <h2 className="mt-1 font-display text-[24px] text-ink">{row.studentName}</h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              Form {row.form} · owner {owner.owner} ({owner.role}) · since {row.since}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Trigger summary */}
          <section className="rounded border border-sand bg-sand-light/50 p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Trigger
            </p>
            <p className="mt-1.5 font-display text-[17px] leading-snug text-ink">{row.trigger}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {row.underReview ? (
                <span className="inline-flex items-center rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                  under review
                </span>
              ) : (
                <span className="inline-flex items-center rounded-sm bg-sand px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                  monitoring
                </span>
              )}
              {row.cumulative ? (
                <span className="inline-flex items-center rounded-sm bg-[#FBEBEA] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B0362A]">
                  cumulative
                </span>
              ) : null}
            </div>
          </section>

          {/* Marks trend */}
          <section className="rounded border border-sand bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                Marks arc — last 6 assessments
              </p>
              <p className="font-mono text-[12px] tabular-nums text-stone">
                Current {marks[marks.length - 1]?.mark}%
              </p>
            </div>
            <svg viewBox="0 0 400 80" className="mt-3 h-20 w-full">
              <polyline
                fill="none"
                stroke="#C65D3D"
                strokeWidth={2}
                points={marks
                  .map(
                    (m, i) =>
                      `${i * (400 / (marks.length - 1))},${80 - ((m.mark - 40) / 50) * 60 - 10}`,
                  )
                  .join(' ')}
              />
              {marks.map((m, i) => (
                <circle
                  key={m.label}
                  cx={i * (400 / (marks.length - 1))}
                  cy={80 - ((m.mark - 40) / 50) * 60 - 10}
                  r={3}
                  fill="#C65D3D"
                />
              ))}
            </svg>
            <ul className="mt-2 grid grid-cols-6 gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-stone">
              {marks.map((m) => (
                <li key={m.label} className="flex flex-col items-center">
                  <span className="font-sans tabular-nums text-ink">{m.mark}</span>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Attendance heatmap */}
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Attendance — last 30 days
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {attendance.map((d, i) => {
                const fill =
                  d.kind === 'present'
                    ? 'bg-ok'
                    : d.kind === 'late'
                    ? 'bg-ochre'
                    : d.kind === 'excused'
                    ? 'bg-earth/40'
                    : d.kind === 'absent'
                    ? 'bg-danger'
                    : 'bg-sand-light';
                return (
                  <span
                    key={i}
                    title={`${d.day} · ${d.kind}`}
                    className={`h-5 w-5 rounded-sm ${fill}`}
                    aria-hidden
                  />
                );
              })}
            </div>
            <p className="mt-3 font-sans text-[12px] text-stone">
              Present {attendance.filter((d) => d.kind === 'present').length} · late{' '}
              {attendance.filter((d) => d.kind === 'late').length} · absent{' '}
              {attendance.filter((d) => d.kind === 'absent').length} · excused{' '}
              {attendance.filter((d) => d.kind === 'excused').length}
            </p>
          </section>

          {/* Owner block */}
          <section className="rounded border border-sand bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                  Case owner
                </p>
                <p className="mt-1 font-display text-[17px] text-ink">
                  {owner.owner}{' '}
                  <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-stone">
                    ({owner.role})
                  </span>
                </p>
                <p className="mt-1 font-sans text-[12px] text-stone">
                  Last contact · 3 days ago (email)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDelegateOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <UserCog className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Change owner
              </button>
            </div>
            {delegateOpen ? (
              <div className="mt-3 grid grid-cols-1 gap-2 rounded bg-sand-light/50 p-3 sm:grid-cols-3">
                {[
                  { name: 'Form teacher', role: 'FT' },
                  { name: 'Deputy Head (Pastoral)', role: 'Deputy' },
                  { name: 'DSL', role: 'DSL' },
                ].map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChangeOwner(opt.name, opt.role);
                      setDelegateOpen(false);
                    }}
                    className="flex flex-col items-start rounded border border-sand bg-white px-3 py-2 text-left font-sans text-[13px] text-ink hover:border-terracotta"
                  >
                    {opt.name}
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-stone">
                      {opt.role}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          {/* Actions */}
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onMessage(owner.owner)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Message {owner.owner}
              </button>
              <button
                type="button"
                onClick={() => onMessage(`Parents of ${row.studentName}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Message parents
              </button>
              <button
                type="button"
                onClick={onClearFromRegister}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-ok/40 bg-[#F0F6F2] px-3 font-sans text-[12px] font-medium text-ok hover:bg-[#E6F0E9]"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                Mark as resolved
              </button>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-sand bg-white px-6 py-4">
          <p className="font-sans text-[12px] text-stone">
            All case actions are logged to the audit trail and visible to the form teacher.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  sub,
  href,
  hrefLabel,
  className,
  children,
}: {
  title: string;
  sub?: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={['rounded border border-sand bg-white p-5', className ?? ''].join(' ')}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-sand pb-3">
        <div>
          <h2 className="font-display text-[18px] tracking-tight text-ink">{title}</h2>
          {sub ? <p className="mt-0.5 font-sans text-[12px] text-stone">{sub}</p> : null}
        </div>
        {href && hrefLabel ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:text-earth"
          >
            {hrefLabel}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          </Link>
        ) : null}
      </header>
      <div className="pt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Synthetic per-student data                                          */
/* ------------------------------------------------------------------ */

function buildMarksTrend(name: string) {
  const seed = name.length;
  return ['T3 24', 'T1 25', 'T2 25', 'T3 25', 'T1 26', 'T2 26'].map((label, i) => ({
    label,
    mark: Math.max(45, Math.min(90, 70 - (seed % 5) * 2 + i * 2 - ((i === 5 ? 8 : 0)))),
  }));
}

type AttKind = 'present' | 'late' | 'excused' | 'absent' | 'weekend';

function buildAttendance(name: string): { day: string; kind: AttKind }[] {
  const seed = name.length + name.charCodeAt(0);
  const today = new Date('2026-04-22');
  const out: { day: string; kind: AttKind }[] = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) {
      out.push({ day: d.toDateString(), kind: 'weekend' });
      continue;
    }
    const roll = (seed + i * 7) % 17;
    const kind: AttKind =
      roll < 1 ? 'absent' : roll < 2 ? 'late' : roll < 3 ? 'excused' : 'present';
    out.push({ day: d.toDateString(), kind });
  }
  return out;
}
