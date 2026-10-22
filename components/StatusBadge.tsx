import { ProjectStatus, statusLabels } from '@/lib/projects'

const dotColor: Record<ProjectStatus, string> = {
  completed: 'bg-status-completed',
  prototype: 'bg-status-prototype',
  'in-progress': 'bg-status-progress',
  concept: 'bg-status-concept',
}

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-mono text-ink-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[status]}`} />
      {statusLabels[status]}
    </span>
  )
}
