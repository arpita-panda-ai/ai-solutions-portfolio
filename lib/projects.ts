export type ProjectStatus = 'completed' | 'prototype' | 'in-progress' | 'concept'

export const statusLabels: Record<ProjectStatus, string> = {
  completed: 'Completed',
  prototype: 'Working prototype',
  'in-progress': 'In progress',
  concept: 'Concept',
}

export interface Project {
  slug: string
  title: string
  kind: 'Flagship application' | 'Product case study' | 'Evaluation study'
  oneLiner: string
  targetUser: string
  status: ProjectStatus
  tools: string[]
  contribution: string
  problem: string
  evidence: string
  approach: string
  outOfScope: string[]
  evaluationApproach: string
  limitations: string
}

export const projects: Project[] = [
  {
    slug: 'ai-ops-triage-copilot',
    title: 'AI Ops Intake Triage Copilot',
    kind: 'Flagship application',
    oneLiner:
      'Turns an unstructured business request into a structured, actionable triage decision.',
    targetUser:
      'Operations and business-analysis teams who triage inbound requests (service requests, change requests, support tickets) before work can start.',
    status: 'in-progress',
    tools: ['Next.js', 'TypeScript', 'Claude API', 'Rules-based extraction', 'Evaluation harness'],
    contribution:
      'Problem framing, triage logic design, extraction rules, UI, and the evaluation harness (test-set design, scoring, calibration analysis). Built with Claude Code; I directed the architecture, requirements and decisions.',
    problem:
      'Requests arrive as free text with inconsistent detail. Before any real work can start, someone has to read it, work out what type of request it is, how urgent it is, what is missing, and who should own it. That triage step is manual, inconsistent between people, and easy to get wrong when volume is high.',
    evidence:
      'Public service-desk and claims-operations research (e.g. Zendesk and ServiceNow benchmark reporting on ticket backlog and misrouting) describes this as a persistent, measurable bottleneck. This project uses synthetic example requests, not real company data.',
    approach:
      'A rules-first extraction and classification engine (clearly labelled as rules-based, not an LLM, unless a model call is actually wired in) reads a request and outputs: request type, extracted key details, a priority level with stated rationale, a list of missing information, a suggested owner/team, and a confidence score. Low-confidence outputs are explicitly flagged for human review rather than auto-routed.',
    outOfScope: [
      'Integration with a real ticketing system (Jira, ServiceNow, etc.)',
      'Multi-turn conversation or follow-up questions',
      'User accounts or authentication',
      'Training a custom classification model',
    ],
    evaluationApproach:
      'Tested against a 24-case synthetic, hand-labelled set (8 clear, 6 ambiguous, 5 missing-information, 5 adversarial — the last designed to break naive keyword matching with negation, sarcasm and multi-intent requests). The first evaluation run surfaced real bugs — a word-boundary regex that silently failed on inflected verbs ("changed", "updated"), missing keywords ("fix", "emergency"), no negation handling, and category ties that silently defaulted to "Incident" — which were then fixed in the engine itself, not just written up as known issues. Live, always-current results after those fixes: 91.7% overall type accuracy (up from 62.5% before the fixes, vs. a 25% baseline of always guessing the most common category), 87.5% priority accuracy, 87.5% review-flag accuracy. Adversarial-case type accuracy went from 40% to 100%; clear and missing-information cases are both at 100%. Confidence calibration holds up — cases scored 0.6+ confidence are 100% correct, cases under 0.4 confidence are correct only 77.8% of the time — meaning the confidence score is a genuinely trustworthy signal, not decorative. Full methodology and every remaining failed case (nothing cherry-picked) are on the live report linked above.',
    limitations:
      'Two categories of failure remain after fixing what was genuinely fixable. First, honest ambiguity: when two categories score an exact tie (e.g. a request mentioning both "broken" and "access"), the engine no longer guesses — it now explicitly returns "unclassified" and flags it for human disambiguation rather than silently defaulting to "Incident" as it used to. This is more honest, but it means a couple of genuinely ambiguous requests are still scored as "wrong" against a single expected label, by design. Second, real semantic gaps a keyword engine cannot close: negation ("NOT broken") is now caught in simple cases via a short negation window, but won\'t catch negation that spans a longer clause; sarcasm, true multi-intent splitting, and distinguishing a genuinely vague request from meaningless noise text are not modelled at all. These are documented rather than hidden. The 24-case test set is small enough to characterise failure patterns but not to produce statistically precise accuracy figures.',
  },
  {
    slug: 'ai-adoption-readiness-assessment',
    title: 'AI Adoption Readiness Assessment',
    kind: 'Product case study',
    oneLiner:
      'A structured scorecard that assesses whether a team is actually ready to adopt an AI workflow before budget is committed.',
    targetUser:
      'Operations and transformation leaders at mid-size companies deciding whether to fund an AI pilot.',
    status: 'prototype',
    tools: ['Product framing', 'Weighted scoring framework', 'Next.js prototype'],
    contribution:
      'Problem framing, scorecard design (categories, weights, questions, recommendations), and the interactive prototype. Built with Claude Code; I directed the scope, scoring logic and content.',
    problem:
      'Many AI pilots are funded and built, then never reach production or get abandoned after launch, often because the team was not actually ready: unclear ownership, poor data quality, no plan for human review, or no way to tell if it is working.',
    evidence:
      'Published industry research on AI pilot failure rates (McKinsey, BCG and Gartner reporting on the gap between AI pilots and production adoption) describes this as a widespread pattern. This prototype does not cite specific statistics from that research in its outputs — the scoring logic below is my own framework, not a reproduction of any named study\'s methodology.',
    approach:
      'A weighted scorecard across four categories — process maturity, data quality & availability, change readiness, and evaluation & monitoring capability (12 questions total) — producing an overall readiness score, a tier (Ready to pilot / Ready with conditions / Not ready yet), and a flagged biggest-risk category with a concrete recommendation. The underlying weights and thresholds are a transparent, documented judgment call, not a validated scientific model — see Limitations.',
    outOfScope: [
      'A production-grade or validated scoring engine',
      'Claims of adoption or usage by any real company or team',
      'Integration with any specific company\'s systems',
      'Competitive benchmarking against named commercial readiness-assessment products',
    ],
    evaluationApproach:
      'This is a product/strategy artefact, not a predictive model. "Evaluation" here means internal consistency of the scoring logic (weights sum to 1, category math is transparent and auditable) and clarity about assumptions — not a performance metric validated against real outcomes.',
    limitations:
      'The category weights, question set and score thresholds are my own reasoned design, not derived from a validated dataset of real pilot outcomes — treat the output as a structured conversation-starter, not a certified verdict. It has not been tested against any real team\'s actual pilot outcome. A weighted average can hide a single catastrophic gap (e.g. data that does not exist at all, outweighed by strong scores elsewhere) — the scorecard deliberately overrides the tier in that case rather than reporting a falsely reassuring average; this was found and fixed during testing.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
