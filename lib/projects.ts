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
  kind: 'Flagship application' | 'Product strategy' | 'Evaluation study'
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
      'Operations and business-analysis teams that triage incoming service requests, change requests and support tickets before work can begin.',
    status: 'in-progress',
    tools: ['Next.js', 'TypeScript', 'Rules-based classification', 'Claude Code', 'Evaluation harness', 'Public Kaggle dataset'],
    contribution:
      'Defined the problem, requirements and triage logic; directed the architecture; designed the extraction rules and user interface; and built the evaluation harness, including test-case design, scoring and confidence analysis. Used Claude Code to support development, with responsibility for the architecture and implementation decisions.',
    problem:
      'Requests arrive as unstructured text, leaving someone to manually determine the category, urgency, missing information and appropriate owner. This creates a repetitive, inconsistent step before work can start.',
    evidence:
      'Public service-desk and claims-operations research (e.g. Zendesk and ServiceNow benchmark reporting on ticket backlog and misrouting) describes this as a persistent, measurable bottleneck. This project uses synthetic example requests, not real company data.',
    approach:
      'A rules-based engine that scores two independent axes, department (who should own it) and issue type (what kind of action it needs), after dataset analysis showed every department contains a mix of issue types, so a single combined category was conflating topic with action. The prototype does not automatically route requests or integrate with a live ticketing system.',
    outOfScope: [
      'Integration with a real ticketing system (Jira, ServiceNow, etc.)',
      'Multi-turn conversation or follow-up questions',
      'User accounts or authentication',
      'Training a custom classification model',
    ],
    evaluationApproach:
      'Scoring department and issue type independently is a stricter test than one combined category: a tie on either axis now falls back to a conservative default rather than guessing. On the 25-case synthetic set it scores 80% department accuracy and 88% issue type accuracy (vs 52%/36% majority-guess baselines), 88% priority accuracy, and correctly flags cases for human review 80% of the time, up from an initial 72%/80%/88%/72% pass after fixing two genuine rule gaps that reviewing every failure by hand surfaced. On the 40-case real-world set it scores 60% department accuracy and 45% issue type accuracy (vs 12.5%/27.5% baselines), unchanged by that fix, a real drop that is reported directly rather than hidden, and the honest ceiling of keyword matching against terse real tickets. Confidence calibration is noisy at this sample size and not yet a reliable signal on its own. Full scoring methodology, the iteration history and every remaining failed case are on the linked evaluation reports.',
    limitations:
      'The prototype remains a rules-based proof of concept, not a production-ready routing system. Scoring department and issue type independently is more realistic but stricter: it can still struggle with overlapping categories, complex negation, sarcasm and requests containing multiple intents, and confidence calibration is not yet reliable at the current sample size. The evaluation datasets are also too small to establish statistically reliable performance. The next step is to compare the rules-based engine with an LLM-assisted approach on a larger, independently evaluated dataset, measuring classification quality, uncertainty handling, latency and cost.',
  },
  {
    slug: 'ai-adoption-readiness-assessment',
    title: 'AI Pilot Readiness Scorecard',
    kind: 'Product strategy',
    oneLiner:
      'An interactive tool that takes a team through the full decision journey for an AI pilot: assess readiness, identify blockers, get a recommended technology approach, build an action plan, and export a report.',
    targetUser:
      'Operations and transformation leaders deciding whether, and how, to pilot an AI workflow.',
    status: 'prototype',
    tools: [
      'Product framing',
      'Weighted scoring framework',
      'Rules-based decision engine',
      'Next.js',
      'TypeScript',
      'Claude Code',
    ],
    contribution:
      'I framed the business problem, designed the readiness questions and weighted scoring framework, designed the separate workflow-nature questions and technology-approach decision rules, defined the action-plan and report logic, and directed development of the full five-step interactive prototype using Claude Code.',
    problem:
      'AI pilots can struggle to reach production when teams lack clear ownership, usable data, human-review processes or meaningful ways to measure success, and even teams that clear those bars often default straight to a generative-AI build without checking whether a simpler, cheaper, more auditable approach would actually fit the task better. Both gaps are easier to address before a pilot begins than after a solution has been built.',
    evidence:
      'Published industry research on AI pilot failure rates (McKinsey, BCG and Gartner reporting on the gap between AI pilots and production adoption) describes this as a widespread pattern. This prototype does not cite specific statistics from that research in its outputs: the scoring and decision logic below is my own framework, not a reproduction of any named study\'s methodology.',
    approach:
      'A five-step decision journey rather than a single score. All thresholds and decision branches are a transparent, documented judgment call, not a validated scientific model. See Limitations.',
    outOfScope: [
      'A production-grade or validated scoring engine',
      'Claims of adoption or usage by any real company or team',
      'Integration with any specific company\'s systems',
      'Competitive benchmarking against named commercial readiness-assessment products',
      'Vendor or tool selection within a recommended technology approach',
      'Project planning, resourcing or timeline estimation beyond a simple action-plan checklist',
    ],
    evaluationApproach:
      'This is a product/strategy artefact, not a predictive model. "Evaluation" here means internal consistency of the scoring and decision logic (weights sum to 1, every threshold and branch is transparent and auditable) and clarity about assumptions, not a performance metric validated against real outcomes. Testing the readiness score exposed a weakness in relying on a weighted average alone: strong scores in some areas could conceal a critical gap elsewhere, so I added an override that caps the tier when a sufficiently serious gap exists in any one category. The technology-approach recommendation follows the same principle: every branch (e.g. low volume routes to "not worth automating yet" regardless of readiness) is a traceable rule, not a black box.',
    limitations:
      'The weights, thresholds and technology-approach rules are reasoned design choices, not scientifically validated models, and neither has been tested against real teams or their eventual pilot outcomes. The four workflow-nature questions behind the technology recommendation cover the most common cases (data structure, rule-writability, explainability, volume) but are not an exhaustive decision framework, and the generated action plan is a starting checklist, not a project plan. The tool is intended to structure readiness and technology-approach discussions, not replace expert judgement. Next steps: test the full journey with operations and transformation professionals, gather feedback on whether the readiness and workflow-nature questions capture the most important considerations, and compare recommended approaches with real pilot outcomes over time before making any claims about predictive validity.',
  },
  {
    slug: 'requirements-qa',
    title: 'Requirements & User Story QA',
    kind: 'Flagship application',
    oneLiner:
      'Reads a user story or requirement and flags exactly what a reviewer would flag before it reaches a sprint: ambiguous language, missing or untestable acceptance criteria, incomplete structure.',
    targetUser:
      'Business analysts and product owners reviewing user stories or requirements before they are accepted into a sprint or backlog.',
    status: 'in-progress',
    tools: ['Next.js', 'TypeScript', 'Rules-based NLP-lite pattern matching', 'Evaluation harness'],
    contribution:
      'Problem framing, the ambiguity/testability rule set, the evaluation test-set design and scoring, and the UI. Built with Claude Code; I directed the architecture, requirements and decisions.',
    problem:
      'Vague or incomplete requirements ("make it user-friendly", "handle errors appropriately") pass review, then cause rework, disputes about what "done" means, or untestable acceptance criteria discovered late. A first-pass, consistent check for ambiguity and testability, before a human reviewer spends time on it, catches a meaningful share of this early.',
    evidence:
      'Requirements-engineering literature (e.g. INCOSE\'s Guide for Writing Requirements, NASA\'s requirements guidance) maintains well-known lists of ambiguous terms and testability criteria precisely because this is a recurring, named problem in practice. This project uses synthetic example requirements, not real company data.',
    approach:
      'A rules-based engine (clearly labelled as pattern matching, not an LLM) reads a user story or plain requirement and returns: detected format, a list of specific issues (ambiguous terms, compound/bundled requirements, missing or untestable acceptance criteria, missing role or benefit for user stories, too-brief fragments) each with severity and an excerpt, a quality score, and a set of clarifying questions a BA could ask the stakeholder. Low-confidence or blocker-level outputs are explicitly flagged for human review.',
    outOfScope: [
      'Integration with a real backlog tool (Jira, Azure DevOps, etc.)',
      'Automatically rewriting or "fixing" the requirement text',
      'True natural-language understanding (semantic parsing, sarcasm, multi-sentence negation)',
      'Training a custom NLP model',
    ],
    evaluationApproach:
      'Tested against a 19-case synthetic, hand-labelled set (8 clear, 3 ambiguous, 4 missing-information, 4 adversarial) scored on four dimensions: format detection, acceptance-criteria detection, the human-review flag, and whether the expected issue types were found without false positives. Ground-truth labels were derived by tracing the engine\'s own rules against each case rather than from independent domain judgement, so this is closer to a thorough logic/regression check than a fully blind evaluation. See Limitations. That process still caught one genuine bug: a single line of ordinary prose starting with "When" was being misread as a one-line Gherkin acceptance-criteria block, swallowing the entire requirement and hiding it from every other check; this was fixed (restricting that heuristic to inputs with more than one line) before the final numbers below. Current results: 100% format accuracy, 100% acceptance-criteria detection accuracy, 100% review-flag accuracy, 100% issue-type accuracy, against a 57.9% baseline of always flagging everything for human review. Full methodology and the complete case list are on the live report linked above.',
    limitations:
      'Because the test set was built by tracing the engine\'s logic rather than independent blind labelling, the 100% scores mainly confirm the rules behave as designed, not that the design itself is complete. Several deliberate, disclosed gaps remain. The curated ambiguous-term list (29 terms from standard requirements-engineering checklists) will miss vague words outside that list (e.g. "better", "nicer"). Acceptance-criteria lines written in Given/When/Then form are always treated as testable regardless of content, so a vague Gherkin step can still slip through. The compound-requirement check is a blunt "and"-counting smell detector: it flags legitimately well-specified multi-clause requirements and repetitive noise text alike, with no real parsing of whether the clauses are actually independent. An incomplete user-story fragment (e.g. "As a user" with no "I want") is not recognized as a user story at all. None of this is hidden; it is the honest ceiling of a keyword/pattern-based v1, not a trained model.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
