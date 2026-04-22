'use client';

import { useState } from 'react';
import { CheckCircle2, Download, FileText, HandCoins, MessageSquarePlus } from 'lucide-react';

import { EditorialAvatar, EditorialCard, SectionEyebrow } from '@/components/student/primitives';
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
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Download PDF
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
            className="inline-flex h-9 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
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
            {past.map((r) => (
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
                  className="inline-flex h-8 items-center gap-1.5 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </EditorialCard>
    </div>
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
