'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  Download,
  Info,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { AUDIT_LOG, type AuditEntry, type AuditSeverity } from '@/lib/mock/school';
import { downloadBlob } from '@/lib/pdf/generate';

const SEVERITY_TONE: Record<AuditSeverity, 'neutral' | 'success' | 'warning' | 'danger'> = {
  INFO: 'neutral',
  NOTICE: 'success',
  WARNING: 'warning',
  ALERT: 'danger',
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
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function exportLog() {
    setExporting(true);
    setTimeout(() => {
      const hash = `sha256:${Math.random().toString(36).slice(-12)}${Date.now().toString(36)}`;
      const header = 'ID,Timestamp,Severity,Actor,Role,Action,Resource,Summary,IP\n';
      const rows = filtered
        .map((a) => {
          const summary = (a.summary ?? '').replace(/"/g, '""');
          return `"${a.id}","${a.at}","${a.severity}","${a.actor}","${a.actorRole}","${a.action}","${a.resource}","${summary}","${a.ip ?? ''}"`;
        })
        .join('\n');
      const footer = `\n# Export signed ${new Date().toISOString()}\n# ${hash}\n`;
      const bytes = new TextEncoder().encode(header + rows + footer);
      downloadBlob(
        bytes,
        `HHA-Audit-${new Date().toISOString().slice(0, 10)}.csv`,
        'text/csv',
      );
      setExporting(false);
      setToast(`Exported ${filtered.length} entries · ${hash.slice(0, 18)}…`);
    }, 700);
  }

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
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Compliance · audit log</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          Every privileged write, on the record
        </h1>
        <p className="mt-2 max-w-[78ch] text-small text-muted">
          Attributable. Immutable. Retained 7 years. Satisfies Section 10 of the proposal and
          complies with the Data Protection Act [Chapter 11:24]. Exports are hash-stamped so
          regulators can verify authenticity.
        </p>
      </header>

      {/* Severity summary */}
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SeverityTile
          icon={<Info className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          iconTone="info"
          label="Info"
          count={counts.INFO}
          sub="Routine writes · OK to tail"
        />
        <SeverityTile
          icon={<ShieldCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          iconTone="success"
          label="Notice"
          count={counts.NOTICE}
          sub="Signed decisions · publish events"
          valueTone="success"
        />
        <SeverityTile
          icon={<Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          iconTone="warning"
          label="Warning"
          count={counts.WARNING}
          sub="Unlocks · failed auth · delays"
          valueTone="warning"
        />
        <SeverityTile
          icon={<ShieldAlert className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
          iconTone="danger"
          label="Alert"
          count={counts.ALERT}
          sub="Financial waivers · data changes"
          valueTone="danger"
        />
      </ul>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-card p-3 shadow-card-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action, resource or summary…"
            className="h-10 w-full rounded-full border border-line bg-surface/40 pl-9 pr-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-surface p-1">
          {(['ALL', 'INFO', 'NOTICE', 'WARNING', 'ALERT'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              className={[
                'rounded-full px-3 py-1 text-micro font-semibold transition-colors',
                severity === s ? 'bg-card text-ink shadow-card-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportLog}
          disabled={exporting}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 text-micro font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} aria-hidden />
          ) : (
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
          )}
          {exporting ? 'Exporting…' : 'Export (hash-stamped)'}
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <p className="text-small font-semibold text-ink">
                {filtered.length} entries · last 24 hours
              </p>
              <p className="text-micro text-muted">Newest first</p>
            </header>
            <ul className="divide-y divide-line">
              {filtered.map((a) => {
                const activeRow = selected?.id === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(a)}
                      className={[
                        'flex w-full items-start gap-4 px-5 py-3 text-left transition-colors',
                        activeRow ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/40',
                      ].join(' ')}
                    >
                      <Badge tone={SEVERITY_TONE[a.severity]} dot>
                        {a.severity.toLowerCase()}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-micro text-ink">{a.action}</span>
                          <span className="text-micro text-muted">·</span>
                          <span className="text-small font-semibold text-ink">{a.actor}</span>
                          <span className="text-micro uppercase tracking-[0.1em] text-muted">
                            ({ROLE_LABEL[a.actorRole]})
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-mono text-micro uppercase tracking-[0.08em] text-muted">
                          {a.resourceLabel ?? a.resource}
                        </p>
                      </div>
                      <span className="flex-none text-micro text-muted">
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

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-micro font-semibold text-white shadow-card-md"
        >
          <Check className="mr-1 inline-block h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function SeverityTile({
  icon,
  iconTone,
  label,
  count,
  sub,
  valueTone,
}: {
  icon: React.ReactNode;
  iconTone: 'info' | 'success' | 'warning' | 'danger';
  label: string;
  count: number;
  sub: string;
  valueTone?: 'success' | 'warning' | 'danger';
}) {
  const iconBg: Record<typeof iconTone, string> = {
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };
  const valueColor =
    valueTone === 'warning'
      ? 'text-warning'
      : valueTone === 'success'
      ? 'text-success'
      : valueTone === 'danger'
      ? 'text-danger'
      : 'text-ink';
  return (
    <li className="rounded-lg border border-line bg-card p-5 shadow-card-sm">
      <div className="flex items-center justify-between">
        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${iconBg[iconTone]}`}>
          {icon}
        </span>
      </div>
      <p className={`mt-3 text-h2 tabular-nums ${valueColor}`}>{count}</p>
      <p className="mt-1 text-micro text-muted">{sub}</p>
    </li>
  );
}

function AuditDetail({ entry }: { entry: AuditEntry }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Entry
          </p>
          <p className="mt-1 font-mono text-small text-ink">{entry.id}</p>
        </div>
        <Badge tone={SEVERITY_TONE[entry.severity]} dot>
          {entry.severity === 'ALERT' ? (
            <AlertTriangle className="mr-1 inline-block h-3 w-3" strokeWidth={2} aria-hidden />
          ) : null}
          {entry.severity.toLowerCase()}
        </Badge>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center gap-3 rounded-md bg-surface/60 px-3 py-3">
          <span
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink text-white"
            aria-hidden
          >
            <User className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-small font-semibold text-ink">{entry.actor}</p>
            <p className="text-micro uppercase tracking-[0.1em] text-muted">
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
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Summary
            </p>
            <p className="mt-1 text-small leading-relaxed text-ink">{entry.summary}</p>
          </div>
        ) : null}

        <div className="rounded-md border border-line bg-surface/40 px-3 py-2.5">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Tamper-evident hash
          </p>
          <p className="mt-0.5 break-all font-mono text-micro text-ink">
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
      <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right">
        <span
          className={[
            'font-semibold text-ink break-words',
            mono ? 'font-mono text-micro' : 'text-small',
          ].join(' ')}
        >
          {value}
        </span>
        {sub ? (
          <span className="block break-words font-mono text-micro uppercase tracking-[0.08em] text-muted">
            {sub}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function DetailPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-line bg-card p-10 text-center">
      <p className="text-small text-muted">Select an entry to inspect</p>
    </div>
  );
}
