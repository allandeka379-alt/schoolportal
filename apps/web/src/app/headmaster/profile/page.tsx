import { Bell, Calendar as CalendarIcon, Clock, Fingerprint, KeyRound, UserCog, Users } from 'lucide-react';

import { ExecPageHeader } from '@/components/headmaster/primitives';
import { DELEGATES, ME_HEADMASTER } from '@/lib/mock/headmaster-extras';

/**
 * Profile, Permissions & Delegation — §15.
 *
 * The portal's most consequential feature: who acts in the Headmaster's
 * name when the Headmaster is unavailable.
 */
export default function HeadmasterProfilePage() {
  return (
    <div className="space-y-8">
      <ExecPageHeader
        eyebrow="Profile · delegation"
        title="Who acts in your name?"
        subtitle="Academic leadership never stalls · accountability is never lost"
      />

      {/* Me */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Account
          </p>
        </div>
        <div className="grid grid-cols-1 gap-0 divide-y divide-sand-light md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="px-6 py-5">
            <dl className="space-y-3">
              <Row label="Name" value={`${ME_HEADMASTER.title} ${ME_HEADMASTER.firstName} ${ME_HEADMASTER.lastName}`} />
              <Row label="Title" value="Headmaster" />
              <Row label="Email" value={ME_HEADMASTER.email} />
              <Row label="Sessions" value="2 active · last key-in 14 min ago" />
            </dl>
          </div>
          <div className="px-6 py-5">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">
              Security
            </p>
            <ul className="mt-3 space-y-2.5 text-[13px]">
              <li className="flex items-center gap-2 text-ink">
                <KeyRound className="h-4 w-4 text-ok" strokeWidth={1.5} aria-hidden />
                YubiKey enrolled — hardware-key login mandatory
              </li>
              <li className="flex items-center gap-2 text-ink">
                <Fingerprint className="h-4 w-4 text-ok" strokeWidth={1.5} aria-hidden />
                TouchID / Windows Hello · personal device sessions
              </li>
              <li className="flex items-center gap-2 text-ink">
                <Clock className="h-4 w-4 text-ok" strokeWidth={1.5} aria-hidden />
                1-hour idle · 4-hour absolute session lifetime
              </li>
              <li className="flex items-center gap-2 text-stone">
                <Bell className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                Impossible-travel detection enabled
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Delegation */}
      <section className="rounded border border-sand bg-white">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
              Standing academic delegates
            </p>
            <p className="mt-1 font-sans text-[13px] text-stone">
              Delegation transfers the approval AND the responsibility · audit records who actually decided
            </p>
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
            <UserCog className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Add delegate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-sand-light/40 text-left">
                <th className="px-6 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Delegate</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Role</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Scope</th>
                <th className="px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">Active?</th>
              </tr>
            </thead>
            <tbody>
              {DELEGATES.map((d) => (
                <tr key={d.name} className="border-t border-sand-light">
                  <td className="px-6 py-3 font-sans font-medium text-ink">{d.name}</td>
                  <td className="px-4 py-3 font-sans text-[13px] text-stone">{d.role}</td>
                  <td className="px-4 py-3 font-serif text-[13px] text-stone">{d.scope}</td>
                  <td className="px-4 py-3">
                    {d.active ? (
                      <span className="inline-flex items-center rounded-sm bg-[#E6F0E9] px-2 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ok">
                        active
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delegation types */}
      <section className="rounded border border-sand bg-white">
        <div className="border-b border-sand px-6 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-earth">
            Delegation types
          </p>
        </div>
        <div className="grid grid-cols-1 gap-0 divide-y divide-sand-light md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
          <TypeTile
            title="Standing"
            body="Specific decision categories pre-delegated permanently · auto-active per rule"
          />
          <TypeTile
            title="Scheduled"
            body="Covers planned absences — conference, leave · date range · auto-active in window"
          />
          <TypeTile
            title="Emergency"
            body="Full academic authority transferred · until revoked · manual activation"
          />
          <TypeTile
            title="Partial"
            body="Specific decision delegated for a single case · per-case trigger"
          />
        </div>
      </section>

      {/* Absent Headmaster */}
      <aside className="rounded border-l-[3px] border-terracotta bg-sand-light/70 px-6 py-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">
          Extended absence
        </p>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink">
          When you are to be absent for more than three consecutive working days, an Acting
          Headmaster is designated. The portal supports this with a formal academic handover
          flow — briefing notes on active cases, open academic queue review, at-risk register
          walkthrough — and a clear transfer of academic authority logged with Board visibility.
        </p>
        <button className="mt-3 inline-flex h-9 items-center gap-1 rounded border border-sand bg-white px-3 font-sans text-[12px] font-medium text-earth hover:bg-sand-light">
          <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Initiate Acting Headmaster handover
        </button>
      </aside>

      {/* Audit */}
      <section className="rounded border border-sand bg-white p-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-earth" strokeWidth={1.5} aria-hidden />
          <p className="font-sans text-[13px] font-medium text-ink">
            Audit log · last 30 days
          </p>
          <span className="ml-auto font-sans text-[12px] text-stone">
            214 actions · 18 delegated · 0 reversed
          </span>
        </div>
        <p className="mt-3 font-serif text-[14px] leading-relaxed text-stone">
          Every delegated action is logged with delegatee, decision, timestamp, underlying
          documentation. You can review any delegated action on return, and reverse any
          decision within a configurable window.
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">{label}</dt>
      <dd className="font-sans text-[14px] text-ink">{value}</dd>
    </div>
  );
}

function TypeTile({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-5 py-4">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta">
        {title}
      </p>
      <p className="mt-2 font-serif text-[13px] leading-relaxed text-stone">{body}</p>
    </div>
  );
}
