import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/lib/projects'
import StatusBadge from '@/components/StatusBadge'

const pillars = [
  {
    title: 'Problem framing',
    description:
      'Starting from an ambiguous business request or process, not a predetermined AI use case — structuring what the actual problem is before proposing a solution.',
  },
  {
    title: 'Solution design',
    description:
      'Deciding what AI is (and isn\'t) the right tool for, what the MVP actually needs, and what to deliberately leave out.',
  },
  {
    title: 'Prototyping & evaluation',
    description:
      'Building a working version, then testing it against real criteria — not just shipping a demo and assuming it works.',
  },
  {
    title: 'Delivery & adoption',
    description:
      'Thinking about rollout, human review, and whether a team is actually ready to use what\'s been built.',
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-content px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          AI Solutions · Business Analysis · Product
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
          Turning business problems into practical AI solutions.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          I'm an AI Solutions Analyst working across problem framing, AI solution design,
          prototyping and evaluation — the full path from an ambiguous business request to
          something that actually ships and gets adopted. This site documents independent
          projects I've built to demonstrate that range.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/projects" className="btn-primary">
            View projects
            <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="btn-outline">
            Get in touch
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="text-base font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl text-ink sm:text-3xl">Projects</h2>
          <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="card flex flex-col gap-4 p-6 hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {project.kind}
                </span>
                <StatusBadge status={project.status} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-ink">{project.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{project.oneLiner}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl text-ink">About</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Five years across AI solutions, business analysis and enterprise technology —
                currently an AI Solutions Analyst, previously in business analysis and
                enterprise IT/automation.
              </p>
            </div>
            <Link href="/about" className="btn-outline whitespace-nowrap">
              Read more
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
