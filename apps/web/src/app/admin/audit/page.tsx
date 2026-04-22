import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

const LOG = [
  { at: '22 Apr 2026 11:48', actor: 'Rutendo Chideme', action: 'slip.approved', resource: 'slip-1', severity: 'INFO' },
  { at: '22 Apr 2026 11:32', actor: 'Miriam Dziva', action: 'gradebook.write', resource: 'gb-form3b-math', severity: 'INFO' },
  { at: '22 Apr 2026 11:21', actor: 'Tendai Makoni', action: 'announcement.publish', resource: 'an-1', severity: 'NOTICE' },
  { at: '22 Apr 2026 09:02', actor: 'System', action: 'statement.import', resource: 'CBZ-01234567890', severity: 'INFO' },
  { at: '22 Apr 2026 07:15', actor: 'Miriam Dziva', action: 'attendance.record', resource: 'form3b-morning', severity: 'INFO' },
  { at: '21 Apr 2026 22:18', actor: 'IT Admin', action: 'user.unlock', resource: 'u-tinashe-parent', severity: 'WARNING' },
  { at: '21 Apr 2026 16:44', actor: 'Rutendo Chideme', action: 'invoice.waive', resource: 'inv-2026-T2-RM', severity: 'ALERT' },
  { at: '21 Apr 2026 16:02', actor: 'System', action: 'backup.complete', resource: 'daily-backup-20260421', severity: 'INFO' },
];

function tone(sev: string) {
  if (sev === 'ALERT') return 'danger';
  if (sev === 'WARNING') return 'warning';
  if (sev === 'NOTICE') return 'info';
  return 'neutral';
}

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Audit log</h2>
        <p className="text-sm text-granite-600 mt-1">
          Every privileged write, every mark change, every fee adjustment — attributable and
          immutable. Satisfies Section 10 of the proposal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 24 hours</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="hha-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {LOG.map((row, i) => (
                <tr key={i}>
                  <td className="font-mono text-xs text-granite-600">{row.at}</td>
                  <td className="font-medium">{row.actor}</td>
                  <td className="font-mono text-xs">{row.action}</td>
                  <td className="font-mono text-xs text-granite-500">{row.resource}</td>
                  <td>
                    <Badge tone={tone(row.severity)}>{row.severity.toLowerCase()}</Badge>
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
