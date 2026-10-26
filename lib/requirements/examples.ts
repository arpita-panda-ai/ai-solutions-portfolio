// Synthetic example requirements only: not real company data. Written to cover a spread of
// cases (well-formed, vague/weasel-worded, compound, and empty) for demoing the tool.
export const EXAMPLE_REQUIREMENTS: { label: string; text: string }[] = [
  {
    label: 'Well-formed user story',
    text: 'As a claims handler, I want to filter the claims queue by status, so that I can prioritize urgent cases first.\n\nAcceptance Criteria:\nGiven the claims queue is open\nWhen I select the "Urgent" status filter\nThen only claims with status "Urgent" are displayed\nAnd the total count updates to match the filtered list',
  },
  {
    label: 'Vague, no acceptance criteria',
    text: 'As a user, I want the dashboard to be more intuitive and user-friendly, so that it is easy to use for everyone.',
  },
  {
    label: 'Compound requirement',
    text: "The system shall allow a manager to approve and reject and reassign claims from the review queue, and shall log every action with a timestamp.\n\nAcceptance Criteria:\n- Approving a claim changes its status to \"Approved\" and records the manager's user ID\n- Rejecting a claim changes its status to \"Rejected\" and requires a reason code\n- Reassigning a claim updates the assigned owner field to the new owner's ID",
  },
  {
    label: 'Plain requirement, no AC',
    text: 'The application must send a confirmation email to the customer immediately after an order is placed.',
  },
  {
    label: 'Too brief / fragment',
    text: 'Add a button.',
  },
]
