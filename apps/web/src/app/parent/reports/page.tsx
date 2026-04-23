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
  X,
} from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow, TrendArrow } from '@/components/student/primitives';
import { ChildColourDot, ParentPageHeader, ParentStatusPill } from '@/components/parent/primitives';
import { useSelectedChild } from '@/components/parent/selected-child-context';
import { reportsFor } from '@/lib/mock/parent-extras';

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

  function simulateDownload(id: string, label: string) {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded((curr) => {
        const next = new Set(curr);
        next.add(id);
        return next;
      });
      setToast(`Downloaded "${label}" (watermarked PDF)`);
    }, 1100);
  }

  return (
    <div className="space-y-8">
      <ParentPageHeader
        eyebrow={`${selectedChild.firstName}'s reports`}
        title="End-of-term reports,"
        accent="from the school."
        subtitle={`Current term and ${past.length} past report${past.length === 1 ? '' : 's'}.`}
        right={
          <button
            type="button"
            onClick={() => simulateDownload(current.id, `${current.term} ${current.year} — ${selectedChild.firstName}`)}
            disabled={downloading === current.id}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light disabled:opacity-60"
          >
            {downloading === current.id ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden />
            ) : downloaded.has(current.id) ? (
              <Check className="h-4 w-4 text-ok" strokeWidth={2} aria-hidden />
            ) : (
              <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
            {downloading === current.id
              ? 'Preparing PDF…'
              : downloaded.has(current.id)
              ? 'Downloaded'
              : 'Download PDF'}
          </button>
        }
      />

      {/* Current report */}
      <EditorialCard className="overflow-hidden">
        <div className="border-b border-sand bg-sand-light/60 px-6 py-6 md:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <ChildColourDot tone={selectedChild.colourTone} />
            <EditorialAvatar
              name={`${selectedChild.firstName} ${selectedChild.lastName}`}
              size="md"
              tone="terracotta"
            />
            <div>
              <p className="font-display text-[22px] text-ink">
                {selectedChild.firstName} {selectedChild.lastName}
              </p>
              <p className="font-sans text-[13px] text-stone">
                {selectedChild.form} · {current.term} {current.year}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ParentStatusPill state={acknowledged ? 'acknowledged' : 'action-required'}>
                {acknowledged ? 'acknowledged' : 'unacknowledged'}
              </ParentStatusPill>
              <span className="font-sans text-[12px] text-stone">
                Released {current.releasedOn} · approved by the Headmaster
              </span>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiTile label="Term average" value={`${current.average}%`} />
            <KpiTile label="Overall grade" value={current.grade} />
            <KpiTile
              label="Position"
              value={`${current.position} of ${current.classSize}`}
            />
            <KpiTile label="Attendance" value={`${current.attendance}%`} />
          </dl>
        </div>

        {/* Form teacher comment */}
        <section className="bg-sand-light/30 px-6 py-8 md:px-10">
          <SectionEyebrow>Form teacher&rsquo;s comment</SectionEyebrow>
          <p className="mt-1 font-sans text-[12px] text-stone">{selectedChild.formTeacher}</p>
          <blockquote className="mt-5 max-w-[68ch] font-display text-[20px] italic leading-[1.55] text-ink">
            &ldquo;{current.formTeacherComment}&rdquo;
          </blockquote>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand px-6 py-4 md:px-10">
          <p className="font-sans text-[12px] text-stone">
            Signed digitally by the Headmaster on {current.releasedOn}. This PDF is
            watermarked with your name and download timestamp.
          </p>
          <div className="flex items-center gap-2">
            {!acknowledged ? (
              <button
                type="button"
                onClick={() => setAcknowledged(true)}
                className="btn-terracotta"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Acknowledge report
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded border border-sand bg-white px-4 py-2 font-sans text-[13px] font-medium text-ok">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Acknowledged · thank you
              </span>
            )}
          </div>
        </div>
      </EditorialCard>

      {/* Next actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ActionCard
          icon={<HandCoins className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          title="Book a parent-teacher meeting"
          body="If you'd like to talk about this report, you can book a 10-minute slot with the form teacher or any subject teacher."
          href="/parent/meetings"
          cta="See available slots"
        />
        <ActionCard
          icon={<MessageSquarePlus className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          title="Message the form teacher"
          body={`Send a quick note to ${selectedChild.formTeacher} about any of the comments above.`}
          href="/parent/messages"
          cta="Open messages"
        />
      </div>

      {/* Past reports */}
      <EditorialCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <SectionEyebrow>Past reports</SectionEyebrow>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            disabled={past.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light disabled:opacity-40"
          >
            Compare terms
          </button>
        </div>
        {past.length === 0 ? (
          <p className="px-6 py-10 text-center font-serif text-[15px] text-stone">
            No past reports yet.
          </p>
        ) : (
          <ul className="divide-y divide-sand-light">
            {past.map((r) => {
              const isDownloading = downloading === r.id;
              const isDownloaded = downloaded.has(r.id);
              return (
                <li key={r.id} className="flex items-center gap-4 px-6 py-4">
                  <FileText className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-medium text-ink">
                      {r.term} {r.year} · Form-teacher report
                    </p>
                    <p className="font-sans text-[12px] text-stone">
                      Released {r.releasedOn} · {r.average}% · Grade {r.grade} · attendance {r.attendance}%
                    </p>
                  </div>
                  <ParentStatusPill state={r.acknowledged ? 'acknowledged' : 'action-required'} />
                  <button
                    type="button"
                    onClick={() => simulateDownload(r.id, `${r.term} ${r.year} — ${selectedChild.firstName}`)}
                    disabled={isDownloading}
                    className="inline-flex h-8 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} aria-hidden />
                    ) : isDownloaded ? (
                      <Check className="h-3.5 w-3.5 text-ok" strokeWidth={2} aria-hidden />
                    ) : (
                      <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    )}
                    {isDownloading ? 'Preparing…' : isDownloaded ? 'Downloaded' : 'Download'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </EditorialCard>

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
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded bg-white shadow-e3"
      >
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-[20px] text-ink">Compare terms</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-2 text-stone transition-colors hover:bg-sand-light hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <p className="font-sans text-[13px] text-stone">
            Side-by-side across {all.length} terms · the portal stitches together form-teacher reports so
            you can read the arc at a glance.
          </p>

          {/* Trend strip */}
          <div className="mt-5 rounded border border-sand bg-sand-light/40 p-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
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
                        isCurrent ? 'bg-terracotta' : 'bg-earth/60',
                      ].join(' ')}
                      style={{ height: `${h}px` }}
                      aria-hidden
                    />
                    <div className="text-center font-mono text-[11px] text-stone">
                      <p className="font-semibold text-ink">{r.average}%</p>
                      <p>
                        {r.term} · {r.year}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row comparison */}
          <table className="mt-6 w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Metric
                </th>
                {all.map((r) => (
                  <th
                    key={r.id}
                    className={[
                      'px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]',
                      r.id === current.id ? 'text-terracotta' : 'text-stone',
                    ].join(' ')}
                  >
                    {r.term} {r.year}
                    {r.id === current.id ? ' (current)' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums text-[13px] text-ink">
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

          {/* Quoted commentary */}
          <div className="mt-6 space-y-3">
            {all.map((r) => (
              <blockquote
                key={r.id}
                className={[
                  'rounded border p-4',
                  r.id === current.id
                    ? 'border-terracotta/40 bg-sand-light/70'
                    : 'border-sand bg-white',
                ].join(' ')}
              >
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-earth">
                  {r.term} {r.year}
                </p>
                <p className="mt-2 font-serif text-[14px] italic leading-relaxed text-ink">
                  &ldquo;{r.formTeacherComment}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-sand bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-stone hover:bg-sand-light"
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
    <tr className="border-t border-sand-light">
      <td className="px-4 py-3 font-sans font-medium text-stone">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-4 py-3">
          {v}
        </td>
      ))}
    </tr>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
        {label}
      </p>
      <p className="mt-1 font-display text-[30px] leading-none text-ink tabular-nums">{value}</p>
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
    <EditorialCard className="p-6">
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="font-display text-[18px] text-ink">{title}</p>
          <p className="mt-1 font-serif text-[14px] text-stone">{body}</p>
          <a
            href={href}
            className="mt-3 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-terracotta hover:underline underline-offset-4"
          >
            {cta} →
          </a>
        </div>
      </div>
    </EditorialCard>
  );
}
