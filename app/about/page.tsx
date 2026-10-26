import type { Metadata } from 'next'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Arpita Panda',
}

interface TimelineEntry {
  org: string
  role: string
  dates: string
  achievements: string[]
}

const TIMELINE: TimelineEntry[] = [
  {
    org: 'Chubb',
    role: 'AI Solutions Analyst',
    dates: 'Mar 2025 – Present',
    achievements: [
      'Reduced policy quality-assurance turnaround by 89% (45 minutes to 5 minutes) by leading delivery of a GenAI document-review solution adopted across 5 countries and 3 lines of business.',
      'Improved classification accuracy from 40% to 90% by independently developing a GenAI-powered company-classification tool, later adopted by global teams for underwriting and portfolio audit.',
      'Increased customer engagement by 42% and sales conversion by 9% across 3 products in 4 international markets through AI-driven call-transcript analysis and structured A/B testing.',
    ],
  },
  {
    org: 'Eqonic Group Limited',
    role: 'Business Analyst',
    dates: 'Jan 2024 – Feb 2025',
    achievements: [
      'Increased lead generation by 50% and contributed to a £500K projected revenue uplift via an automated, data-driven go-to-market strategy.',
      'Improved EBITDA performance by 12% through automated SKU profitability reporting and procurement alignment analysis.',
      'Boosted conversion rates by 30% by translating customer-behaviour analysis into targeted, automated client proposals.',
    ],
  },
  {
    org: 'Eli Lilly and Company, Bangalore',
    role: 'Software Configuration and Development Analyst',
    dates: 'Mar 2023 – Aug 2023',
    achievements: [
      'Saved $250K annually by identifying process inefficiencies via Celonis process mining and implementing automation interventions with the finance team.',
      'Drove a 20% increase in user engagement and a 15% reduction in onboarding time by leading enterprise-wide deployment of the WalkMe digital adoption platform.',
    ],
  },
  {
    org: 'Eli Lilly and Company, Bangalore',
    role: 'IT Analyst',
    dates: 'Jul 2021 – Feb 2023',
    achievements: [
      'Reduced processing time from 3 days to 8 hours by automating compensation workflows for 2,000+ employees using RPA with data extraction and validation logic.',
      'Drove a 56% increase in automation adoption by evaluating and prioritising 100+ automation use cases and providing governance recommendations to global team managers.',
    ],
  },
]

const OUTCOMES = [
  {
    value: '£30M+',
    label: 'Quantified impact',
    detail: 'Across 5+ lines of business and multiple countries through AI automation solutions (Chubb).',
  },
  {
    value: '£500K',
    label: 'Projected revenue uplift',
    detail: 'From an automated, data-driven go-to-market strategy (Eqonic Group).',
  },
  {
    value: '$250K',
    label: 'Annual savings',
    detail: 'From process-mining-led automation of redundant manual tasks (Eli Lilly).',
  },
  {
    value: '56%',
    label: 'Increase in automation adoption',
    detail: 'From evaluating and prioritising 100+ automation use cases (Eli Lilly).',
  },
]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl text-ink sm:text-4xl">About</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-muted">
        <p>
          I'm an AI Solutions Analyst with around five years of experience across AI solutions,
          business analysis, process improvement and enterprise technology. My work sits at the
          intersection of business problem framing, AI solution design, product thinking and
          delivery: understanding what a team actually needs before reaching for an AI solution,
          and staying involved through requirements, prototyping and evaluation.
        </p>
        <p>
          I'm currently an AI Solutions Analyst, working on business problem discovery, AI and
          generative AI solution design, and cross-functional delivery within an enterprise
          environment. Day-to-day that means translating business needs into structured
          requirements, understanding current and future-state processes, and working across
          business, product and delivery teams.
        </p>
        <p>
          Before that, I worked as a Business Analyst in the renewable energy and consumer solar
          sector (requirements gathering, go-to-market analysis and commercially-informed
          decision-making), and earlier still in enterprise IT, software configuration and
          workflow automation, focused on process improvement and operational efficiency.
        </p>
        <p>
          I studied an MSc in Management at Cranfield School of Management, and a BTech in Chemical
          Engineering at NIT Rourkela.
        </p>
        <a href="/Arpita-Panda-CV.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2">
          <Download size={14} />
          Download CV
        </a>
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-xl font-semibold text-ink">Selected outcomes</h2>
        <p className="mt-2 text-sm text-ink-muted">
          A few figures from across my professional experience that I'm able to share publicly.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OUTCOMES.map((outcome) => (
            <div key={outcome.label} className="card p-4">
              <p className="font-serif text-2xl font-semibold text-ink">{outcome.value}</p>
              <p className="mt-1 text-sm font-medium text-ink">{outcome.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{outcome.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-xl font-semibold text-ink">Career timeline</h2>
        <div className="mt-5 space-y-8">
          {TIMELINE.map((entry) => (
            <div key={`${entry.org}-${entry.role}`} className="border-t border-border pt-6 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div>
                  <p className="font-serif text-base font-semibold text-ink">{entry.org}</p>
                  <p className="text-sm text-ink-muted">{entry.role}</p>
                </div>
                <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">{entry.dates}</span>
              </div>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-muted">
                {entry.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 space-y-6 text-base leading-relaxed text-ink-muted">
        <p>
          The projects on this site are independent work, built outside of and separate from any
          employer's confidential projects, using synthetic data and public evidence. I use tools
          including Claude Code to help build them: my contribution is in the problem framing,
          requirements, architecture and product decisions, directing implementation, and
          evaluating the result, not in manually writing every line of code.
        </p>
      </div>
    </main>
  )
}
