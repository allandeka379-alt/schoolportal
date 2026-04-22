import { Badge } from '@hha/ui';
import { Pin } from 'lucide-react';

import type { DemoAnnouncement } from '@/lib/mock/fixtures';

export function AnnouncementCard({ a }: { a: DemoAnnouncement }) {
  return (
    <article className="border-b border-granite-200 py-4 last:border-0">
      <div className="flex items-center gap-2 mb-1">
        {a.pinned ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-savanna-700">
            <Pin className="h-3 w-3" aria-hidden /> Pinned
          </span>
        ) : null}
        <Badge tone="outline">{a.channel}</Badge>
        {a.requiresAcknowledgement ? (
          <Badge tone="warning">Acknowledgement required</Badge>
        ) : null}
      </div>
      <h3 className="text-base font-semibold text-heritage-950">{a.title}</h3>
      <p className="mt-1 text-sm text-granite-700 leading-relaxed">{a.body}</p>
      <p className="mt-2 text-xs text-granite-500">
        {a.author} · {new Date(a.publishedAt).toLocaleString('en-ZW')}
      </p>
    </article>
  );
}
