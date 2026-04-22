import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';

import {
  ChartBar,
  ExecPageHeader,
  KPICard,
  Sparkline,
} from '@/components/headmaster/primitives';
import {
  BRIDGE_KPIS,
  COHORT_TREND,
  DECISIONS,
  FORM_AVERAGES,
  SCHOOL_STATE,
  type Decision,
} from '@/lib/mock/headmaster-extras';

/**
 * The Bridge — §04.
 *
 * Five zones:
 *   1. Status band (dark Earth header)
 *   2. Academic KPI row (4 cards)
 *   3. Decisions queue (requires your decision today)
 *   4. Academic snapshot (cohort by form + 6-term trend)
 *   5. Teaching & safeguarding strip
 */
export default function BridgePage() {
  return (
    <div className="space-y-8">
      {/* Zone 1 — Status band */}
      <section className="rounded bg-[#2A1D10] px-6 py-6 text-cream md:px-10 md:py-8">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-ochre">
          The Bridge
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] text-cream">
            {SCHOOL_STATE.dateLabel}
            <span className="ml-3 font-sans text-[14px] font-normal text-sand/70">
              · {SCHOOL_STATE.termLabel}
            </span>
          </h1>
          <p className="font-sans text-[13px] text-sand/80">
            School status:{' '}
            <span className="font-semibold text-ok">
              {SCHOOL_STATE.status}
            </span>{' '}
            · {SCHOOL_STATE.learnersPresent.toLocaleString('en-ZW')} of{' '}
            {SCHOOL_STATE.learnersTotal.toLocaleString('en-ZW')} learners present (
            {SCHOOL_STATE.attendancePercent}%)
          </p>
        </div>
      </section>

      {/* Zone 2 — KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {BRIDGE_KPIS.map((k) => (
          <KPICard
            key={k.key}
            label={k.label}
            value={k.value}
            deltaLabel={k.deltaLabel}
            trend={k.trend}
            size="lg"
          />
        ))}
      </div>

      {/* Zone 3 — Decisions queue */}
      <section className="rounded border border-sand bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-t-terracotta border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Requires your decision today
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Each item links to its full context. One-tap delegate preserves audit.
            </p>
          </div>
          <Link
            href="/headmaster/approvals"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Open approvals queue
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
        <ol className="divide-y divide-sand-light">
          {DECISIONS.slice(0, 4).map((d, i) => (
            <DecisionRow key={d.id} decision={d} index={i + 1} />
          ))}
        </ol>
      </section>

      {/* Zone 4 — Academic snapshot */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded border border-sand bg-white lg:col-span-3">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Cohort average by form
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Term 2, 2026 · all forms · click a bar to drill
            </p>
          </div>
          <div className="space-y-1 px-6 py-5">
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
        </section>

        <section className="rounded border border-sand bg-white lg:col-span-2">
          <div className="border-b border-sand px-6 py-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Cohort trend — six terms
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Moving average · whole school
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none tabular-nums text-ink">
                  {COHORT_TREND.at(-1)?.avg.toFixed(1)}%
                </p>
                <p className="mt-2 font-sans text-[12px] text-stone">
                  up from {COHORT_TREND[0]?.avg.toFixed(1)}% six terms ago
                </p>
              </div>
              <Sparkline values={COHORT_TREND.map((t) => t.avg)} width={160} height={56} />
            </div>
            <ul className="mt-6 space-y-2 font-sans text-[12px]">
              {COHORT_TREND.map((t, i) => (
                <li key={t.term} className="flex items-center justify-between">
                  <span className="text-stone">{t.term}</span>
                  <span className="font-mono tabular-nums text-ink">
                    {t.avg.toFixed(1)}%
                    {i === 0 ? null : (
                      <span className="ml-2 text-stone">
                        {(t.avg - (COHORT_TREND[i - 1]?.avg ?? 0)).toFixed(1) > '0'
                          ? `+${(t.avg - (COHORT_TREND[i - 1]?.avg ?? 0)).toFixed(1)}`
                          : (t.avg - (COHORT_TREND[i - 1]?.avg ?? 0)).toFixed(1)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Zone 5 — Teaching & safeguarding strip */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StripTile
          icon={<Users className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          label="Teaching quality"
          value="91%"
          sub="CPD on track · 18 walks planned this term"
          href="/headmaster/teaching"
        />
        <StripTile
          icon={<ShieldCheck className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          label="Safeguarding"
          value="3"
          sub="active cases · 1 needs your review"
          href="/headmaster/safeguarding"
        />
        <StripTile
          icon={<Calendar className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          label="Next 7 days"
          value="6"
          sub="academic events · mid-term week begins Mon"
          href="/headmaster/strategic"
        />
      </div>

      {/* Personalised brief */}
      <aside className="rounded border border-earth/30 bg-sand-light/70 px-6 py-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          Personalised academic brief · 07:00
        </p>
        <p className="mt-2 max-w-[72ch] font-serif text-[15px] leading-relaxed text-ink">
          Good morning, {SCHOOL_STATE.termLabel.toLowerCase()}.{' '}
          <strong className="font-semibold">One safeguarding case</strong> was escalated overnight
          by the DSL and needs your review. Two learning walks are scheduled today — Mrs Sithole
          in Mathematics 4B and Mr Ndaba in History 4A. The{' '}
          <strong className="font-semibold">Form 4 report cards</strong> are ready for your
          approval; the Deputy Head (Academic) has sampled them and flagged two for closer reading.
          Teacher on leave today: Ms Chikwangwana (Geography). Pass rate holding at 84%, cohort
          average 76.2%.
        </p>
      </aside>
    </div>
  );
}

function DecisionRow({ decision, index }: { decision: Decision; index: number }) {
  const urgent = decision.urgency === 'urgent';
  const tagStyle = {
    safeguarding: 'bg-danger text-cream',
    'staff-appraisal': 'bg-[#EBE8F5] text-[#4F3E99]',
    curriculum: 'bg-[#FDF4E3] text-[#92650B]',
    reports: 'bg-[#E6F0E9] text-[#2F7D4E]',
    'teaching-quality': 'bg-sand text-earth',
    policy: 'bg-sand text-earth',
    'student-exception': 'bg-sand text-earth',
  }[decision.category];
  const categoryLabel = {
    safeguarding: 'Safeguarding',
    'staff-appraisal': 'Staff appraisal',
    curriculum: 'Curriculum',
    reports: 'Reports',
    'teaching-quality': 'Teaching quality',
    policy: 'Policy',
    'student-exception': 'Student exception',
  }[decision.category];

  return (
    <li className="flex items-center gap-4 px-6 py-4 hover:bg-sand-light/30">
      <span className="w-8 font-mono text-[13px] tabular-nums text-stone">
        {String(index).padStart(2, '0')}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              'inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em]',
              tagStyle,
            ].join(' ')}
          >
            {categoryLabel}
          </span>
          {urgent ? (
            <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-danger">
              <AlertTriangle className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              Urgent
            </span>
          ) : null}
          <span className="font-sans text-[11px] text-stone">· {decision.submittedAgo}</span>
          <span className="font-sans text-[11px] text-stone">· {decision.submittedBy}</span>
        </div>
        <p className="font-display text-[17px] leading-snug text-ink">{decision.title}</p>
        <p className="font-serif text-[13px] text-stone">{decision.context}</p>
      </div>
      <div className="flex flex-none items-center gap-2">
        <Link
          href="/headmaster/approvals"
          className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
        >
          Open
          <ArrowRight className="ml-1 h-3 w-3" strokeWidth={1.5} aria-hidden />
        </Link>
        {decision.canDelegate ? (
          <button
            type="button"
            className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-stone hover:bg-sand-light"
          >
            Delegate
          </button>
        ) : null}
      </div>
    </li>
  );
}

function StripTile({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded border border-sand bg-white p-5 transition-all duration-200 ease-out-soft hover:-translate-y-px hover:shadow-e2"
    >
      <div className="flex items-center justify-between">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 font-display text-[32px] leading-none text-ink tabular-nums">{value}</p>
      <p className="mt-2 font-sans text-[12px] text-stone">{sub}</p>
    </Link>
  );
}
