import { Badge, Card, CardContent, CardHeader, CardTitle, Input, Money } from '@hha/ui';
import { Download, Filter, Search } from 'lucide-react';

import { INVOICES, STUDENTS } from '@/lib/mock/fixtures';

export default function AdminFeesPage() {
  // For the demo, synthesise a wider ledger by multiplying invoices across students.
  const rows = STUDENTS.map((s, i) => {
    const invoice = INVOICES[i % INVOICES.length]!;
    const outstanding = ((i * 37) % 2 === 0) ? invoice.balance : '0.00';
    return {
      student: s,
      invoice,
      outstanding,
      status: outstanding === '0.00' ? 'PAID' : 'PARTIAL',
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Fees Ledger</h2>
        <p className="text-sm text-granite-600 mt-1">
          Every invoice, every payment, live. Filter by class, method, outstanding amount, or ageing.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-granite-400" aria-hidden />
          <Input className="pl-9" placeholder="Search by student name or admission number…" />
        </div>
        <select className="h-10 rounded border border-granite-300 bg-white px-3 text-sm">
          <option>All forms</option>
          <option>Form 1</option>
          <option>Form 2</option>
          <option>Form 3</option>
        </select>
        <select className="h-10 rounded border border-granite-300 bg-white px-3 text-sm">
          <option>Any status</option>
          <option>Paid</option>
          <option>Partially paid</option>
          <option>Overdue</option>
        </select>
        <button className="h-10 rounded border border-granite-300 bg-white px-3 text-sm font-medium hover:bg-granite-50 inline-flex items-center gap-2">
          <Filter className="h-4 w-4" /> More filters
        </button>
        <button className="h-10 rounded bg-heritage-900 px-4 text-sm font-medium text-white hover:bg-heritage-800 inline-flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Term 2 2026</CardTitle>
          <p className="text-xs text-granite-500">Showing {rows.length} of 428 students</p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Form</th>
                <th>Invoice</th>
                <th className="text-right">Total</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th className="text-right">Reminder</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.student.id}>
                  <td>
                    <div className="font-medium">
                      {r.student.firstName} {r.student.lastName}
                    </div>
                    <div className="font-mono text-xs text-granite-500">
                      {r.student.admissionNo}
                    </div>
                  </td>
                  <td>
                    {r.student.form} {r.student.stream}
                  </td>
                  <td className="font-mono text-xs">{r.invoice.invoiceNumber}</td>
                  <td className="text-right">
                    <Money amount={r.invoice.subtotal} currency="USD" />
                  </td>
                  <td className="text-right">
                    <Money
                      amount={r.outstanding}
                      currency="USD"
                      tone={r.outstanding === '0.00' ? 'positive' : 'negative'}
                    />
                  </td>
                  <td>
                    <Badge tone={r.status === 'PAID' ? 'success' : 'warning'}>
                      {r.status === 'PAID' ? 'paid' : 'partial'}
                    </Badge>
                  </td>
                  <td className="text-right">
                    {r.status === 'PAID' ? (
                      <span className="text-xs text-granite-400">—</span>
                    ) : (
                      <button className="text-xs text-heritage-700 hover:underline">Gentle</button>
                    )}
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
