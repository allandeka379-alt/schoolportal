import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Money } from '@hha/ui';
import { Banknote, CreditCard, FileDown, Smartphone, Upload } from 'lucide-react';

import { INVOICES, PAYMENTS } from '@/lib/mock/fixtures';

const PAYMENT_METHODS = [
  { name: 'EcoCash', icon: Smartphone, tone: 'bg-emerald-50 text-emerald-800 border-emerald-200', settle: 'Real-time' },
  { name: 'OneMoney', icon: Smartphone, tone: 'bg-heritage-50 text-heritage-800 border-heritage-200', settle: 'Real-time' },
  { name: 'InnBucks', icon: Smartphone, tone: 'bg-savanna-50 text-savanna-800 border-savanna-200', settle: 'Real-time' },
  { name: 'ZIPIT', icon: Banknote, tone: 'bg-heritage-50 text-heritage-800 border-heritage-200', settle: 'Real-time' },
  { name: 'CBZ Transfer', icon: Banknote, tone: 'bg-granite-100 text-granite-800 border-granite-200', settle: 'Same day' },
  { name: 'Stanbic Transfer', icon: Banknote, tone: 'bg-granite-100 text-granite-800 border-granite-200', settle: 'Same day' },
  { name: 'ZB Transfer', icon: Banknote, tone: 'bg-granite-100 text-granite-800 border-granite-200', settle: 'Same day' },
  { name: 'Steward Transfer', icon: Banknote, tone: 'bg-granite-100 text-granite-800 border-granite-200', settle: 'Same day' },
  { name: 'Visa / Mastercard', icon: CreditCard, tone: 'bg-heritage-50 text-heritage-800 border-heritage-200', settle: 'Real-time' },
  { name: 'Upload bank slip', icon: Upload, tone: 'bg-savanna-50 text-savanna-800 border-savanna-200', settle: 'Reconciled' },
];

export default function FeesPage() {
  const invoices = INVOICES.filter((i) => i.studentId === 's-farai');
  const outstanding = invoices.find((i) => i.status !== 'PAID');
  const payments = PAYMENTS.filter((p) => p.studentId === 's-farai');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Fees</h2>
        <p className="text-sm text-granite-600 mt-1">
          Invoices, payments, and payment options. Pay the way that works for your family.
        </p>
      </div>

      {outstanding ? (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="hha-label">Outstanding balance</p>
              <p className="mt-1 font-display text-display-sm text-heritage-950">
                <Money amount={outstanding.balance} currency="USD" bold />
              </p>
              <p className="mt-1 text-sm text-granite-600">
                {outstanding.term} · due{' '}
                {new Date(outstanding.dueDate).toLocaleDateString('en-ZW', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">
                <FileDown className="h-4 w-4" /> Statement
              </Button>
              <Button>Pay now</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-granite-600 mb-4">
            Ten methods, one workflow. Mobile money and ZIPIT settle in real time; EFTs reconcile
            the same day; bank-slip uploads are read automatically.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.name}
                  className={`flex flex-col items-start gap-2 rounded-lg border px-4 py-3 text-left transition-colors hover:border-heritage-400 ${m.tone}`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-[11px] font-medium uppercase tracking-wider opacity-70">
                    {m.settle}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Term</th>
                <th className="text-right">Total</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th className="text-right">Due</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="font-mono text-xs text-granite-700">{inv.invoiceNumber}</td>
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
                  <td className="text-right">
                    <button className="text-xs text-heritage-700 hover:underline">Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Method</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th className="text-right">Paid</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-granite-700">{p.reference}</td>
                  <td>{p.method}</td>
                  <td className="text-right">
                    <Money amount={p.amount} currency="USD" />
                  </td>
                  <td>
                    <Badge tone={p.status === 'RECONCILED' ? 'success' : 'info'}>
                      {p.status.replace('_', ' ').toLowerCase()}
                    </Badge>
                  </td>
                  <td className="text-right text-xs text-granite-600">
                    {new Date(p.paidAt).toLocaleDateString('en-ZW', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
