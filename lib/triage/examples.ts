// Synthetic example requests only — not real company data. Written to cover a spread of
// cases (clear, ambiguous, missing-information, low-urgency) for demoing and, later,
// for the Project 3 evaluation test set.
export const EXAMPLE_REQUESTS: { label: string; text: string }[] = [
  {
    label: 'Clear incident, urgent',
    text: 'The order processing system has been down since this morning and all 40 of our warehouse staff cannot log in. This is blocking shipments going out today, please help urgently.',
  },
  {
    label: 'Access request',
    text: 'Hi, can you request access to the CRM system for our new starter, jane.doe@example.com? She needs standard sales rep permissions by next Monday.',
  },
  {
    label: 'Change request, some detail',
    text: 'Please update the invoice template to add a purchase order number field above the billing address. Finance needs this for the new contracts starting next quarter.',
  },
  {
    label: 'Information request, low urgency',
    text: 'Quick question — how do I export a report from the analytics dashboard? No rush, just trying to learn the tool.',
  },
  {
    label: 'Billing query',
    text: 'We were overcharged on last month\'s invoice — it shows two subscription charges instead of one. Can someone look into a refund?',
  },
  {
    label: 'Ambiguous / missing information',
    text: 'It\'s not working again.',
  },
]
