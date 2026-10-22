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
    tools: ['Next.js', 'TypeScript', 'Claude API', 'Rules-based extraction'],
    contribution:
      'Problem framing, triage logic design, extraction rules, UI, evaluation plan. Built with Claude Code; I directed the architecture, requirements and decisions.',
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
      'A labelled synthetic test set will be scored for request-type classification accuracy, completeness of extracted fields, and confidence calibration (whether "high confidence" outputs are actually correct more often than "low confidence" ones). Full results are published as Project 3.',
    limitations:
      'Rules-based v1 will not handle multi-intent or highly ambiguous requests well. This is a deliberate, disclosed limitation, not a hidden one.',
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
  {
    slug: 'triage-copilot-evaluation',
    title: 'Evaluating the Triage Copilot',
    kind: 'Evaluation study',
    oneLiner:
      "An evaluation study measuring the Triage Copilot's accuracy, completeness and confidence calibration against a labelled test set.",
    targetUser: 'Anyone deciding whether the Triage Copilot is reliable enough to trust.',
    status: 'completed',
    tools: ['Synthetic test set', 'Error analysis', 'Confidence calibration'],
    contribution:
      'Designed the 24-case labelled test set and ground-truth labels (assigned before looking at the engine\'s output), built the scoring/calibration logic, and ran the evaluation. Built with Claude Code; I directed the methodology and interpreted the results.',
    problem:
      'A working demo proves nothing about reliability on its own. Before this is presented as credible, it needs to be tested against cases it has not seen, including ones designed to break it.',
    evidence:
      'A 24-case synthetic test set spanning 4 buckets: clear cases (8), ambiguous/overlapping cases (6), missing-information cases (5), and adversarial cases designed to break naive keyword matching — e.g. negation, sarcasm, multi-intent requests, and unrelated text containing trigger words (5).',
    approach:
      'Ran the Triage Copilot\'s rules engine against the labelled set and scored request-type accuracy, priority accuracy, human-review-flag accuracy, and confidence calibration (whether higher-confidence outputs are actually correct more often). Results: 62.5% overall type accuracy (vs. a 25% baseline of always guessing the most common category), 79.2% priority accuracy, and 87.5% review-flag accuracy. Accuracy by difficulty: 100% on clear cases, 33.3% on ambiguous cases, 60% on missing-information cases, 40% on adversarial cases — accuracy drops exactly where it should. Confidence calibration held up: cases scored 0.8+ confidence were 100% correct, while cases scored under 0.4 confidence were only 33.3% correct, meaning the confidence score is a genuinely useful signal for deciding what to trust.',
    outOfScope: ['Evaluating any system other than this project\'s own Triage Copilot'],
    evaluationApproach:
      'Dataset construction (hand-labelled, blind to engine output), scoring criteria (type/priority/review-flag accuracy, confidence calibration by band), and a baseline comparison against always guessing the most common category. Full results, including every failed case with expected-vs-actual output, are shown on the live report — nothing is summarised away.',
    limitations:
      'A 24-case set is small — it is enough to catch and characterise clear failure patterns, not to produce statistically precise accuracy figures. The most common failure mode found was category tie-breaking defaulting to "Incident" when two categories scored equally (e.g. multi-intent requests mentioning both "broken" and "access") — a specific, identified gap in the tie-breaking logic, documented here rather than quietly fixed and hidden. Negation ("NOT broken") and sarcasm are not detected at all, by design, since this is a keyword/pattern engine, not an NLU model.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
