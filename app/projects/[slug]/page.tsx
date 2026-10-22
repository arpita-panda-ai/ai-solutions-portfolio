import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProject, projects } from '@/lib/projects'
import StatusBadge from '@/components/StatusBadge'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  return { title: project ? `${project.title} | Arpita Panda` : 'Project | Arpita Panda' }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </div>
  )
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const isPlanned = project.status === 'concept'

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          {project.kind}
        </span>
        <StatusBadge status={project.status} />
      </div>

      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{project.oneLiner}</p>

      {project.slug === 'ai-ops-triage-copilot' && (
        <Link href="/tools/triage-copilot" className="btn-primary mt-6 inline-flex">
          Try the live tool
        </Link>
      )}
      {project.slug === 'ai-adoption-readiness-assessment' && (
        <Link href="/tools/readiness-scorecard" className="btn-primary mt-6 inline-flex">
          Try the scorecard
        </Link>
      )}

      {isPlanned && (
        <div className="mt-8 rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
          This project hasn't been built yet. The sections below describe the plan — problem,
          evidence and intended approach — not a finished result. This page will be updated once
          work starts.
        </div>
      )}

      <div className="mt-10">
        <Section title="Target user">{project.targetUser}</Section>
        <Section title="Problem">{project.problem}</Section>
        <Section title="Evidence & assumptions">{project.evidence}</Section>
        <Section title={isPlanned ? 'Planned approach' : 'Solution approach'}>
          {project.approach}
        </Section>
        <Section title="Out of scope">
          <ul className="list-disc space-y-1 pl-5">
            {project.outOfScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
        <Section title="Evaluation approach">{project.evaluationApproach}</Section>
        <Section title="My contribution">{project.contribution}</Section>
        <Section title="Limitations">{project.limitations}</Section>
        <Section title="Tools">
          <div className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-ink-muted"
              >
                {tool}
              </span>
            ))}
          </div>
        </Section>
      </div>
    </main>
  )
}
