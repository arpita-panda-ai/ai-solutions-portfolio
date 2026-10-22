import { NextResponse } from 'next/server'
import { runRequirementsQA } from '@/lib/requirements/rules'

const MAX_INPUT_LENGTH = 4000

export async function POST(request: Request) {
  let body: { text?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const text = typeof body.text === 'string' ? body.text : ''

  if (!text.trim()) {
    return NextResponse.json({ error: 'Requirement text is required.' }, { status: 400 })
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: `Requirement text must be under ${MAX_INPUT_LENGTH} characters.` }, { status: 400 })
  }

  const result = runRequirementsQA(text)
  return NextResponse.json({ result })
}
