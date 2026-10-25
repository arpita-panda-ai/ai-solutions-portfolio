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
    tools: ['Next.js', 'TypeScript', 'Claude API', 'Rules-based extraction', 'Evaluation harness', 'Real-world evaluation (Kaggle dataset)'],
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
      'Tested against a 25-case synthetic, hand-labelled set (8 clear, 6 ambiguous, 5 missing-information, 6 adversarial — the last designed to break naive keyword matching with negation, sarcasm and multi-intent requests). The first evaluation run surfaced real bugs — a word-boundary regex that silently failed on inflected verbs ("changed", "updated"), missing keywords ("fix", "emergency"), no negation handling, and category ties that silently defaulted to "Incident" — which were then fixed in the engine itself, not just written up as known issues. A sixth adversarial case ("Payment is not working") was added later after live manual testing surfaced it directly — the bare word "payment" doubled as a full-weight Billing keyword and tied against Incident\'s "not working". The first fix attempt (removing "payment" outright) over-corrected and broke a genuine payment complaint with no other finance words ("Cannot process my payment", caught by a second round of live testing); the actual fix keeps "payment" as a separate, lower-weight signal, so it still classifies a payment-only complaint as Billing on its own but loses any tie against a same- or higher-weight Incident/Access/Change signal. Live, always-current results after all fixes: 92% overall type accuracy (up from an initial 62.5% pre-fix baseline on the original 24 cases, vs. a 28% baseline of always guessing the most common category on the current 25), 88% priority accuracy, 88% review-flag accuracy. Confidence calibration holds up — cases scored 0.4+ confidence are consistently correct (100%), while cases under 0.4 confidence are correct only 77.8% of the time — meaning the confidence score is a genuinely trustworthy signal, not decorative. Full methodology and every remaining failed case (nothing cherry-picked) are on the live report linked above. Separately, because a hand-written synthetic set risks flattering the engine, the same rules engine was also tested — on its own live report — against 35 real (anonymised) IT service desk tickets from a public, CC0-licensed Kaggle dataset, not company data, stratified across 7 of its 8 source categories (the 8th, "HR Support", has no analog in this engine\'s scope and was excluded). Real-world type accuracy is 42.9% against a 31.4% baseline of always guessing the most common category — far lower than the synthetic-set figure above, and that gap is reported directly rather than hidden. That run surfaced two more genuine vocabulary gaps (the words "issue" and "problem" were missing from the Incident category, and "receipt" was missing from Billing), which were fixed in the engine, improving real-world accuracy from an initial 37.1% to 42.9%.',
    limitations:
      'Two categories of failure remain after fixing what was genuinely fixable. First, honest ambiguity: when two categories score an exact tie (e.g. a request mentioning both "broken" and "access"), the engine no longer guesses — it now explicitly returns "unclassified" and flags it for human disambiguation rather than silently defaulting to "Incident" as it used to. This is more honest, but it means a couple of genuinely ambiguous requests are still scored as "wrong" against a single expected label, by design. Second, real semantic gaps a keyword engine cannot close: negation ("NOT broken") is now caught in simple cases via a short negation window, but won\'t catch negation that spans a longer clause; sarcasm, true multi-intent splitting, and distinguishing a genuinely vague request from meaningless noise text are not modelled at all. These are documented rather than hidden. The 25-case test set is small enough to characterise failure patterns but not to produce statistically precise accuracy figures. The real-world evaluation (its own live report) surfaces a further, more fundamental limitation: on 35 real IT service tickets, type accuracy is only 42.9%, barely above a 31.4% always-guess-the-largest-category baseline — a large drop from the synthetic set\'s 91.7%. This is not a discrepancy to explain away; it is the honest ceiling of a keyword-matching engine against real, terse, often verb-less phrasing that a hand-written synthetic set cannot capture. Fixing two genuinely missing, general keywords ("issue"/"problem" for Incident, "receipt" for Billing) improved real-world accuracy but also introduced two new false positives from category-vocabulary collisions (a generic agile term "issue types" wrongly triggering Incident; a tie between Change and Incident on the shared word "issue") — a concrete illustration that expanding a rules engine\'s vocabulary is not a free lunch. A further, more extensive verb-list expansion for the Change category (e.g. "move", "create", "set up", "postpone") was considered and deliberately not made, because that fix list would have been reverse-engineered from this exact 35-ticket answer key and risked tuning to the test rather than genuinely improving the engine.',
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
      'Vague or incomplete requirements ("make it user-friendly", "handle errors appropriately") pass review, then cause rework, disputes about what "done" means, or untestable acceptance criteria discovered late. A first-pass, consistent check for ambiguity and testability — before a human reviewer spends time on it — catches a meaningful share of this early.',
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
      'Tested against a 19-case synthetic, hand-labelled set (8 clear, 3 ambiguous, 4 missing-information, 4 adversarial) scored on four dimensions: format detection, acceptance-criteria detection, the human-review flag, and whether the expected issue types were found without false positives. Ground-truth labels were derived by tracing the engine\'s own rules against each case rather than from independent domain judgement, so this is closer to a thorough logic/regression check than a fully blind evaluation — see Limitations. That process still caught one genuine bug: a single line of ordinary prose starting with "When" was being misread as a one-line Gherkin acceptance-criteria block, swallowing the entire requirement and hiding it from every other check; this was fixed (restricting that heuristic to inputs with more than one line) before the final numbers below. Current results: 100% format accuracy, 100% acceptance-criteria detection accuracy, 100% review-flag accuracy, 100% issue-type accuracy, against a 57.9% baseline of always flagging everything for human review. Full methodology and the complete case list are on the live report linked above.',
    limitations:
      'Because the test set was built by tracing the engine\'s logic rather than independent blind labelling, the 100% scores mainly confirm the rules behave as designed, not that the design itself is complete — several deliberate, disclosed gaps remain. The curated ambiguous-term list (29 terms from standard requirements-engineering checklists) will miss vague words outside that list (e.g. "better", "nicer"). Acceptance-criteria lines written in Given/When/Then form are always treated as testable regardless of content, so a vague Gherkin step can still slip through. The compound-requirement check is a blunt "and"-counting smell detector — it flags legitimately well-specified multi-clause requirements and repetitive noise text alike, with no real parsing of whether the clauses are actually independent. An incomplete user-story fragment (e.g. "As a user" with no "I want") is not recognized as a user story at all. None of this is hidden — it is the honest ceiling of a keyword/pattern-based v1, not a trained model.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
