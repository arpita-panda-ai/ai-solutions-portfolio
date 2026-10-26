import Link from 'next/link'
import {
  Search,
  PenTool,
  Hammer,
  LineChart,
  ArrowUpRight,
  Linkedin,
  Github,
} from 'lucide-react'
import { projects } from '@/lib/projects'
import StatusBadge from '@/components/StatusBadge'

const CONTACT = {
  linkedin: 'https://www.linkedin.com/in/itsarpitapanda',
  github: 'https://github.com/arpita-panda-ai',
}

const whatIBring = [
  {
    title: 'Business analysis',
    description: 'Requirements gathering, process mapping and acceptance criteria that hold up in a sprint review.',
  },
  {
    title: 'AI solution design',
    description: 'Framing where AI genuinely fits a workflow, and designing around its real limitations.',
  },
  {
    title: 'Hands-on building',
    description: 'Prototyping ideas directly rather than only describing them in a deck.',
  },
  {
    title: 'Delivery and collaboration',
    description: 'Stakeholder management and agile delivery, working the way teams actually work, end to end.',
  },
]

const approachSteps = [
  {
    number: '01',
    title: 'Understand',
    quote: '"Before designing anything, I want to know what problem actually needs solving."',
    icon: Search,
  },
  {
    number: '02',
    title: 'Design',
    quote: "\"A solution is only as good as the requirements and constraints it's built around.\"",
    icon: PenTool,
  },
  {
    number: '03',
    title: 'Build',
    quote: "\"I'd rather show a working prototype than describe one.\"",
    icon: Hammer,
  },
  {
    number: '04',
    title: 'Evaluate',
    quote: "\"If it hasn't been tested, I don't assume it works.\"",
    icon: LineChart,
  },
]

const projectMeta: Record<string, { category: string }> = {
  'ai-ops-triage-copilot': { category: 'WORKFLOW AUTOMATION' },
  'ai-adoption-readiness-assessment': { category: 'AI STRATEGY' },
  'requirements-qa': { category: 'BUSINESS ANALYSIS' },
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy">
        <div className="mx-auto max-w-content px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="font-mono text-sm text-mint">AI SOLUTIONS ANALYST</p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Most businesses know AI matters. Few know where it matters most.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            I look beyond individual tasks to understand the entire process, identify where the
            biggest opportunities lie, and determine where AI can create the most value.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <a href="#about" className="text-sm font-medium text-white hover:text-mint">
              More about me ↓
            </a>
            <a href="#contact" className="text-sm font-medium text-mint hover:text-white">
              Let&apos;s connect ↗
            </a>
          </div>
        </div>
      </section>

      {/* About me */}
      <section id="about" className="bg-offwhite">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-offwhite-muted">About</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-offwhite-ink sm:text-4xl">
            My experience and what motivates me.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <p className="text-base leading-relaxed text-offwhite-muted">
              Across enterprise technology, business analysis and, more recently, AI solutions, I
              start from the same place: understanding a business problem well enough to define
              what a good solution actually needs to do.
            </p>
            <p className="text-base leading-relaxed text-offwhite-muted">
              For close to five years that&apos;s meant requirements gathering, stakeholder
              management and translating between business and technical teams, inside agile
              delivery. What interests me most is the space between strategy and execution: turning
              an undefined problem into something buildable, testable and worth shipping.
            </p>
          </div>
          <Link href="/about" className="mt-8 inline-block text-sm font-medium text-offwhite-ink underline decoration-mint decoration-2 underline-offset-4 hover:text-mint">
            Full background →
          </Link>
        </div>
      </section>

      {/* What I bring */}
      <section className="border-y border-offwhite-border bg-white">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-offwhite-muted">Capabilities</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-offwhite-ink sm:text-4xl">
            What I bring.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
            Four things I consistently bring to a problem, in roughly the order I reach for them.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatIBring.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-offwhite-border p-6 motion-safe:transition-colors hover:border-mint"
              >
                <h3 className="text-base font-semibold text-offwhite-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-offwhite-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My approach */}
      <section id="approach" className="bg-offwhite">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-offwhite-muted">Approach</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-offwhite-ink sm:text-4xl">
            How I work.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
            A practical approach to taking a problem from initial idea to tested solution.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-4">
            {approachSteps.map(({ number, title, quote, icon: Icon }, i) => (
              <div
                key={number}
                className={`border-offwhite-border pl-6 lg:border-t lg:pl-0 lg:pt-8 ${
                  i > 0 ? 'border-l lg:border-l-0' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-mint">{number}</span>
                  <Icon size={18} className="text-offwhite-muted" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 text-base font-semibold text-offwhite-ink">{title}</h3>
                <p className="mt-2 text-sm italic leading-relaxed text-offwhite-muted">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What interests me */}
      <section className="border-y border-offwhite-border bg-white">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-widest text-offwhite-muted">Career direction</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-offwhite-ink sm:text-4xl">
            What I want to work on.
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-offwhite-muted">
            <p>
              AI won&apos;t replace every step in a business, but used well, it&apos;s the most
              powerful assistive tool a team has: targeted, purposeful, and built around a real
              problem, not AI for AI&apos;s sake.
            </p>
            <p>
              I&apos;m drawn to roles that sit close to the problem, with enough ownership to see
              an idea through from framing to a working result: applied AI, workflow automation,
              product or product operations, and AI transformation work.
            </p>
          </div>
          <p className="mt-10 text-xl font-semibold leading-snug text-offwhite-ink lg:whitespace-nowrap">
            Understand the problem. <span className="text-mint">Shape the solution.</span> Deliver
            the value.
          </p>
        </div>
      </section>

      {/* Featured work */}
      <section id="work" className="bg-offwhite">
        <div className="mx-auto max-w-content px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-semibold text-offwhite-ink sm:text-4xl">
            A few things I&apos;ve been building.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-offwhite-muted">
            Independent projects built to practice the full loop: framing a problem, designing a
            solution, building it, and evaluating whether it actually works.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col rounded-lg border border-offwhite-border bg-white p-6 motion-safe:transition-colors hover:border-mint"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-offwhite-muted">
                    {projectMeta[project.slug]?.category ?? project.kind}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-offwhite-ink">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-offwhite-muted">
                  {project.oneLiner}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-offwhite-ink group-hover:text-mint">
                  Explore project <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-offwhite-muted">
            These are independent portfolio projects and prototypes, not representations of client
            deployments. Features and evaluation results are documented on the relevant project
            pages.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-navy">
        <div className="mx-auto max-w-content px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-semibold text-white sm:text-4xl">
            Have an interesting problem to solve?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            I&apos;m always glad to talk through a problem, a role, or an idea worth building. The
            easiest ways to reach me are below.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-mint px-5 py-3 text-sm font-medium text-navy motion-safe:transition-opacity hover:opacity-90"
            >
              <Linkedin size={16} />
              Connect on LinkedIn ↗
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-medium text-white motion-safe:transition-colors hover:border-mint hover:text-mint"
            >
              <Github size={16} />
              View GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
