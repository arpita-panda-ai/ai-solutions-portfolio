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
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tools/triage-copilot" className="btn-primary inline-flex">
              Try the live tool
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wide text-ink">
                What I built
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
                <li>Defined the problem, triage logic and extraction rules, and directed the architecture.</li>
                <li>Built the interactive application and the evaluation harness using Claude Code.</li>
                <li>Redesigned the engine from one combined category to two independent axes, department and issue type, after dataset analysis showed every department contains a mix of issue types.</li>
                <li>Designed a 25-case synthetic test set covering clear, ambiguous, missing-information and adversarial requests.</li>
                <li>Separately tested the same engine against 40 real, anonymised IT service-desk tickets from a public Kaggle dataset.</li>
                <li>Fixed genuine classification bugs the testing surfaced, rather than just writing them up as known issues.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-sm font-semibold uppercase tracking-wide text-ink">
                Evaluation results
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-ink-muted">Synthetic · 25 cases</p>
                  <p className="mt-1 text-ink">80% department<br />88% issue type</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs uppercase tracking-wide text-ink-muted">Real-world · 40 tickets</p>
                  <p className="mt-1 text-ink">60% department<br />45% issue type</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                The gap between the two is driven mainly by how the real dataset is already
                stripped of punctuation and phrasing before this engine sees it, not a flaw in the
                department/issue-type model itself; full methodology, iteration history and every
                failed case are on the two linked evaluation reports.
              </p>
            </div>
          </div>
        </>
      )}
      {project.slug === 'ai-adoption-readiness-assessment' && (
        <Link href="/tools/readiness-scorecard" className="btn-primary mt-6 inline-flex">
          Try the full tool
        </Link>
      )}
      {project.slug === 'requirements-qa' && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tools/requirements-qa" className="btn-primary inline-flex">
            Try the live tool
          </Link>
        </div>
      )}

      {isPlanned && (
        <div className="mt-8 rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
          This project hasn't been built yet. The sections below describe the plan (problem,
          evidence and intended approach), not a finished result. This page will be updated once
          work starts.
        </div>
      )}

      <div className="mt-10">
        <Section title="Target user">{project.targetUser}</Section>
        <Section title="Problem">{project.problem}</Section>
        <Section title="Evidence & assumptions">{project.evidence}</Section>
        <Section title={isPlanned ? 'Planned approach' : 'Solution approach'}>
          {project.approach}
          {project.slug === 'ai-ops-triage-copilot' && (
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Department (who should own it) and issue type (what kind of action it needs), scored independently</li>
              <li>Priority with a stated rationale</li>
              <li>Missing information</li>
              <li>Extracted details</li>
              <li>Confidence signal and human-review flag for uncertain cases</li>
            </ul>
          )}
          {project.slug === 'ai-adoption-readiness-assessment' && (
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Steps 1-2, readiness assessment: a 12-question assessment across four weighted areas
                (process maturity, data readiness, change readiness, evaluation and monitoring)
                produces a weighted score and a readiness tier. Every category that falls below a
                risk threshold is surfaced as its own blocker with a specific recommendation, not
                just the single worst one.
              </li>
              <li>
                Step 3, technology-approach recommendation: four further questions about the
                workflow itself (how structured the data is, whether the decision logic can be
                written down as explicit rules, whether the decision needs to be explainable, and
                whether the volume justifies building anything) feed a second, separate rules
                engine that recommends one of four approaches: deterministic rules-based
                automation, AI-assisted automation with mandatory human review, fixing the process
                first, or holding off entirely. Deliberately kept rules-based and auditable rather
                than defaulting to generative AI to make the project look more &quot;AI&quot;.
              </li>
              <li>Step 4, action plan: turns the blockers and the recommended approach into a single ordered action plan.</li>
              <li>Step 5, export: exports the full result as a downloadable report, generated entirely in the browser.</li>
            </ul>
          )}
        </Section>
        <Section title="Out of scope">
          <ul className="list-disc space-y-1 pl-5">
            {project.outOfScope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
        <Section title="Evaluation approach">
          {project.slug === 'ai-ops-triage-copilot' && (
            <ul className="mb-3 list-disc space-y-1 pl-5">
              <li>Synthetic: 25 hand-labelled cases covering clear, ambiguous, incomplete and adversarial requests.</li>
              <li>Real-world: 40 anonymised IT service-desk tickets from a public, CC0-licensed Kaggle dataset, covering all 8 native ticket categories.</li>
            </ul>
          )}
          {project.evaluationApproach}
        </Section>
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

      {project.slug === 'ai-ops-triage-copilot' && (
        <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link href="/tools/triage-eval-report" className="btn-outline inline-flex">
            View synthetic evaluation
          </Link>
          <Link href="/tools/triage-real-eval-report" className="btn-outline inline-flex">
            View real-world evaluation
          </Link>
        </div>
      )}
      {project.slug === 'requirements-qa' && (
        <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link href="/tools/requirements-eval-report" className="btn-outline inline-flex">
            View the live evaluation report
          </Link>
        </div>
      )}
    </main>
  )
}
