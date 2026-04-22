import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@hha/ui';
import { FileText, Upload } from 'lucide-react';

import { RESOURCES } from '@/lib/mock/fixtures';

export default function TeacherResourcesPage() {
  const mine = RESOURCES.filter((r) => r.subjectCode === 'MATH');
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-heritage-950">Resources</h2>
          <p className="text-sm text-granite-600 mt-1">
            Upload books, notes, and past papers. Control whether the class can see them yet.
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4" /> Upload resource
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My uploads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mine.length === 0 ? (
            <EmptyState title="No uploads yet." description="Upload your first resource to get started." />
          ) : (
            <ul className="divide-y divide-granite-100">
              {mine.map((r) => (
                <li key={r.id} className="flex items-center gap-3 p-4">
                  <FileText className="h-5 w-5 text-granite-500" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-granite-500 mt-0.5">
                      {r.kind} · {r.size ?? r.duration}
                    </p>
                  </div>
                  <Badge tone="success">Visible to Form 3</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
