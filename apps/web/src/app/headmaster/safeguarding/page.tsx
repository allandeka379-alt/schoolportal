'use client';

import { useState } from 'react';
import { AlertTriangle, FileKey2, Lock, ShieldCheck } from 'lucide-react';

import { ChartBar, ExecPageHeader, KPICard } from '@/components/headmaster/primitives';
import { SAFEGUARDING_CATEGORIES, SAFEGUARDING_RIBBON } from '@/lib/mock/headmaster-extras';

/**
 * Safeguarding overview — §10.
 *
 *   - No list of names. Counts, categories, statuses.
 *   - Individual records require two-person authorisation.
 *   - Reassuring silence when nothing is active.
 */
export default function SafeguardingPage() {
  const [dualAuthOpen, setDualAuthOpen] = useState(false);

  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Safeguarding overview"
        title="Every data point here concerns a real child."
        subtitle="No informational browsing · every drill-down logged · two-person authorisation on individual records"
      />

      {/* Current state ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard
          label="Active cases"
          value={SAFEGUARDING_RIBBON.activeCases.toString()}
          deltaLabel="under DSL management"
        />
        <KPICard
          label="Needs HM review"
          value={SAFEGUARDING_RIBBON.needsReview.toString()}
          deltaLabel="this week"
          trend="flat"
        />
        <KPICard
          label="External reports"
          value={SAFEGUARDING_RIBBON.externalReports30d.toString()}
          deltaLabel="last 30 days"
          trend="flat"
        />
        <KPICard
          label="Avg resolution"
          value={`${SAFEGUARDING_RIBBON.avgResolutionDays}d`}
          deltaLabel="time (3-month)"
          trend="flat"
        />
      </div>

      {/* Active case — two-person open */}
      <section className="rounded border border-terracotta/60 bg-white">
        <div className="flex items-center gap-3 border-b border-terracotta/60 bg-[#FDF0EB] px-6 py-4">
          <AlertTriangle className="h-5 w-5 text-terracotta" strokeWidth={1.5} aria-hidden />
          <p className="font-sans text-[13px] font-semibold text-terracotta">
            1 case needs your review this week
          </p>
          <span className="ml-auto font-sans text-[11px] text-stone">
            Submitted by DSL · 2h ago · recommended action inside
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <p className="font-display text-[18px] text-ink">External referral decision · Form 3B</p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              DSL recommends referral to Social Services · requires HM authorisation within 24h
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
            >
              <FileKey2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Delegate to Deputy
            </button>
            <button
              type="button"
              onClick={() => setDualAuthOpen(true)}
              className="btn-terracotta"
            >
              <Lock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Open case (dual auth)
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Cases by category · 12-month view
          </p>
          <p className="mt-1 font-sans text-[13px] text-stone">
            Includes resolved cases · no individual identifying data
          </p>
        </div>
        <div className="space-y-1 px-6 py-5">
          {SAFEGUARDING_CATEGORIES.map((c) => (
            <ChartBar
              key={c.category}
              label={c.category}
              value={c.count}
              max={Math.max(...SAFEGUARDING_CATEGORIES.map((x) => x.count))}
              sub={`${c.count} cases`}
            />
          ))}
        </div>
      </section>

      {/* Reading notes */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Note
          icon={<ShieldCheck className="h-5 w-5 text-ok" strokeWidth={1.5} aria-hidden />}
          title="No systemic rise"
          body="No category has risen consistently over the last three terms. Patterns remain within sector norms."
        />
        <Note
          icon={<ShieldCheck className="h-5 w-5 text-ok" strokeWidth={1.5} aria-hidden />}
          title="Resolution time steady"
          body="14-day average resolution time has held for two terms; no capacity issue emerging."
        />
        <Note
          icon={<ShieldCheck className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />}
          title="Annual audit"
          body="Independent Schools Association audit next due October 2026. A+ rating held from March."
        />
      </div>

      <aside className="rounded border-l-[3px] border-earth bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
          Design convention
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          On days with no active safeguarding matters, this page reads &ldquo;No active
          safeguarding matters require your attention.&rdquo; That is the desired state.
        </p>
      </aside>

      {dualAuthOpen ? <DualAuthModal onClose={() => setDualAuthOpen(false)} /> : null}
    </div>
  );
}

function Note({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded border border-sand bg-white p-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-sans text-[13px] font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-2 font-serif text-[13px] leading-relaxed text-stone">{body}</p>
    </div>
  );
}

function DualAuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded border border-sand bg-white p-6 shadow-e3"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Two-person authorisation required
        </p>
        <h3 className="mt-2 font-display text-[22px] text-ink">
          Open Form 3B safeguarding case?
        </h3>
        <p className="mt-2 font-serif text-[15px] text-stone">
          This case contains sensitive information. Access requires the Headmaster and one of
          DSL or Deputy (Pastoral) to authorise. Every drill-down is logged.
        </p>
        <div className="mt-5 space-y-2">
          <label className="flex items-center gap-2 rounded border border-sand px-3 py-2 font-sans text-[13px] text-ink">
            <input type="checkbox" className="h-3 w-3" defaultChecked />
            Headmaster — hardware key confirmed
          </label>
          <label className="flex items-center gap-2 rounded border border-sand px-3 py-2 font-sans text-[13px] text-ink">
            <input type="checkbox" className="h-3 w-3" />
            DSL (Mrs Gumbo) — awaiting signature
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light"
          >
            Cancel
          </button>
          <button type="button" disabled className="btn-terracotta disabled:opacity-40">
            Open (awaiting second signature)
          </button>
        </div>
      </div>
    </div>
  );
}
