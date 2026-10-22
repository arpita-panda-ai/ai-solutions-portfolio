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
    status: 'concept',
    tools: ['Product research', 'PRD', 'Scoring framework', 'Prototype (planned)'],
    contribution:
      'Not yet built. Scope defined; research, PRD and prototype to follow in a later phase.',
    problem:
      'Many AI pilots are funded and built, then never reach production or get abandoned after launch, often because the team was not actually ready: unclear ownership, poor data quality, no plan for human review, or no way to tell if it is working.',
    evidence:
      'Published industry research on AI pilot failure rates (McKinsey, BCG and Gartner reporting on the gap between AI pilots and production adoption) will be cited directly, with sources, rather than restated as unsourced claims.',
    approach:
      'A weighted scorecard across process maturity, data quality, change-readiness and evaluation capability, plus a short written product brief: target user, competitive landscape, PRD, prioritisation, a simple prototype or clickable workflow, and an MVP roadmap.',
    outOfScope: [
      'A production-grade scoring engine',
      'Claims of adoption or usage by any real company',
      'Integration with any specific company\'s systems',
    ],
    evaluationApproach:
      'This is a product/strategy artefact, not a measurable system. "Evaluation" here means internal consistency of the scoring logic and transparency about assumptions, not a performance metric.',
    limitations:
      'Not yet started. This page will be updated once research and the prototype exist.',
  },
  {
    slug: 'triage-copilot-evaluation',
    title: 'Evaluating the Triage Copilot',
    kind: 'Evaluation study',
    oneLiner:
      "An evaluation study measuring the Triage Copilot's accuracy, completeness and confidence calibration against a labelled test set.",
    targetUser: 'Anyone deciding whether the Triage Copilot is reliable enough to trust.',
    status: 'concept',
    tools: ['Synthetic test set', 'Error analysis'],
    contribution: 'Not yet started — depends on Project 1 being built first.',
    problem:
      'A working demo proves nothing about reliability on its own. Before this is presented as credible, it needs to be tested against cases it has not seen, including ones designed to break it.',
    evidence:
      'Test cases will be synthetic, written specifically to cover clear cases, ambiguous cases, missing-information cases and adversarial/edge cases.',
    approach:
      'Run the Triage Copilot against a labelled set of 20-30 synthetic requests, score classification accuracy, field-extraction completeness and confidence calibration, then categorise failures by type.',
    outOfScope: ['Evaluating any system other than this project\'s own Triage Copilot'],
    evaluationApproach:
      'The evaluation methodology itself: dataset construction, scoring criteria, baseline comparison (e.g. against always-guessing-the-most-common-type), and documented limitations of the evaluation.',
    limitations:
      'Not yet started. Depends on Project 1 reaching a testable state first.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
