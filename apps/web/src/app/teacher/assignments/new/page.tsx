'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Bold,
  CalendarClock,
  FileText,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Plus,
  Sigma,
  Upload,
} from 'lucide-react';

import { EditorialCard, SectionEyebrow } from '@/components/student/primitives';
import { ClassChip, TeacherStatusPill } from '@/components/teacher/primitives';
import { TEACHER_CLASSES, classLabel } from '@/lib/mock/teacher-extras';

/**
 * Assignment authoring workspace — §07.
 *
 *   - Left (2/3): title + rich-text brief + attachments
 *   - Right (1/3): settings panel (assign to, release timing, max marks, rubric, late policy, formats)
 *   - Auto-save status indicator in the header
 */
export default function NewAssignmentPage() {
  const [title, setTitle] = useState('Untitled assignment');
  const [selectedClass, setSelectedClass] = useState(TEACHER_CLASSES[0]);
  const [release, setRelease] = useState<'now' | 'scheduled' | 'draft'>('now');
  const [rubric, setRubric] = useState<{ name: string; max: string }[]>([
    { name: 'Method', max: '16' },
    { name: 'Accuracy', max: '16' },
    { name: 'Presentation', max: '8' },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/assignments"
            className="inline-flex h-9 w-9 items-center justify-center rounded text-stone transition-colors hover:bg-sand-light hover:text-ink"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-earth">
              New assignment
            </p>
            <p className="mt-0.5 font-sans text-[12px] text-stone">
              Auto-saved 10s ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TeacherStatusPill state="draft" />
          <button
            type="button"
            className="inline-flex h-10 items-center rounded border border-sand bg-white px-4 font-sans text-[13px] font-medium text-earth hover:bg-sand-light"
          >
            Save as draft
          </button>
          <button type="button" className="btn-terracotta">
            Release
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left — content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assignment title"
            className="w-full border-0 border-b border-transparent bg-transparent py-2 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight text-ink placeholder-stone/60 focus:border-terracotta focus:outline-none"
          />

          {/* Rich-text toolbar */}
          <EditorialCard className="overflow-hidden">
            <div className="flex items-center gap-1 border-b border-sand bg-sand-light/40 px-2 py-1.5">
              <ToolbarButton icon={Bold} label="Bold" />
              <ToolbarButton icon={Italic} label="Italic" />
              <span className="h-5 w-px bg-sand" aria-hidden />
              <ToolbarButton icon={List} label="List" />
              <ToolbarButton icon={Link2} label="Link" />
              <ToolbarButton icon={Sigma} label="Formula" />
              <ToolbarButton icon={ImageIcon} label="Image" />
            </div>
            <textarea
              rows={10}
              placeholder="Write the brief. Students will see formatting exactly as you enter it."
              defaultValue={`Complete questions 1–12 on page 84. Show every step of your working.\n\nFor each quadratic:\n  • Identify the coefficients a, b and c.\n  • Decide whether to factor, complete the square, or use the quadratic formula — and state your choice.\n  • Solve for x, giving both roots.\n\nUpload a clear scan or photograph. Hand-written is preferred.`}
              className="w-full border-0 bg-white px-6 py-4 font-serif text-[16px] leading-relaxed text-ink placeholder-stone focus:outline-none"
            />
          </EditorialCard>

          {/* Attachments */}
          <section>
            <SectionEyebrow>Attached readings</SectionEyebrow>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-3 rounded border border-sand bg-white px-4 py-3">
                <FileText className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
                <span className="flex-1 font-sans text-[13px] text-ink">
                  Chapter 4 — Functions.pdf
                </span>
                <span className="font-sans text-[12px] text-stone">1.1 MB</span>
              </li>
              <li className="flex items-center gap-3 rounded border border-sand bg-white px-4 py-3">
                <FileText className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
                <span className="flex-1 font-sans text-[13px] text-ink">
                  Worked Examples.pdf
                </span>
                <span className="font-sans text-[12px] text-stone">640 KB</span>
              </li>
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded border border-dashed border-stone/40 bg-cream px-4 py-2 font-sans text-[13px] font-medium text-earth transition-colors hover:border-terracotta hover:bg-sand-light/40"
            >
              <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Add attachment
            </button>
          </section>
        </div>

        {/* Right — settings */}
        <aside className="space-y-5 lg:col-span-4">
          <SettingsGroup label="Assign to">
            <div className="flex flex-wrap items-center gap-2">
              {selectedClass ? (
                <ClassChip
                  form={selectedClass.form}
                  stream={selectedClass.stream}
                  subjectName={selectedClass.subjectName}
                  subjectTone={selectedClass.subjectTone}
                />
              ) : null}
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded border border-dashed border-sand bg-white px-3 font-sans text-[12px] font-medium text-stone hover:border-terracotta hover:text-earth"
              >
                <Plus className="h-3 w-3" strokeWidth={1.5} aria-hidden />
                Add class
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {TEACHER_CLASSES.slice(1, 4).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 font-sans text-[12px] text-stone hover:bg-sand-light/60 hover:text-ink"
                  >
                    {classLabel(c)}
                    <span className="text-[11px]">+ add</span>
                  </button>
                </li>
              ))}
            </ul>
          </SettingsGroup>

          <SettingsGroup label="Release">
            <div role="radiogroup" className="space-y-1">
              {(
                [
                  { key: 'now', label: 'Release now' },
                  { key: 'scheduled', label: 'Schedule' },
                  { key: 'draft', label: 'Keep as draft' },
                ] as const
              ).map((o) => (
                <label
                  key={o.key}
                  className={[
                    'flex cursor-pointer items-center gap-2 rounded border px-3 py-2 font-sans text-[13px] transition-colors',
                    release === o.key
                      ? 'border-terracotta bg-sand-light/70 text-ink'
                      : 'border-sand bg-white text-stone hover:bg-sand-light/40',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="release"
                    checked={release === o.key}
                    onChange={() => setRelease(o.key)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={[
                      'h-3 w-3 flex-none rounded-full border',
                      release === o.key ? 'border-terracotta bg-terracotta' : 'border-stone',
                    ].join(' ')}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </SettingsGroup>

          <SettingsGroup label="Due date &amp; time">
            <div className="flex items-center gap-2 rounded border border-sand bg-white px-3 py-2 font-sans text-[13px] text-ink">
              <CalendarClock className="h-4 w-4 text-earth" strokeWidth={1.5} aria-hidden />
              26 April · 23:59
            </div>
          </SettingsGroup>

          <SettingsGroup label="Maximum marks">
            <input
              type="number"
              defaultValue={100}
              className="h-10 w-full rounded border border-sand bg-white px-3 font-mono text-[14px] text-ink focus:border-terracotta focus:outline-none"
            />
          </SettingsGroup>

          <SettingsGroup label="Rubric">
            <ul className="space-y-2">
              {rubric.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    value={r.name}
                    onChange={(e) =>
                      setRubric((prev) =>
                        prev.map((row, j) => (j === i ? { ...row, name: e.target.value } : row)),
                      )
                    }
                    className="h-9 flex-1 rounded border border-sand bg-white px-2 font-sans text-[13px] text-ink focus:border-terracotta focus:outline-none"
                  />
                  <input
                    value={r.max}
                    onChange={(e) =>
                      setRubric((prev) =>
                        prev.map((row, j) => (j === i ? { ...row, max: e.target.value } : row)),
                      )
                    }
                    className="h-9 w-16 rounded border border-sand bg-white px-2 font-mono text-[13px] text-ink focus:border-terracotta focus:outline-none"
                  />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setRubric((prev) => [...prev, { name: '', max: '10' }])}
              className="mt-2 inline-flex items-center gap-1 font-sans text-[12px] font-medium text-terracotta hover:underline"
            >
              <Plus className="h-3 w-3" strokeWidth={1.5} />
              Add criterion
            </button>
          </SettingsGroup>

          <SettingsGroup label="Late policy">
            <select
              defaultValue="penalise"
              className="h-10 w-full rounded border border-sand bg-white px-3 font-sans text-[13px] text-ink focus:border-terracotta focus:outline-none"
            >
              <option value="reject">Reject after deadline</option>
              <option value="no-penalty">Accept without penalty</option>
              <option value="penalise">Accept with penalty per day</option>
            </select>
          </SettingsGroup>

          <SettingsGroup label="Submission formats">
            <div className="flex flex-wrap gap-1.5">
              {['PDF', 'DOC', 'Image', 'Audio', 'Video', 'Text'].map((fmt, i) => (
                <label
                  key={fmt}
                  className={[
                    'inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    i < 3
                      ? 'border-terracotta bg-terracotta/10 text-terracotta-hover'
                      : 'border-sand bg-white text-stone hover:border-earth',
                  ].join(' ')}
                >
                  <input type="checkbox" defaultChecked={i < 3} className="sr-only" />
                  {fmt}
                </label>
              ))}
            </div>
          </SettingsGroup>
        </aside>
      </div>
    </div>
  );
}

function SettingsGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {children}
    </div>
  );
}

function ToolbarButton({ icon: Icon, label }: { icon: typeof Bold; label: string }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded text-stone transition-colors hover:bg-sand hover:text-ink"
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
