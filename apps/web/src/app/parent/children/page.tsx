import { Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

import { ChildCard } from '@/components/child-card';
import { INVOICES, STUDENTS } from '@/lib/mock/fixtures';

export default function ChildrenPage() {
  const children = STUDENTS.filter((s) => s.guardianIds.includes('u-parent'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Your children</h2>
        <p className="text-sm text-granite-600 mt-1">
          Two registered at HHA. A sibling discount of 5% applies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {children.map((c) => (
          <ChildCard
            key={c.id}
            child={c}
            average={c.id === 's-farai' ? 75 : 82}
            attendance={c.id === 's-farai' ? 96 : 99}
            pendingAssignments={c.id === 's-farai' ? 3 : 1}
            outstandingBalance={
              INVOICES.find((i) => i.studentId === c.id && i.status !== 'PAID')?.balance
            }
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guardian relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-granite-700 leading-relaxed">
            The portal supports multiple guardian types — parents, step-parents, grandparents,
            and bonded guardians — each with configurable access. A grandparent paying fees but
            not receiving reports is a valid and supported arrangement.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="hha-table">
              <thead>
                <tr>
                  <th>Guardian</th>
                  <th>Relationship</th>
                  <th>Primary</th>
                  <th>Can view academics</th>
                  <th>Can pay fees</th>
                  <th>Receives reports</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">Sekai Moyo (you)</td>
                  <td>Mother</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td className="font-medium">Tafara Moyo</td>
                  <td>Father</td>
                  <td>—</td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td className="font-medium">Gogo Rudo Chingwaru</td>
                  <td>Grandparent</td>
                  <td>—</td>
                  <td>—</td>
                  <td>✓</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
