import Anthropic from '@anthropic-ai/sdk'
import type { Department, IssueType, Priority, TriageResult } from './types'

const VALID_DEPARTMENTS: Department[] = [
  'Hardware',
  'Access',
  'Storage',
  'Purchase',
  'Billing',
  'HR Support',
  'Administrative rights',
  'Internal Project',
  'Miscellaneous',
]
const VALID_ISSUE_TYPES: IssueType[] = [
  'Incident / Something is broken',
  'Request / Something new is needed',
  'Change / Modify something existing',
  'Query / A question, no action needed',
  'Other / unclassified',
]
const VALID_PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

// Hard cost cap for this demo: a cheap model, a small output budget, and a per-process
// request ceiling. This counter resets on server restart / cold start, so it is a
// best-effort cap suitable for a low-traffic portfolio demo, not a production rate limiter.
const MAX_CALLS_PER_PROCESS = Number(process.env.TRIAGE_LLM_MAX_CALLS ?? 30)
const MODEL = process.env.TRIAGE_LLM_MODEL ?? 'claude-haiku-4-5-20251001'
const MAX_OUTPUT_TOKENS = 400

let callCount = 0

export class LlmUnavailableError extends Error {}

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  return new Anthropic({ apiKey })
}

const SYSTEM_PROMPT = `You are a triage assistant for an operations team. You will be given one free-text business request.
Classify it and respond with ONLY a single JSON object, no prose, no markdown fences, matching this exact shape:
{
  "department": one of ${JSON.stringify(VALID_DEPARTMENTS)} (which team should own this ticket),
  "issueType": one of ${JSON.stringify(VALID_ISSUE_TYPES)} (what kind of action this needs),
  "priority": one of ${JSON.stringify(VALID_PRIORITIES)},
  "priorityRationale": short string explaining the priority,
  "extractedDetails": [{"label": string, "value": string}, ...] (key facts you can point to in the text, e.g. deadline, system named, number of people affected),
  "missingInformation": [string, ...] (what a human triager would still need to ask for),
  "confidence": number between 0 and 1 reflecting how confident you are in this classification,
  "rationale": short string explaining your classification
}
Base your answer only on the text given. Do not invent facts not present in the request.`

export async function runLlmTriage(text: string): Promise<TriageResult> {
  const client = getClient()
  if (!client) {
    throw new LlmUnavailableError('ANTHROPIC_API_KEY is not configured.')
  }
  if (callCount >= MAX_CALLS_PER_PROCESS) {
    throw new LlmUnavailableError('Demo cost cap reached for this server instance — falling back to rules-based triage.')
  }
  callCount += 1

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: text }],
  })

  const block = response.content[0]
  if (block.type !== 'text') {
    throw new LlmUnavailableError('Unexpected response format from model.')
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(block.text)
  } catch {
    throw new LlmUnavailableError('Model did not return valid JSON.')
  }

  const department = VALID_DEPARTMENTS.includes(parsed.department as Department)
    ? (parsed.department as Department)
    : 'Miscellaneous'
  const issueType = VALID_ISSUE_TYPES.includes(parsed.issueType as IssueType)
    ? (parsed.issueType as IssueType)
    : 'Other / unclassified'
  const priority = VALID_PRIORITIES.includes(parsed.priority as Priority)
    ? (parsed.priority as Priority)
    : 'Medium'
  const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5

  const extractedDetails = Array.isArray(parsed.extractedDetails)
    ? (parsed.extractedDetails as { label: string; value: string }[]).filter(
        (d) => d && typeof d.label === 'string' && typeof d.value === 'string'
      )
    : []
  const missingInformation = Array.isArray(parsed.missingInformation)
    ? (parsed.missingInformation as string[]).filter((m) => typeof m === 'string')
    : []

  return {
    department,
    departmentConfidence: confidence,
    issueType,
    issueTypeConfidence: confidence,
    priority,
    priorityRationale: typeof parsed.priorityRationale === 'string' ? parsed.priorityRationale : '',
    extractedDetails,
    missingInformation,
    confidence,
    needsHumanReview: confidence < 0.6 || issueType === 'Other / unclassified',
    source: 'llm',
    rationale: typeof parsed.rationale === 'string' ? parsed.rationale : 'Classified by Claude.',
  }
}
