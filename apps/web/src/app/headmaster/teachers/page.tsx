'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  Users,
  X,
} from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import {
  APPRAISAL_COMPLETION,
  FT_LOAD,
  LEARNING_WALKS,
  MATHS_CLASSES,
  TEACHING_KPIS,
} from '@/lib/mock/headmaster-extras';

type Walk = (typeof LEARNING_WALKS)[number];

interface ClassRow {
  label: string;
  teacher: string;
  avg: number;
}

/**
 * Administrator · Teachers.
 *
 * Click-through everywhere:
 *   - Class row → drawer (walks, trend, appraisal snippet)
 *   - Walk row → drawer (observer notes placeholder, reschedule, mark complete)
 *   - Department row → expand to see per-staff appraisal status
 *   - FT row → toast shortcut to caseload
 */
export default function TeachersPage() {
  const kpis = TEACHING_KPIS;
  const appraisalSchoolTotal = APPRAISAL_COMPLETION.reduce(
    (acc, d) => ({ c: acc.c + d.complete, t: acc.t + d.total }),
    { c: 0, t: 0 },
  );
  const appraisalPct = Math.round((appraisalSchoolTotal.c / appraisalSchoolTotal.t) * 100);

  const sortedClasses = [...MATHS_CLASSES].sort((a, b) => b.avg - a.avg);
  const highest = sortedClasses.slice(0, 3);
  const lowest = [...sortedClasses].reverse().slice(0, 3);

  const [classPreview, setClassPreview] = useState<ClassRow | null>(null);
  const [walkPreview, setWalkPreview] = useState<Walk | null>(null);
  const [walks, setWalks] = useState<Walk[]>([...LEARNING_WALKS]);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function completeWalk(id: string) {
    setWalks((curr) =>
      curr.map((w) => (w.id === id ? ({ ...w, status: 'complete' } as Walk) : w)),
    );
    setToast('Walk marked complete · notes saved');
  }

  function rescheduleWalk(id: string, when: string) {
    setWalks((curr) => curr.map((w) => (w.id === id ? ({ ...w, date: when } as Walk) : w)));
    setToast(`Walk rescheduled to ${when}`);
  }

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Teachers"
        title="Teacher performance"
        subtitle="Staffing, CPD, observation, appraisal — one page. Click any row to drill in."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map((k) => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            deltaLabel={k.sub}
            trend={k.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Appraisal completion — expandable rows */}
        <Panel
          className="lg:col-span-3"
          title="Appraisal completion by department"
          sub={`${appraisalSchoolTotal.c} of ${appraisalSchoolTotal.t} staff · ${appraisalPct}% school-wide · click a department to expand`}
        >
          <ul className="space-y-1 pt-2">
            {APPRAISAL_COMPLETION.map((d) => {
              const pct = Math.round((d.complete / d.total) * 100);
              const expanded = expandedDept === d.dept;
              return (
                <li key={d.dept} className="rounded border border-transparent hover:border-sand-light">
                  <button
                    type="button"
                    onClick={() => setExpandedDept(expanded ? null : d.dept)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left"
                  >
                    <ChevronRight
                      className={[
                        'h-3.5 w-3.5 flex-none text-stone transition-transform',
                        expanded ? 'rotate-90' : '',
                      ].join(' ')}
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div className="flex-1">
                      <ChartBar
                        label={d.dept}
                        value={pct}
                        tone={pct === 100 ? 'complete' : pct >= 80 ? 'good' : 'warn'}
                        sub={`${d.complete}/${d.total}`}
                      />
                    </div>
                  </button>
                  {expanded ? (
                    <div className="mx-2 mb-2 rounded bg-sand-light/60 p-3">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        Staff in {d.dept}
                      </p>
                      <ul className="mt-2 space-y-1.5 font-sans text-[13px]">
                        {buildStaffList(d.dept, d.total).map((s, i) => {
                          const done = i < d.complete;
                          return (
                            <li key={s.name} className="flex items-center gap-3">
                              {done ? (
                                <CheckCircle2
                                  className="h-4 w-4 flex-none text-ok"
                                  strokeWidth={1.5}
                                  aria-hidden
                                />
                              ) : (
                                <Clock
                                  className="h-4 w-4 flex-none text-ochre"
                                  strokeWidth={1.5}
                                  aria-hidden
                                />
                              )}
                              <span className="flex-1 text-ink">{s.name}</span>
                              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
                                {done ? `complete · ${s.date}` : s.nextStep}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            Four departments sit below 90% — Deputy Head (Academic) to follow up this week.
          </div>
        </Panel>

        {/* CPD + walks progress */}
        <Panel className="lg:col-span-2" title="CPD · walks · observation" sub="This term">
          <div className="space-y-5 pt-2">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                CPD hours delivered
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                1,640 <span className="text-[14px] text-stone">/ 2,720</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-earth"
                  style={{ width: `${(1640 / 2720) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Learning walks completed
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                {walks.filter((w) => w.status === 'complete').length}{' '}
                <span className="text-[14px] text-stone">/ 40</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-ochre"
                  style={{ width: `${(walks.filter((w) => w.status === 'complete').length / 40) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                Peer-observation participation
              </p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-ink">
                74% <span className="text-[14px] text-stone">of 68 staff</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full bg-earth" style={{ width: `74%` }} />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Learning walk schedule */}
      <Panel
        title="Learning walk schedule"
        sub="Click a row to inspect · reschedule or mark complete"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Walk #
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Class
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Teacher
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Observer
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  When
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {walks.map((w) => (
                <tr
                  key={w.id}
                  onClick={() => setWalkPreview(w)}
                  className="cursor-pointer border-t border-sand-light hover:bg-sand-light/40"
                >
                  <td className="px-4 py-3 font-mono text-[12px] tabular-nums text-stone">
                    {w.id}
                  </td>
                  <td className="px-4 py-3 font-sans font-medium text-ink">{w.className}</td>
                  <td className="px-4 py-3 font-sans text-ink">{w.teacher}</td>
                  <td className="px-4 py-3 font-sans text-stone">{w.observer}</td>
                  <td className="px-4 py-3 font-sans text-[12px] text-stone">{w.date}</td>
                  <td className="px-4 py-3">
                    {w.status === 'complete' ? (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7D4E]">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                        <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                        scheduled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Class-level performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel
          title="Highest-performing classes"
          sub="Mathematics department · Term 2 · click to drill"
        >
          <ol className="space-y-3 pt-2">
            {highest.map((c, i) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => setClassPreview(c)}
                  className="group flex w-full items-center gap-3 rounded border border-sand bg-cream/40 px-4 py-3 text-left hover:border-earth"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sand-light font-mono text-[13px] font-semibold text-earth">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans font-medium text-ink group-hover:text-earth">
                      {c.label}
                    </p>
                    <p className="font-sans text-[12px] text-stone">{c.teacher}</p>
                  </div>
                  <span className="font-display text-[22px] tabular-nums text-ok">
                    {c.avg.toFixed(1)}%
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-stone group-hover:translate-x-0.5 group-hover:text-earth"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title="Needs attention"
          sub="Classes below the department mean · click to drill"
        >
          <ol className="space-y-3 pt-2">
            {lowest.map((c, i) => (
              <li key={c.label}>
                <button
                  type="button"
                  onClick={() => setClassPreview(c)}
                  className="group flex w-full items-center gap-3 rounded border border-sand bg-cream/40 px-4 py-3 text-left hover:border-earth"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#FBEBEA] font-mono text-[13px] font-semibold text-[#B0362A]">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans font-medium text-ink group-hover:text-earth">
                      {c.label}
                    </p>
                    <p className="font-sans text-[12px] text-stone">{c.teacher}</p>
                  </div>
                  <span className="font-display text-[22px] tabular-nums text-danger">
                    {c.avg.toFixed(1)}%
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-stone group-hover:translate-x-0.5 group-hover:text-earth"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded bg-sand-light/60 p-3 font-sans text-[12px] text-stone">
            A class average sitting 5+ points below the department mean triggers a learning-walk
            review.
          </p>
        </Panel>
      </div>

      {/* FT workload — click to flash caseload shortcut */}
      <Panel
        title="Form-teacher workload"
        sub="Pastoral load by form teacher · click a row to see the caseload"
        href="/headmaster/students"
        hrefLabel="Full register"
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
                  At-risk
                </th>
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Under review
                </th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Distribution
                </th>
                <th className="px-4 py-3" />
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
                    onClick={() => setToast(`${row.ft} · Form ${row.form} · ${load} cases`)}
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
                    <td className="px-4 py-3 text-right">
                      <ChevronRight
                        className="h-4 w-4 text-stone"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {classPreview ? (
        <ClassDrawer
          row={classPreview}
          onClose={() => setClassPreview(null)}
          onAction={(msg) => setToast(msg)}
        />
      ) : null}

      {walkPreview ? (
        <WalkDrawer
          walk={walkPreview}
          onClose={() => setWalkPreview(null)}
          onComplete={() => {
            completeWalk(walkPreview.id);
            setWalkPreview(null);
          }}
          onReschedule={(when) => {
            rescheduleWalk(walkPreview.id, when);
            setWalkPreview((w) => (w ? ({ ...w, date: when } as Walk) : w));
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
/* Drawers                                                             */
/* ------------------------------------------------------------------ */

function ClassDrawer({
  row,
  onClose,
  onAction,
}: {
  row: ClassRow;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  const trend = useMemo(() => buildTrend(row.avg), [row.avg]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Class
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">{row.label} · Mathematics</h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">Teacher: {row.teacher}</p>
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

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <section className="rounded border border-sand bg-sand-light/50 p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Current average
            </p>
            <p className="mt-1 font-display text-[42px] leading-none tabular-nums text-ink">
              {row.avg.toFixed(1)}%
            </p>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Six-term trend
            </p>
            <svg viewBox="0 0 400 80" className="mt-3 h-20 w-full">
              <polyline
                fill="none"
                stroke="#C65D3D"
                strokeWidth={2}
                points={trend
                  .map(
                    (m, i) =>
                      `${i * (400 / (trend.length - 1))},${80 - ((m - 50) / 40) * 60 - 10}`,
                  )
                  .join(' ')}
              />
              {trend.map((m, i) => (
                <circle
                  key={i}
                  cx={i * (400 / (trend.length - 1))}
                  cy={80 - ((m - 50) / 40) * 60 - 10}
                  r={3}
                  fill="#C65D3D"
                />
              ))}
            </svg>
            <ul className="mt-2 grid grid-cols-6 gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-stone">
              {['T3 24', 'T1 25', 'T2 25', 'T3 25', 'T1 26', 'T2 26'].map((t) => (
                <li key={t} className="text-center">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Recent walks
            </p>
            <ul className="mt-3 space-y-2 font-sans text-[13px]">
              <li className="flex items-center justify-between">
                <span className="text-ink">Walking observation · last Monday</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ok">
                  strong
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink">Peer observation · 2 weeks ago</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-stone">
                  routine
                </span>
              </li>
            </ul>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(`Walk scheduled · ${row.label}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Schedule walk
              </button>
              <button
                type="button"
                onClick={() => onAction(`Message drafted to ${row.teacher}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Message teacher
              </button>
              <button
                type="button"
                onClick={() => onAction(`Roster opened for ${row.label}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                See roster
              </button>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end border-t border-sand bg-white px-6 py-4">
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

function WalkDrawer({
  walk,
  onClose,
  onComplete,
  onReschedule,
}: {
  walk: Walk;
  onClose: () => void;
  onComplete: () => void;
  onReschedule: (when: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [when, setWhen] = useState(walk.date);
  const rubric = [
    { criterion: 'Planning', score: walk.status === 'complete' ? 4 : null, max: 5 },
    { criterion: 'Pace', score: walk.status === 'complete' ? 3 : null, max: 5 },
    { criterion: 'Engagement', score: walk.status === 'complete' ? 4 : null, max: 5 },
    { criterion: 'Assessment', score: walk.status === 'complete' ? 3 : null, max: 5 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Learning walk {walk.id}
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">
              {walk.className} · {walk.teacher}
            </h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              Observer: {walk.observer} · {walk.date}
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

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Rubric (5 per criterion)
            </p>
            <ul className="mt-3 space-y-2 font-sans text-[13px]">
              {rubric.map((r) => (
                <li key={r.criterion} className="flex items-center gap-3">
                  <span className="w-36 text-stone">{r.criterion}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-earth"
                      style={{ width: `${r.score !== null ? (r.score / r.max) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono tabular-nums text-ink">
                    {r.score !== null ? `${r.score} / ${r.max}` : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Observer notes
            </p>
            <p className="mt-3 font-serif text-[14px] leading-relaxed text-stone">
              {walk.status === 'complete'
                ? '“Strong start. Pace slipped mid-lesson when calculators came out. Class routines are excellent — well-established hand signals for participation.”'
                : 'Notes will appear once the walk is marked complete.'}
            </p>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {walk.status === 'complete' ? (
                <span className="inline-flex h-9 items-center gap-2 rounded border border-ok/40 bg-[#F0F6F2] px-3 font-sans text-[12px] font-medium text-ok">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  Walk complete
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onComplete}
                  className="inline-flex h-9 items-center gap-1.5 rounded bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  Mark complete
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                {editing ? 'Cancel reschedule' : 'Reschedule'}
              </button>
            </div>
            {editing ? (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="e.g. Wed 07 May"
                  className="h-9 flex-1 rounded border border-sand bg-white px-3 font-sans text-[13px] text-ink placeholder-stone focus:border-terracotta focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    onReschedule(when.trim());
                    setEditing(false);
                  }}
                  disabled={!when.trim()}
                  className="inline-flex h-9 items-center rounded border border-terracotta bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            ) : null}
          </section>
        </div>

        <div className="flex items-center justify-end border-t border-sand bg-white px-6 py-4">
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
/* Synthetic data for drawers                                          */
/* ------------------------------------------------------------------ */

function buildStaffList(dept: string, total: number) {
  const names: Record<string, string[]> = {
    Mathematics: ['Mr Tadyanemhandu', 'Mrs Dziva', 'Mr Mushore', 'Mr Mabika', 'Mrs Sibanda', 'Mrs Sithole', 'Mrs Ruzvidzo', 'Mr Mukwada'],
    English: ['Mr Gondo', 'Mrs Chigwada', 'Ms Sithole', 'Mr Tafi', 'Mrs Hondo', 'Mrs Nyati', 'Mr Chari'],
    Sciences: ['Mr Mhlanga', 'Dr Madziva', 'Ms Banda', 'Ms Nyathi', 'Mr Chirunga', 'Mr Tore', 'Mrs Marizu', 'Mrs Chinhoi'],
    Humanities: ['Mr Ndaba', 'Mrs Dube', 'Mr Moyo', 'Mr Takawira', 'Mrs Maponga', 'Mrs Nzira', 'Mr Gwenzi', 'Ms Mutanga', 'Mr Shumba'],
    Languages: ['Mrs Chiweshe', 'Mr Ngandu', 'Mrs Zvogbo', 'Mrs Chahwanda', 'Mr Mapako', 'Mrs Shonhiwa'],
    Arts: ['Mrs Hove', 'Mr Chikasha', 'Mrs Dhliwayo', 'Mr Rupende', 'Mrs Muchini', 'Ms Chidzambwa'],
    'Sports & PE': ['Mr Makwenda', 'Mrs Matanda', 'Mr Zinyama', 'Mrs Chiwendo', 'Mr Tsvangirai'],
    Commerce: ['Mrs Mahachi', 'Mr Madziva', 'Mr Tawanda', 'Mrs Tafirenyika', 'Mr Ndoro'],
  };
  const base = names[dept] ?? Array.from({ length: total }, (_, i) => `Staff ${i + 1}`);
  return base.slice(0, total).map((name, i) => ({
    name,
    date: ['6 Mar', '18 Mar', '2 Apr', '9 Apr', '14 Apr', '17 Apr', '21 Apr', '22 Apr'][i] ?? '—',
    nextStep: ['Interview booked', 'Awaiting self-review', 'Booking email sent', 'Interview booked'][
      i % 4
    ],
  }));
}

function buildTrend(current: number): number[] {
  return [-9, -6, -4, -2, -1, 0].map((o) => Math.max(50, Math.min(95, current + o)));
}
