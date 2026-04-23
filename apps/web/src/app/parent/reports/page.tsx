'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  HandCoins,
  Loader2,
  MessageSquarePlus,
  TrendingUp,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/student/progress-ring';
import { EditorialAvatar } from '@/components/student/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import {
  reportsFor,
  type ParentReport,
  type ReportSubjectRow,
} from '@/lib/mock/parent-extras';
import { buildReportCard, downloadPdf } from '@/lib/pdf/generate';

/**
 * Parent reports — §09.
 *
 *   - Summary band for the current-term report
 *   - Form teacher's comment in Fraunces italic on Sand Light
 *   - Acknowledge action (records a note to the form teacher)
 *   - Past reports list with compare affordance
 */
export default function ParentReportsPage() {
  const { selectedChild } = useSelectedChild();
  const reports = reportsFor(selectedChild.id);
  const current = reports.find((r) => r.current) ?? reports[0]!;
  const past = reports.filter((r) => !r.current);
  const [acknowledged, setAcknowledged] = useState(current.acknowledged);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  function downloadReport(report: ParentReport) {
    setDownloading(report.id);
    setTimeout(() => {
      const pdf = buildReportCard({
        studentName: `${selectedChild.firstName} ${selectedChild.lastName}`,
        admissionNo: selectedChild.id.replace('s-', 'JHS-2026-').toUpperCase(),
        house: selectedChild.house,
        age: selectedChild.form.includes('4')
          ? 16
          : selectedChild.form.includes('3')
          ? 15
          : selectedChild.form.includes('2')
          ? 14
          : 13,
        form: selectedChild.form,
        term: report.term,
        year: report.year,
        releasedOn: report.releasedOn,
        termAverage: report.average,
        grade: report.grade,
        position: report.position,
        classSize: report.classSize,
        attendance: report.attendance,
        daysAbsent: report.daysAbsent,
        daysLate: report.daysLate,
        conduct: report.conduct,
        leadership: report.leadership,
        housePoints: report.housePoints,
        formTeacher: report.formTeacherName,
        formTeacherComment: report.formTeacherComment,
        headmasterName: report.headmasterName,
        headmasterComment: report.headmasterComment,
        nextTermStarts: report.nextTermStarts,
        feesDueAmount: report.feesDueAmount,
        feesDueBy: report.feesDueBy,
        subjects: report.subjects.map((s) => ({
          code: s.code,
          name: s.name,
          teacher: s.teacher,
          initials: s.initials,
          ca: s.ca,
          exam: s.exam,
          total: s.total,
          grade: s.grade,
          position: s.position,
          classSize: s.classSize,
          classAverage: s.classAverage,
          comment: s.comment,
        })),
      });
      const safeName = `${selectedChild.firstName}-${selectedChild.lastName}`.replace(/\s+/g, '-');
      const filename = `JHS-${safeName}-${report.term.replace(/\s+/g, '')}-${report.year}.pdf`;
      downloadPdf(filename, pdf);
      setDownloading(null);
      setDownloaded((curr) => {
        const next = new Set(curr);
        next.add(report.id);
        return next;
      });
      setToast(`Downloaded "${filename}" — watermarked with your login`);
    }, 900);
  }

  const ringTone: 'success' | 'brand' | 'warning' | 'danger' =
    current.average >= 80 ? 'success' : current.average >= 65 ? 'brand' : current.average >= 50 ? 'warning' : 'danger';

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-small text-muted">{selectedChild.firstName}&rsquo;s reports</p>
          <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
            End-of-term reports
          </h1>
          <p className="mt-2 text-small text-muted">
            Current term and {past.length} past report{past.length === 1 ? '' : 's'}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => downloadReport(current)}
          disabled={downloading === current.id}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md disabled:opacity-60"
        >
          {downloading === current.id ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
          ) : downloaded.has(current.id) ? (
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
          ) : (
            <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          )}
          {downloading === current.id
            ? 'Preparing PDF…'
            : downloaded.has(current.id)
            ? 'Downloaded'
            : 'Download PDF'}
        </button>
      </header>

      {/* Standard report card — current term */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        {/* Student header */}
        <div className="border-b border-line bg-surface/50 px-6 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <EditorialAvatar
                name={`${selectedChild.firstName} ${selectedChild.lastName}`}
                size="md"
                tone="terracotta"
              />
              <div>
                <p className="text-h3 text-ink">
                  {selectedChild.firstName} {selectedChild.lastName}
                </p>
                <p className="text-small text-muted">
                  {selectedChild.form} · {current.term} {current.year} ·{' '}
                  {selectedChild.house} House
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={acknowledged ? 'success' : 'warning'} dot>
                {acknowledged ? 'Acknowledged' : 'Unacknowledged'}
              </Badge>
              <span className="text-micro text-muted">Released {current.releasedOn}</span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiTile
              label="Term average"
              value={`${current.average}%`}
              ring={current.average}
              ringTone={ringTone}
            />
            <KpiTile label="Overall grade" value={current.grade} />
            <KpiTile label="Class position" value={`${current.position}/${current.classSize}`} />
            <KpiTile label="Attendance" value={`${current.attendance}%`} />
          </dl>

          {/* Conduct + attendance strip */}
          <ul className="mt-4 grid grid-cols-2 gap-3 rounded-md border border-line bg-card p-3 text-small sm:grid-cols-4">
            <ConductCell label="Days absent" value={String(current.daysAbsent)} />
            <ConductCell label="Late marks" value={String(current.daysLate)} />
            <ConductCell label="Conduct" value={current.conduct} />
            <ConductCell label="House points" value={String(current.housePoints)} />
          </ul>
          {current.leadership && current.leadership !== '—' ? (
            <p className="mt-3 flex items-center gap-2 text-small text-ink">
              <Badge tone="gold" dot>
                Leadership
              </Badge>
              {current.leadership}
            </p>
          ) : null}
        </div>

        {/* Subject results table */}
        <div className="border-b border-line px-6 py-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                Subject results
              </p>
              <p className="mt-0.5 text-small text-muted">
                CA out of 40 · exam out of 60 · total out of 100 · position within the subject class
              </p>
            </div>
            <span className="text-micro text-muted">
              {current.subjects.length} subjects
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="py-2 pr-3 text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Subject
                  </th>
                  <th className="px-3 py-2 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    CA / 40
                  </th>
                  <th className="px-3 py-2 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Exam / 60
                  </th>
                  <th className="px-3 py-2 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Total
                  </th>
                  <th className="px-3 py-2 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Grade
                  </th>
                  <th className="px-3 py-2 text-center text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Position
                  </th>
                  <th className="px-3 py-2 text-right text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Class avg
                  </th>
                  <th className="px-3 py-2 text-left text-micro font-semibold uppercase tracking-[0.1em] text-muted">
                    Teacher
                  </th>
                </tr>
              </thead>
              <tbody>
                {current.subjects.map((s) => (
                  <SubjectRow key={s.code} row={s} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div className="grid grid-cols-1 gap-0 border-b border-line md:grid-cols-2">
          <div className="border-b border-line px-6 py-6 md:border-b-0 md:border-r md:px-8">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Form teacher&rsquo;s comment
            </p>
            <p className="mt-1 text-small font-semibold text-ink">
              {current.formTeacherName}
            </p>
            <blockquote className="mt-3 text-small leading-relaxed text-ink">
              &ldquo;{current.formTeacherComment}&rdquo;
            </blockquote>
          </div>
          <div className="px-6 py-6 md:px-8">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
              Headmaster&rsquo;s comment
            </p>
            <p className="mt-1 text-small font-semibold text-ink">
              {current.headmasterName}
            </p>
            <blockquote className="mt-3 text-small leading-relaxed text-ink">
              &ldquo;{current.headmasterComment}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Term logistics */}
        <div className="grid grid-cols-1 gap-0 border-b border-line sm:grid-cols-2">
          <div className="border-b border-line bg-surface/40 px-6 py-4 sm:border-b-0 sm:border-r md:px-8">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Next term begins
            </p>
            <p className="mt-1 text-small font-semibold text-ink">{current.nextTermStarts}</p>
          </div>
          <div className="bg-surface/40 px-6 py-4 md:px-8">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Fees due
            </p>
            <p className="mt-1 text-small font-semibold text-ink">
              USD {current.feesDueAmount} · by {current.feesDueBy}
            </p>
          </div>
        </div>

        {/* Signatures + acknowledge bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4 md:px-8">
          <p className="max-w-[48ch] text-micro text-muted">
            Signed digitally by {current.headmasterName} · {current.releasedOn}. The PDF is
            watermarked with your parent login and the download timestamp.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadReport(current)}
              disabled={downloading === current.id}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
            >
              {downloading === current.id ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />
              ) : (
                <Download className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              )}
              {downloading === current.id ? 'Preparing…' : 'Download PDF'}
            </button>
            {!acknowledged ? (
              <button
                type="button"
                onClick={() => setAcknowledged(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Acknowledge report
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/5 px-4 py-2 text-small font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Acknowledged · thank you
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Next actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActionCard
          icon={<HandCoins className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          title="Book a parent-teacher meeting"
          body="If you'd like to talk about this report, you can book a 10-minute slot with the form teacher or any subject teacher."
          href="/parent/meetings"
          cta="See available slots"
        />
        <ActionCard
          icon={<MessageSquarePlus className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          title="Message the form teacher"
          body={`Send a quick note to ${selectedChild.formTeacher} about any of the comments above.`}
          href="/parent/messages"
          cta="Open messages"
        />
      </div>

      {/* Past reports */}
      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
        <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div>
            <h2 className="text-small font-semibold text-ink">Past reports</h2>
            <p className="text-micro text-muted">{past.length} archived term{past.length === 1 ? '' : 's'}</p>
          </div>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            disabled={past.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-4 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-40"
          >
            Compare terms
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          </button>
        </header>
        {past.length === 0 ? (
          <p className="px-6 py-10 text-center text-small text-muted">
            No past reports yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {past.map((r) => {
              const isDownloading = downloading === r.id;
              const isDownloaded = downloaded.has(r.id);
              return (
                <li key={r.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                    <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-small font-semibold text-ink">
                      {r.term} {r.year} · Form-teacher report
                    </p>
                    <p className="text-micro text-muted">
                      Released {r.releasedOn} · {r.average}% · Grade {r.grade} · attendance {r.attendance}%
                    </p>
                  </div>
                  <Badge tone={r.acknowledged ? 'success' : 'warning'} dot>
                    {r.acknowledged ? 'Acknowledged' : 'Action required'}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => downloadReport(r)}
                    disabled={isDownloading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
                    ) : isDownloaded ? (
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} aria-hidden />
                    ) : (
                      <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    )}
                    {isDownloading ? 'Preparing…' : isDownloaded ? 'Downloaded' : 'Download'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {compareOpen ? (
        <CompareDrawer
          current={current}
          past={past}
          onClose={() => setCompareOpen(false)}
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

function CompareDrawer({
  current,
  past,
  onClose,
}: {
  current: ReturnType<typeof reportsFor>[number];
  past: ReturnType<typeof reportsFor>;
  onClose: () => void;
}) {
  const all = useMemo(() => [...past, current], [past, current]).sort((a, b) => {
    return `${a.year}-${a.term}`.localeCompare(`${b.year}-${b.term}`);
  });

  const max = Math.max(...all.map((r) => r.average));
  const min = Math.min(...all.map((r) => r.average));

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
              <TrendingUp className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h2 className="text-small font-semibold text-ink">Compare terms</h2>
              <p className="text-micro text-muted">{all.length} terms side-by-side</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <p className="text-small text-muted">
            The portal stitches together form-teacher reports so you can read the arc at a glance.
          </p>

          {/* Trend strip */}
          <div className="mt-5 rounded-md border border-line bg-surface/50 p-4">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Term averages
            </p>
            <div className="mt-3 flex items-end gap-4">
              {all.map((r) => {
                const h = Math.max(12, ((r.average - min + 4) / Math.max(max - min + 4, 1)) * 120);
                const isCurrent = r.id === current.id;
                return (
                  <div key={r.id} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={[
                        'w-full max-w-[56px] rounded-t',
                        isCurrent ? 'bg-brand-primary' : 'bg-brand-primary/35',
                      ].join(' ')}
                      style={{ height: `${h}px` }}
                      aria-hidden
                    />
                    <div className="text-center">
                      <p className="text-small font-semibold tabular-nums text-ink">{r.average}%</p>
                      <p className="text-micro text-muted">
                        {r.term} · {r.year}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row comparison */}
          <div className="mt-6 overflow-x-auto rounded-md border border-line">
            <table className="w-full text-small">
              <thead>
                <tr className="bg-surface/60 text-left">
                  <th className="px-4 py-3 text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                    Metric
                  </th>
                  {all.map((r) => (
                    <th
                      key={r.id}
                      className={[
                        'px-4 py-3 text-micro font-semibold uppercase tracking-[0.12em]',
                        r.id === current.id ? 'text-brand-primary' : 'text-muted',
                      ].join(' ')}
                    >
                      {r.term} {r.year}
                      {r.id === current.id ? ' (current)' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums text-ink">
                <ComparisonRow label="Average" values={all.map((r) => `${r.average}%`)} />
                <ComparisonRow label="Grade" values={all.map((r) => r.grade)} />
                <ComparisonRow
                  label="Position"
                  values={all.map((r) => `${r.position}/${r.classSize}`)}
                />
                <ComparisonRow
                  label="Attendance"
                  values={all.map((r) => `${r.attendance}%`)}
                />
              </tbody>
            </table>
          </div>

          {/* Quoted commentary */}
          <div className="mt-6 space-y-3">
            {all.map((r) => (
              <blockquote
                key={r.id}
                className={[
                  'rounded-md border p-4',
                  r.id === current.id
                    ? 'border-brand-primary/30 bg-brand-primary/5'
                    : 'border-line bg-card',
                ].join(' ')}
              >
                <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
                  {r.term} {r.year}
                </p>
                <p className="mt-2 text-small italic leading-relaxed text-ink">
                  &ldquo;{r.formTeacherComment}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-line bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3 text-small font-semibold text-muted">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3 text-small">
          {v}
        </td>
      ))}
    </tr>
  );
}

function ConductCell({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-md bg-surface/40 px-3 py-2">
      <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-0.5 text-small font-semibold text-ink">{value}</p>
    </li>
  );
}

function SubjectRow({ row }: { row: ReportSubjectRow }) {
  const gradeTone: 'success' | 'brand' | 'warning' | 'danger' =
    row.grade === 'A' ? 'success' : row.grade === 'B' ? 'brand' : row.grade === 'C' ? 'warning' : 'danger';
  return (
    <>
      <tr className="border-t border-line align-middle">
        <td className="py-3 pr-3">
          <p className="text-small font-semibold text-ink">{row.name}</p>
          <p className="text-micro text-muted">{row.code}</p>
        </td>
        <td className="px-3 py-3 text-right font-mono tabular-nums text-ink">
          {row.ca}
          <span className="text-muted"> / 40</span>
        </td>
        <td className="px-3 py-3 text-right font-mono tabular-nums text-ink">
          {row.exam}
          <span className="text-muted"> / 60</span>
        </td>
        <td className="px-3 py-3 text-right font-bold tabular-nums text-ink">{row.total}</td>
        <td className="px-3 py-3 text-center">
          <Badge tone={gradeTone} dot>
            {row.grade}
          </Badge>
        </td>
        <td className="px-3 py-3 text-center font-mono tabular-nums text-ink">
          {row.position}/{row.classSize}
        </td>
        <td className="px-3 py-3 text-right tabular-nums text-muted">{row.classAverage}%</td>
        <td className="px-3 py-3 text-small text-ink">
          {row.teacher}
          <span className="ml-1 rounded-sm bg-surface px-1 font-mono text-micro text-muted">
            {row.initials}
          </span>
        </td>
      </tr>
      {row.comment ? (
        <tr className="bg-surface/20">
          <td colSpan={8} className="px-0 pb-3 pt-1">
            <p className="border-l-2 border-brand-primary/40 pl-3 text-micro italic text-muted">
              &ldquo;{row.comment}&rdquo;
            </p>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function KpiTile({
  label,
  value,
  ring,
  ringTone,
}: {
  label: string;
  value: string;
  ring?: number;
  ringTone?: 'success' | 'brand' | 'warning' | 'danger';
}) {
  return (
    <div className="rounded-md border border-line bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        {ring !== undefined && ringTone ? (
          <ProgressRing value={ring} size={36} stroke={4} tone={ringTone} />
        ) : null}
      </div>
      <p className="mt-2 text-h2 tabular-nums text-ink">{value}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <a
      href={href}
      className="hover-lift group flex h-full items-start gap-3 rounded-lg border border-line bg-card p-5 shadow-card-sm transition-colors hover:border-brand-primary/30"
    >
      <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-ink">{title}</p>
        <p className="mt-1 text-small text-muted">{body}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-micro font-semibold text-brand-primary">
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </a>
  );
}
