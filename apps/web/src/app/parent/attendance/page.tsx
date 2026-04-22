import { Alert, Card, CardContent, CardHeader, CardTitle } from '@hha/ui';

export default function ParentAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-heritage-950">Attendance</h2>
        <p className="text-sm text-granite-600 mt-1">
          You&rsquo;ll be notified immediately if either child is marked absent without an excuse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Farai Moyo · Form 3 Blue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-display-sm text-heritage-950">96%</p>
            <p className="mt-1 text-sm text-granite-600">
              2 absences · 1 excused, 1 unexcused this term
            </p>
            <div className="mt-4 grid grid-cols-12 gap-0.5">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-6 rounded-sm ${i === 18 ? 'bg-msasa-500' : i === 32 ? 'bg-savanna-400' : 'bg-emerald-500'}`}
                  aria-label={i === 18 ? 'Absent' : i === 32 ? 'Late' : 'Present'}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-granite-500 flex gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden /> Present
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-savanna-400" aria-hidden /> Late
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-msasa-500" aria-hidden /> Absent
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tanaka Moyo · Form 1 Green</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-display-sm text-heritage-950">99%</p>
            <p className="mt-1 text-sm text-granite-600">
              1 excused absence this term (doctor&rsquo;s appointment, 12 March)
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert tone="info" title="Automatic notifications">
        If Farai or Tanaka is marked absent before 09:00 without a prior excuse, you&rsquo;ll
        receive an in-app notification and an SMS as a safety net.
      </Alert>
    </div>
  );
}
