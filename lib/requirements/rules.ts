import type {
  IssueSeverity,
  RequirementAnalysisResult,
  RequirementFormat,
  RequirementIssue,
} from './types'

// A curated subset of the classic "ambiguous words" lists used in real requirements-engineering
// checklists (e.g. INCOSE's Guide for Writing Requirements, NASA's requirements guidance), terms
// that sound specific but are not independently testable without a stakeholder defining them.
const AMBIGUOUS_TERMS: { term: string; re: RegExp }[] = [
  { term: 'user-friendly', re: /\buser[- ]friendly\b/i },
  { term: 'easy to use', re: /\beasy to use\b/i },
  { term: 'intuitive', re: /\bintuitive(ly)?\b/i },
  { term: 'seamless', re: /\bseamless(ly)?\b/i },
  { term: 'robust', re: /\brobust(ly)?\b/i },
  { term: 'flexible', re: /\bflexible\b/i },
  { term: 'scalable', re: /\bscalable\b/i },
  { term: 'efficient', re: /\befficient(ly)?\b/i },
  { term: 'effective', re: /\beffective(ly)?\b/i },
  { term: 'appropriate', re: /\bappropriate(ly)?\b/i },
  { term: 'adequate', re: /\badequate(ly)?\b/i },
  { term: 'sufficient', re: /\bsufficient(ly)?\b/i },
  { term: 'reasonable', re: /\breasonable\b/i },
  { term: 'timely', re: /\btimely\b/i },
  { term: 'as needed', re: /\bas needed\b/i },
  { term: 'if possible', re: /\bif possible\b/i },
  { term: 'where applicable', re: /\bwhere applicable\b/i },
  { term: 'state of the art', re: /\bstate[- ]of[- ]the[- ]art\b/i },
  { term: 'best practice', re: /\bbest practices?\b/i },
  { term: 'modern', re: /\bmodern\b/i },
  { term: 'optimal', re: /\boptimal(ly)?\b/i },
  { term: 'fast', re: /\bfast\b/i },
  { term: 'quickly', re: /\bquickly\b/i },
  { term: 'slow', re: /\bslow(ly)?\b/i },
  { term: 'secure', re: /\bsecure(ly)?\b/i },
  { term: 'reliable', re: /\breliabl[ey]\b/i },
  { term: 'TBD', re: /\b(tbd|tbc)\b/i },
  { term: 'etc.', re: /\betc\.?\b/i },
  { term: 'and/or', re: /\band\/or\b/i },
]

const MAX_REPORTED_AMBIGUOUS_TERMS = 5

const USER_STORY_ROLE_RE = /\bas\s+an?\s+([^,.\n]+?),?\s*i\s+want\b/i
const USER_STORY_WANT_RE = /\bi\s+want\b/i
const USER_STORY_GOAL_RE = /\bi\s+want\s+(?:to\s+)?([\s\S]+?)(?:,?\s*so\s+that\b|[.\n]|$)/i
const USER_STORY_BENEFIT_RE = /\bso\s+that\s+([\s\S]+?)(?:[.\n]|$)/i
const PLAIN_REQUIREMENT_RE = /\b(the\s+(system|application|app|platform|tool|service)\s+(shall|should|must|will))\b/i

const AC_HEADING_RE = /\b(acceptance criteria|ac)\s*:?/i
const GHERKIN_LINE_RE = /^\s*(given|when|then|and|but)\b/i
const BULLET_LINE_RE = /^\s*([-*•]|\d+[.)])\s*/
const CONCRETE_MARKER_RE = /\d|"[^"]+"|\b(https?:\/\/|status code|error message)\b/i

function splitLines(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
}

function detectFormat(text: string): RequirementFormat {
  if (USER_STORY_ROLE_RE.test(text) || USER_STORY_WANT_RE.test(text)) return 'user-story'
  if (PLAIN_REQUIREMENT_RE.test(text)) return 'plain-requirement'
  return 'unrecognized'
}

function findAmbiguousTerms(text: string): { term: string; excerpt: string }[] {
  const found: { term: string; excerpt: string }[] = []
  for (const { term, re } of AMBIGUOUS_TERMS) {
    const match = re.exec(text)
    if (match) found.push({ term, excerpt: match[0] })
    if (found.length >= MAX_REPORTED_AMBIGUOUS_TERMS) break
  }
  return found
}

function countCompoundSmell(mainText: string): number {
  const matches = mainText.match(/\band\b/gi)
  return matches ? matches.length : 0
}

function splitStoryAndAcceptanceCriteria(text: string): { mainText: string; acLines: string[] } {
  const headingMatch = AC_HEADING_RE.exec(text)
  if (headingMatch) {
    const mainText = text.slice(0, headingMatch.index).trim()
    const acLines = splitLines(text.slice(headingMatch.index + headingMatch[0].length))
    return { mainText, acLines }
  }

  const lines = splitLines(text)
  const firstStructuredIndex = lines.findIndex(
    (l) => GHERKIN_LINE_RE.test(l) || BULLET_LINE_RE.test(l)
  )
  // Require at least two lines before trusting the bullet/Gherkin heuristic: a single line of
  // ordinary prose that happens to start with "When"/"Given" is not a real acceptance-criteria
  // block, and splitting on it would swallow the whole requirement and hide it from every other check.
  if (firstStructuredIndex === -1 || lines.length < 2) {
    return { mainText: text.trim(), acLines: [] }
  }
  return {
    mainText: lines.slice(0, firstStructuredIndex).join(' ').trim(),
    acLines: lines.slice(firstStructuredIndex),
  }
}

function isLineTestable(line: string, acLinesAreGherkin: boolean): boolean {
  if (acLinesAreGherkin) return true
  return CONCRETE_MARKER_RE.test(line)
}

function lineHasAmbiguousTerm(line: string): boolean {
  return AMBIGUOUS_TERMS.some(({ re }) => re.test(line))
}

function buildSuggestedQuestions(issues: RequirementIssue[]): string[] {
  const questions: string[] = []
  const add = (q: string) => {
    if (!questions.includes(q)) questions.push(q)
  }

  for (const issue of issues) {
    switch (issue.type) {
      case 'ambiguous-term':
        add(`What specific, measurable definition should replace "${issue.excerpt}"?`)
        break
      case 'compound-requirement':
        add('Can this be split into separate, independently testable requirements?')
        break
      case 'missing-acceptance-criteria':
        add('What are the specific, testable conditions that define this as done?')
        break
      case 'untestable-criterion':
        add(`How would someone verify "${issue.excerpt}" without judgement calls: what number, state, or exact outcome applies?`)
        break
      case 'missing-role':
        add('Who, specifically, is the user/role this is written for?')
        break
      case 'missing-benefit':
        add('Why does the user want this: what is the underlying benefit or goal?')
        break
      case 'too-brief':
        add('Can you expand this into a full requirement with context, scope and acceptance criteria?')
        break
    }
  }
  return questions.slice(0, 6)
}

export function runRequirementsQA(rawText: string): RequirementAnalysisResult {
  const text = rawText.trim()

  if (!text) {
    return {
      format: 'unrecognized',
      qualityScore: 0,
      issues: [{ type: 'too-brief', severity: 'blocker', message: 'No requirement text was submitted.' }],
      hasAcceptanceCriteria: false,
      acceptanceCriteriaCount: 0,
      untestableCriteriaCount: 0,
      suggestedQuestions: ['What requirement or user story would you like reviewed?'],
      confidence: 0,
      needsHumanReview: true,
      source: 'rules',
      rationale: 'Empty input cannot be assessed.',
    }
  }

  const issues: RequirementIssue[] = []
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const format = detectFormat(text)
  const { mainText, acLines } = splitStoryAndAcceptanceCriteria(text)

  if (wordCount < 8) {
    issues.push({
      type: 'too-brief',
      severity: 'blocker',
      message: 'Too little text to assess meaningfully; this reads as a fragment, not a complete requirement.',
    })
  }

  for (const { excerpt } of findAmbiguousTerms(mainText)) {
    issues.push({
      type: 'ambiguous-term',
      severity: 'warning',
      message: `"${excerpt}" is subjective and not independently testable: ask the stakeholder for a specific, measurable definition.`,
      excerpt,
    })
  }

  const compoundCount = countCompoundSmell(mainText)
  if (compoundCount >= 2) {
    issues.push({
      type: 'compound-requirement',
      severity: 'warning',
      message: 'This requirement may bundle multiple distinct capabilities in one sentence (multiple "and"s): consider splitting so each can be estimated and tested independently.',
    })
  }

  const acLinesAreGherkin = acLines.some((l) => GHERKIN_LINE_RE.test(l))
  const cleanedAcLines = acLines.filter((l) => !AC_HEADING_RE.test(l))
  let untestableCriteriaCount = 0

  if (cleanedAcLines.length === 0) {
    issues.push({
      type: 'missing-acceptance-criteria',
      severity: 'blocker',
      message: 'No acceptance criteria found: this cannot be verified as "done" without specific, testable conditions.',
    })
  } else {
    for (const line of cleanedAcLines) {
      const testable = isLineTestable(line, acLinesAreGherkin)
      if (!testable && (lineHasAmbiguousTerm(line) || line.split(/\s+/).filter(Boolean).length < 5)) {
        untestableCriteriaCount += 1
        issues.push({
          type: 'untestable-criterion',
          severity: 'warning',
          message: 'This acceptance criterion has no concrete, measurable condition; it reads as a judgement call rather than a pass/fail check.',
          excerpt: line.replace(BULLET_LINE_RE, '').trim(),
        })
      }
    }
  }

  if (format === 'user-story') {
    if (!USER_STORY_ROLE_RE.test(mainText)) {
      issues.push({
        type: 'missing-role',
        severity: 'warning',
        message: 'No "As a [role]" clause found: unclear who this requirement is actually for.',
      })
    }
    if (!USER_STORY_BENEFIT_RE.test(mainText)) {
      issues.push({
        type: 'missing-benefit',
        severity: 'warning',
        message: 'No "so that [benefit]" clause found: a reviewer can\'t judge priority or trade-offs without knowing the underlying goal.',
      })
    }
  }

  let qualityScore = 100
  for (const issue of issues) {
    if (issue.severity === 'blocker') qualityScore -= 25
    else if (issue.severity === 'warning') qualityScore -= 10
    else qualityScore -= 4
  }
  qualityScore = Math.max(0, Math.min(100, qualityScore))

  const hasBlocker = issues.some((i) => i.severity === 'blocker')
  let confidence = format === 'unrecognized' ? 0.4 : 0.85
  if (wordCount < 8) confidence -= 0.3
  confidence = Math.max(0.1, Math.min(0.95, confidence - issues.length * 0.05))

  const needsHumanReview = qualityScore < 70 || hasBlocker || format === 'unrecognized'

  const suggestedQuestions = buildSuggestedQuestions(issues)

  return {
    format,
    qualityScore,
    issues,
    hasAcceptanceCriteria: cleanedAcLines.length > 0,
    acceptanceCriteriaCount: cleanedAcLines.length,
    untestableCriteriaCount,
    suggestedQuestions,
    confidence: Math.round(confidence * 100) / 100,
    needsHumanReview,
    source: 'rules',
    rationale: `Detected format "${format}" with ${issues.length} issue(s) found (${issues.filter((i) => i.severity === 'blocker').length} blocker, ${issues.filter((i) => i.severity === 'warning').length} warning); quality score ${qualityScore}/100.`,
  }
}
