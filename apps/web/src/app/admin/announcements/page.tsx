'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  Languages,
  MessageSquare,
  Pin,
  Plus,
  Send,
  Users,
} from 'lucide-react';

import {
  SCHOOL_ANNOUNCEMENTS,
  audienceLabel,
  type AnnouncementAudience,
  type SchoolAnnouncement,
} from '@/lib/mock/school';

/**
 * Announcements — Admin.
 *
 *  - Composer with audience picker, pin/urgent toggles, SMS fallback
 *  - Recent announcements with acknowledgement & view stats
 *  - Click a row to inspect details (audience, translations, ack list)
 */

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
    // Rough sum — audience can overlap so cap at 428 (school population).
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
    <div className="space-y-6">
      <header>
        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Communication · Announcements
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
          What the school says, openly.
        </h1>
        <p className="mt-2 max-w-[78ch] font-sans text-[14px] text-slate">
          Author · schedule · track acknowledgement. Shona and Ndebele translations are drafted for
          review before publishing. SMS fallback is available for parents who have not opened the
          portal in 7 days.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Composer */}
        <section className="xl:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">Compose</p>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Reach · {reachEstimate.toLocaleString('en-ZW')} recipients
              </span>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label
                  htmlFor="ann-title"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                >
                  Title · short and specific
                </label>
                <input
                  id="ann-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-term break reminder — Monday 19 May"
                  className="input-boxed"
                />
              </div>

              <div>
                <label
                  htmlFor="ann-body"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                >
                  Body · Markdown supported
                </label>
                <textarea
                  id="ann-body"
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the announcement. Shona and Ndebele drafts will be generated for your review before publishing."
                  className="w-full rounded-md border border-mist bg-snow p-3 font-sans text-[14px] text-obsidian placeholder-steel focus:outline-none"
                />
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                  {body.length} chars · ~{Math.max(0, Math.ceil(body.length / 160))} SMS pages
                </p>
              </div>

              <div>
                <label className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate">
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
                          'inline-flex h-8 items-center rounded-sm border px-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors',
                          on
                            ? 'border-obsidian bg-obsidian text-snow'
                            : 'border-mist bg-snow text-slate hover:bg-fog',
                        ].join(' ')}
                      >
                        {audienceLabel(a)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-mist pt-4 font-sans text-[13px] text-slate">
                <Toggle value={urgent} onChange={setUrgent} label="Mark as urgent" />
                <Toggle value={pinned} onChange={setPinned} label="Pin to top" />
                <Toggle value={autoTranslate} onChange={setAutoTranslate} label="Auto-translate (SN · ND)" />
                <Toggle value={requireAck} onChange={setRequireAck} label="Require acknowledgement" />
                <Toggle value={smsFallback} onChange={setSmsFallback} label="SMS fallback" />
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-mist pt-4">
                <button type="button" className="btn-primary">
                  <Send className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  Publish now
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
                >
                  Schedule…
                </button>
                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                  Preview below
                </span>
              </div>
            </div>
          </div>

          {/* Recent list */}
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">Recent</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Last 7 days · {SCHOOL_ANNOUNCEMENTS.length} items
              </p>
            </div>
            <ul className="divide-y divide-mist">
              {SCHOOL_ANNOUNCEMENTS.map((a) => {
                const active = selectedId === a.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(a.id)}
                      className={[
                        'flex w-full items-start gap-4 px-5 py-4 text-left transition-colors',
                        active ? 'bg-fog' : 'hover:bg-fog/60',
                      ].join(' ')}
                    >
                      <div className="flex-none text-center">
                        {a.urgent ? (
                          <AlertCircle className="mx-auto h-4 w-4 text-signal-error" strokeWidth={1.5} aria-hidden />
                        ) : a.pinned ? (
                          <Pin className="mx-auto h-4 w-4 text-slate" strokeWidth={1.5} aria-hidden />
                        ) : (
                          <BellRing className="mx-auto h-4 w-4 text-steel" strokeWidth={1.5} aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-sans text-[14px] font-medium text-obsidian">
                            {a.title}
                          </p>
                          {a.urgent ? (
                            <span className="rounded-sm bg-signal-error/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-signal-error">
                              urgent
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 font-sans text-[12px] text-slate">
                          {a.body}
                        </p>
                        <p className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
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
                            <Users className="mr-1 inline-block h-3 w-3 -translate-y-px" strokeWidth={1.5} aria-hidden />
                            {a.audienceSize}
                          </span>
                          {a.requiresAck && a.ackCount !== undefined ? (
                            <>
                              <span>·</span>
                              <span>
                                <CheckCircle2 className="mr-1 inline-block h-3 w-3 -translate-y-px" strokeWidth={1.5} aria-hidden />
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
          </div>
        </section>

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
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        className={[
          'relative h-5 w-9 rounded-full border transition-colors',
          value ? 'border-obsidian bg-obsidian' : 'border-mist bg-fog',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-snow transition-transform',
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
  const ackPct = announcement.requiresAck && announcement.ackCount
    ? Math.round((announcement.ackCount / announcement.audienceSize) * 100)
    : null;

  return (
    <article className="overflow-hidden rounded-md border border-mist bg-snow">
      <div className="border-b border-mist px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]"
            style={{ color: 'rgb(var(--accent))' }}
          >
            Inspect
          </span>
          {announcement.urgent ? (
            <span className="rounded-sm bg-signal-error/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-signal-error">
              urgent
            </span>
          ) : null}
          {announcement.pinned ? (
            <span className="rounded-sm bg-fog px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-slate">
              pinned
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-display text-[17px] font-medium leading-snug tracking-tight text-obsidian">
          {announcement.title}
        </h3>
      </div>

      <div className="px-5 py-5 space-y-4">
        <p className="font-sans text-[13px] leading-relaxed text-slate">{announcement.body}</p>

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">Audience</p>
          <div className="flex flex-wrap gap-1.5">
            {announcement.audience.map((a) => (
              <span
                key={a}
                className="inline-flex items-center rounded-sm bg-fog px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-slate"
              >
                {audienceLabel(a)}
              </span>
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
            {announcement.audienceSize} recipients · {announcement.views ?? 0} opened
          </p>
        </div>

        {announcement.requiresAck && ackPct !== null ? (
          <div className="rounded-md border border-mist bg-fog/50 p-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel">
                Acknowledgement
              </p>
              <p className="font-mono text-[11px] tabular-nums text-obsidian">{ackPct}%</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${ackPct}%`,
                  backgroundColor: 'rgb(var(--accent))',
                }}
              />
            </div>
            <p className="mt-2 font-sans text-[12px] text-steel">
              {announcement.ackCount}/{announcement.audienceSize} have acknowledged
            </p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
            Delivery channels
          </p>
          <ul className="space-y-1 font-sans text-[12px] text-slate">
            <li className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-slate" strokeWidth={1.5} aria-hidden />
              Portal feed · always
            </li>
            <li className="flex items-center gap-2">
              <Languages className="h-3.5 w-3.5 text-slate" strokeWidth={1.5} aria-hidden />
              {announcement.translatedTo.length > 0
                ? `Translated · ${announcement.translatedTo.join(' · ')}`
                : 'English only'}
            </li>
            <li className="flex items-center gap-2">
              <BellRing className="h-3.5 w-3.5 text-slate" strokeWidth={1.5} aria-hidden />
              SMS fallback · {announcement.smsFallback ? 'on' : 'off'}
            </li>
          </ul>
        </div>

        <div className="border-t border-mist pt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
          Published by{' '}
          <span className="text-obsidian">{announcement.publishedBy}</span> ·{' '}
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
