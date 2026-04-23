'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  Lock,
  Smartphone,
  Upload,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

type MethodKey =
  | 'ecocash'
  | 'onemoney'
  | 'innbucks'
  | 'zipit'
  | 'bank'
  | 'card'
  | 'upload';

interface MethodDef {
  key: MethodKey;
  name: string;
  icon: React.ElementType;
  settle: string;
  tone: 'brand' | 'success' | 'info' | 'warning' | 'gold';
  kind: 'mobile' | 'bank' | 'card' | 'upload';
}

const METHODS: MethodDef[] = [
  { key: 'ecocash', name: 'EcoCash', icon: Smartphone, settle: 'Real-time', tone: 'success', kind: 'mobile' },
  { key: 'onemoney', name: 'OneMoney', icon: Smartphone, settle: 'Real-time', tone: 'info', kind: 'mobile' },
  { key: 'innbucks', name: 'InnBucks', icon: Smartphone, settle: 'Real-time', tone: 'warning', kind: 'mobile' },
  { key: 'zipit', name: 'ZIPIT', icon: Banknote, settle: 'Instant', tone: 'brand', kind: 'bank' },
  { key: 'bank', name: 'CBZ / Stanbic / ZB', icon: Banknote, settle: 'Same-day', tone: 'info', kind: 'bank' },
  { key: 'card', name: 'Visa / Mastercard', icon: CreditCard, settle: 'Real-time', tone: 'gold', kind: 'card' },
  { key: 'upload', name: 'Upload bank slip', icon: Upload, settle: 'Reconciled', tone: 'brand', kind: 'upload' },
];

const TONE_STYLES: Record<MethodDef['tone'], string> = {
  brand: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
  warning: 'bg-warning/10 text-warning',
  gold: 'bg-brand-accent/15 text-brand-accent',
};

export interface PaymentFlowProps {
  open: boolean;
  onClose: () => void;
  /** Pre-fill amount (string or number). */
  amount?: string | number;
  /** Display label for what is being paid. e.g. "Tanaka Moyo · Term 2 balance". */
  label?: string;
  /** Optional currency. Defaults to USD. */
  currency?: string;
  /** Fires when the payment pipeline completes with a receipt id. */
  onComplete?: (detail: { method: MethodKey; amount: string; reference: string }) => void;
}

export function PaymentFlowModal({
  open,
  onClose,
  amount = '',
  label = 'Harare Heritage Academy · school fees',
  currency = 'USD',
  onComplete,
}: PaymentFlowProps) {
  const [step, setStep] = useState<'pick' | 'form' | 'processing' | 'success'>('pick');
  const [method, setMethod] = useState<MethodDef | null>(null);
  const [amt, setAmt] = useState(String(amount || ''));
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset on close after the exit animation could play (immediate is fine for now)
      const t = setTimeout(() => {
        setStep('pick');
        setMethod(null);
        setReceipt(null);
        setPhone('');
        setPin('');
        setBankRef('');
        setCardNo('');
        setCardExp('');
        setCardCvv('');
        setCardName('');
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    setAmt(String(amount || ''));
  }, [amount, open]);

  if (!open) return null;

  function chooseMethod(m: MethodDef) {
    setMethod(m);
    if (m.key === 'upload') {
      // Redirect to the real slip upload page
      return;
    }
    setStep('form');
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!method) return;
    setStep('processing');
    // Simulate async call
    setTimeout(() => {
      const ref =
        method.kind === 'mobile'
          ? `TX${Date.now().toString().slice(-8)}`
          : method.kind === 'bank'
          ? `ZIPIT-${Date.now().toString().slice(-6)}`
          : `AUTH-${Date.now().toString(36).slice(-6).toUpperCase()}`;
      setReceipt(ref);
      setStep('success');
      onComplete?.({ method: method.key, amount: amt, reference: ref });
    }, 1800);
  }

  const headerCopy =
    step === 'pick'
      ? 'Choose a payment method'
      : step === 'form'
      ? method?.name ?? 'Payment'
      : step === 'processing'
      ? 'Processing…'
      : 'Payment received';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => (step === 'processing' ? null : onClose())}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-card shadow-card-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            {step === 'form' ? (
              <button
                type="button"
                onClick={() => setStep('pick')}
                aria-label="Back"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
            ) : null}
            <div>
              <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                Payment
              </p>
              <h2 className="text-h3 text-ink">{headerCopy}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={step === 'processing'}
            aria-label="Close"
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-30"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5">
          {/* Summary line */}
          <div className="mb-4 rounded-md border border-line bg-surface/40 p-4">
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">Paying</p>
            <p className="mt-1 text-small font-semibold text-ink">{label}</p>
            <p className="mt-2 text-[1.75rem] font-bold leading-none tabular-nums text-ink">
              {currency} {amt || '0.00'}
            </p>
          </div>

          {step === 'pick' ? (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <label
                  htmlFor="pay-amount"
                  className="text-micro font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  Amount
                </label>
                <input
                  id="pay-amount"
                  type="text"
                  inputMode="decimal"
                  value={amt}
                  onChange={(e) => setAmt(e.target.value)}
                  placeholder="0.00"
                  className="h-10 flex-1 rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  if (m.key === 'upload') {
                    return (
                      <li key={m.key}>
                        <Link
                          href="/parent/fees/upload"
                          onClick={onClose}
                          className="hover-lift group flex h-full items-center gap-3 rounded-lg border border-line bg-card p-3 transition-colors hover:border-brand-primary/30"
                        >
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${TONE_STYLES[m.tone]}`}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-small font-semibold text-ink">{m.name}</p>
                            <Badge tone={m.tone === 'gold' ? 'gold' : m.tone} dot>
                              {m.settle}
                            </Badge>
                          </div>
                          <ArrowRight
                            className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={m.key}>
                      <button
                        type="button"
                        onClick={() => chooseMethod(m)}
                        disabled={!amt || Number(amt) <= 0}
                        className="hover-lift group flex h-full w-full items-center gap-3 rounded-lg border border-line bg-card p-3 text-left transition-colors hover:border-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${TONE_STYLES[m.tone]}`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-small font-semibold text-ink">{m.name}</p>
                          <Badge tone={m.tone === 'gold' ? 'gold' : m.tone} dot>
                            {m.settle}
                          </Badge>
                        </div>
                        <ArrowRight
                          className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-micro text-muted">
                <Lock className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                Your PIN is entered on a secure prompt. The school never sees it.
              </p>
            </div>
          ) : null}

          {step === 'form' && method ? (
            <form onSubmit={submitForm} className="space-y-4">
              {method.kind === 'mobile' ? (
                <>
                  <Field label={`${method.name} phone number`}>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0771 234 567"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Confirm with PIN">
                    <input
                      type="password"
                      required
                      minLength={4}
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••"
                      className={inputClass}
                    />
                  </Field>
                  <p className="flex items-start gap-2 rounded-md border border-info/25 bg-info/[0.04] p-3 text-micro text-ink">
                    <Smartphone
                      className="mt-0.5 h-4 w-4 flex-none text-info"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    You&rsquo;ll get a {method.name} prompt on this phone. Approve to complete.
                  </p>
                </>
              ) : null}

              {method.kind === 'bank' ? (
                <>
                  <Field label="Payment reference">
                    <input
                      type="text"
                      required
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      placeholder="HHA-2026-000123"
                      className={inputClass}
                    />
                  </Field>
                  <div className="rounded-md border border-line bg-surface/40 p-3 text-small text-ink">
                    <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
                      Beneficiary
                    </p>
                    <p className="mt-1 font-semibold">Harare Heritage Academy</p>
                    <p className="text-micro text-muted">CBZ · 11234567890123 · Branch 01234</p>
                  </div>
                </>
              ) : null}

              {method.kind === 'card' ? (
                <>
                  <Field label="Cardholder name">
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As on the card"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Card number">
                    <input
                      type="text"
                      required
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className={inputClass}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry">
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM / YY"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="CVV">
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </>
              ) : null}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('pick')}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                >
                  Pay {currency} {amt || '0.00'}
                  <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </form>
          ) : null}

          {step === 'processing' ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Loader2
                className="h-10 w-10 animate-spin text-brand-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-h3 text-ink">Authorising with {method?.name}</p>
              <p className="max-w-xs text-small text-muted">
                Do not close this window. The receipt will be issued in a moment.
              </p>
            </div>
          ) : null}

          {step === 'success' && receipt ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 className="h-7 w-7" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="text-h2 text-ink">
                {currency} {amt} received
              </p>
              <p className="text-small text-muted">
                We&rsquo;ve emailed the digital receipt and updated your balance.
              </p>
              <div className="mt-2 w-full rounded-md border border-line bg-surface/40 p-4 text-left">
                <dl className="space-y-2 text-small">
                  <Row label="Reference" value={receipt} mono />
                  <Row label="Method" value={method?.name ?? ''} />
                  <Row
                    label="Settled"
                    value={new Date().toLocaleString('en-ZW', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  />
                </dl>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-small font-semibold text-ink transition-colors hover:bg-surface"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-primary px-5 text-small font-semibold text-white shadow-card-sm transition hover:bg-brand-primary/90 hover:shadow-card-md"
                >
                  Done
                  <Check className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'h-11 w-full rounded-md border border-line bg-card px-3 text-small text-ink placeholder:text-muted focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-micro font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className={mono ? 'font-mono text-small font-semibold text-ink' : 'text-small font-semibold text-ink'}>
        {value}
      </dd>
    </div>
  );
}
