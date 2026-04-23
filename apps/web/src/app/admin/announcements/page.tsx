'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Languages,
  MessageSquare,
  Pin,
  Send,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  SCHOOL_ANNOUNCEMENTS,
  audienceLabel,
  type AnnouncementAudience,
  type SchoolAnnouncement,
} from '@/lib/mock/school';

const AUDIENCE_OPTIONS: AnnouncementAudience[] = [
  'SCHOOL',
  'FORM_1',
  'FORM_2',
  'FORM_3',
  'FORM_4',
  'STAFF',
  'PARENTS',
  'BOARDERS',
  'SAVANNA_HOUSE',
  'HERITAGE_HOUSE',
  'MSASA_HOUSE',
  'GRANITE_HOUSE',
];

const inputClass =
  'h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20';

export default function AnnouncementsAdminPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<AnnouncementAudience[]>(['SCHOOL']);
  const [urgent, setUrgent] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [requireAck, setRequireAck] = useState(false);
  const [smsFallback, setSmsFallback] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(SCHOOL_ANNOUNCEMENTS[0]!.id);

  function toggleAudience(a: AnnouncementAudience) {
    setAudience((curr) =>
      curr.includes(a) ? curr.filter((x) => x !== a) : [...curr, a],
    );
  }

  const selected =
    SCHOOL_ANNOUNCEMENTS.find((a) => a.id === selectedId) ?? SCHOOL_ANNOUNCEMENTS[0]!;

  const reachEstimate = useMemo(() => {
    if (audience.includes('SCHOOL')) return 428;
    const map: Record<AnnouncementAudience, number> = {
      SCHOOL: 428,
      FORM_1: 98,
      FORM_2: 108,
      FORM_3: 116,
      FORM_4: 78,
      FORM_3B: 28,
      STAFF: 42,
      PARENTS: 284,
      BOARDERS: 112,
      SAVANNA_HOUSE: 107,
      HERITAGE_HOUSE: 107,
      MSASA_HOUSE: 107,
      GRANITE_HOUSE: 107,
    };
    return Math.min(
      audience.reduce((sum, a) => sum + map[a], 0),
      428,
    );
  }, [audience]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-small text-muted">Communication · announcements</p>
        <h1 className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-ink">
          What the school says, openly
        </h1>
        <p className="mt-2 max-w-[78ch] text-small text-muted">
          Author · schedule · track acknowledgement. Shona and Ndebele translations are drafted for
          review before publishing. SMS fallback is available for parents who have not opened the
          portal in 7 days.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Composer + recent */}
        <div className="space-y-6 xl:col-span-2">
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">Compose</h2>
              <Badge tone="brand" dot>
                Reach · {reachEstimate.toLocaleString('en-ZW')} recipients
              </Badge>
            </header>

            <div className="space-y-5 p-5">
              <div>
                <label
                  htmlFor="ann-title"
                  className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  Title · short and specific
                </label>
                <input
                  id="ann-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-term break reminder — Monday 19 May"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="ann-body"
                  className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  Body · Markdown supported
                </label>
                <textarea
                  id="ann-body"
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the announcement. Shona and Ndebele drafts will be generated for your review before publishing."
                  className="w-full rounded-md border border-line bg-card p-3 text-small leading-relaxed text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <p className="mt-1 text-micro text-muted">
                  {body.length} chars · ~{Math.max(0, Math.ceil(body.length / 160))} SMS pages
                </p>
              </div>

              <div>
                <label className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                  Audience
                </label>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCE_OPTIONS.map((a) => {
                    const on = audience.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAudience(a)}
                        className={[
                          'inline-flex h-9 items-center rounded-full border px-3 text-micro font-semibold transition-colors',
                          on
                            ? 'border-brand-primary bg-brand-primary text-white'
                            : 'border-line bg-card text-ink hover:bg-surface',
                        ].join(' ')}
                      >
                        {audienceLabel(a)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4 text-small text-ink">
                <Toggle value={urgent} onChange={setUrgent} label="Mark as urgent" />
                <Toggle value={pinned} onChange={setPinned} label="Pin to top" />
                <Toggle value={autoTranslate} onChange={setAutoTranslate} label="Auto-translate (SN · ND)" />
                <Toggle value={requireAck} onChange={setRequireAck} label="Require acknowledgement" />
                <Toggle value={smsFallback} onChange={setSmsFallback} label="SMS fallback" />
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                >
                  <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  Publish now
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Schedule…
                </button>
                <span className="ml-auto text-micro text-muted">Preview on the right</span>
              </div>
            </div>
          </section>

          {/* Recent list */}
          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
            <header className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <h2 className="text-small font-semibold text-ink">Recent</h2>
              <p className="text-micro text-muted">
                Last 7 days · {SCHOOL_ANNOUNCEMENTS.length} items
              </p>
            </header>
            <ul className="divide-y divide-line">
              {SCHOOL_ANNOUNCEMENTS.map((a) => {
                const activeRow = selectedId === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(a.id)}
                      className={[
                        'flex w-full items-start gap-4 px-5 py-4 text-left transition-colors',
                        activeRow ? 'bg-brand-primary/[0.06]' : 'hover:bg-surface/40',
                      ].join(' ')}
                    >
                      <span
                        className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-md ${
                          a.urgent
                            ? 'bg-danger/10 text-danger'
                            : a.pinned
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'bg-info/10 text-info'
                        }`}
                      >
                        {a.urgent ? (
                          <AlertCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        ) : a.pinned ? (
                          <Pin className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        ) : (
                          <BellRing className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-small font-semibold text-ink">{a.title}</p>
                          {a.urgent ? (
                            <Badge tone="danger" dot>
                              Urgent
                            </Badge>
                          ) : null}
                          {a.pinned ? (
                            <Badge tone="brand" dot>
                              Pinned
                            </Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-small text-muted">{a.body}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-3 text-micro text-muted">
                          <span>{a.publishedBy}</span>
                          <span>·</span>
                          <span>
                            {new Date(a.publishedAt).toLocaleString('en-ZW', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>·</span>
                          <span>
                            <Users
                              className="mr-1 inline-block h-3 w-3 -translate-y-px"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                            {a.audienceSize}
                          </span>
                          {a.requiresAck && a.ackCount !== undefined ? (
                            <>
                              <span>·</span>
                              <span>
                                <CheckCircle2
                                  className="mr-1 inline-block h-3 w-3 -translate-y-px text-success"
                                  strokeWidth={1.75}
                                  aria-hidden
                                />
                                {a.ackCount}/{a.audienceSize}
                              </span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Detail */}
        <section className="xl:col-span-1">
          <AnnouncementDetail announcement={selected} />
        </section>
      </div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2">
      <span
        className={[
          'relative h-5 w-9 rounded-full border transition-colors',
          value ? 'border-brand-primary bg-brand-primary' : 'border-line bg-surface',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform',
            value ? 'translate-x-[18px]' : 'translate-x-0.5',
          ].join(' ')}
          aria-hidden
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function AnnouncementDetail({ announcement }: { announcement: SchoolAnnouncement }) {
  const ackPct =
    announcement.requiresAck && announcement.ackCount
      ? Math.round((announcement.ackCount / announcement.audienceSize) * 100)
      : null;

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-card shadow-card-sm">
      <header className="border-b border-line px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Inspect
          </p>
          {announcement.urgent ? (
            <Badge tone="danger" dot>
              Urgent
            </Badge>
          ) : null}
          {announcement.pinned ? (
            <Badge tone="brand" dot>
              Pinned
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-2 text-h3 leading-snug tracking-tight text-ink">
          {announcement.title}
        </h3>
      </header>

      <div className="space-y-4 px-5 py-5">
        <p className="text-small leading-relaxed text-ink">{announcement.body}</p>

        <div className="space-y-2">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Audience</p>
          <div className="flex flex-wrap gap-1.5">
            {announcement.audience.map((a) => (
              <Badge key={a} tone="neutral">
                {audienceLabel(a)}
              </Badge>
            ))}
          </div>
          <p className="text-micro text-muted">
            {announcement.audienceSize} recipients · {announcement.views ?? 0} opened
          </p>
        </div>

        {announcement.requiresAck && ackPct !== null ? (
          <div className="rounded-md border border-line bg-surface/40 p-3">
            <div className="flex items-center justify-between">
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Acknowledgement
              </p>
              <p className="text-small font-semibold tabular-nums text-ink">{ackPct}%</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand-primary"
                style={{ width: `${ackPct}%` }}
              />
            </div>
            <p className="mt-2 text-micro text-muted">
              {announcement.ackCount}/{announcement.audienceSize} have acknowledged
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
            Delivery channels
          </p>
          <ul className="space-y-1.5 text-small text-ink">
            <li className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
              Portal feed · always
            </li>
            <li className="flex items-center gap-2">
              <Languages className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
              {announcement.translatedTo.length > 0
                ? `Translated · ${announcement.translatedTo.join(' · ')}`
                : 'English only'}
            </li>
            <li className="flex items-center gap-2">
              <BellRing className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
              SMS fallback · {announcement.smsFallback ? 'on' : 'off'}
            </li>
          </ul>
        </div>

        <div className="border-t border-line pt-3 text-micro text-muted">
          Published by <span className="font-semibold text-ink">{announcement.publishedBy}</span> ·{' '}
          {new Date(announcement.publishedAt).toLocaleString('en-ZW', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </article>
  );
}
