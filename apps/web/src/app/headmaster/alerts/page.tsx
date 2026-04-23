'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  ClipboardList,
  ShieldAlert,
} from 'lucide-react';

import { ExecPageHeader } from '@/components/headmaster/primitives';
import { DECISIONS, HEAD_ALERTS, type Decision } from '@/lib/mock/headmaster-extras';

/**
 * Administrator · Alerts & decisions.
 *
 * Folds the earlier "Approvals" queue into the same stream as live alerts.
 * The Administrator sees one list, sorted by urgency. Decisions have
 * Approve / Delegate / Open buttons; alerts have Acknowledge / Open.
 */
export default function AlertsPage() {
  const [tab, setTab] = useState<'decisions' | 'alerts' | 'all'>('all');
  const [acked, setAcked] = useState<Set<string>>(new Set());

  const urgentDecisions = DECISIONS.filter((d) => d.urgency === 'urgent');
  const alertUrgent = HEAD_ALERTS.filter((a) => a.urgent).length;
  const alertTotal = HEAD_ALERTS.length - acked.size;

  const showDecisions = tab === 'decisions' || tab === 'all';
  const showAlerts = tab === 'alerts' || tab === 'all';

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Alerts &amp; decisions"
        title="Requires your attention"
        subtitle={`${DECISIONS.length} decisions to take · ${alertTotal} alerts open · ${
          urgentDecisions.length + alertUrgent
        } urgent`}
        right={
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            <BellOff className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Quiet hours
          </button>
        }
      />

      {/* Tabs */}
      <nav aria-label="Filter" className="border-b border-sand">
        <ul className="flex flex-wrap gap-0">
          {(
            [
              { key: 'all' as const, label: 'All', count: DECISIONS.length + alertTotal },
              { key: 'decisions' as const, label: 'Decisions', count: DECISIONS.length },
              { key: 'alerts' as const, label: 'Alerts', count: alertTotal },
            ]
          ).map((t) => {
            const active = t.key === tab;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    'inline-flex h-11 items-center gap-2 border-b-[2px] px-4 font-sans text-[14px] transition-colors',
                    active
                      ? 'border-terracotta font-semibold text-ink'
                      : 'border-transparent text-stone hover:text-ink',
                  ].join(' ')}
                >
                  {t.label}
                  <span
                    className={[
                      'rounded-sm px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums',
                      active ? 'bg-sand text-earth' : 'bg-sand-light text-stone',
                    ].join(' ')}
                  >
                    {t.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Decisions queue */}
      {showDecisions ? (
        <section className="rounded border border-sand bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
            <div>
              <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
                <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                Decisions · require your sign-off
              </p>
              <p className="mt-1 font-sans text-[13px] text-stone">
                Each item links to its full context. One-tap delegate preserves audit.
              </p>
            </div>
          </div>
          <ol className="divide-y divide-sand-light">
            {DECISIONS.map((d, i) => (
              <DecisionRow key={d.id} decision={d} index={i + 1} />
            ))}
          </ol>
        </section>
      ) : null}

      {/* Alerts stream */}
      {showAlerts ? (
        <section className="rounded border border-sand bg-white">
          <div className="border-b border-sand px-6 py-4">
            <p className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              <Bell className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Live alerts · today
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Acknowledge to clear · urgent items also push to SMS
            </p>
          </div>
          <ul className="divide-y divide-sand-light">
            {HEAD_ALERTS.filter((a) => !acked.has(a.id)).map((a) => {
              const tagStyle =
                a.category === 'safeguarding'
                  ? 'bg-danger text-cream'
                  : a.category === 'at-risk'
                  ? 'bg-[#FBEBEA] text-danger'
                  : a.category === 'academic'
                  ? 'bg-[#FDF4E3] text-[#92650B]'
                  : a.category === 'reports'
                  ? 'bg-[#E6F0E9] text-ok'
                  : 'bg-sand text-earth';
              return (
                <li key={a.id} className="flex items-start gap-4 px-6 py-4">
                  {a.urgent ? (
                    <AlertTriangle
                      className="mt-0.5 h-5 w-5 flex-none text-terracotta"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  ) : (
                    <Bell
                      className="mt-0.5 h-5 w-5 flex-none text-stone/70"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] ${tagStyle}`}
                      >
                        {a.category}
                      </span>
                      <span className="font-sans text-[11px] text-stone">· {a.ago}</span>
                      {a.urgent ? (
                        <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-danger">
                          <ShieldAlert className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                          urgent
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 font-display text-[16px] leading-snug text-ink">
                      {a.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {a.actionHref && a.actionLabel ? (
                      <Link
                        href={a.actionHref}
                        className="inline-flex h-8 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
                      >
                        {a.actionLabel}
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        setAcked((curr) => {
                          const next = new Set(curr);
                          next.add(a.id);
                          return next;
                        })
                      }
                      className="inline-flex h-8 items-center gap-1 rounded px-3 font-sans text-[11px] text-stone hover:text-ink"
                    >
                      <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                      Acknowledge
                    </button>
                  </div>
                </li>
              );
            })}
            {acked.size === HEAD_ALERTS.length ? (
              <li className="px-6 py-10 text-center font-serif text-[15px] text-stone">
                All clear. You have acknowledged every open alert.
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      <aside className="rounded border-l-[3px] border-earth bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          Quiet hours
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          22:00–06:00 · only safeguarding-immediate alerts pass through. Weekends deprioritise
          routine items. Term breaks delegate everything to the Deputy Head automatically.
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
        <button
          type="button"
          className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
        >
          Open
        </button>
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
