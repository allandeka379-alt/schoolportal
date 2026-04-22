import { Reveal } from './reveal';

/**
 * Feature showcase — v2.0.
 *
 * Three alternating rows of product preview + copy. Snow surfaces, Mist
 * hairlines, accent highlights. SVG previews use the v2.0 palette.
 */
const FEATURES = [
  {
    ord: 'Feature 01',
    title: (
      <>
        Teaching,
        <br />
        <span style={{ color: 'rgb(var(--accent))' }}>unburdened.</span>
      </>
    ),
    body:
      'A marking console that understands how a teacher actually works. Annotate PDFs in the browser. Record a forty-second audio note where a written comment would feel cold. Publish a rubric-based mark and feedback in two clicks.',
    tail: 'Mrs Dziva can hand back Worksheet 5 on Sunday evening and still be home for dinner.',
    imageRight: false,
    screenshot: <TeacherScreenshot />,
    imageTitle: 'Teacher marking console',
  },
  {
    ord: 'Feature 02',
    title: (
      <>
        Learning,
        <br />
        <span style={{ color: 'rgb(var(--accent))' }}>in reach.</span>
      </>
    ),
    body:
      'One dashboard answers four questions in a glance: what is due, what is new, how am I doing, what do I owe. The library lives in the same place as the homework — because they always did.',
    tail: 'The student portal degrades gracefully on a basic Android in Gokwe; it does not demand a flagship phone to participate.',
    imageRight: true,
    screenshot: <StudentScreenshot />,
    imageTitle: 'Student dashboard',
  },
  {
    ord: 'Feature 03',
    title: (
      <>
        Paying,
        <br />
        <span style={{ color: 'rgb(var(--accent))' }}>reconciled.</span>
      </>
    ),
    body:
      'Snap the bank slip, upload it, and a six-step pipeline reads, parses, verifies, and reconciles against the school&rsquo;s bank statement. Parents see their payment reflect the same day, not the next week.',
    tail: 'EcoCash, OneMoney, InnBucks, ZIPIT, CBZ, Stanbic, ZB, Steward — the rails Zimbabwean families actually use.',
    imageRight: false,
    screenshot: <SlipScreenshot />,
    imageTitle: 'Bank-slip reconciliation',
  },
] as const;

export function FeatureShowcase() {
  return (
    <section
      id="academics"
      aria-labelledby="features-heading"
      className="border-t border-mist bg-fog py-20 md:py-28"
    >
      <div className="hha-wrap">
        <h2 id="features-heading" className="sr-only">
          Features
        </h2>
        <div className="space-y-24 md:space-y-32">
          {FEATURES.map((f) => (
            <div
              key={f.ord}
              className="grid grid-cols-1 items-center gap-10 md:gap-16 lg:grid-cols-2"
            >
              {/* Image */}
              <Reveal className={f.imageRight ? 'lg:order-2' : 'lg:order-1'}>
                <BrowserChrome title={f.imageTitle}>{f.screenshot}</BrowserChrome>
              </Reveal>

              {/* Copy */}
              <Reveal
                delayMs={120}
                className={f.imageRight ? 'lg:order-1' : 'lg:order-2'}
              >
                <div className="max-w-prose-sm">
                  <p
                    className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
                    style={{ color: 'rgb(var(--accent))' }}
                  >
                    {f.ord}
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight tracking-tight text-obsidian">
                    {f.title}
                  </h3>
                  <p className="mt-6 font-sans text-[17px] leading-relaxed text-slate">
                    {f.body}
                  </p>
                  <p className="mt-4 font-sans text-[15px] leading-relaxed text-steel">
                    {f.tail}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrowserChrome({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-md border border-mist bg-snow shadow-screenshot">
      <div className="flex items-center gap-2 border-b border-mist bg-fog px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-signal-error/40" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-warning/50" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-success/40" aria-hidden />
        </span>
        <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-steel">
          {title}
        </span>
      </div>
      <div className="aspect-[4/3] w-full bg-snow">{children}</div>
    </figure>
  );
}

/* v2.0 inline SVG previews — snow/mist/obsidian + cyan accent.
 * Zero image weight, zero CLS, respects the performance budget. */

function TeacherScreenshot() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F7F8FA" />
      {/* left column: class list */}
      <rect x="16" y="16" width="110" height="268" fill="#EDEFF3" rx="4" />
      <rect x="28" y="32" width="60" height="6" fill="#0F1115" rx="1" />
      <rect x="28" y="48" width="80" height="4" fill="#3D424B" opacity="0.45" rx="1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <circle cx="38" cy={80 + i * 30} r="6" fill="#DADDE3" />
          <rect x="52" y={74 + i * 30} width="60" height="4" fill="#0F1115" opacity="0.7" rx="1" />
          <rect x="52" y={84 + i * 30} width="40" height="3" fill="#3D424B" opacity="0.4" rx="1" />
        </g>
      ))}
      {/* right: script preview + mark field */}
      <rect x="142" y="16" width="242" height="180" fill="#FFFFFF" stroke="#DADDE3" rx="4" />
      <rect x="156" y="32" width="120" height="6" fill="#0F1115" rx="1" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x="156"
          y={50 + i * 16}
          width={220 - (i % 3) * 40}
          height="3"
          fill="#3D424B"
          opacity="0.35"
          rx="1"
        />
      ))}
      {/* annotation highlight */}
      <rect x="156" y="113" width="80" height="10" fill="#00B37E" opacity="0.25" rx="1" />
      <circle cx="360" cy="118" r="8" fill="#00B37E" />
      <path d="M357 118 L359 120 L363 116" stroke="#F7F8FA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* rubric scores */}
      <rect x="142" y="208" width="242" height="76" fill="#EDEFF3" stroke="#DADDE3" rx="4" />
      {['Clarity', 'Depth', 'Working'].map((label, i) => (
        <g key={label}>
          <rect x="156" y={222 + i * 16} width="40" height="3" fill="#0F1115" opacity="0.75" rx="1" />
          <rect x="220" y={222 + i * 16} width="100" height="4" fill="#DADDE3" rx="1" />
          <rect
            x="220"
            y={222 + i * 16}
            width={100 - i * 20}
            height="4"
            fill="#00B37E"
            rx="1"
          />
          <rect x="330" y={220 + i * 16} width="20" height="6" fill="#0F1115" opacity="0.85" rx="1" />
        </g>
      ))}
    </svg>
  );
}

function StudentScreenshot() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F7F8FA" />
      {/* greeting */}
      <rect x="20" y="20" width="140" height="8" fill="#0F1115" rx="1" />
      <rect x="20" y="34" width="100" height="4" fill="#3D424B" opacity="0.5" rx="1" />
      {/* four stats */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 93} y="54" width="85" height="64" fill="#FFFFFF" stroke="#DADDE3" rx="3" />
          <rect x={30 + i * 93} y="62" width="40" height="3" fill="#3D424B" opacity="0.6" rx="1" />
          <rect
            x={30 + i * 93}
            y="78"
            width={40 + (i % 2) * 10}
            height="12"
            fill="#0F1115"
            rx="1"
          />
          <rect x={30 + i * 93} y="96" width="55" height="3" fill="#5B5CFF" opacity="0.7" rx="1" />
        </g>
      ))}
      {/* due list */}
      <rect x="20" y="140" width="238" height="144" fill="#FFFFFF" stroke="#DADDE3" rx="3" />
      <rect x="30" y="152" width="80" height="5" fill="#0F1115" rx="1" />
      {['MATH', 'CHEM', 'HIST'].map((subj, i) => (
        <g key={subj}>
          <rect x="30" y={176 + i * 32} width="2" height="20" fill={i === 0 ? '#E11D48' : i === 1 ? '#F5A524' : '#5B5CFF'} />
          <rect x="42" y={178 + i * 32} width="120" height="4" fill="#0F1115" opacity="0.85" rx="1" />
          <rect x="42" y={188 + i * 32} width="70" height="3" fill="#3D424B" opacity="0.5" rx="1" />
          <rect x="210" y={180 + i * 32} width="34" height="6" fill="#0F1115" opacity="0.75" rx="1" />
        </g>
      ))}
      {/* streak panel */}
      <rect x="268" y="140" width="116" height="144" fill="#EDEFF3" stroke="#DADDE3" rx="3" />
      <rect x="278" y="152" width="60" height="5" fill="#5B5CFF" rx="1" />
      <rect x="278" y="170" width="34" height="14" fill="#0F1115" rx="1" />
      {/* streak cells */}
      {Array.from({ length: 21 }).map((_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        return (
          <rect
            key={i}
            x={278 + col * 16}
            y={200 + row * 12}
            width="12"
            height="8"
            rx="1"
            fill={i < 14 ? '#5B5CFF' : '#DADDE3'}
          />
        );
      })}
    </svg>
  );
}

function SlipScreenshot() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F7F8FA" />
      {/* left: slip preview */}
      <rect x="20" y="20" width="160" height="200" fill="#FFFFFF" stroke="#DADDE3" rx="3" />
      <rect x="32" y="34" width="90" height="6" fill="#0F1115" rx="1" />
      <rect x="32" y="46" width="60" height="3" fill="#3D424B" opacity="0.5" rx="1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <rect x="32" y={68 + i * 22} width="40" height="3" fill="#3D424B" opacity="0.4" rx="1" />
          <rect x="90" y={68 + i * 22} width="70" height="3" fill="#0F1115" opacity="0.8" rx="1" />
        </g>
      ))}
      <rect x="32" y="190" width="100" height="18" fill="#EDEFF3" stroke="#DADDE3" rx="1" />
      <rect x="40" y="196" width="50" height="3" fill="#0F1115" opacity="0.75" rx="1" />
      <rect x="40" y="202" width="70" height="2" fill="#3D424B" opacity="0.5" rx="1" />

      {/* right: pipeline stepper */}
      <rect x="200" y="20" width="180" height="260" fill="#EDEFF3" stroke="#DADDE3" rx="3" />
      <rect x="212" y="34" width="80" height="5" fill="#0F1115" rx="1" />
      {[
        { label: 'Enhance', done: true },
        { label: 'OCR', done: true },
        { label: 'Parse', done: true },
        { label: 'Verify', done: true },
        { label: 'Reconcile', done: false },
        { label: 'Credit', done: false },
      ].map((step, i) => (
        <g key={step.label}>
          <circle
            cx="222"
            cy={68 + i * 32}
            r="7"
            fill={step.done ? '#00B37E' : i === 4 ? '#F5A524' : '#DADDE3'}
            stroke={step.done ? '#00B37E' : '#DADDE3'}
          />
          {step.done ? (
            <path
              d={`M219 ${68 + i * 32} l2 2 l4 -4`}
              stroke="#F7F8FA"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : null}
          {i < 5 ? (
            <line
              x1="222"
              y1={76 + i * 32}
              x2="222"
              y2={92 + i * 32}
              stroke="#DADDE3"
              strokeDasharray="2 2"
            />
          ) : null}
          <rect
            x="240"
            y={65 + i * 32}
            width="90"
            height="4"
            fill="#0F1115"
            opacity={step.done || i === 4 ? '0.9' : '0.35'}
            rx="1"
          />
        </g>
      ))}
    </svg>
  );
}
