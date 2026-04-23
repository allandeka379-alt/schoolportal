'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  CloudUpload,
  FileImage,
  Info,
  Loader2,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  XCircle,
} from 'lucide-react';

import { PARENT_CHILDREN, FAMILY_FEES_SUMMARY } from '@/lib/mock/parent-extras';

/**
 * Slip upload + 6-step reconciliation pipeline — live demo.
 *
 * Step 1 — Image enhancement  (deskew / despeckle / contrast)
 * Step 2 — OCR                (hybrid engine · confidence per field)
 * Step 3 — Structural parsing (bank · amount · date · reference)
 * Step 4 — Account verification (school account + parent match)
 * Step 5 — Statement reconciliation (match to bank-statement line)
 * Step 6 — Account update      (credit · receipt · parent notification)
 *
 * The pipeline runs as a client-side simulation so parents (and partners)
 * can see every step. Zero real side-effects — the demo re-arms after
 * completion and failures are deterministic (step 5 for the demo slip).
 */

type StepStatus = 'idle' | 'running' | 'done' | 'failed';

interface PipelineStep {
  id: number;
  label: string;
  detail: string;
  icon: React.ElementType;
  duration: number; // ms
}

const STEPS: PipelineStep[] = [
  {
    id: 1,
    label: 'Image enhancement',
    detail: 'Deskew · despeckle · boost contrast · straighten margins',
    icon: FileImage,
    duration: 800,
  },
  {
    id: 2,
    label: 'OCR',
    detail: 'Hybrid engine · per-field confidence',
    icon: ScanLine,
    duration: 1200,
  },
  {
    id: 3,
    label: 'Structural parsing',
    detail: 'Bank · amount · date · reference · payer',
    icon: Sparkles,
    duration: 900,
  },
  {
    id: 4,
    label: 'Account verification',
    detail: 'School account + parent identity match',
    icon: ShieldCheck,
    duration: 700,
  },
  {
    id: 5,
    label: 'Statement reconciliation',
    detail: 'Match to bank-statement line · tolerance ±0.50',
    icon: CheckCircle2,
    duration: 1400,
  },
  {
    id: 6,
    label: 'Account update',
    detail: 'Credit invoice · issue receipt · notify parent',
    icon: BadgeCheck,
    duration: 600,
  },
];

export default function SlipUploadPage() {
  const [childId, setChildId] = useState<string>(PARENT_CHILDREN[0]?.id ?? 's-farai');
  const [fileName, setFileName] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('800');
  const [bank, setBank] = useState<string>('CBZ');
  const [reference, setReference] = useState<string>('JHS/F.MOYO/T2');

  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0 = none
  const [statuses, setStatuses] = useState<Record<number, StepStatus>>({});
  const [outcome, setOutcome] = useState<'none' | 'success' | 'failed'>('none');

  // Auto-advance through the pipeline.
  useEffect(() => {
    if (!running) return;
    if (currentStep < 1) return;
    if (currentStep > STEPS.length) return;

    const step = STEPS[currentStep - 1]!;
    setStatuses((prev) => ({ ...prev, [step.id]: 'running' }));

    const timer = setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [step.id]: 'done' }));
      if (currentStep === STEPS.length) {
        setRunning(false);
        setOutcome('success');
      } else {
        setCurrentStep((n) => n + 1);
      }
    }, step.duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, running]);

  function start() {
    setStatuses({});
    setOutcome('none');
    setCurrentStep(1);
    setRunning(true);
  }

  function reset() {
    setStatuses({});
    setOutcome('none');
    setCurrentStep(0);
    setRunning(false);
    setFileName(null);
  }

  function simulateFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  }

  function simulateDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  }

  const child = useMemo(
    () => PARENT_CHILDREN.find((c) => c.id === childId) ?? PARENT_CHILDREN[0]!,
    [childId],
  );

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/parent/fees"
          className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate hover:text-obsidian"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          Back to fees
        </Link>
        <p
          className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'rgb(var(--accent))' }}
        >
          Fees · Upload bank slip
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium tracking-tight text-obsidian">
          Snap it. Upload. Done.
        </h1>
        <p className="mt-2 max-w-[78ch] font-sans text-[14px] text-slate">
          Upload a photograph or scan of your deposit slip. Our pipeline reads, parses, verifies
          and reconciles it against the school&rsquo;s bank statement. Most slips settle within 2
          hours — you will see a receipt here the moment they do.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Upload + form */}
        <section className="xl:col-span-2 space-y-5">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">1. Upload slip</p>
            </div>
            <div className="p-5">
              <label
                htmlFor="slip-file"
                onDragOver={(e) => e.preventDefault()}
                onDrop={simulateDrop}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-mist bg-fog/50 px-4 py-10 text-center transition-colors hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/5"
              >
                <CloudUpload
                  className="h-10 w-10 text-steel"
                  strokeWidth={1.25}
                  aria-hidden
                />
                {fileName ? (
                  <div>
                    <p className="font-sans text-[14px] font-medium text-obsidian">{fileName}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                      Ready for pipeline
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-sans text-[14px] font-medium text-obsidian">
                      Drop a slip here, or tap to select
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                      PDF · JPG · PNG · HEIC · up to 10 MB
                    </p>
                  </div>
                )}
                <input
                  id="slip-file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={simulateFile}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">2. Slip details</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                Will auto-fill from OCR · check before submitting
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="slip-child"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                >
                  Credit to child
                </label>
                <select
                  id="slip-child"
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  className="input-boxed"
                >
                  {PARENT_CHILDREN.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} · {c.form}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="slip-bank"
                    className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                  >
                    Bank
                  </label>
                  <select
                    id="slip-bank"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="input-boxed"
                  >
                    <option>CBZ</option>
                    <option>Stanbic</option>
                    <option>ZB</option>
                    <option>Steward</option>
                    <option>NMB</option>
                    <option>FBC</option>
                    <option>Ecobank</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="slip-amount"
                    className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                  >
                    Amount · USD
                  </label>
                  <input
                    id="slip-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-boxed"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="slip-ref"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate"
                >
                  Your reference
                </label>
                <input
                  id="slip-ref"
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="JHS / STUDENT-SHORTNAME / TERM"
                  className="input-boxed"
                />
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                  Helps the pipeline match your slip the first time
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-mist pt-4">
                <button
                  type="button"
                  onClick={start}
                  disabled={!fileName || running || outcome === 'success'}
                  className={[
                    'btn-primary',
                    !fileName || running || outcome === 'success' ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  {running ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden />
                      Running
                    </>
                  ) : outcome === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      Reconciled
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      Submit slip
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-mist bg-snow px-3 font-sans text-[13px] font-medium text-slate hover:bg-fog"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-md border border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/5 p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 flex-none text-[rgb(var(--accent-hover))]" strokeWidth={1.5} aria-hidden />
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[rgb(var(--accent-hover))]">
                  Why it works
                </p>
                <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate">
                  We never just accept a slip at face value — the pipeline verifies the deposit
                  really landed in the school&rsquo;s account by matching it to the daily bank
                  statement line. This removes the &ldquo;slip in a drawer&rdquo; problem and speeds up your
                  receipt by days.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* Pipeline */}
        <section className="xl:col-span-3 space-y-5">
          <div className="overflow-hidden rounded-md border border-mist bg-snow">
            <div className="flex items-center justify-between border-b border-mist px-5 py-3">
              <p className="font-sans text-[13px] font-medium text-obsidian">Reconciliation pipeline</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
                {outcome === 'success' ? 'Completed' : running ? 'Running…' : 'Idle'}
              </p>
            </div>
            <ol className="relative">
              {STEPS.map((step, i) => {
                const status: StepStatus = statuses[step.id] ?? 'idle';
                const Icon = step.icon;
                return (
                  <li key={step.id} className="border-b border-mist last:border-b-0">
                    <div className="flex items-start gap-4 px-5 py-4">
                      <div
                        className={[
                          'flex h-10 w-10 flex-none items-center justify-center rounded-full border transition-colors',
                          status === 'running'
                            ? 'border-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10'
                            : status === 'done'
                            ? 'border-signal-success bg-signal-success/10'
                            : status === 'failed'
                            ? 'border-signal-error bg-signal-error/10'
                            : 'border-mist bg-fog',
                        ].join(' ')}
                      >
                        {status === 'running' ? (
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            strokeWidth={1.5}
                            style={{ color: 'rgb(var(--accent))' }}
                            aria-hidden
                          />
                        ) : status === 'done' ? (
                          <CheckCircle2 className="h-4 w-4 text-signal-success" strokeWidth={1.5} aria-hidden />
                        ) : status === 'failed' ? (
                          <XCircle className="h-4 w-4 text-signal-error" strokeWidth={1.5} aria-hidden />
                        ) : (
                          <Icon className="h-4 w-4 text-steel" strokeWidth={1.5} aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-sans text-[13px] font-medium text-obsidian">
                            Step {i + 1} · {step.label}
                          </p>
                          {status === 'running' ? (
                            <span className="rounded-sm bg-[rgb(var(--accent))]/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[rgb(var(--accent-hover))]">
                              running
                            </span>
                          ) : status === 'done' ? (
                            <span className="rounded-sm bg-signal-success/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-signal-success">
                              done
                            </span>
                          ) : status === 'failed' ? (
                            <span className="rounded-sm bg-signal-error/10 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-signal-error">
                              failed
                            </span>
                          ) : (
                            <span className="rounded-sm bg-fog px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-steel">
                              pending
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-sans text-[12px] text-slate">{step.detail}</p>
                        {status === 'done' ? (
                          <StepOutput step={step.id} bank={bank} amount={amount} reference={reference} child={child.firstName} />
                        ) : null}
                      </div>
                      <span className="flex-none font-mono text-[11px] uppercase tracking-[0.08em] text-steel">
                        {step.duration}ms
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Outcome */}
          {outcome === 'success' ? <OutcomeCard bank={bank} amount={amount} reference={reference} child={child} /> : null}
        </section>
      </div>
    </div>
  );
}

function StepOutput({
  step,
  bank,
  amount,
  reference,
  child,
}: {
  step: number;
  bank: string;
  amount: string;
  reference: string;
  child: string;
}) {
  const tiny = 'font-mono text-[11px] text-steel';
  switch (step) {
    case 1:
      return (
        <p className={`mt-2 ${tiny}`}>
          Deskew −1.4° · despeckle 92 px · contrast +18% · DPI 200 → 300
        </p>
      );
    case 2:
      return (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-md bg-fog/60 p-2 font-mono text-[11px] text-slate">
          <Field k="bank" v={bank} c={0.98} />
          <Field k="amount" v={`USD ${amount}.00`} c={0.96} />
          <Field k="date" v="22 Apr 2026" c={0.99} />
          <Field k="ref" v={reference} c={0.91} />
        </div>
      );
    case 3:
      return <p className={`mt-2 ${tiny}`}>Schema match · bank-deposit · no missing fields</p>;
    case 4:
      return (
        <p className={`mt-2 ${tiny}`}>
          Account 01234567890 · JHS · {bank} ✓ &nbsp;·&nbsp; payer matches parent on file ✓
        </p>
      );
    case 5:
      return (
        <p className={`mt-2 ${tiny}`}>
          Matched to statement line 142 · ref hash 0xA4F7 · confidence 0.98
        </p>
      );
    case 6:
      return (
        <p className={`mt-2 ${tiny}`}>
          Credited invoice INV-2026-T2-{child.toUpperCase()} · receipt RCT-20260423-A4F7 issued
        </p>
      );
    default:
      return null;
  }
}

function Field({ k, v, c }: { k: string; v: string; c: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="uppercase tracking-[0.12em] text-steel">{k}</span>
      <span className="truncate text-obsidian">{v}</span>
      <span className="ml-auto tabular-nums text-signal-success">{(c * 100).toFixed(0)}%</span>
    </div>
  );
}

function OutcomeCard({
  bank,
  amount,
  reference,
  child,
}: {
  bank: string;
  amount: string;
  reference: string;
  child: { firstName: string; lastName: string; form: string };
}) {
  return (
    <article className="overflow-hidden rounded-md border border-signal-success/40 bg-signal-success/5">
      <div className="flex items-center gap-3 border-b border-signal-success/30 px-5 py-3">
        <CheckCircle2 className="h-5 w-5 text-signal-success" strokeWidth={1.5} aria-hidden />
        <div>
          <p className="font-sans text-[14px] font-medium text-obsidian">Receipt issued</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-steel">
            RCT-20260423-A4F7 · reconciled
          </p>
        </div>
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-signal-success">
          <Clock className="mr-1 inline-block h-3 w-3 -translate-y-px" strokeWidth={1.5} aria-hidden />
          5.6 sec
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 px-5 py-5 text-sm sm:grid-cols-4">
        <Kv k="Child" v={`${child.firstName} ${child.lastName}`} sub={child.form} />
        <Kv k="Bank" v={bank} sub="Same-day rail" />
        <Kv k="Amount" v={`USD ${amount}.00`} sub="Credited to invoice" />
        <Kv k="Reference" v={reference} mono />
      </div>
      <div className="border-t border-signal-success/30 bg-snow px-5 py-3">
        <p className="font-sans text-[13px] text-slate">
          A PDF receipt has been emailed to you and filed in the fees ledger. Both portals — yours
          and the bursar&rsquo;s — now show the balance updated.
        </p>
      </div>
    </article>
  );
}

function Kv({ k, v, sub, mono }: { k: string; v: string; sub?: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{k}</p>
      <p
        className={[
          'mt-1 font-medium text-obsidian',
          mono ? 'font-mono text-[13px]' : 'font-sans text-[14px]',
        ].join(' ')}
      >
        {v}
      </p>
      {sub ? <p className="mt-0.5 font-mono text-[11px] text-steel">{sub}</p> : null}
    </div>
  );
}
