import type { ApproachResult, ReadinessTier, WorkflowAnswer, WorkflowQuestion } from './types'

// Step 3 of the decision journey: recommend a technology approach. Deliberately rules-based and
// transparent, same as the rest of this tool: a well-designed rules engine can demonstrate
// stronger product judgement than reaching for generative AI where it isn't needed, and every
// branch below is auditable rather than a black box.
export const WORKFLOW_QUESTIONS: WorkflowQuestion[] = [
  {
    id: 'dataStructure',
    text: 'How structured is the input data for this specific workflow?',
    options: [
      { value: 'structured', label: 'Structured (forms, fixed fields, a defined schema)' },
      { value: 'semi-structured', label: 'Semi-structured (e.g. emails with some fixed fields)' },
      { value: 'unstructured', label: 'Unstructured (free text, documents, images, speech)' },
    ],
  },
  {
    id: 'decisionLogic',
    text: 'Can the decision or output be written down as a clear set of explicit rules?',
    options: [
      { value: 'yes-fully', label: 'Yes, it is basically a checklist' },
      { value: 'yes-mostly', label: 'Mostly, with some judgment calls' },
      { value: 'no', label: 'No, it needs interpretation or context' },
    ],
  },
  {
    id: 'explainability',
    text: 'Does this decision need to be explainable or auditable (e.g. regulated, compliance, customer-facing)?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'volume',
    text: 'Is the volume or frequency high enough to justify building something, rather than staying manual?',
    options: [
      { value: 'low', label: 'Low: occasional, ad hoc' },
      { value: 'medium', label: 'Medium: regular but not constant' },
      { value: 'high', label: 'High: frequent or high-volume' },
    ],
  },
]

export function recommendApproach(
  readinessTier: ReadinessTier,
  workflowAnswers: WorkflowAnswer[]
): ApproachResult {
  const valueOf = (id: WorkflowQuestion['id']) =>
    workflowAnswers.find((a) => a.questionId === id)?.value

  const volume = valueOf('volume')
  const dataStructure = valueOf('dataStructure')
  const decisionLogic = valueOf('decisionLogic')
  const explainability = valueOf('explainability')

  if (volume === 'low') {
    return {
      approach: 'Not worth automating yet',
      rationale:
        'At this volume, the effort of building and maintaining any automation is unlikely to pay back. Revisit once the workflow runs often enough to justify it.',
    }
  }

  if (readinessTier === 'Not ready yet') {
    return {
      approach: 'Fix the process first',
      rationale:
        'Foundational readiness gaps identified above mean recommending a specific technology now would be premature. Address those gaps, then reassess.',
    }
  }

  if (decisionLogic === 'no' || dataStructure === 'unstructured') {
    const explainNote =
      explainability === 'yes'
        ? ' Because this decision needs to be explainable or auditable, keep a human reviewing every output rather than spot-checking, and log each decision.'
        : ''
    return {
      approach: 'AI-assisted with mandatory human review',
      rationale: `The input is ${
        dataStructure === 'unstructured' ? 'unstructured, free-text' : 'only partly structured'
      } and/or the decision relies on judgment rather than a fixed checklist, so a deterministic rules engine alone is unlikely to hold up. An AI-assisted approach with a human reviewing outputs is more realistic than either a rigid rules engine or a fully autonomous system.${explainNote}`,
    }
  }

  const exceptionNote =
    decisionLogic === 'yes-mostly'
      ? ' Build an explicit escalation path for the minority of cases that need judgment, rather than forcing them through the same rules as everything else.'
      : ''
  return {
    approach: 'Deterministic rules-based automation',
    rationale: `The input is structured and the decision logic can be written down as explicit rules, so a transparent, rules-based engine should be tried before reaching for a generative AI approach: it is cheaper to build, easier to audit, and easier to trust.${exceptionNote}`,
  }
}
