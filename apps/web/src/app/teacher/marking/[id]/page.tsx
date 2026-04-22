import { MarkingWorkspace } from '@/components/teacher/marking-workspace';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MarkingPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <MarkingWorkspace
      assignmentId={id}
      assignmentTitle="Problem Set 7 — Quadratic Equations"
      classLabel="Form 4A · Mathematics"
      maxMarks={100}
      rubricTemplate={[
        { criterion: 'Method', max: 40 },
        { criterion: 'Accuracy', max: 40 },
        { criterion: 'Presentation', max: 20 },
      ]}
    />
  );
}
