'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Download,
  Info,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';

import { AUDIT_LOG, type AuditEntry, type AuditSeverity } from '@/lib/mock/school';

/**
 * Audit log — every privileged write, attributable and immutable.
 *
 * Satisfies Section 10 of the proposal and the Data Protection Act
 * Chapter 11:24. Live tail on the left, selectable row detail on the
 * right.
 */

const SEVERITY_TONE: Record<AuditSeverity, string> = {
  INFO: 'bg-fog text-slate',
  NOTICE: 'bg-signal-success/10 text-signal-success',
  WARNING: 'bg-signal-warning/10 text-signal-warning',
  ALERT: 'bg-signal-error/10 text-signal-error',
};

const ROLE_LABEL: Record<AuditEntry['actorRole'], string> = {
  HEADMASTER: 'Headmaster',
  BURSAR: 'Bursar',
  TEACHER: 'Teacher',
  SYSTEM: 'System',
  IT_ADMIN: 'IT Admin',
  PARENT: 'Parent',
};

export default function AuditLogPage() {
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<AuditSeverity | 'ALL'>('ALL');
  const [selected, setSelected] = useState<AuditEntry | null>(AUDIT_LOG[0] ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUDIT_LOG.filter((a) => {
      if (severity !== 'ALL' && a.severity !== severity) return false;
      if (!q) return true;
      return (
        a.actor.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.resource.toLowerCase().includes(q) ||
        (a.resourceLabel ?? '').toLowerCase().includes(q) ||
        (a.summary ?? '').toLowerCase().includes(q)
      );
    });
  }, [query, severity]);

  const counts = useMemo(() => {
    const counts = { INFO: 0, NOTICE: 0, WARNING: 0, ALERT: 0 } as Record<AuditSeverity, number>;
    AUDIT_LOG.forEach((a) => {
      counts[a.severity] += 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Compliance · Audit log
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
          Every privileged write, on the record.
        </h1>
        <p className="mt-2 max-w-[78ch] font-sans text-[14px] text-slate">
          Attributable. Immutable. Retained 7 years. Satisfies Section 10 of the proposal and
          complies with the Data Protection Act [Chapter 11:24]. Exports are hash-stamped so
          regulators can verify authenticity.
        </p>
      </header>

      {/* Severity summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SeverityTile
          icon={<Info className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          label="Info"
          count={counts.INFO}
          sub="Routine writes · OK to tail"
        />
        <SeverityTile
          icon={<ShieldCheck className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          label="Notice"
          count={counts.NOTICE}
          sub="Signed decisions · publish events"
          tone="success"
        />
        <SeverityTile
          icon={<Bell className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          label="Warning"
          count={counts.WARNING}
          sub="Unlocks · failed auth · delays"
          tone="warning"
        />
        <SeverityTile
          icon={<ShieldAlert className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          label="Alert"
          count={counts.ALERT}
          sub="Financial waivers · data changes"
          tone="error"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-mist bg-snow p-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action, resource or summary…"
            className="h-10 w-full rounded-md border border-mist bg-snow pl-9 pr-3 font-sans text-[13px] text-obsidian placeholder-steel focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border border-mist bg-fog p-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em]">
          {(['ALL', 'INFO', 'NOTICE', 'WARNING', 'ALERT'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              className={[
                'rounded-sm px-2.5 py-1 transition-colors',
                severity === s ? 'bg-obsidian text-snow' : 'text-slate hover:text-obsidian',
              ].join(' ')}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Export (hash-stamped)
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">
                {filtered.length} entries · last 24 hours
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Newest first
              </p>
            </div>
            <ul className="divide-y divide-mist">
              {filtered.map((a) => {
                const active = selected?.id === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(a)}
                      className={[
                        'flex w-full items-start gap-4 px-5 py-3 text-left transition-colors',
                        active ? 'bg-fog' : 'hover:bg-fog/60',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
                          SEVERITY_TONE[a.severity],
                        ].join(' ')}
                      >
                        {a.severity.toLowerCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-[12px] text-obsidian">{a.action}</span>
                          <span className="font-mono text-[10px] text-steel">·</span>
                          <span className="font-sans text-[13px] text-obsidian">{a.actor}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                            ({ROLE_LABEL[a.actorRole]})
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                          {a.resourceLabel ?? a.resource}
                        </p>
                      </div>
                      <span className="flex-none font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                        {new Date(a.at).toLocaleString('en-ZW', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="xl:col-span-1">
          {selected ? <AuditDetail entry={selected} /> : <DetailPlaceholder />}
        </section>
      </div>
    </div>
  );
}

function SeverityTile({
  icon,
  label,
  count,
  sub,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  sub: string;
  tone?: 'default' | 'success' | 'warning' | 'error';
}) {
  const border =
    tone === 'success'
      ? 'border-t-[3px] border-t-signal-success'
      : tone === 'warning'
      ? 'border-t-[3px] border-t-signal-warning'
      : tone === 'error'
      ? 'border-t-[3px] border-t-signal-error'
      : 'border-t-[3px] border-t-mist';
  return (
    <div className={`rounded-md border border-mist bg-snow p-4 ${border}`}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
          {label}
        </p>
        <span className="text-slate">{icon}</span>
      </div>
      <p className="mt-2 font-display text-[26px] font-medium leading-none text-obsidian tabular-nums">
        {count}
      </p>
      <p className="mt-2 font-sans text-[12px] text-steel">{sub}</p>
    </div>
  );
}

function AuditDetail({ entry }: { entry: AuditEntry }) {
  return (
    <article className="overflow-hidden rounded-md border border-mist bg-snow">
      <div className="flex items-center justify-between border-b border-mist px-5 py-4">
        <div>
          <p
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Entry
          </p>
          <p className="font-mono text-[14px] text-obsidian">{entry.id}</p>
        </div>
        <span
          className={[
            'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]',
            SEVERITY_TONE[entry.severity],
          ].join(' ')}
        >
          {entry.severity === 'ALERT' ? (
            <AlertTriangle className="h-3 w-3" strokeWidth={2} aria-hidden />
          ) : null}
          {entry.severity.toLowerCase()}
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-center gap-3 rounded-md bg-fog px-3 py-3">
          <span
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-obsidian text-snow"
            aria-hidden
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-sans text-[14px] font-medium text-obsidian">{entry.actor}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
              {ROLE_LABEL[entry.actorRole]}
              {entry.ip ? ` · ${entry.ip}` : ''}
            </p>
          </div>
        </div>

        <dl className="space-y-3">
          <Row label="Action" value={entry.action} mono />
          <Row
            label="Resource"
            value={entry.resourceLabel ?? entry.resource}
            sub={entry.resourceLabel ? entry.resource : undefined}
            mono={!entry.resourceLabel}
          />
          <Row
            label="Timestamp"
            value={new Date(entry.at).toLocaleString('en-ZW', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
            sub="CAT · UTC+2"
          />
        </dl>

        {entry.summary ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Summary</p>
            <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate">{entry.summary}</p>
          </div>
        ) : null}

        <div className="rounded-md border border-mist bg-fog/50 px-3 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel">
            Tamper-evident hash
          </p>
          <p className="mt-0.5 break-all font-mono text-[11px] text-slate">
            sha256:9f4a…{entry.id.slice(-4)}…c8e2
          </p>
        </div>
      </div>
    </article>
  );
}

function Row({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{label}</dt>
      <dd className="max-w-[60%] text-right">
        <span
          className={[
            'font-medium text-obsidian break-words',
            mono ? 'font-mono text-[12px]' : 'font-sans text-[13px]',
          ].join(' ')}
        >
          {value}
        </span>
        {sub ? (
          <span className="block break-words font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
            {sub}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function DetailPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-mist bg-snow p-10 text-center">
      <p className="font-sans text-[14px] text-slate">Select an entry to inspect</p>
    </div>
  );
}
