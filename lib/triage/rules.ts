import type { Department, IssueType, Priority, TriageResult } from './types'

interface AxisRule<T extends string> {
  value: T
  patterns: { re: RegExp; weight: number }[]
}

// --- Department axis -------------------------------------------------------------------------
// Keyword groups for 8 of these 9 departments were derived from a frequency/distinctiveness
// analysis (freq_in_category / freq_overall) run across all 47,837 rows of the Kaggle "IT
// Service Ticket Classification Dataset", grouped by its native Topic_group labels, not
// hand-guessed. Generic words shared across departments (e.g. the bare word "access", which
// appears constantly in Storage tickets via an automated "X wants to access Y" notification
// template) were deliberately excluded in favour of the more distinctive technical nouns that
// analysis surfaced, so a department isn't misclassified just because of shared boilerplate.
// "Billing" is the one exception: the dataset has no native billing/invoice category, so this
// department's keywords are hand-curated finance vocabulary, not dataset-derived, kept for
// test coverage reasons, not because the dataset supports it.
const DEPARTMENT_RULES: AxisRule<Department>[] = [
  {
    value: 'Hardware',
    patterns: [
      { re: /\b(charger|socket|laptop|monitor|printer|keyboard|mouse|screen|battery|hinges?)\b/i, weight: 2 },
      { re: /\b(pc|device|disk|debug(ging)?|hardware)\b/i, weight: 1 },
    ],
  },
  {
    value: 'Access',
    patterns: [
      // CRM/ERP added in iteration 2: named business systems are as distinctive a signal as
      // confluence/vpn, unlike the bare generic word "access" (see comment above on why that
      // word was excluded in the first place).
      { re: /\b(confluence|repository|repo|git|badge|unlock|vpn|crm|erp)\b/i, weight: 2 },
      { re: /\b(license|licence|credentials|password|login|log ?in)\b/i, weight: 1.5 },
      // The fuller phrase "access to the ... system" is specific enough to avoid the boilerplate
      // collision that excluding the bare word "access" was meant to prevent, and gives a named
      // system (e.g. "the CRM system") enough combined weight to beat unrelated department
      // signals that happen to co-occur in the same message (see C2 in the eval report).
      { re: /\baccess to the\b.{0,20}\bsystem\b/i, weight: 1 },
    ],
  },
  {
    value: 'Storage',
    patterns: [
      { re: /\b(mailbox(es)?|quota|archive(d)?|file ?share)\b/i, weight: 2 },
      { re: /\b(folder(s)?|shared drive|disk space|library)\b/i, weight: 1.5 },
    ],
  },
  {
    value: 'Purchase',
    patterns: [
      { re: /\b(purchase( order)?|\bpo\b|purchased|ordered|allocation)\b/i, weight: 2 },
      { re: /\b(delivery|delivered|receipts?|replenishment)\b/i, weight: 1 },
    ],
  },
  {
    value: 'Billing',
    patterns: [
      { re: /\b(invoice|billing|overcharged|refund|subscription cost|charge(d)?)\b/i, weight: 2 },
      // "payment" alone is a weaker, more generic noun (payment gateway/page/form) than the
      // specific finance terms above, but unlike the old single-axis engine, it no longer has
      // to compete against Incident signals (that's a separate axis now), so it can safely carry
      // more weight here without risking a repeat of the "Payment is not working" collision.
      { re: /\bpayment\b/i, weight: 1.5 },
    ],
  },
  {
    value: 'HR Support',
    patterns: [
      { re: /\b(leaver|new starter|starter form|timecard|maternity|annual leave|absence)\b/i, weight: 2 },
      { re: /\b(onboarding|holiday|hr\b)\b/i, weight: 1 },
    ],
  },
  {
    value: 'Administrative rights',
    patterns: [
      { re: /\b(workstation|endpoint|windows upgrade|software center)\b/i, weight: 2 },
      { re: /\b(outlook|upgrade(d)?|patch(ed)?|reboot(ed)?)\b/i, weight: 1 },
    ],
  },
  {
    value: 'Internal Project',
    patterns: [
      { re: /\b(pipeline|project code|pm role|opportunit(y|ies))\b/i, weight: 2 },
      { re: /\bsetup form\b/i, weight: 1.5 },
    ],
  },
  {
    value: 'Miscellaneous',
    patterns: [
      { re: /\b(mailing list|blacklist|distribution list|ownership)\b/i, weight: 1.5 },
    ],
  },
]

// --- Issue type axis --------------------------------------------------------------------------
// This axis cuts across every department (a frequency analysis of 160 hand-labelled real
// tickets confirmed each department contains a mix of all issue types), so it has no
// department-native vocabulary to mine. These patterns are close to the old single-axis
// engine's category rules, with the department-specific vocabulary (invoice, access-the-noun,
// etc.) stripped out; that vocabulary now lives in DEPARTMENT_RULES above instead.
const ISSUE_TYPE_RULES: AxisRule<IssueType>[] = [
  {
    value: 'Incident / Something is broken',
    patterns: [
      { re: /\b(down|outage|crash(ed|ing)?|broken|not working|stopped working|unresponsive)\b/i, weight: 2 },
      { re: /\b(error|bug|fail(ed|ing|s)?|exception|issue(s)?|problem(s)?)\b/i, weight: 1.5 },
      { re: /\bcan'?t (access|log ?in|connect|load)\b/i, weight: 1 },
      { re: /\b(unable to|cannot|can'?t)\b/i, weight: 1 },
      { re: /\b(since (yesterday|this morning|last night|\d))\b/i, weight: 0.5 },
      // "emergency" is a strong incident signal on its own, but excluded before "contact" so it
      // doesn't fire on unrelated HR/forms language like "emergency contact details" (see C8).
      { re: /\bemergency\b(?!\s+contact)/i, weight: 2 },
      { re: /\bfix(e[ds]|ing)?\b/i, weight: 1 },
      // Added in iteration 2: billing-specific "something went wrong" language (overcharged,
      // double charged) wasn't covered by any Incident signal, so it fell through to
      // "unclassified" even though it's clearly reporting a problem, not asking a question
      // (see C5 and A5 in the eval report).
      { re: /\b(overcharged|double charged|charged (twice|again)|wrongly charged)\b/i, weight: 2 },
    ],
  },
  {
    value: 'Request / Something new is needed',
    patterns: [
      { re: /\b(request|need|require|grant|give me)\b.{0,20}\b(access|account|license|licence)\b/i, weight: 2 },
      { re: /\b(new (account|license|licence|user|starter)|provision|please (create|set ?up|install|grant|give|provide))\b/i, weight: 1.5 },
      { re: /\b(permission(s)?|credentials|login details)\b/i, weight: 1 },
    ],
  },
  {
    value: 'Change / Modify something existing',
    patterns: [
      // Stem-based (\w*) so inflected forms like "changed"/"updated"/"configuring" actually match;
      // the original literal-word versions silently failed on anything but the bare infinitive.
      { re: /\b(chang\w*|updat\w*|modif\w*|configur\w*|renam\w*|migrat\w*|postpon\w*|resched\w*)\b/i, weight: 1.5 },
      { re: /\bplease (updat\w*|chang\w*|add\w*|remov\w*|disable\w*|close\w*|postpon\w*)\b/i, weight: 1.5 },
      { re: /\b(add (a )?(feature|field|button|option))\b/i, weight: 1 },
    ],
  },
  {
    value: 'Query / A question, no action needed',
    patterns: [
      { re: /\b(can you (tell|explain|clarify)|what is|how do i|how does|wondering if|question about)\b/i, weight: 2 },
      { re: /\?\s*$/, weight: 0.5 },
    ],
  },
]

const HIGH_PRIORITY_SIGNALS = [
  // "urgent"/"critical" are excluded when followed by well-known unrelated fixed phrases
  // ("urgent care", "critical patient(s)/condition") so a surface keyword collision in an
  // off-topic message doesn't get read as a real urgency signal (see AD5).
  /\b(urgent\w*(?!\s+care)|asap|immediate\w*|critical\w*(?!\s+(patients?|conditions?))|right away|as soon as possible)\b/i,
  /\bproduction (is )?down\b/i,
  /\b(cannot|can'?t) work\b/i,
  /\bblocking\b/i,
  /\b(all|every) (users?|customers?|clients?) (are )?affected\b/i,
  /\baffecting (all|most|many|dozens of|hundreds of|\d+\+?)\s*(staff|users?|people|customers?|clients?|employees?)\b/i,
  /\bby (today|this morning|end of day|eod)\b/i,
]

// Positive-closure language ("it worked, thanks") signals this isn't an open request at all;
// used both to force low priority and (below) to stop a coincidental keyword match (e.g. the
// noun "system update") from being read as an active request for that category.
const CLOSURE_RE = /\b(worked (perfectly|great|well|fine)|all (good|sorted)|resolved now|fixed now)\b/i

const LOW_PRIORITY_SIGNALS = [
  /\b(no rush|whenever you (can|get a chance)|low priority|just curious|not urgent)\b/i,
  CLOSURE_RE,
]

const DEADLINE_RE = /\b(by (today|tomorrow|tonight|eod|end of day|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|[a-z]+ \d{1,2}(st|nd|rd|th)?)|within \d+ (hours?|days?))\b/i
const EMAIL_RE = /[\w.-]+@[\w.-]+\.\w+/
const AFFECTED_COUNT_RE = /\b(\d+)\+?\s*(users?|people|customers?|clients?|employees?)\b/i
const SYSTEM_RE = /\b(the|our|my)\s+([A-Z][\w-]*(?:\s[A-Z][\w-]*)?|[a-z]+)\s+(system|portal|app|application|platform|server|database|tool|account)\b/i
const PRODUCT_NAME_RE = /\b(Salesforce|Jira|ServiceNow|SAP|Workday|SharePoint|Slack|Zendesk|Confluence|Okta|AWS|Azure|CRM|ERP|VPN)\b/

// Treats a keyword match as void if it's directly negated a few words earlier in the same clause
// (e.g. "NOT broken"), a lightweight, generalisable mitigation for naive keyword matching, not
// full negation scoping. It won't catch negation several clauses away or across punctuation.
const NEGATION_WINDOW_RE = /\b(not|isn['’]t|aren['’]t|wasn['’]t|weren['’]t|doesn['’]t|didn['’]t|never|no longer)\b[^.?!]{0,20}$/i

interface AxisResult<T extends string> {
  value: T
  score: number
  margin: number
  isTie: boolean
  tiedValues: T[]
  confidence: number
}

// Scores and picks a winner for one classification axis (Department or Issue type),
// independently of the other axis. A genuine tie between two or more candidates means the text
// plausibly fits more than one, rather than silently picking whichever is listed first, this is
// surfaced honestly via the fallback value and a deliberately low, fixed confidence (see AD3).
function classifyAxis<T extends string>(text: string, rules: AxisRule<T>[], fallback: T): AxisResult<T> {
  const scores = rules.map((rule) => {
    const score = rule.patterns.reduce((sum, p) => {
      const match = p.re.exec(text)
      if (!match) return sum
      const before = text.slice(0, match.index)
      if (NEGATION_WINDOW_RE.test(before)) return sum
      return sum + p.weight
    }, 0)
    return { value: rule.value, score }
  })
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const top = sorted[0]
  const runnerUp = sorted[1]
  const topScore = top?.score ?? 0
  const margin = topScore - (runnerUp?.score ?? 0)

  // A minimum score is required before committing to a category: a single weak modifier isn't
  // enough signal on its own (see M3).
  const MIN_CONFIDENT_SCORE = 1
  const tiedAtTop = sorted.filter((s) => s.score === topScore)
  const isTie = topScore > 0 && tiedAtTop.length >= 2
  const isConfident = topScore >= MIN_CONFIDENT_SCORE && !isTie

  const value = isConfident ? top.value : fallback
  const confidence = isTie
    ? 0.2
    : !isConfident
      ? 0.15
      : Math.max(0.3, Math.min(0.95, 0.5 + margin * 0.15 + Math.min(topScore, 3) * 0.08))

  return {
    value,
    score: topScore,
    margin,
    isTie,
    tiedValues: isTie ? tiedAtTop.map((s) => s.value) : [],
    confidence: Math.round(confidence * 100) / 100,
  }
}

function determinePriority(text: string, issueType: IssueType): { priority: Priority; rationale: string } {
  if (HIGH_PRIORITY_SIGNALS.some((re) => re.test(text))) {
    return { priority: 'High', rationale: 'Text contains urgency language (e.g. "urgent", "ASAP", "blocking", a same-day deadline, or mentions many users affected).' }
  }
  if (LOW_PRIORITY_SIGNALS.some((re) => re.test(text))) {
    return { priority: 'Low', rationale: 'Text explicitly signals low urgency (e.g. "no rush", "whenever you can", or positive-closure language like "worked perfectly").' }
  }
  if (DEADLINE_RE.test(text)) {
    return { priority: 'Medium', rationale: 'A deadline is mentioned but no explicit urgency language, so treated as medium priority.' }
  }
  if (issueType === 'Query / A question, no action needed') {
    return { priority: 'Low', rationale: 'A question/information request with no stated urgency defaults to low priority, since it is not blocking active work.' }
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
  department: Department,
  issueType: IssueType,
  details: { label: string }[],
  priority: Priority
): string[] {
  const missing: string[] = []
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const hasLabel = (label: string) => details.some((d) => d.label === label)

  if (wordCount < 12) missing.push('Request is very brief: may be missing context the requester has in mind but did not write down.')
  if (!hasLabel('Contact email found')) missing.push('No contact/requester identity found in the text.')

  // Only flag "impact/urgency not stated" if urgency wasn't already established via explicit
  // high-priority language or a stated scale of impact; otherwise this duplicates that signal.
  if (
    issueType === 'Incident / Something is broken' &&
    priority !== 'High' &&
    !hasLabel('Deadline mentioned') &&
    !hasLabel('Scale of impact')
  ) {
    missing.push('Impact and urgency not stated: unclear how many people are affected or how time-sensitive this is.')
  }
  if (issueType === 'Request / Something new is needed' && department === 'Access' && !hasLabel('System / product named')) {
    missing.push('No specific system/account named: unclear what access is actually being requested.')
  }
  if (issueType === 'Change / Modify something existing' && wordCount < 20) {
    missing.push('Change request lacks detail on exactly what should change and why.')
  }

  return missing
}

export function runRulesTriage(rawText: string): TriageResult {
  const text = rawText.trim()

  if (!text) {
    return {
      department: 'Miscellaneous',
      departmentConfidence: 0,
      issueType: 'Other / unclassified',
      issueTypeConfidence: 0,
      priority: 'Low',
      priorityRationale: 'No text provided.',
      extractedDetails: [],
      missingInformation: ['No request text was submitted.'],
      confidence: 0,
      needsHumanReview: true,
      source: 'rules',
      rationale: 'Empty input cannot be triaged.',
    }
  }

  const department = classifyAxis(text, DEPARTMENT_RULES, 'Miscellaneous')
  const issueType = classifyAxis(text, ISSUE_TYPE_RULES, 'Other / unclassified')

  // Closure/positive-feedback language ("worked perfectly, thank you") means this is FYI, not an
  // active request, a coincidental keyword match (e.g. the noun "system update") shouldn't be
  // read as a request for that category just because the word appears (see AD1).
  const isClosureMessage = CLOSURE_RE.test(text) && !HIGH_PRIORITY_SIGNALS.some((re) => re.test(text))
  if (isClosureMessage) {
    department.value = 'Miscellaneous'
    issueType.value = 'Other / unclassified'
    department.confidence = Math.min(department.confidence, 0.2)
    issueType.confidence = Math.min(issueType.confidence, 0.2)
  }

  const { priority, rationale: priorityRationale } = determinePriority(text, issueType.value)
  const extractedDetails = extractDetails(text)
  const missingInformation = findMissingInformation(text, department.value, issueType.value, extractedDetails, priority)

  if (department.isTie) {
    missingInformation.unshift(
      `Multiple departments scored equally (${department.tiedValues.join(', ')}): likely more than one topic in this message, so department was left as "Miscellaneous" rather than guessed.`
    )
  }
  if (issueType.isTie) {
    missingInformation.unshift(
      `Multiple issue types scored equally (${issueType.tiedValues.join(', ')}): a single-category rules engine cannot confidently split this; needs human disambiguation.`
    )
  }

  // Overall confidence is the weaker of the two axes: a mismatch on either dimension means the
  // overall triage result shouldn't be trusted more than its least-confident part.
  const combinedConfidence = Math.min(department.confidence, issueType.confidence)
  const confidence = Math.max(0.1, combinedConfidence - missingInformation.length * 0.12)
  const needsHumanReview =
    confidence < 0.6 ||
    issueType.value === 'Other / unclassified' ||
    department.isTie ||
    issueType.isTie ||
    missingInformation.length >= 3

  const rationale = `Department classified as "${department.value}" (score ${department.score.toFixed(1)}, margin ${department.margin.toFixed(1)}). Issue type classified as "${issueType.value}" (score ${issueType.score.toFixed(1)}, margin ${issueType.margin.toFixed(1)}).`

  return {
    department: department.value,
    departmentConfidence: department.confidence,
    issueType: issueType.value,
    issueTypeConfidence: issueType.confidence,
    priority,
    priorityRationale,
    extractedDetails,
    missingInformation,
    confidence: Math.round(confidence * 100) / 100,
    needsHumanReview,
    source: 'rules',
    rationale,
  }
}
