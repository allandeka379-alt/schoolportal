'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Flag, MessageCirclePlus, ShieldAlert } from 'lucide-react';

import { ChartBar, ExecPageHeader } from '@/components/headmaster/primitives';
import {
  CLASS_SETS,
  REPORTS_PROGRESS,
  REVIEW_STUDENTS,
} from '@/lib/mock/headmaster-extras';

/**
 * Reports — §09. Approval & release.
 *
 * Overview: class-set progress by stage.
 * Review workspace: left = student list (flagged first), right = report
 * preview. Approve / Return with note / Next student.
 */
export default function ReportsApprovalPage() {
  const [activeId, setActiveId] = useState('rv-2');
  const students = REVIEW_STUDENTS;
  const active = students.find((s) => s.id === activeId) ?? students[0]!;
  const reviewed = students.filter((s) => s.reviewed).length;

  const [mode, setMode] = useState<'full' | 'flagged' | 'sample'>('flagged');
  const visible = useMemo(() => {
    if (mode === 'flagged') return students.filter((s) => s.flagged);
    if (mode === 'sample') return students.slice(0, Math.ceil(students.length / 2));
    return students;
  }, [mode, students]);

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Reports · approval & release"
        title="Form 4A · Term 2 report cards"
        subtitle="32 students · all HODs signed off · form teacher overall complete · your review required"
      />

      {/* Whole-school progress */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Term 2 report cards · class-set progress
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            32 class-sets · approval chain status
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {REPORTS_PROGRESS.map((r) => (
            <ChartBar
              key={r.stage}
              label={r.stage}
              value={(r.complete / r.total) * 100}
              tone={r.complete === r.total ? 'complete' : 'default'}
              sub={`${r.complete} of ${r.total}`}
            />
          ))}
        </div>
      </section>

      {/* Class-set queue */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Class sets awaiting your approval
          </p>
        </div>
        <ul className="divide-y divide-sand-light">
          {CLASS_SETS.filter((c) => c.stage === 'hm-approval').map((c) => (
            <li key={c.id} className="flex items-center gap-4 px-6 py-4">
              <span className="font-display text-[18px] text-ink">{c.classLabel}</span>
              <span className="font-sans text-[12px] text-stone">
                {c.totalStudents} students · {c.flagged} flagged
              </span>
              <button
                type="button"
                className="ml-auto inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
              >
                Review set
                <ChevronRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Review workspace */}
      <section className="rounded border border-sand bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Form 4A · review workspace
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              {reviewed} / {students.length} reviewed
            </p>
          </div>
          <div role="radiogroup" className="inline-flex overflow-hidden rounded border border-sand">
            <ModeButton active={mode === 'flagged'} label="Flagged only" onClick={() => setMode('flagged')} />
            <ModeButton active={mode === 'sample'} label="Sample mode" onClick={() => setMode('sample')} />
            <ModeButton active={mode === 'full'} label="Full class-set" onClick={() => setMode('full')} />
          </div>
          <button className="inline-flex h-9 items-center gap-1 rounded bg-terracotta px-4 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover">
            Bulk approve set
          </button>
        </div>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
          {/* Students list */}
          <aside className="border-b border-sand md:col-span-5 md:border-b-0 md:border-r">
            <ul className="divide-y divide-sand-light">
              {visible.map((s) => {
                const isActive = s.id === active.id;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={[
                        'relative flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors',
                        isActive ? 'bg-sand-light/70' : 'hover:bg-sand-light/40',
                      ].join(' ')}
                    >
                      {isActive ? (
                        <span
                          aria-hidden
                          className="absolute inset-y-2 left-0 w-[2px] rounded-r-sm bg-terracotta"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-sans text-[14px] font-medium text-ink">
                          {s.name}
                          {s.atRisk ? (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-[#FBEBEA] px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-danger">
                              <ShieldAlert className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                              at-risk
                            </span>
                          ) : null}
                          {s.flagged ? (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-[#FDF4E3] px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#92650B]">
                              <Flag className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                              flagged
                            </span>
                          ) : null}
                        </p>
                        <p className="font-sans text-[11px] text-stone">
                          {s.summary.average}% · Grade {s.summary.grade} · position {s.summary.position}/{s.summary.classSize}
                        </p>
                      </div>
                      {s.reviewed ? (
                        <CheckCircle2 className="h-4 w-4 text-ok" strokeWidth={1.5} aria-label="Reviewed" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Preview */}
          <div className="md:col-span-7">
            <div className="border-b border-sand bg-sand-light/40 px-6 py-5">
              <p className="font-display text-[22px] text-ink">{active.name}</p>
              <p className="font-sans text-[12px] text-stone">
                Form 4A · Term 2, 2026 · released only after your approval
              </p>
              <dl className="mt-4 grid grid-cols-4 gap-3">
                <Kpi label="Term avg" value={`${active.summary.average}%`} />
                <Kpi label="Grade" value={active.summary.grade} />
                <Kpi label="Position" value={`${active.summary.position}/${active.summary.classSize}`} />
                <Kpi label="Attendance" value={`${active.summary.attendance}%`} />
              </dl>
            </div>
            <div className="px-6 py-6">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                Form teacher&rsquo;s comment
              </p>
              <blockquote className="mt-3 max-w-[68ch] font-display text-[18px] italic leading-[1.5] text-ink">
                &ldquo;{active.ftComment}&rdquo;
              </blockquote>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sand px-6 py-4">
              <p className="font-sans text-[12px] text-stone">
                Approve if marks reconcile, comments are fair and specific, no factual errors.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                >
                  <MessageCirclePlus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Return with note
                </button>
                <button className="btn-terracotta">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  Approve &amp; next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="mt-1 font-display text-[22px] leading-none tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function ModeButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={[
        'inline-flex h-9 items-center px-3 font-sans text-[12px] font-medium transition-colors',
        active ? 'bg-ink text-cream' : 'bg-white text-stone hover:bg-sand-light',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
