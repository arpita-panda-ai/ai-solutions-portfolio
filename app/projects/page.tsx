import Link from 'next/link'
import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import StatusBadge from '@/components/StatusBadge'

export const metadata: Metadata = {
  title: 'Projects | Arpita Panda',
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-ink sm:text-4xl">Projects</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Three independent projects, each demonstrating a different part of the problem-to-solution
        journey: a working application, a product opportunity case study, and an evaluation study.
        Status is labelled accurately — nothing here is presented as finished unless it is.
      </p>

      <div className="mt-12 space-y-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="card flex flex-col gap-4 p-6 hover:border-accent md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {project.kind}
                </span>
                <StatusBadge status={project.status} />
              </div>
              <h2 className="mt-2 font-serif text-xl font-semibold text-ink">{project.title}</h2>
              <p className="mt-1 max-w-xl text-sm text-ink-muted">{project.oneLiner}</p>
              <p className="mt-2 text-xs text-ink-muted">
                Target user: {project.targetUser}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:max-w-[200px] md:justify-end">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-ink-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
