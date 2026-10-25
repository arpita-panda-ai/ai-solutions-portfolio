import type { Department, IssueType, Priority } from './types'

// Synthetic, hand-labelled test set — not real company data. Ground-truth labels reflect my
// own best-judgment reading of each request, assigned BEFORE looking at what the rules engine
// actually outputs, so the evaluation is a genuine blind test rather than a tuned-to-pass one.
//
// Relabelled for the two-axis (Department + Issue type) schema. A few cases that were
// genuinely ambiguous under the old single-axis model turned out to resolve cleanly once split
// into two independent axes (see AD6) — that's called out below where it applies.
export type CaseCategory = 'clear' | 'ambiguous' | 'missing-info' | 'adversarial'

export interface LabeledCase {
  id: string
  caseCategory: CaseCategory
  text: string
  expectedDepartment: Department
  expectedIssueType: IssueType
  expectedPriority: Priority
  expectedNeedsReview: boolean
  note?: string
}

export const EVAL_DATASET: LabeledCase[] = [
  // --- Clear cases: unambiguous category + priority, used to check the engine works on easy cases ---
  {
    id: 'C1',
    caseCategory: 'clear',
    text: 'The order processing system has been down since this morning and all 40 of our warehouse staff cannot log in. This is blocking shipments going out today, please help urgently.',
    expectedDepartment: 'Access',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'High',
    expectedNeedsReview: false,
    note: 'No department fits perfectly — it is a business system, not literally a login/access tool — but "cannot log in" makes Access the closest department match.',
  },
  {
    id: 'C2',
    caseCategory: 'clear',
    text: 'Hi, can you request access to the CRM system for our new starter, jane.doe@example.com? She needs standard sales rep permissions by next Monday.',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
    expectedPriority: 'Medium',
    expectedNeedsReview: false,
  },
  {
    id: 'C3',
    caseCategory: 'clear',
    text: 'Please update the invoice template to add a purchase order number field above the billing address. Finance needs this for the new contracts starting next quarter.',
    expectedDepartment: 'Billing',
    expectedIssueType: 'Change / Modify something existing',
    expectedPriority: 'Medium',
    expectedNeedsReview: false,
  },
  {
    id: 'C4',
    caseCategory: 'clear',
    text: 'Quick question — how do I export a report from the analytics dashboard? No rush, just trying to learn the tool.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Query / A question, no action needed',
    expectedPriority: 'Low',
    expectedNeedsReview: false,
  },
  {
    id: 'C5',
    caseCategory: 'clear',
    text: "We were overcharged on last month's invoice — it shows two subscription charges instead of one. Can someone look into a refund?",
    expectedDepartment: 'Billing',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: false,
  },
  {
    id: 'C6',
    caseCategory: 'clear',
    text: 'The email server has been down for two hours, affecting all 200 staff. We need this fixed as soon as possible.',
    expectedDepartment: 'Administrative rights',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'High',
    expectedNeedsReview: false,
  },
  {
    id: 'C7',
    caseCategory: 'clear',
    text: "I urgently need VPN access granted today, I'm working from home and can't connect.",
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
    expectedPriority: 'High',
    expectedNeedsReview: false,
  },
  {
    id: 'C8',
    caseCategory: 'clear',
    text: 'Please add a new mandatory field to the onboarding form for emergency contact details. This should go in before the next hiring round starts in three weeks.',
    expectedDepartment: 'HR Support',
    expectedIssueType: 'Change / Modify something existing',
    expectedPriority: 'Medium',
    expectedNeedsReview: false,
  },

  // --- Ambiguous cases: genuinely overlap two categories, a human triager would want to double-check ---
  {
    id: 'A1',
    caseCategory: 'ambiguous',
    text: 'I need access to the reporting system because mine is broken.',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
    note: 'Issue type overlaps Incident ("broken") and Request ("need access") — primary ask is access.',
  },
  {
    id: 'A2',
    caseCategory: 'ambiguous',
    text: 'Can you change my access permissions, this error keeps happening?',
    expectedDepartment: 'Access',
    expectedIssueType: 'Change / Modify something existing',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
    note: 'Issue type overlaps Change, Request and Incident language.',
  },
  {
    id: 'A3',
    caseCategory: 'ambiguous',
    text: 'The report is wrong and I need it changed urgently.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Change / Modify something existing',
    expectedPriority: 'High',
    expectedNeedsReview: true,
    note: 'Issue type could read as Incident ("wrong") or Change ("changed"). No department-specific vocabulary present.',
  },
  {
    id: 'A4',
    caseCategory: 'ambiguous',
    text: 'This is broken, can you tell me how to fix it myself?',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
    note: 'Issue type overlaps Incident and Query.',
  },
  {
    id: 'A5',
    caseCategory: 'ambiguous',
    text: "I was charged twice and this system won't let me update my billing info.",
    expectedDepartment: 'Billing',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
    note: 'Issue type overlaps Incident ("charged twice", "won\'t let me") and Change ("update").',
  },
  {
    id: 'A6',
    caseCategory: 'ambiguous',
    text: 'Can you grant me access, or is there a setting I need to change myself?',
    expectedDepartment: 'Access',
    expectedIssueType: 'Request / Something new is needed',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
    note: 'Issue type overlaps Request and Change — the message explicitly offers two possible resolutions.',
  },

  // --- Missing-information cases: too vague to triage confidently ---
  {
    id: 'M1',
    caseCategory: 'missing-info',
    text: "It's not working again.",
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
  },
  {
    id: 'M2',
    caseCategory: 'missing-info',
    text: 'Need help asap.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'High',
    expectedNeedsReview: true,
  },
  {
    id: 'M3',
    caseCategory: 'missing-info',
    text: 'Can someone look at this?',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
  },
  {
    id: 'M4',
    caseCategory: 'missing-info',
    text: 'Please fix.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: true,
  },
  {
    id: 'M5',
    caseCategory: 'missing-info',
    text: 'Question about the thing we discussed.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Query / A question, no action needed',
    expectedPriority: 'Low',
    expectedNeedsReview: true,
  },

  // --- Adversarial cases: designed to break naive keyword matching ---
  {
    id: 'AD1',
    caseCategory: 'adversarial',
    text: 'Everything is NOT broken, I just wanted to say the new system update worked perfectly, thank you!',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'Low',
    expectedNeedsReview: true,
    note: "Negation defeats naive keyword matching on 'broken' — this is positive feedback, not an incident.",
  },
  {
    id: 'AD2',
    caseCategory: 'adversarial',
    text: 'Oh great, ANOTHER urgent critical emergency ASAP because nothing ever works around here, as usual.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'High',
    expectedNeedsReview: true,
    note: 'Sarcastic tone is not modeled; the engine cannot tell venting from an actionable high-priority incident. No department-specific vocabulary present.',
  },
  {
    id: 'AD3',
    caseCategory: 'adversarial',
    text: 'Also, can you grant me access to the finance system, and separately the invoice generator is broken and overcharging customers.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'High',
    expectedNeedsReview: true,
    note: 'Genuinely two requests in one message, each pointing at a different department (Access vs Billing) and a different issue type (Request vs Incident) — multi-intent is explicitly out of scope for a v1 rules engine, so both axes tie and fall back rather than guessing.',
  },
  {
    id: 'AD4',
    caseCategory: 'adversarial',
    text: 'test test test, email jane@x.com, system.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'Low',
    expectedNeedsReview: true,
    note: 'Low-signal noise text.',
  },
  {
    id: 'AD5',
    caseCategory: 'adversarial',
    text: 'I was reading an article about how urgent care clinics handle critical patients, completely unrelated to work, just thought you would find it interesting.',
    expectedDepartment: 'Miscellaneous',
    expectedIssueType: 'Other / unclassified',
    expectedPriority: 'Low',
    expectedNeedsReview: true,
    note: "'Urgent' and 'critical' appear in an unrelated context — tests false-positive triggering on surface keywords.",
  },
  {
    id: 'AD6',
    caseCategory: 'adversarial',
    text: 'Payment is not working',
    expectedDepartment: 'Billing',
    expectedIssueType: 'Incident / Something is broken',
    expectedPriority: 'Medium',
    expectedNeedsReview: false,
    note: 'Found via live user testing: under the old single-axis engine, "payment" doubled as a bare Billing keyword that tied against Incident\'s "not working", leaving this wrongly unclassified. Splitting Department and Issue type into independent axes resolves this structurally, not just by patching keyword weights — "payment" only has to compete against other departments (none fire here), and "not working" only has to compete against other issue types (none fire here), so both axes now resolve confidently with no cross-axis collision possible.',
  },
]
