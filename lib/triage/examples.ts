// Synthetic example requests only: not real company data. Written to cover a spread of
// departments and issue types that the engine classifies clearly and confidently, so the
// live demo buttons showcase the tool working, not its known ambiguous/edge-case limits
// (those are covered separately and honestly in the evaluation reports instead).
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
    text: 'Please update our CRM contact fields to include a secondary phone number; the sales team needs this change rolled out by next Friday.',
  },
  {
    label: 'Information request, low urgency',
    text: 'Quick question about my mailbox quota: how do I request more storage space for my team folder? No rush, just planning ahead.',
  },
  {
    label: 'Billing query',
    text: 'We were overcharged on last month\'s invoice: it shows two subscription charges instead of one. Can someone look into a refund?',
  },
  {
    label: 'New starter / HR request',
    text: 'Our new starter\'s onboarding paperwork needs to be completed by Monday; can someone send her the new starter form?',
  },
]
