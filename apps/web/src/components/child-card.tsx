import Link from 'next/link';
import { Avatar, Badge, Money } from '@hha/ui';
import { ArrowRight, CheckCircle2, ClipboardList, TrendingUp } from 'lucide-react';

import type { DemoStudent } from '@/lib/mock/fixtures';

export interface ChildCardProps {
  child: DemoStudent;
  average: number;
  attendance: number;
  outstandingBalance?: string;
  pendingAssignments: number;
}

export function ChildCard({ child, average, attendance, outstandingBalance, pendingAssignments }: ChildCardProps) {
  return (
    <div className="hha-card-surface p-5">
      <div className="flex items-start gap-3">
        <Avatar name={`${child.firstName} ${child.lastName}`} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-heritage-950">
            {child.firstName} {child.lastName}
          </p>
          <p className="text-xs text-granite-600">
            {child.form} · {child.stream} · {child.house} House · {child.admissionNo}
          </p>
        </div>
        <Badge tone="outline">{child.house}</Badge>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4 text-center">
        <div>
          <dt className="hha-label">Average</dt>
          <dd className="mt-1 font-display text-lg text-heritage-950 flex items-center justify-center gap-1">
            {average}%
            <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden />
          </dd>
        </div>
        <div>
          <dt className="hha-label">Attendance</dt>
          <dd className="mt-1 font-display text-lg text-heritage-950">{attendance}%</dd>
        </div>
        <div>
          <dt className="hha-label">To do</dt>
          <dd className="mt-1 font-display text-lg text-heritage-950 flex items-center justify-center gap-1">
            {pendingAssignments}
            <ClipboardList className="h-4 w-4 text-granite-400" aria-hidden />
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="hha-label">Fees</p>
          <p className="mt-0.5 text-sm">
            {outstandingBalance && outstandingBalance !== '0.00' ? (
              <>
                <Money amount={outstandingBalance} currency="USD" tone="negative" bold /> due
              </>
            ) : (
              <span className="text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" aria-hidden /> Paid in full
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/parent/progress?child=${child.id}`}
          className="text-sm text-heritage-700 hover:underline inline-flex items-center gap-1"
        >
          View details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
