import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Clock, FileText, MessageSquarePlus, Paperclip } from 'lucide-react';

import { ASSIGNMENTS_FOR_FARAI } from '@/lib/mock/fixtures';
import { ASSIGNMENT_DETAILS, dueLabel, subjectNameByCode } from '@/lib/mock/student-extras';

import { EditorialCard, SectionEyebrow, StatusPill } from '@/components/student/primitives';
import { SubmissionPanel } from '@/components/student/submission-panel';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Assignment detail — §07 of the spec.
 *
 * Two columns:
 *   - Left (64%): title, meta, instructions, attachments, rubric
 *   - Right (36%): sticky submission panel (drag-drop, upload queue, submit)
 *
 * A live countdown appears when < 24h remain.
 */
export default async function AssignmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const a = ASSIGNMENT_DETAILS[id] ?? ASSIGNMENTS_FOR_FARAI.find((x) => x.id === id);
  if (!a) notFound();

  const detail = ASSIGNMENT_DETAILS[id];
  const due = dueLabel(a.dueAt);
  const dueDate = new Date(a.dueAt);

  const hoursRemaining = Math.max(
    0,
    Math.floor((dueDate.getTime() - Date.now()) / (1000 * 60 * 60)),
  );
  const showCountdown = hoursRemaining > 0 && hoursRemaining < 24;

  const pill =
    a.status === 'RETURNED'
      ? 'marked'
      : a.status === 'SUBMITTED'
      ? 'submitted'
      : a.status === 'LATE'
      ? 'overdue'
      : 'pending';

  return (
    <div className="space-y-8">
      <Link
        href="/student/assignments"
        className="inline-flex items-center gap-1.5 font-sans text-[13px] text-stone hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        Back to assignments
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column — brief */}
        <article className="lg:col-span-8">
          <SectionEyebrow>
            {subjectNameByCode(a.subjectCode).toUpperCase()}
          </SectionEyebrow>

          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
            {a.title.split(' — ')[0]}
            {a.title.includes(' — ') ? (
              <>
                {' — '}
                <span className="italic font-light text-terracotta">
                  {a.title.split(' — ').slice(1).join(' — ')}
                </span>
              </>
            ) : null}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[14px] text-stone">
            <span>
              Set by <span className="text-ink">{a.teacher}</span>
            </span>
            <span className="text-sand">·</span>
            <span>
              Due{' '}
              <span className="text-ink">
                {dueDate.toLocaleDateString('en-ZW', { day: 'numeric', month: 'long' })}
                {' at '}
                {dueDate.toLocaleTimeString('en-ZW', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </span>
            <span className="text-sand">·</span>
            <span>
              Max <span className="text-ink">{a.maxMarks}</span> marks
            </span>
            <StatusPill state={pill} />
          </div>

          {showCountdown ? (
            <div className="mt-5 inline-flex items-center gap-2 rounded border border-[#F3D4D1] bg-[#FDF2F1] px-4 py-2 font-sans text-[13px] text-danger">
              <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              <span>
                <span className="font-semibold">Due in {hoursRemaining} hours</span> — submit early if
                you can.
              </span>
            </div>
          ) : null}

          <div className="mt-10 border-t border-sand pt-8">
            <SectionEyebrow>Instructions</SectionEyebrow>
            <div className="mt-4 space-y-4">
              {(detail?.body ?? a.instructions).split('\n').map((line, i) => (
                <p key={i} className="font-serif text-body-lg text-ink/90">
                  {line || <br />}
                </p>
              ))}
            </div>
          </div>

          {a.attachments.length > 0 ? (
            <div className="mt-10 border-t border-sand pt-8">
              <SectionEyebrow>Attached readings</SectionEyebrow>
              <ul className="mt-4 space-y-2">
                {a.attachments.map((att) => (
                  <li key={att.name}>
                    <a
                      href="#"
                      className="group flex items-center gap-4 rounded border border-sand bg-white px-4 py-3 transition-colors hover:bg-sand-light/40"
                    >
                      <FileText className="h-5 w-5 flex-none text-earth" strokeWidth={1.5} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block font-sans text-[14px] font-medium text-ink">
                          {att.name}
                        </span>
                        <span className="block font-sans text-[12px] text-stone">{att.size}</span>
                      </span>
                      <span className="font-sans text-[13px] text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {detail && detail.rubric.length > 0 ? (
            <div className="mt-10 border-t border-sand pt-8">
              <SectionEyebrow>Rubric</SectionEyebrow>
              <EditorialCard className="mt-4 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sand-light/50">
                      <th className="px-4 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        Criterion
                      </th>
                      <th className="px-4 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        Descriptor
                      </th>
                      <th className="px-4 py-3 text-right font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                        Max
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.rubric.map((r) => (
                      <tr key={r.criterion} className="border-t border-sand-light">
                        <td className="px-4 py-3 font-sans text-[14px] font-medium text-ink">
                          {r.criterion}
                        </td>
                        <td className="px-4 py-3 font-serif text-[14px] text-stone">
                          {r.descriptor}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-[14px] tabular-nums text-ink">
                          {r.maxPoints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </EditorialCard>
            </div>
          ) : null}

          {a.status === 'RETURNED' && a.feedback ? (
            <div className="mt-10 border-t border-sand pt-8">
              <SectionEyebrow>Teacher&rsquo;s feedback</SectionEyebrow>
              <div className="mt-4 rounded border border-sand bg-sand-light/50 p-6">
                <blockquote className="font-display text-[20px] italic text-ink">
                  &ldquo;{a.feedback}&rdquo;
                </blockquote>
                <p className="mt-4 flex items-center gap-2 font-sans text-[13px] text-stone">
                  <span className="h-1 w-6 rounded-full bg-terracotta" aria-hidden />
                  {a.teacher}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-display text-[36px] tabular-nums text-ink">
                  {a.markAwarded}
                </span>
                <span className="font-sans text-[15px] text-stone">
                  out of {a.maxMarks} —{' '}
                  {a.markAwarded !== undefined
                    ? `${Math.round(((a.markAwarded ?? 0) / a.maxMarks) * 100)}%`
                    : ''}
                </span>
                <Link href="#" className="ml-auto landing-link font-sans text-[13px] font-medium text-terracotta">
                  <MessageSquarePlus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                  Ask a follow-up
                </Link>
              </div>
            </div>
          ) : null}
        </article>

        {/* Right column — submission panel */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <SubmissionPanel
              assignmentId={a.id}
              status={a.status}
              dueAtIso={a.dueAt}
              submittedAtIso={a.submittedAt}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
