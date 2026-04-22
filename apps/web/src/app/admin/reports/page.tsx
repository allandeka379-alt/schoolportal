import { Card, CardContent, CardHeader, CardTitle, Money } from '@hha/ui';
import { Download, FileText } from 'lucide-react';

const REPORTS = [
  { id: 'r1', name: 'Term 2 fees collection — weekly', updatedAt: '22 Apr 2026', format: 'PDF / Excel' },
  { id: 'r2', name: 'ZIMSEC candidate registration — Form 4', updatedAt: '18 Apr 2026', format: 'CSV' },
  { id: 'r3', name: 'Ministry statutory return — enrolment Q2', updatedAt: '15 Apr 2026', format: 'Excel' },
  { id: 'r4', name: 'Board financial summary — monthly', updatedAt: '31 Mar 2026', format: 'PDF' },
  { id: 'r5', name: 'Attendance summary — Form 1–4', updatedAt: '12 Apr 2026', format: 'Excel' },
  { id: 'r6', name: 'End-of-term academic performance', updatedAt: '08 Apr 2026', format: 'PDF' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Reports</h2>
        <p className="text-sm text-granite-600 mt-1">
          Compliance, board, and operational reports. Every report is available as PDF and Excel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <p className="hha-label">Fees collected Term 2</p>
            <p className="mt-1 font-display text-display-sm text-heritage-950">
              <Money amount="184320.00" currency="USD" />
            </p>
            <p className="mt-1 text-sm text-granite-600">62% of target</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Reports generated this month</p>
            <p className="mt-1 font-display text-display-sm text-heritage-950">47</p>
            <p className="mt-1 text-sm text-granite-600">12 statutory · 35 operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="hha-label">Pending end-of-term report approvals</p>
            <p className="mt-1 font-display text-display-sm text-savanna-700">18</p>
            <p className="mt-1 text-sm text-granite-600">At form-teacher stage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-granite-100">
            {REPORTS.map((r) => (
              <li key={r.id} className="flex items-center gap-3 p-4 hover:bg-granite-50/60">
                <FileText className="h-5 w-5 text-granite-400" aria-hidden />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-granite-500">
                    Updated {r.updatedAt} · {r.format}
                  </p>
                </div>
                <button className="rounded p-2 text-granite-500 hover:bg-granite-100 hover:text-heritage-900">
                  <Download className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
