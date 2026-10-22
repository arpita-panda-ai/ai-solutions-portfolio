import type { Priority, RequestType, TriageResult } from './types'

interface CategoryRule {
  type: RequestType
  owner: string
  patterns: { re: RegExp; weight: number }[]
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    type: 'Incident / Something is broken',
    owner: 'IT Service Desk / Infrastructure team',
    patterns: [
      { re: /\b(down|outage|crash(ed|ing)?|broken|not working|stopped working|unresponsive)\b/i, weight: 2 },
      { re: /\b(error|bug|fail(ed|ing|s)?|exception)\b/i, weight: 1.5 },
      { re: /\bcan'?t (access|log ?in|connect|load)\b/i, weight: 1 },
      { re: /\b(since (yesterday|this morning|last night|\d))\b/i, weight: 0.5 },
    ],
  },
  {
    type: 'Access request',
    owner: 'IT Access Management / Security team',
    patterns: [
      { re: /\b(request|need|grant|give me)\b.{0,20}\baccess\b/i, weight: 2 },
      { re: /\b(add (me|him|her|them) (as|to)|new account|provision)\b/i, weight: 1.5 },
      { re: /\b(permission(s)?|credentials|login details)\b/i, weight: 1 },
      { re: /\bvpn\b/i, weight: 0.5 },
    ],
  },
  {
    type: 'Change request',
    owner: 'Change Management / Product team',
    patterns: [
      { re: /\b(change|update|modify|configure|rename|migrate)\b/i, weight: 1.5 },
      { re: /\b(please (update|change|add|remove))\b/i, weight: 1.5 },
      { re: /\b(add (a )?(feature|field|button|option))\b/i, weight: 1 },
    ],
  },
  {
    type: 'Information request',
    owner: 'Business Analyst / Support team',
    patterns: [
      { re: /\b(can you (tell|explain|clarify)|what is|how do i|how does|wondering if|question about)\b/i, weight: 2 },
      { re: /\?\s*$/, weight: 0.5 },
    ],
  },
  {
    type: 'Billing / invoice query',
    owner: 'Finance / Billing team',
    patterns: [
      { re: /\b(invoice|billing|overcharged|refund|payment|subscription cost|charge(d)?)\b/i, weight: 2 },
    ],
  },
]

const HIGH_PRIORITY_SIGNALS = [
  /\b(urgent\w*|asap|immediate\w*|critical\w*|right away)\b/i,
  /\bproduction (is )?down\b/i,
  /\b(cannot|can'?t) work\b/i,
  /\bblocking\b/i,
  /\b(all|every) (users?|customers?|clients?) (are )?affected\b/i,
  /\bby (today|this morning|end of day|eod)\b/i,
]

const LOW_PRIORITY_SIGNALS = [
  /\b(no rush|whenever you (can|get a chance)|low priority|just curious|not urgent)\b/i,
]

const DEADLINE_RE = /\b(by (today|tomorrow|tonight|eod|end of day|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|[a-z]+ \d{1,2}(st|nd|rd|th)?)|within \d+ (hours?|days?))\b/i
const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/
const AFFECTED_COUNT_RE = /\b(\d+)\+?\s*(users?|people|customers?|clients?|employees?)\b/i
const SYSTEM_RE = /\b(the|our|my)\s+([A-Z][\w-]*(?:\s[A-Z][\w-]*)?|[a-z]+)\s+(system|portal|app|application|platform|server|database|tool|account)\b/i
const PRODUCT_NAME_RE = /\b(Salesforce|Jira|ServiceNow|SAP|Workday|SharePoint|Slack|Zendesk|Confluence|Okta|AWS|Azure|CRM|ERP|VPN)\b/

function scoreCategories(text: string): { type: RequestType; owner: string; score: number }[] {
  return CATEGORY_RULES.map((rule) => {
    const score = rule.patterns.reduce((sum, p) => (p.re.test(text) ? sum + p.weight : sum), 0)
    return { type: rule.type, owner: rule.owner, score }
  })
}

function determinePriority(text: string): { priority: Priority; rationale: string } {
  if (HIGH_PRIORITY_SIGNALS.some((re) => re.test(text))) {
    return { priority: 'High', rationale: 'Text contains urgency language (e.g. "urgent", "ASAP", "blocking", a same-day deadline, or mentions many users affected).' }
  }
  if (LOW_PRIORITY_SIGNALS.some((re) => re.test(text))) {
    return { priority: 'Low', rationale: 'Text explicitly signals low urgency (e.g. "no rush", "whenever you can").' }
  }
  if (DEADLINE_RE.test(text)) {
    return { priority: 'Medium', rationale: 'A deadline is mentioned but no explicit urgency language, so treated as medium priority.' }
  }
  return { priority: 'Medium', rationale: 'No explicit urgency or deadline language found; defaulted to medium pending human confirmation.' }
}

function extractDetails(text: string): { label: string; value: string }[] {
  const details: { label: string; value: string }[] = []

  const deadlineMatch = text.match(DEADLINE_RE)
  if (deadlineMatch) details.push({ label: 'Deadline mentioned', value: deadlineMatch[0] })

  const emailMatch = text.match(EMAIL_RE)
  if (emailMatch) details.push({ label: 'Contact email found', value: emailMatch[0] })

  const affectedMatch = text.match(AFFECTED_COUNT_RE)
  if (affectedMatch) details.push({ label: 'Scale of impact', value: `${affectedMatch[1]} ${affectedMatch[2]}` })

  const productMatch = text.match(PRODUCT_NAME_RE)
  if (productMatch) details.push({ label: 'System / product named', value: productMatch[0] })
  else {
    const systemMatch = text.match(SYSTEM_RE)
    if (systemMatch) details.push({ label: 'System / product named', value: `${systemMatch[2]} ${systemMatch[3]}` })
  }

  return details
}

function findMissingInformation(
  text: string,
  requestType: RequestType,
  details: { label: string }[],
  priority: Priority
): string[] {
  const missing: string[] = []
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const hasLabel = (label: string) => details.some((d) => d.label === label)

  if (wordCount < 12) missing.push('Request is very brief — may be missing context the requester has in mind but did not write down.')
  if (!hasLabel('Contact email found')) missing.push('No contact/requester identity found in the text.')

  // Only flag "impact/urgency not stated" if urgency wasn't already established via explicit
  // high-priority language or a stated scale of impact — otherwise this duplicates that signal.
  if (
    requestType === 'Incident / Something is broken' &&
    priority !== 'High' &&
    !hasLabel('Deadline mentioned') &&
    !hasLabel('Scale of impact')
  ) {
    missing.push('Impact and urgency not stated — unclear how many people are affected or how time-sensitive this is.')
  }
  if (requestType === 'Access request' && !hasLabel('System / product named')) {
    missing.push('No specific system/account named — unclear what access is actually being requested.')
  }
  if (requestType === 'Change request' && wordCount < 20) {
    missing.push('Change request lacks detail on exactly what should change and why.')
  }

  return missing
}

export function runRulesTriage(rawText: string): TriageResult {
  const text = rawText.trim()

  if (!text) {
    return {
      requestType: 'Other / unclassified',
      requestTypeConfidence: 0,
      priority: 'Low',
      priorityRationale: 'No text provided.',
      extractedDetails: [],
      missingInformation: ['No request text was submitted.'],
      suggestedOwner: 'Triage queue — needs manual routing',
      confidence: 0,
      needsHumanReview: true,
      source: 'rules',
      rationale: 'Empty input cannot be triaged.',
    }
  }

  const scores = scoreCategories(text)
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const runnerUp = sorted[1]

  const topScore = top?.score ?? 0
  const margin = topScore - (runnerUp?.score ?? 0)

  const requestType: RequestType = topScore > 0 ? top.type : 'Other / unclassified'
  const owner =
    topScore > 0 ? top.owner : 'Triage queue — needs manual routing'

  // Confidence: scaled by absolute signal strength and how clearly it beat the next category.
  const requestTypeConfidence =
    topScore === 0 ? 0.15 : Math.max(0.3, Math.min(0.95, 0.5 + margin * 0.15 + Math.min(topScore, 3) * 0.08))

  const { priority, rationale: priorityRationale } = determinePriority(text)
  const extractedDetails = extractDetails(text)
  const missingInformation = findMissingInformation(text, requestType, extractedDetails, priority)

  const confidence = Math.max(
    0.1,
    requestTypeConfidence - missingInformation.length * 0.12
  )
  const needsHumanReview =
    confidence < 0.6 || requestType === 'Other / unclassified' || missingInformation.length >= 3

  return {
    requestType,
    requestTypeConfidence: Math.round(requestTypeConfidence * 100) / 100,
    priority,
    priorityRationale,
    extractedDetails,
    missingInformation,
    suggestedOwner: owner,
    confidence: Math.round(confidence * 100) / 100,
    needsHumanReview,
    source: 'rules',
    rationale: `Classified as "${requestType}" using keyword/pattern matching (top score ${topScore.toFixed(1)}, margin over next category ${margin.toFixed(1)}).`,
  }
}
