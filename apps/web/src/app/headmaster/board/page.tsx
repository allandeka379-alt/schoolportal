import { CheckCircle2, CircleDashed, Clock, Download, FileSpreadsheet, FileText, Presentation } from 'lucide-react';

import { ExecPageHeader } from '@/components/headmaster/primitives';
import { BOARD_SECTIONS } from '@/lib/mock/headmaster-extras';

/**
 * Board Reporting (academic) — §13.
 *
 * Contributes the academic narrative to the Board pack. Other sections
 * (financial, operational, enrolment) are prepared by their respective
 * owners and assembled centrally.
 */
export default function BoardReportingPage() {
  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Board reporting · academic pack"
        title="Termly Board academic sections"
        subtitle="Compiled automatically from the data you've been reading all term"
        right={
          <button className="btn-terracotta">
            <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Export full pack
          </button>
        }
      />

      {/* Timeline */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Board pack cycle
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            10 days before meeting · pack reaches governors 5 days before · meeting presentation
          </p>
        </div>
        <ol className="relative divide-y divide-sand-light">
          {[
            { step: 1, label: 'System generates first draft', done: true },
            { step: 2, label: 'Headmaster reviews academic sections', done: true },
            { step: 3, label: 'Deputy (Academic) input', done: false },
            { step: 4, label: 'DSL signs off safeguarding summary', done: false },
            { step: 5, label: 'Headmaster approves (locks academic sections)', done: false },
            { step: 6, label: 'Full pack assembled (Bursar + Business Manager + Registrar)', done: false },
            { step: 7, label: 'Distribution to governors (5 days before meeting)', done: false },
          ].map((s) => (
            <li key={s.step} className="flex items-center gap-3 px-6 py-3">
              {s.done ? (
                <CheckCircle2 className="h-4 w-4 text-ok" strokeWidth={1.5} aria-hidden />
              ) : (
                <CircleDashed className="h-4 w-4 text-stone" strokeWidth={1.5} aria-hidden />
              )}
              <span className="font-mono text-[11px] tabular-nums text-stone">{String(s.step).padStart(2, '0')}</span>
              <span className={`font-sans text-[13px] ${s.done ? 'text-stone line-through' : 'text-ink'}`}>
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Pack sections */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Academic sections · Board pack
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Edit narrative sections · data sections are read-only
          </p>
        </div>
        <ul className="divide-y divide-sand-light">
          {BOARD_SECTIONS.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
              <span className="font-mono text-[11px] tabular-nums text-stone">
                {s.id.toUpperCase()}
              </span>
              <span className="flex-1 font-sans text-[14px] font-medium text-ink">
                {s.title}
              </span>
              <span className="font-sans text-[12px] text-stone">{s.due}</span>
              {s.status === 'complete' ? (
                <span className="inline-flex items-center gap-1 rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ok">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                  complete
                </span>
              ) : s.status === 'pending-dsl' ? (
                <span className="inline-flex items-center gap-1 rounded-sm bg-[#FDF4E3] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#92650B]">
                  <Clock className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                  awaiting DSL
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  draft
                </span>
              )}
              <button className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
                Review
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Export options */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <ExportTile icon={<FileText className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />} label="Full PDF pack" />
        <ExportTile icon={<FileText className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />} label="Academic-only PDF" />
        <ExportTile icon={<Presentation className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />} label="PowerPoint" />
        <ExportTile icon={<FileSpreadsheet className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />} label="Raw data CSVs" />
      </div>

      {/* Efficiency claim */}
      <aside className="rounded border-l-[3px] border-terracotta bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Time returned
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          Previously 1–2 days of Headmaster and Deputy time per month. Automated compilation
          reduces this to approximately <strong className="font-semibold">90 minutes</strong> of
          review and editing — 10–15 working days of senior time returned to the school each year.
        </p>
      </aside>
    </div>
  );
}

function ExportTile({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="group flex items-center gap-3 rounded border border-sand bg-white p-4 text-left transition-all hover:-translate-y-px hover:border-terracotta hover:shadow-e2"
    >
      {icon}
      <div>
        <p className="font-sans text-[13px] font-medium text-ink">{label}</p>
        <p className="mt-0.5 font-sans text-[11px] text-stone">Export when ready</p>
      </div>
    </button>
  );
}
