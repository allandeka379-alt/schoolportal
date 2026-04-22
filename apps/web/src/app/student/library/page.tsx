import { Badge, Card, CardContent, CardHeader, CardTitle, Input } from '@hha/ui';
import { BookmarkCheck, Download, FileText, PlayCircle, Search } from 'lucide-react';

import { RESOURCES, SUBJECTS } from '@/lib/mock/fixtures';

const ICONS = {
  Textbook: FileText,
  Notes: FileText,
  'Past Paper': FileText,
  Video: PlayCircle,
  Worksheet: FileText,
} as const;

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Digital Library</h2>
        <p className="text-sm text-granite-600 mt-1">
          Textbooks, notes, past papers, and class recordings. Mark items for offline download.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-granite-400" aria-hidden />
          <Input className="pl-9" placeholder="Search across all subjects…" />
        </div>
        <select
          className="h-10 rounded border border-granite-300 bg-white px-3 text-sm text-granite-800 focus-visible:outline-none focus-visible:border-heritage-500 focus-visible:shadow-focus"
          aria-label="Subject"
        >
          <option>All subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s.code}>{s.name}</option>
          ))}
        </select>
        <select
          className="h-10 rounded border border-granite-300 bg-white px-3 text-sm text-granite-800 focus-visible:outline-none focus-visible:border-heritage-500 focus-visible:shadow-focus"
          aria-label="Kind"
        >
          <option>Any kind</option>
          <option>Textbook</option>
          <option>Notes</option>
          <option>Past Paper</option>
          <option>Video</option>
          <option>Worksheet</option>
        </select>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recently added</CardTitle>
          <p className="text-xs text-granite-500">{RESOURCES.length} items</p>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-granite-100">
            {RESOURCES.map((r) => {
              const Icon = ICONS[r.kind];
              return (
                <li key={r.id} className="flex items-center gap-4 p-4 hover:bg-granite-50/60">
                  <div className="h-10 w-10 rounded bg-granite-100 text-granite-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-granite-900 truncate">{r.title}</p>
                    <p className="text-xs text-granite-500 mt-0.5">
                      {r.kind} · {r.subjectCode} · {r.size ?? r.duration} · updated{' '}
                      {new Date(r.updatedAt).toLocaleDateString('en-ZW', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  {r.bookmarked ? (
                    <Badge tone="success">
                      <BookmarkCheck className="h-3 w-3" aria-hidden /> Offline
                    </Badge>
                  ) : null}
                  <button
                    className="rounded p-2 text-granite-500 hover:bg-granite-100 hover:text-heritage-900"
                    aria-label="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ask the librarian</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-granite-700 mb-3">
            Can&rsquo;t find what you need? Request a resource and your subject teacher or the
            librarian will be notified.
          </p>
          <div className="flex gap-2">
            <Input placeholder="e.g. A-level past papers for chemistry organic chemistry unit 4" />
            <button className="h-10 rounded bg-heritage-900 px-4 text-sm font-medium text-white hover:bg-heritage-800">
              Request
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
