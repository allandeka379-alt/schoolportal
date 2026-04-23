'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Globe,
  Loader2,
  Lock,
  Shield,
  ShieldCheck,
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
  kind: 'mobile' | 'bank' | 'card' | 'upload';
  settle: string;
  tone: 'brand' | 'success' | 'info' | 'warning' | 'gold';
  logo: string; // path under /public
  logoAlt: string;
  logoBg: string; // tailwind classes for the logo tile background
  tag?: string; // small descriptor under logo
}

const METHODS: MethodDef[] = [
  {
    key: 'ecocash',
    name: 'EcoCash',
    kind: 'mobile',
    settle: 'Real-time',
    tone: 'success',
    logo: '/payments/ecocash.png',
    logoAlt: 'EcoCash',
    logoBg: 'bg-[#E10600]',
    tag: 'Econet',
  },
  {
    key: 'onemoney',
    name: 'OneMoney',
    kind: 'mobile',
    settle: 'Real-time',
    tone: 'info',
    logo: '/payments/onemoney.png',
    logoAlt: 'OneMoney',
    logoBg: 'bg-[#FFD800]',
    tag: 'NetOne',
  },
  {
    key: 'innbucks',
    name: 'InnBucks',
    kind: 'mobile',
    settle: 'Real-time',
    tone: 'warning',
    logo: '/payments/innbucks.svg',
    logoAlt: 'InnBucks',
    logoBg: 'bg-[#0B6B3A]',
    tag: 'Innscor',
  },
  {
    key: 'zipit',
    name: 'ZIPIT',
    kind: 'bank',
    settle: 'Instant',
    tone: 'brand',
    logo: '/payments/zimswitch.jpg',
    logoAlt: 'ZIPIT / ZimSwitch',
    logoBg: 'bg-white',
    tag: 'ZimSwitch',
  },
  {
    key: 'bank',
    name: 'Bank transfer',
    kind: 'bank',
    settle: 'Same-day',
    tone: 'info',
    logo: '/payments/bank-transfer.svg',
    logoAlt: 'Bank transfer',
    logoBg: 'bg-white',
    tag: 'CBZ · Stanbic · ZB',
  },
  {
    key: 'card',
    name: 'Visa / Mastercard',
    kind: 'card',
    settle: 'Real-time',
    tone: 'gold',
    logo: '/payments/card-brands.svg',
    logoAlt: 'Visa and Mastercard',
    logoBg: 'bg-white',
    tag: 'International',
  },
  {
    key: 'upload',
    name: 'Upload bank slip',
    kind: 'upload',
    settle: 'Reconciled',
    tone: 'brand',
    logo: '',
    logoAlt: 'Upload bank slip',
    logoBg: 'bg-brand-primary/10',
    tag: 'Manual deposit',
  },
];

export interface PaymentFlowProps {
  open: boolean;
  onClose: () => void;
  amount?: string | number;
  label?: string;
  currency?: string;
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
  // Mobile money
  const [phone, setPhone] = useState('');
  // Bank
  const [bankRef, setBankRef] = useState('');
  // Card
  const [cardName, setCardName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardCountry, setCardCountry] = useState('United Kingdom');
  const [cardPostcode, setCardPostcode] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [stepHint, setStepHint] = useState<string>('');

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep('pick');
      setMethod(null);
      setReceipt(null);
      setPhone('');
      setBankRef('');
      setCardNo('');
      setCardExp('');
      setCardCvv('');
      setCardName('');
      setCardPostcode('');
      setStepHint('');
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setAmt(String(amount || ''));
  }, [amount, open]);

  if (!open) return null;

  function chooseMethod(m: MethodDef) {
    setMethod(m);
    if (m.key === 'upload') return; // Link navigates
    setStep('form');
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!method) return;
    setStep('processing');
    setStepHint(
      method.kind === 'mobile'
        ? `Check your phone. ${method.name} has sent a prompt — enter your PIN there to confirm.`
        : method.kind === 'card'
        ? '3-D Secure · verifying with your bank'
        : method.kind === 'bank'
        ? 'Matching your deposit against the ZimSwitch feed'
        : 'Finalising',
    );
    const delay = method.kind === 'mobile' ? 2600 : method.kind === 'card' ? 1900 : 1500;
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
    }, delay);
  }

  // Formatters
  function onCardNoChange(v: string) {
    // Strip non-digits, group by 4
    const digits = v.replace(/\D/g, '').slice(0, 19);
    const groups = digits.match(/.{1,4}/g);
    setCardNo(groups ? groups.join(' ') : '');
  }

  function onCardExpChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) setCardExp(digits);
    else setCardExp(`${digits.slice(0, 2)} / ${digits.slice(2)}`);
  }

  function cardBrandHint(): 'visa' | 'mastercard' | null {
    const first = cardNo.replace(/\s/g, '').charAt(0);
    if (first === '4') return 'visa';
    if (first === '5' || first === '2') return 'mastercard';
    return null;
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
            <p className="text-micro font-semibold uppercase tracking-[0.12em] text-muted">
              Paying
            </p>
            <p className="mt-1 text-small font-semibold text-ink">{label}</p>
            <p className="mt-2 text-[1.75rem] font-bold leading-none tabular-nums text-ink">
              {currency} {amt || '0.00'}
            </p>
          </div>

          {/* Pick */}
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
                  const content = (
                    <div className="hover-lift group flex h-full items-center gap-3 rounded-lg border border-line bg-card p-3 transition-colors hover:border-brand-primary/30">
                      <MethodLogo method={m} />
                      <div className="min-w-0 flex-1">
                        <p className="text-small font-semibold text-ink">{m.name}</p>
                        <p className="text-micro text-muted">{m.tag}</p>
                        <Badge tone={m.tone === 'gold' ? 'gold' : m.tone} dot>
                          {m.settle}
                        </Badge>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                  );
                  if (m.key === 'upload') {
                    return (
                      <li key={m.key}>
                        <Link href="/parent/fees/upload" onClick={onClose}>
                          {content}
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
                        className="w-full text-left disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {content}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Reassurance strip */}
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-md border border-line bg-surface/40 px-4 py-3 text-micro text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" strokeWidth={1.75} aria-hidden />
                  PCI DSS · TLS 1.3
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-info" strokeWidth={1.75} aria-hidden />
                  Accepts cards from any country
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-brand-primary" strokeWidth={1.75} aria-hidden />
                  We never see your PIN
                </span>
              </div>
            </div>
          ) : null}

          {/* Form */}
          {step === 'form' && method ? (
            <form onSubmit={submitForm} className="space-y-4">
              {/* Method recap */}
              <div className="flex items-center gap-3 rounded-md border border-line bg-surface/40 p-3">
                <MethodLogo method={method} />
                <div className="min-w-0 flex-1">
                  <p className="text-small font-semibold text-ink">{method.name}</p>
                  <p className="text-micro text-muted">{method.tag}</p>
                </div>
                <Badge tone={method.tone === 'gold' ? 'gold' : method.tone} dot>
                  {method.settle}
                </Badge>
              </div>

              {/* Mobile money — NO PIN field. Just phone. USSD push does the PIN. */}
              {method.kind === 'mobile' ? (
                <>
                  <Field label={`${method.name} number`}>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0771 234 567"
                      className={inputClass}
                    />
                  </Field>
                  <div className="flex items-start gap-3 rounded-md border border-info/25 bg-info/[0.04] p-3 text-small text-ink">
                    <Smartphone
                      className="mt-0.5 h-4 w-4 flex-none text-info"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div>
                      <p className="font-semibold">Your PIN stays on your phone.</p>
                      <p className="mt-0.5 text-micro text-muted">
                        When you tap &ldquo;Pay&rdquo;, {method.name} sends a prompt to this number.
                        Approve with your PIN on the phone — the school never sees it.
                      </p>
                    </div>
                  </div>
                </>
              ) : null}

              {/* Bank transfer / ZIPIT */}
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

              {/* CARD — the diaspora selling point */}
              {method.kind === 'card' ? (
                <>
                  <div className="rounded-lg border border-line bg-gradient-to-br from-ink to-ink/85 p-5 text-white shadow-card-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-micro font-semibold uppercase tracking-[0.12em] text-white/70">
                          Amount
                        </p>
                        <p className="mt-1 text-[1.75rem] font-bold leading-none tabular-nums">
                          {currency} {amt || '0.00'}
                        </p>
                        <p className="mt-1 text-micro text-white/70">
                          Billed in {currency} · no hidden FX markup
                        </p>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                        {cardBrandHint() === 'visa' ? (
                          <span className="text-[13px] font-black italic tracking-wider">VISA</span>
                        ) : cardBrandHint() === 'mastercard' ? (
                          <span className="flex items-center gap-1">
                            <span className="h-3 w-3 rounded-full bg-[#EB001B]" aria-hidden />
                            <span className="h-3 w-3 rounded-full bg-[#F79E1B] -ml-1.5" aria-hidden />
                          </span>
                        ) : (
                          <Image
                            src="/payments/card-brands.svg"
                            alt="Visa · Mastercard"
                            width={60}
                            height={20}
                            className="h-5 w-auto"
                            unoptimized
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="font-mono text-[15px] tracking-[0.15em] text-white/90">
                        {cardNo || '•••• •••• •••• ••••'}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-micro">
                        <div>
                          <p className="text-white/60">Cardholder</p>
                          <p className="mt-0.5 uppercase tracking-wider">
                            {cardName || 'YOUR NAME'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Expiry</p>
                          <p className="mt-0.5 font-mono">{cardExp || 'MM / YY'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Field label="Cardholder name">
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As printed on the card"
                      className={inputClass}
                      autoComplete="cc-name"
                    />
                  </Field>
                  <Field label="Card number">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={cardNo}
                        onChange={(e) => onCardNoChange(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className={`${inputClass} pr-12 font-mono tracking-wider`}
                        autoComplete="cc-number"
                      />
                      {cardBrandHint() ? (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-micro font-black italic tracking-wider text-ink">
                          {cardBrandHint() === 'visa' ? 'VISA' : null}
                          {cardBrandHint() === 'mastercard' ? (
                            <span className="flex items-center">
                              <span
                                className="block h-4 w-4 rounded-full bg-[#EB001B]"
                                aria-hidden
                              />
                              <span
                                className="block -ml-2 h-4 w-4 rounded-full bg-[#F79E1B]"
                                aria-hidden
                              />
                            </span>
                          ) : null}
                        </span>
                      ) : null}
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiry">
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => onCardExpChange(e.target.value)}
                        placeholder="MM / YY"
                        className={`${inputClass} font-mono`}
                        autoComplete="cc-exp"
                      />
                    </Field>
                    <Field label="CVV">
                      <input
                        type="password"
                        required
                        inputMode="numeric"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className={`${inputClass} font-mono`}
                        autoComplete="cc-csc"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-[1fr,120px] gap-3">
                    <Field label="Billing country">
                      <select
                        value={cardCountry}
                        onChange={(e) => setCardCountry(e.target.value)}
                        className={inputClass}
                        autoComplete="country-name"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Post code">
                      <input
                        type="text"
                        value={cardPostcode}
                        onChange={(e) => setCardPostcode(e.target.value)}
                        placeholder="SW1A 1AA"
                        className={inputClass}
                        autoComplete="postal-code"
                      />
                    </Field>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 rounded border-line accent-brand-primary"
                    />
                    Save card for next term (tokenised · you&rsquo;re in control)
                  </label>

                  <div className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-surface/40 px-3 py-2 text-micro text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-success" strokeWidth={1.75} aria-hidden />
                      3-D Secure / Verified by Visa
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-info" strokeWidth={1.75} aria-hidden />
                      Global acceptance
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck
                        className="h-3.5 w-3.5 text-brand-primary"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      PCI DSS Level 1
                    </span>
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

          {/* Processing */}
          {step === 'processing' ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              {method ? <MethodLogo method={method} size="lg" /> : null}
              <Loader2
                className="mt-3 h-8 w-8 animate-spin text-brand-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-h3 text-ink">
                {method?.kind === 'mobile' ? `Sending ${method.name} prompt` : 'Authorising'}
              </p>
              <p className="max-w-sm text-small text-muted">{stepHint}</p>
              {method?.kind === 'mobile' ? (
                <p className="text-micro text-muted">
                  Dial *151# if the prompt didn&rsquo;t arrive.
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Success */}
          {step === 'success' && receipt ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
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
                  {method?.kind === 'card' ? (
                    <Row label="Card ending" value={`•••• ${cardNo.replace(/\s/g, '').slice(-4) || '0000'}`} mono />
                  ) : null}
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

function MethodLogo({ method, size = 'md' }: { method: MethodDef; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  if (method.key === 'upload') {
    return (
      <span
        className={`inline-flex ${box} flex-none items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary`}
      >
        <Upload className={size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }
  return (
    <span
      className={`inline-flex ${box} flex-none items-center justify-center overflow-hidden rounded-md border border-line ${method.logoBg}`}
    >
      <Image
        src={method.logo}
        alt={method.logoAlt}
        width={96}
        height={64}
        className="max-h-full max-w-full object-contain p-1"
        unoptimized
      />
    </span>
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
      <dd
        className={
          mono ? 'font-mono text-small font-semibold text-ink' : 'text-small font-semibold text-ink'
        }
      >
        {value}
      </dd>
    </div>
  );
}

const COUNTRIES = [
  'Zimbabwe',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'New Zealand',
  'Germany',
  'Netherlands',
  'Ireland',
  'Botswana',
  'Namibia',
  'Zambia',
  'Mozambique',
  'Other',
];
