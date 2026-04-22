import { Badge, Card, CardContent, CardHeader, CardTitle, Money } from '@hha/ui';
import { Download, Receipt } from 'lucide-react';

const RECEIPTS = [
  { ref: 'RCT-20260422-A4F7', student: 'Farai Moyo', method: 'CBZ Transfer', amount: '800.00', when: '22 Apr 14:02', status: 'RECONCILED' },
  { ref: 'RCT-20260422-9B12', student: 'Tanaka Moyo', method: 'Stanbic Slip', amount: '1450.00', when: '22 Apr 11:03', status: 'VERIFIED' },
  { ref: 'RCT-20260422-5C8D', student: 'Chipo Banda', method: 'EcoCash', amount: '1650.00', when: '22 Apr 08:14', status: 'RECONCILED' },
  { ref: 'RCT-20260421-1A2E', student: 'Rudo Mutasa', method: 'ZIPIT', amount: '500.00', when: '21 Apr 18:30', status: 'RECONCILED' },
  { ref: 'RCT-20260421-7D4B', student: 'Tinashe Ncube', method: 'CBZ Transfer', amount: '500.00', when: '21 Apr 16:33', status: 'FAILED' },
  { ref: 'RCT-20260120-4E2A', student: 'Farai Moyo', method: 'EcoCash', amount: '1650.00', when: '15 Jan 08:33', status: 'RECONCILED' },
];

export default function ReceiptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Receipts</h2>
        <p className="text-sm text-granite-600 mt-1">
          Every payment — by any method — produces a digital receipt with a unique reference.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" aria-hidden /> Recent receipts
          </CardTitle>
          <p className="text-xs text-granite-500">All receipts downloadable as PDF</p>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Student</th>
                <th>Method</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th>When</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {RECEIPTS.map((r) => (
                <tr key={r.ref}>
                  <td className="font-mono text-xs">{r.ref}</td>
                  <td className="font-medium">{r.student}</td>
                  <td>{r.method}</td>
                  <td className="text-right">
                    <Money amount={r.amount} currency="USD" />
                  </td>
                  <td>
                    <Badge tone={r.status === 'RECONCILED' ? 'success' : r.status === 'FAILED' ? 'danger' : 'info'}>
                      {r.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="text-xs text-granite-600">{r.when}</td>
                  <td className="text-right">
                    <button className="rounded p-1.5 text-granite-500 hover:bg-granite-100 hover:text-heritage-900">
                      <Download className="h-4 w-4" />
                    </button>
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
