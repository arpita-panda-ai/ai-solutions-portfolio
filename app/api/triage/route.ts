import { NextResponse } from 'next/server'
import { runRulesTriage } from '@/lib/triage/rules'
import { LlmUnavailableError, runLlmTriage } from '@/lib/triage/llm'
import type { TriageResult } from '@/lib/triage/types'

const MAX_INPUT_LENGTH = 2000

export async function POST(request: Request) {
  let body: { text?: unknown; useAI?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text : ''
  const useAI = body.useAI === true

  if (!text.trim()) {
    return NextResponse.json({ error: 'Request text is required.' }, { status: 400 })
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: `Request text must be under ${MAX_INPUT_LENGTH} characters.` }, { status: 400 })
  }

  const rulesResult = runRulesTriage(text)

  if (!useAI) {
    return NextResponse.json({ result: rulesResult, aiRequested: false })
  }

  let llmResult: TriageResult | null = null
  let aiNote: string | null = null
  try {
    llmResult = await runLlmTriage(text)
  } catch (err) {
    aiNote =
      err instanceof LlmUnavailableError
        ? err.message
        : 'AI-assisted triage failed unexpectedly; showing rules-based result instead.'
  }

  return NextResponse.json({
    result: llmResult ?? rulesResult,
    rulesResult,
    aiRequested: true,
    aiNote,
  })
}
