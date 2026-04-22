import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Money, Stepper } from '@hha/ui';
import { Banknote, CreditCard, FileDown, Smartphone, Upload } from 'lucide-react';

import { INVOICES, SLIPS, STUDENTS } from '@/lib/mock/fixtures';

const STEP_LABELS = {
  IMAGE_ENHANCEMENT: 'Image enhancement',
  OCR: 'Optical character recognition',
  STRUCTURAL_PARSING: 'Structural parsing',
  ACCOUNT_VERIFICATION: 'Account verification',
  STATEMENT_RECONCILIATION: 'Statement reconciliation',
  ACCOUNT_UPDATE: 'Account update & receipt',
} as const;

const STEP_DESCRIPTIONS = {
  IMAGE_ENHANCEMENT: 'Deskewed, cropped, contrast-adjusted.',
  OCR: 'Every printed field extracted from the slip.',
  STRUCTURAL_PARSING: 'Bank layout recognised (CBZ, Stanbic, ZB…).',
  ACCOUNT_VERIFICATION: 'Beneficiary matches an HHA registered account.',
  STATEMENT_RECONCILIATION: 'Deposit found on our bank statement.',
  ACCOUNT_UPDATE: 'Ledger updated and receipt issued.',
} as const;

export default function ParentFeesPage() {
  const ourInvoices = INVOICES.filter((i) =>
    STUDENTS.filter((s) => s.guardianIds.includes('u-parent')).some((s) => s.id === i.studentId),
  );

  // The parent's most recent slip upload for Tanaka (from fixtures).
  const slip = SLIPS.find((s) => s.studentId === 's-tanaka')!;

  const totalOutstanding = ourInvoices.reduce(
    (sum, inv) => sum + Number(inv.balance),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Fees</h2>
        <p className="text-sm text-granite-600 mt-1">
          One view across both children. Sibling discount already applied.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="hha-label">Total outstanding — both children</p>
            <p className="mt-1 font-display text-display-sm text-heritage-950">
              <Money amount={totalOutstanding.toFixed(2)} currency="USD" bold />
            </p>
            <p className="mt-1 text-sm text-granite-600">Due Friday 9 May · Term 2 2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <FileDown className="h-4 w-4" /> Combined statement
            </Button>
            <Button>Pay both now</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <OptionTile icon={<Smartphone className="h-5 w-5" />} label="EcoCash" note="Real-time via Paynow" />
              <OptionTile icon={<Smartphone className="h-5 w-5" />} label="OneMoney" note="Real-time" />
              <OptionTile icon={<Smartphone className="h-5 w-5" />} label="InnBucks" note="Real-time" />
              <OptionTile icon={<Banknote className="h-5 w-5" />} label="ZIPIT" note="Instant transfer" />
              <OptionTile icon={<Banknote className="h-5 w-5" />} label="CBZ / Stanbic / ZB" note="Same-day EFT" />
              <OptionTile icon={<CreditCard className="h-5 w-5" />} label="Visa / Mastercard" note="Via Paynow" />
            </div>
            <div className="mt-4 rounded-lg border-2 border-dashed border-savanna-300 bg-savanna-50/60 p-4 text-center">
              <Upload className="mx-auto h-6 w-6 text-savanna-700" aria-hidden />
              <p className="mt-2 text-sm font-semibold text-savanna-900">Paid at the bank?</p>
              <p className="text-xs text-savanna-800 mt-0.5">
                Upload a photo of the slip — we&rsquo;ll read it and reconcile automatically.
              </p>
              <button className="mt-3 rounded bg-savanna-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-savanna-700">
                Upload slip
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your latest slip upload</CardTitle>
            <p className="text-xs text-granite-500 mt-1">
              Tanaka · Stanbic deposit · uploaded 22 Apr 11:03
            </p>
          </CardHeader>
          <CardContent>
            <Stepper
              items={slip.steps.map((s) => ({
                key: s.step,
                label: STEP_LABELS[s.step],
                description: STEP_DESCRIPTIONS[s.step],
                status:
                  s.outcome === 'done'
                    ? 'done'
                    : s.outcome === 'failed'
                    ? 'failed'
                    : s.outcome === 'in-progress'
                    ? 'in-progress'
                    : 'pending',
              }))}
            />
            <div className="mt-4 rounded border border-heritage-200 bg-heritage-50/60 p-3 text-xs text-heritage-800">
              Currently reconciling against our CBZ statement. You&rsquo;ll see the balance clear
              once the deposit reaches the school&rsquo;s account — typically within 4 hours.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Invoice</th>
                <th>Term</th>
                <th className="text-right">Total</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th className="text-right">Due</th>
              </tr>
            </thead>
            <tbody>
              {ourInvoices.map((inv) => {
                const student = STUDENTS.find((s) => s.id === inv.studentId)!;
                return (
                  <tr key={inv.id}>
                    <td className="font-medium">{student.firstName}</td>
                    <td className="font-mono text-xs">{inv.invoiceNumber}</td>
                    <td>{inv.term}</td>
                    <td className="text-right">
                      <Money amount={inv.subtotal} currency="USD" />
                    </td>
                    <td className="text-right">
                      <Money
                        amount={inv.balance}
                        currency="USD"
                        tone={inv.balance === '0.00' ? 'positive' : 'negative'}
                      />
                    </td>
                    <td>
                      <Badge
                        tone={
                          inv.status === 'PAID'
                            ? 'success'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'warning'
                            : inv.status === 'OVERDUE'
                            ? 'danger'
                            : 'info'
                        }
                      >
                        {inv.status.replace('_', ' ').toLowerCase()}
                      </Badge>
                    </td>
                    <td className="text-right text-xs text-granite-600">
                      {new Date(inv.dueDate).toLocaleDateString('en-ZW', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function OptionTile({ icon, label, note }: { icon: React.ReactNode; label: string; note: string }) {
  return (
    <button className="flex flex-col items-start gap-2 rounded-lg border border-granite-200 bg-white p-3 text-left hover:border-heritage-400 hover:bg-heritage-50/30 transition-colors">
      <span className="text-granite-600">{icon}</span>
      <span className="text-sm font-semibold text-granite-900">{label}</span>
      <span className="text-xs text-granite-500">{note}</span>
    </button>
  );
}
