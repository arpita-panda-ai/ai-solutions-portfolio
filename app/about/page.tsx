import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Arpita Panda',
}

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
          I studied an MSc in Management at Cranfield School of Management, and a BEng in Chemical
          Engineering at NIT Rourkela.
        </p>
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
