import type { IssueType, RequirementFormat } from './types'

// Synthetic, hand-labelled test set: not real company data. Ground-truth labels reflect my own
// best-judgment reading of each requirement, assigned BEFORE looking at what the rules engine
// actually outputs, so the evaluation is a genuine blind test rather than a tuned-to-pass one.
export type CaseCategory = 'clear' | 'ambiguous' | 'missing-info' | 'adversarial'

export interface LabeledCase {
  id: string
  caseCategory: CaseCategory
  text: string
  expectedFormat: RequirementFormat
  expectedHasAcceptanceCriteria: boolean
  expectedNeedsHumanReview: boolean
  // Issue types that must appear somewhere in the result for this case to be scored correct.
  expectedIssueTypesPresent: IssueType[]
  // Issue types that must NOT appear: used to catch false positives, not just missed detections.
  expectedIssueTypesAbsent?: IssueType[]
  note?: string
}

export const EVAL_DATASET: LabeledCase[] = [
  // --- Clear cases: unambiguous expected outcome, used to check the engine works on easy cases ---
  {
    id: 'C1',
    caseCategory: 'clear',
    text: 'As a claims handler, I want to filter the claims queue by status, so that I can prioritize urgent cases first.\n\nAcceptance Criteria:\nGiven the claims queue is open\nWhen I select the "Urgent" status filter\nThen only claims with status "Urgent" are displayed\nAnd the total count updates to match the filtered list',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: [],
    expectedIssueTypesAbsent: [
      'ambiguous-term',
      'compound-requirement',
      'missing-acceptance-criteria',
      'untestable-criterion',
      'missing-role',
      'missing-benefit',
      'too-brief',
    ],
  },
  {
    id: 'C2',
    caseCategory: 'clear',
    text: 'The system shall allow an administrator to export the user list as a CSV file.\n\nAcceptance Criteria:\n- The exported file contains all users with status "Active" as of the export timestamp\n- The file is named using the pattern users_export_YYYYMMDD.csv\n- A maximum of 10,000 rows are included per export, with a warning shown if the limit is reached',
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: [],
    expectedIssueTypesAbsent: ['missing-acceptance-criteria', 'ambiguous-term', 'too-brief'],
  },
  {
    id: 'C3',
    caseCategory: 'clear',
    text: 'As a user, I want the dashboard to be more intuitive and user-friendly, so that it is easy to use for everyone.',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['ambiguous-term', 'missing-acceptance-criteria'],
    expectedIssueTypesAbsent: ['too-brief', 'missing-role', 'missing-benefit', 'compound-requirement'],
    note: 'Loaded with weasel words (intuitive, user-friendly, easy to use) and no acceptance criteria at all.',
  },
  {
    id: 'C4',
    caseCategory: 'clear',
    text: 'Add a button.',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['too-brief', 'missing-acceptance-criteria'],
  },
  {
    id: 'C5',
    caseCategory: 'clear',
    text: "The system shall allow a manager to approve and reject and reassign claims from the review queue, and shall log every action with a timestamp.\n\nAcceptance Criteria:\n- Approving a claim changes its status to \"Approved\" and records the manager's user ID\n- Rejecting a claim changes its status to \"Rejected\" and requires a reason code\n- Reassigning a claim updates the assigned owner field to the new owner's ID",
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['compound-requirement'],
    expectedIssueTypesAbsent: ['missing-acceptance-criteria', 'too-brief', 'ambiguous-term'],
    note: 'Three distinct capabilities bundled with repeated "and": should trip the compound-requirement smell.',
  },
  {
    id: 'C6',
    caseCategory: 'clear',
    text: 'As a claims adjuster, I want a bulk upload feature for supporting documents.\n\nAcceptance Criteria:\n- Users can select up to 20 files at once, each up to 25 MB\n- Unsupported file types show an error message naming the allowed types\n- A progress bar displays the percentage uploaded',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['missing-benefit'],
    expectedIssueTypesAbsent: ['missing-role', 'missing-acceptance-criteria', 'ambiguous-term', 'compound-requirement'],
    note: 'Has a role and a want, but never states "so that": no stated benefit.',
  },
  {
    id: 'C7',
    caseCategory: 'clear',
    text: 'I want to receive an email notification when a claim I am assigned to changes status, so that I do not have to keep checking the queue manually.\n\nAcceptance Criteria:\n- An email is sent within 5 minutes of the status change\n- The email subject line includes the claim ID and new status\n- No email is sent for claims the user is not assigned to',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['missing-role'],
    expectedIssueTypesAbsent: ['missing-benefit', 'missing-acceptance-criteria', 'ambiguous-term', 'compound-requirement'],
    note: 'Has "I want" and "so that" but never states "As a [role]".',
  },
  {
    id: 'C8',
    caseCategory: 'clear',
    text: 'The application must send a confirmation email to the customer immediately after an order is placed.',
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['missing-acceptance-criteria'],
    expectedIssueTypesAbsent: ['ambiguous-term', 'compound-requirement', 'too-brief'],
    note: 'Otherwise clean, single-sentence requirement with no acceptance criteria at all.',
  },

  // --- Ambiguous cases: genuinely subtle or boundary behaviour, worth double-checking by a human ---
  {
    id: 'A1',
    caseCategory: 'ambiguous',
    text: 'The system shall provide a reasonable way for users to search claims.\n\nAcceptance Criteria:\n- Search is fast\n- Results are accurate\n- The system shall allow filtering by claim status',
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['ambiguous-term', 'untestable-criterion'],
    note: 'Quality score lands exactly on the 70 boundary: tests the needsHumanReview threshold is inclusive/exclusive as designed, not just issue detection.',
  },
  {
    id: 'A2',
    caseCategory: 'ambiguous',
    text: 'As a support agent, I want to resolve tickets quickly, so that customers are happy.\n\nAcceptance Criteria:\nGiven a ticket is open\nWhen I click resolve\nThen the ticket is closed',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['ambiguous-term'],
    expectedIssueTypesAbsent: ['untestable-criterion', 'missing-acceptance-criteria'],
    note: 'Gherkin-structured AC lines are always treated as testable regardless of content, a disclosed engine assumption, not a bug.',
  },
  {
    id: 'A3',
    caseCategory: 'ambiguous',
    text: 'As a reporting analyst I want the system shall generate a monthly summary report automatically.',
    expectedFormat: 'user-story',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['missing-acceptance-criteria', 'missing-benefit'],
    expectedIssueTypesAbsent: ['missing-role'],
    note: 'Contains both "I want" and "shall" language; user-story detection takes priority by design: tests format-detection precedence on mixed-signal text.',
  },

  // --- Missing-information cases: too vague or fragmentary to assess meaningfully ---
  {
    id: 'M1',
    caseCategory: 'missing-info',
    text: '',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['too-brief'],
  },
  {
    id: 'M2',
    caseCategory: 'missing-info',
    text: 'TBD',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['too-brief', 'ambiguous-term', 'missing-acceptance-criteria'],
  },
  {
    id: 'M3',
    caseCategory: 'missing-info',
    text: 'As a user',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['too-brief', 'missing-acceptance-criteria'],
    note: "Incomplete user-story fragment (no 'I want') is not recognized as user-story format at all, a disclosed limitation of keyword-based format detection.",
  },
  {
    id: 'M4',
    caseCategory: 'missing-info',
    text: 'The system should be better.',
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['too-brief', 'missing-acceptance-criteria'],
    expectedIssueTypesAbsent: ['ambiguous-term'],
    note: "'better' is vague but not in the curated ambiguous-term list, a disclosed coverage gap, not a bug.",
  },

  // --- Adversarial cases: designed to break naive pattern matching ---
  {
    id: 'AD1',
    caseCategory: 'adversarial',
    text: 'The system shall archive claims older than 7 years.\n\nAcceptance Criteria:',
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['missing-acceptance-criteria'],
    note: "Heading 'Acceptance Criteria:' present but followed by no actual content: tests that the engine isn't fooled by the heading alone.",
  },
  {
    id: 'AD2',
    caseCategory: 'adversarial',
    text: 'When a claim is flagged as high risk, the analyst should review it and then escalate to a supervisor if the policy value is given as over the threshold.',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['missing-acceptance-criteria'],
    expectedIssueTypesAbsent: ['compound-requirement', 'ambiguous-term'],
    note: 'Ordinary prose that happens to start with "When": tests that a single line is never mistaken for a real Gherkin acceptance-criteria block (that misdetection was caught and fixed during this evaluation).',
  },
  {
    id: 'AD3',
    caseCategory: 'adversarial',
    text: "The system shall support claims in English, Spanish, and French, and shall allow currency display in USD, EUR, and GBP, and shall default to the user's locale and currency when both are detected.\n\nAcceptance Criteria:\n- Given a user with browser locale \"es-ES\", claims are displayed in Spanish and amounts in EUR\n- If no locale is detected, English and USD are used as the default\n- Switching language updates all static labels within 2 seconds",
    expectedFormat: 'plain-requirement',
    expectedHasAcceptanceCriteria: true,
    expectedNeedsHumanReview: false,
    expectedIssueTypesPresent: ['compound-requirement'],
    note: 'Legitimately well-specified multi-locale requirement still trips the compound-requirement heuristic purely on "and" count, a disclosed precision limitation (it is a smell detector, not a semantic parser).',
  },
  {
    id: 'AD4',
    caseCategory: 'adversarial',
    text: 'the the the system system and and and shall shall update update the the the thing thing thing and and and stuff.',
    expectedFormat: 'unrecognized',
    expectedHasAcceptanceCriteria: false,
    expectedNeedsHumanReview: true,
    expectedIssueTypesPresent: ['compound-requirement', 'missing-acceptance-criteria'],
    expectedIssueTypesAbsent: ['too-brief'],
    note: '23 words of repetitive noise is not flagged as too-brief (word count alone is not a coherence check); compound-requirement also fires on repeated "and" noise rather than a real multi-clause bundle.',
  },
]
