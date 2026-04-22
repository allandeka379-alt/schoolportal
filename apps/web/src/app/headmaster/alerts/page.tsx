import Link from 'next/link';
import { AlertTriangle, Bell, BellOff, CheckCircle2, ShieldAlert } from 'lucide-react';

import { ExecPageHeader } from '@/components/headmaster/primitives';
import { HEAD_ALERTS } from '@/lib/mock/headmaster-extras';

/**
 * Alerts & Escalations — §14.
 *
 * Real-time stream of academic and pastoral matters. Curated tightly —
 * rate-limited per category.
 */
export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Alerts & escalations"
        title="Anything unexpected?"
        subtitle={`${HEAD_ALERTS.length} alerts · ${HEAD_ALERTS.filter((a) => a.urgent).length} urgent`}
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

      {/* Stream */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Live stream · today
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Acknowledge to clear from active view · dismiss keeps in history
          </p>
        </div>
        <ul className="divide-y divide-sand-light">
          {HEAD_ALERTS.map((a) => {
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
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-terracotta" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Bell className="mt-0.5 h-5 w-5 flex-none text-stone/70" strokeWidth={1.5} aria-hidden />
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
                  <p className="mt-2 font-display text-[16px] leading-snug text-ink">{a.message}</p>
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
                    className="inline-flex h-8 items-center gap-1 rounded px-3 font-sans text-[11px] text-stone hover:text-ink"
                  >
                    <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                    Acknowledge
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Categories & rate limits */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Alert categories
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Category</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Triggers</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Delivery</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Rate limit</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Safeguarding immediate', triggers: 'External referral · child in danger · police involvement', delivery: 'Push + SMS + call', rate: 'None' },
                { cat: 'Staff absence emergency', triggers: 'Teacher unavailable at short notice', delivery: 'Push', rate: '1 per hour' },
                { cat: 'Academic exception', triggers: 'Unusual cohort movement · mass-submission failure', delivery: 'Push + email', rate: '3 per day' },
                { cat: 'Report process', triggers: 'Release window opens · flagged returns accumulating', delivery: 'Push + email', rate: '1 per day' },
                { cat: 'At-risk escalation', triggers: 'New cumulative trigger student', delivery: 'Push + email', rate: '2 per day' },
                { cat: 'Routine academic', triggers: 'Walk notes ready · appraisal items due', delivery: 'In-portal only', rate: 'Digest' },
              ].map((c) => (
                <tr key={c.cat} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans font-medium text-ink">{c.cat}</td>
                  <td className="px-4 py-3 font-serif text-[13px] text-stone">{c.triggers}</td>
                  <td className="px-4 py-3 font-sans text-[12px] text-stone">{c.delivery}</td>
                  <td className="px-4 py-3 font-sans text-[12px] text-stone">{c.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded border-l-[3px] border-earth bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          Quiet hours
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          22:00–06:00 · only safeguarding-immediate alerts pass through. Weekends deprioritise
          routine. Term breaks delegate everything to the Deputy Head automatically. An academic
          leader constantly interrupted is an academic leader unable to think.
        </p>
      </aside>
    </div>
  );
}
