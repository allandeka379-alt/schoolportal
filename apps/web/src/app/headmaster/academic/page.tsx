'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';

import { ChartBar, ExecPageHeader, HeatCell, KPICard, Sparkline } from '@/components/headmaster/primitives';
import {
  COHORT_TREND,
  FORM_AVERAGES,
  HEATMAP_CLASSES,
  HEATMAP_DATA,
  HEATMAP_FORM,
  HEATMAP_SUBJECTS,
  SUBJECT_AVERAGES,
} from '@/lib/mock/headmaster-extras';

type Term = 'term-2-26' | 'term-1-26' | 'term-3-25';
const TERM_LABELS: Record<Term, string> = {
  'term-2-26': 'Term 2',
  'term-1-26': 'Term 1',
  'term-3-25': 'Term 3 2025',
};

type SubjectRow = (typeof SUBJECT_AVERAGES)[number];

/**
 * Administrator · Academic.
 *
 * Interactive dashboard:
 *   - Working term / year-group / stream filters
 *   - Subject rows open a drawer (classes that contribute to the average,
 *     staff, 6-term trend)
 *   - Heatmap cells open a per-class detail drawer
 */
export default function AcademicPage() {
  const [term, setTerm] = useState<Term>('term-2-26');
  const [yearGroup, setYearGroup] = useState<string>('All year groups');
  const [stream, setStream] = useState<string>('All streams');
  const [subjectPreview, setSubjectPreview] = useState<SubjectRow | null>(null);
  const [cellPreview, setCellPreview] = useState<{ classLabel: string; subjectCode: string; value: number } | null>(
    null,
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Simulate how each filter shifts the data — every active filter nudges the
  // display numbers so the charts feel responsive.
  const filterShift = useMemo(() => {
    let s = 0;
    if (term === 'term-1-26') s -= 1.2;
    if (term === 'term-3-25') s -= 2.1;
    if (yearGroup === 'Form 6') s += 3.1;
    if (yearGroup === 'Form 3') s -= 1.4;
    if (stream === 'Science') s += 1.6;
    if (stream === 'Arts') s -= 0.8;
    return s;
  }, [term, yearGroup, stream]);

  const subjects = useMemo(() => {
    return SUBJECT_AVERAGES.map((s) => ({
      ...s,
      avg: Math.max(50, Math.min(96, s.avg + filterShift)),
    })).sort((a, b) => b.avg - a.avg);
  }, [filterShift]);

  const formAverages = useMemo(() => {
    const list = FORM_AVERAGES.map((f) => ({
      ...f,
      avg: Math.max(50, Math.min(96, f.avg + filterShift)),
    }));
    if (yearGroup === 'All year groups') return list;
    return list.filter((f) => f.form === yearGroup);
  }, [filterShift, yearGroup]);

  const bestSubjects = subjects.slice(0, 3);
  const concernSubjects = subjects.filter((s) => s.avg < s.threeYear - 1).sort((a, b) => a.avg - b.avg);
  const schoolAverage = COHORT_TREND.at(-1)?.avg ?? 76.2;
  const schoolAverageAdj = Math.max(50, Math.min(96, schoolAverage + filterShift));
  const schoolAverageFrom = COHORT_TREND[0]?.avg ?? 70.2;

  const anyFilter = term !== 'term-2-26' || yearGroup !== 'All year groups' || stream !== 'All streams';

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Academic"
        title="Teaching and learning"
        subtitle={`${TERM_LABELS[term]} · ${yearGroup} · ${stream}`}
      />

      {/* Filter bar — working */}
      <div className="flex flex-wrap items-center gap-2 rounded border border-sand bg-white p-2">
        <Dropdown
          label="Term"
          value={TERM_LABELS[term]}
          options={(Object.keys(TERM_LABELS) as Term[]).map((k) => ({
            value: k,
            label: TERM_LABELS[k],
          }))}
          onChange={(v) => setTerm(v as Term)}
        />
        <Dropdown
          label="Year group"
          value={yearGroup}
          options={['All year groups', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'].map(
            (v) => ({ value: v, label: v }),
          )}
          onChange={setYearGroup}
        />
        <Dropdown
          label="Stream"
          value={stream}
          options={['All streams', 'Science', 'Commerce', 'Arts'].map((v) => ({ value: v, label: v }))}
          onChange={setStream}
        />
        {anyFilter ? (
          <button
            type="button"
            onClick={() => {
              setTerm('term-2-26');
              setYearGroup('All year groups');
              setStream('All streams');
              setToast('Filters reset');
            }}
            className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-stone hover:text-ink hover:bg-sand-light"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Reset
          </button>
        ) : null}
      </div>

      {/* KPI ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="School average"
          value={`${schoolAverageAdj.toFixed(1)}%`}
          deltaLabel={`${filterShift >= 0 ? '+' : ''}${filterShift.toFixed(1)} vs unfiltered`}
          trend={filterShift > 0 ? 'up' : filterShift < 0 ? 'down' : 'flat'}
        />
        <KPICard label="vs National (ZIMSEC)" value="+2.1" deltaLabel="points above" trend="up" />
        <KPICard label="Pass rate" value="84%" deltaLabel="+0.9 pp" trend="up" />
        <KPICard
          label="Students of concern"
          value="18"
          deltaLabel="down from 24"
          trend="down-good"
        />
      </div>

      {/* Subject averages — interactive */}
      <section className="rounded border border-sand bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Subject averages · {TERM_LABELS[term]}
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Click a subject to drill into contributing classes
            </p>
          </div>
          <div className="flex items-center gap-3 font-sans text-[11px] text-stone">
            <LegendDot colour="bg-ok" label="Meeting or exceeding" />
            <LegendDot colour="bg-ochre" label="Within 3pp below" />
            <LegendDot colour="bg-danger" label="More than 3pp below" />
          </div>
        </div>
        <ul className="space-y-0.5 px-4 py-4">
          {subjects.map((s) => {
            const delta = s.avg - s.threeYear;
            const tone = delta >= 0 ? 'good' : delta >= -3 ? 'warn' : 'danger';
            return (
              <li key={s.code}>
                <button
                  type="button"
                  onClick={() => setSubjectPreview(s)}
                  className="w-full rounded px-2 py-0.5 text-left transition-colors hover:bg-sand-light/40"
                >
                  <ChartBar
                    label={s.name}
                    value={s.avg}
                    tone={tone}
                    sub={`${s.avg.toFixed(1)}%`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Highlights + concerns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded border border-sand bg-white">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Trending up
            </p>
          </div>
          <ul className="divide-y divide-sand-light">
            {bestSubjects.map((s) => (
              <li key={s.code}>
                <button
                  type="button"
                  onClick={() => setSubjectPreview(s)}
                  className="flex w-full items-center justify-between px-6 py-3 hover:bg-sand-light/40"
                >
                  <span className="font-sans text-[14px] font-medium text-ink">{s.name}</span>
                  <span className="font-mono text-[14px] tabular-nums text-ok">
                    {s.avg.toFixed(1)}%{' '}
                    <span className="text-[12px] text-stone">
                      · +{(s.avg - s.threeYear).toFixed(1)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-sand bg-white">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Of concern
            </p>
          </div>
          {concernSubjects.length === 0 ? (
            <p className="px-6 py-8 text-center font-serif text-[15px] text-stone">
              Every subject tracking at or above its 3-year average.
            </p>
          ) : (
            <ul className="divide-y divide-sand-light">
              {concernSubjects.map((s) => (
                <li key={s.code}>
                  <button
                    type="button"
                    onClick={() => setSubjectPreview(s)}
                    className="flex w-full items-center justify-between px-6 py-3 hover:bg-sand-light/40"
                  >
                    <span className="font-sans text-[14px] font-medium text-ink">{s.name}</span>
                    <span className="font-mono text-[14px] tabular-nums text-danger">
                      {s.avg.toFixed(1)}%{' '}
                      <span className="text-[12px] text-stone">
                        · {(s.avg - s.threeYear).toFixed(1)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Year-group performance */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Performance by year group
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            {yearGroup === 'All year groups' ? 'Forms 1–6 · current filters applied' : yearGroup}
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {formAverages.map((f) => (
            <ChartBar
              key={f.form}
              label={f.form}
              value={f.avg}
              tone={f.avg >= 78 ? 'good' : f.avg >= 72 ? 'default' : 'warn'}
              sub={`${f.avg.toFixed(1)}%`}
            />
          ))}
          {formAverages.length === 0 ? (
            <p className="px-2 py-4 font-sans text-[13px] text-stone">
              No year groups match the current filter.
            </p>
          ) : null}
        </div>
      </section>

      {/* Form 4 heatmap */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            {HEATMAP_FORM} · subject × class heatmap
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Click any cell to inspect that class · each cell is that class&rsquo;s average for the
            subject this term
          </p>
        </div>
        <div className="overflow-x-auto px-6 py-5">
          <table className="w-full text-[13px]">
            <thead>
              <tr>
                <th className="pr-3 text-left font-mono text-[11px] uppercase tracking-[0.14em] text-stone" />
                {HEATMAP_SUBJECTS.map((s) => (
                  <th
                    key={s}
                    className="px-1 py-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-stone"
                  >
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_CLASSES.map((cls, i) => (
                <tr key={cls}>
                  <td className="pr-3 text-left font-sans text-[12px] font-semibold text-ink">
                    {HEATMAP_FORM} {cls}
                  </td>
                  {HEATMAP_SUBJECTS.map((subj, j) => {
                    const value = HEATMAP_DATA[i]![j]!;
                    return (
                      <td key={j} className="p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCellPreview({
                              classLabel: `${HEATMAP_FORM} ${cls}`,
                              subjectCode: subj,
                              value,
                            })
                          }
                          className="block w-full"
                        >
                          <HeatCell value={value} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* School trend */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Whole-school trend · six terms
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Moving average across all forms
            </p>
            <p className="mt-4 font-display text-[clamp(2rem,3vw,2.5rem)] leading-none tabular-nums text-ink">
              {schoolAverageAdj.toFixed(1)}%
            </p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              up {(schoolAverage - schoolAverageFrom).toFixed(1)} points over six terms
            </p>
          </div>
          <Sparkline values={COHORT_TREND.map((c) => c.avg + filterShift)} width={300} height={96} />
        </div>
      </section>

      <aside className="rounded border border-sand bg-sand-light/60 px-6 py-4">
        <p className="font-sans text-[12px] text-stone">
          National data last updated November 2025 (ZIMSEC publication cycle). Regional
          independent-schools benchmarks available on request.
        </p>
      </aside>

      {subjectPreview ? (
        <SubjectDrawer
          subject={subjectPreview}
          onClose={() => setSubjectPreview(null)}
          onAction={(msg) => setToast(msg)}
        />
      ) : null}

      {cellPreview ? (
        <CellDrawer
          classLabel={cellPreview.classLabel}
          subjectCode={cellPreview.subjectCode}
          value={cellPreview.value}
          onClose={() => setCellPreview(null)}
          onAction={(msg) => setToast(msg)}
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

function LegendDot({ colour, label }: { colour: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${colour}`} aria-hidden />
      {label}
    </span>
  );
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded border border-sand bg-white px-2 py-1 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">{label}</span>
      <select
        value={options.find((o) => o.label === value)?.value ?? value}
        onChange={(e) => {
          const opt = options.find((o) => o.value === e.target.value);
          onChange(opt ? opt.label : e.target.value);
        }}
        className="h-8 cursor-pointer border-0 bg-transparent pr-2 font-sans text-[12px] font-medium text-earth focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Subject + cell drawers                                              */
/* ------------------------------------------------------------------ */

function SubjectDrawer({
  subject,
  onClose,
  onAction,
}: {
  subject: SubjectRow;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  const classes = useMemo(() => buildClassesForSubject(subject), [subject]);
  const trend = useMemo(
    () => [-8, -6, -4, -2, -1, 0].map((o) => Math.max(50, Math.min(95, subject.avg + o))),
    [subject],
  );

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
              Subject
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">
              {subject.name} · {subject.code}
            </h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              Current average {subject.avg.toFixed(1)}% · 3-year avg {subject.threeYear.toFixed(1)}%
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
              Contributing classes
            </p>
            <ul className="mt-3 space-y-1">
              {classes.map((c) => (
                <li key={c.label} className="flex items-center gap-3 rounded px-1 py-1">
                  <span className="w-24 font-mono text-[13px] text-stone">{c.label}</span>
                  <span className="w-40 font-sans text-[13px] text-ink">{c.teacher}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                    <div
                      className={[
                        'h-full rounded-full',
                        c.avg >= 78 ? 'bg-ok' : c.avg >= 72 ? 'bg-earth' : 'bg-ochre',
                      ].join(' ')}
                      style={{ width: `${c.avg}%` }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-[12px] tabular-nums text-ink">
                    {c.avg.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
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
                  .map((m, i) => `${i * (400 / (trend.length - 1))},${80 - ((m - 50) / 45) * 60 - 10}`)
                  .join(' ')}
              />
              {trend.map((m, i) => (
                <circle
                  key={i}
                  cx={i * (400 / (trend.length - 1))}
                  cy={80 - ((m - 50) / 45) * 60 - 10}
                  r={3}
                  fill="#C65D3D"
                />
              ))}
            </svg>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(`HOD ${subject.name} notified`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Message HOD
              </button>
              <button
                type="button"
                onClick={() => onAction(`Walk scheduled across ${subject.code} classes`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Schedule walk
              </button>
              <button
                type="button"
                onClick={() => onAction(`Subject report added to Term report pack`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Add to term pack
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

function CellDrawer({
  classLabel,
  subjectCode,
  value,
  onClose,
  onAction,
}: {
  classLabel: string;
  subjectCode: string;
  value: number;
  onClose: () => void;
  onAction: (msg: string) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-e3"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Class × subject
            </p>
            <h2 className="mt-1 font-display text-[22px] text-ink">
              {classLabel} · {subjectCode}
            </h2>
            <p className="mt-0.5 font-sans text-[13px] text-stone">
              Current average{' '}
              <span className="font-mono font-semibold text-ink">{value}%</span>
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
          <section className="rounded border border-sand bg-sand-light/50 p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Headline
            </p>
            <p className="mt-1 font-display text-[42px] leading-none tabular-nums text-ink">
              {value}
              <span className="text-[18px] text-stone">%</span>
            </p>
            <p className="mt-2 font-sans text-[13px] text-stone">
              {value >= 80
                ? 'Comfortably above the school mean — keep lessons at the current pace.'
                : value >= 70
                ? 'On track with the rest of the year group.'
                : 'Below the subject mean. Recommend a learning walk this fortnight.'}
            </p>
          </section>

          <section className="rounded border border-sand bg-white p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
              Quick actions
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(`Walk scheduled for ${classLabel} · ${subjectCode}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Schedule walk
              </button>
              <button
                type="button"
                onClick={() => onAction(`Teacher message draft started`)}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Message teacher
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

function buildClassesForSubject(subject: SubjectRow) {
  const pool: { label: string; teacher: string; avg: number }[] = [
    { label: '4A', teacher: 'Mrs Dziva', avg: subject.avg + 4 },
    { label: '4B', teacher: 'Mrs Sithole', avg: subject.avg - 3 },
    { label: '4C', teacher: 'Mr Mushore', avg: subject.avg - 1 },
    { label: '5A', teacher: 'Mr Tadyanemhandu', avg: subject.avg + 2 },
    { label: '5B', teacher: 'Mr Mukwada', avg: subject.avg - 6 },
    { label: '3A', teacher: 'Mr Mabika', avg: subject.avg - 4 },
  ];
  return pool.map((c) => ({ ...c, avg: Math.max(50, Math.min(95, c.avg)) }));
}
