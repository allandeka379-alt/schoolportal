import { AlertTriangle, Archive, CheckCircle2, Filter, MessageCirclePlus, UserCog } from 'lucide-react';

import { ExecPageHeader } from '@/components/headmaster/primitives';
import { DECISIONS, type Decision } from '@/lib/mock/headmaster-extras';

/**
 * Approvals queue (academic) — §12.
 *
 * Every academic decision requiring signature, consent, or authorisation.
 * Financial/operational/governance approvals live elsewhere.
 */
export default function ApprovalsPage() {
  const urgent = DECISIONS.filter((d) => d.urgency === 'urgent');
  const thisWeek = DECISIONS.filter((d) => d.urgency === 'this-week');
  const thisMonth = DECISIONS.filter((d) => d.urgency === 'this-month');

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Approvals queue · academic"
        title="What needs your decision?"
        subtitle={`${DECISIONS.length} pending · ${urgent.length} urgent · ${thisWeek.length} this week · ${thisMonth.length} this month`}
        right={
          <>
            <button className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light">
              <Filter className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Filter
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light">
              <Archive className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Approval history
            </button>
          </>
        }
      />

      <section className="space-y-3">
        {urgent.length > 0 ? (
          <Group label="Urgent" items={urgent} />
        ) : null}
        <Group label="This week" items={thisWeek} />
        <Group label="This month" items={thisMonth} />
      </section>

      <aside className="rounded border-l-[3px] border-earth bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          What belongs here · what doesn&rsquo;t
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          This queue holds <strong>academic decisions only</strong>. Financial, operational,
          HR-administrative, and governance approvals reach you through separate formal
          channels — the Bursar&rsquo;s finance committee, the Business Manager&rsquo;s operations
          review, the Board for governance. The Bridge is academic.
        </p>
      </aside>
    </div>
  );
}

function Group({ label, items }: { label: string; items: readonly Decision[] }) {
  if (items.length === 0) return null;
  const isUrgent = label === 'Urgent';
  return (
    <section className={`rounded border bg-white ${isUrgent ? 'border-t-[3px] border-t-terracotta border-x-sand border-b-sand' : 'border-sand'}`}>
      <div className="flex items-center gap-2 border-b border-sand px-6 py-3">
        {isUrgent ? (
          <AlertTriangle className="h-4 w-4 text-terracotta" strokeWidth={1.5} aria-hidden />
        ) : null}
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          {label}
        </p>
        <span className="ml-auto font-sans text-[11px] text-stone">{items.length}</span>
      </div>
      <ul className="divide-y divide-sand-light">
        {items.map((d) => (
          <DecisionItem key={d.id} decision={d} />
        ))}
      </ul>
    </section>
  );
}

function DecisionItem({ decision }: { decision: Decision }) {
  const tagStyle = {
    safeguarding:      'bg-danger text-cream',
    'staff-appraisal': 'bg-[#EBE8F5] text-[#4F3E99]',
    curriculum:        'bg-[#FDF4E3] text-[#92650B]',
    reports:           'bg-[#E6F0E9] text-[#2F7D4E]',
    'teaching-quality':'bg-sand text-earth',
    policy:            'bg-sand text-earth',
    'student-exception':'bg-sand text-earth',
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
    <li className="px-6 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] ${tagStyle}`}>
          {categoryLabel}
        </span>
        <span className="font-sans text-[11px] text-stone">
          submitted {decision.submittedAgo} by {decision.submittedBy}
        </span>
        <span className="font-sans text-[11px] text-stone">· {decision.deadline}</span>
      </div>
      <h3 className="mt-2 font-display text-[18px] text-ink">{decision.title}</h3>
      <p className="mt-1 font-serif text-[13px] leading-relaxed text-stone">{decision.context}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
          Review
        </button>
        <button className="inline-flex h-9 items-center gap-1 rounded bg-terracotta px-3 font-sans text-[12px] font-semibold text-cream hover:bg-terracotta-hover">
          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Approve
        </button>
        <button className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
          <MessageCirclePlus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Return with note
        </button>
        {decision.canDelegate ? (
          <button className="inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-stone hover:bg-sand-light">
            <UserCog className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Delegate
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-sm bg-sand-light px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
            cannot delegate
          </span>
        )}
      </div>
    </li>
  );
}
