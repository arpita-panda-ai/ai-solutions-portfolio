'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2, Sparkles } from 'lucide-react'
import { EXAMPLE_REQUESTS } from '@/lib/triage/examples'
import type { TriageResult } from '@/lib/triage/types'

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-status-progress/10 text-status-progress border-status-progress/30',
  Medium: 'bg-accent-soft text-accent border-accent/30',
  Low: 'bg-ink/5 text-ink-muted border-border',
}

function ResultCard({ result, note }: { result: TriageResult; note?: string | null }) {
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          {result.source === 'llm' ? 'AI-assisted (Claude)' : 'Rules-based'}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[result.priority]}`}
        >
          {result.priority} priority
        </span>
      </div>

      {note && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-status-progress/30 bg-status-progress/5 p-3 text-xs text-ink">
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-status-progress" />
          <span>{note}</span>
        </div>
      )}

      <h3 className="mt-4 font-serif text-lg font-semibold text-ink">{result.department}</h3>
      <p className="mt-1 text-sm text-ink-muted">{result.issueType}</p>
      <p className="mt-1 text-xs text-ink-muted">{result.priorityRationale}</p>

      {result.needsHumanReview && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-status-concept/30 bg-ink/5 py-2 px-3 text-xs font-medium text-ink">
          <AlertTriangle size={14} className="flex-shrink-0" />
          Flagged for human review (confidence {Math.round(result.confidence * 100)}%)
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Extracted details</p>
        {result.extractedDetails.length === 0 ? (
          <p className="mt-1 text-sm text-ink-muted">Nothing extracted beyond the classification above.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {result.extractedDetails.map((d) => (
              <li key={d.label}>
                <span className="text-ink-muted">{d.label}:</span> <span className="text-ink">{d.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Missing information</p>
        {result.missingInformation.length === 0 ? (
          <p className="mt-1 text-sm text-ink-muted">None flagged.</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {result.missingInformation.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Routed to</p>
          <p className="mt-1 text-ink">{result.department} team</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Confidence</p>
          <p className="mt-1 text-ink">{Math.round(result.confidence * 100)}%</p>
        </div>
      </div>

      <p className="mt-4 text-xs italic text-ink-muted">{result.rationale}</p>
    </div>
  )
}

export default function TriageCopilotTool() {
  const [text, setText] = useState('')
  const [useAI, setUseAI] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<{
    result: TriageResult
    rulesResult?: TriageResult
    aiRequested: boolean
    aiNote?: string | null
  } | null>(null)

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, useAI }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setResponse(data)
      }
    } catch {
      setError('Could not reach the triage service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-ops-triage-copilot" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">Try the Triage Copilot</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Paste a free-text request below, or load one of the synthetic examples. The rules-based
        engine always runs. You can optionally also run it through Claude for comparison — this
        demo caps the number of AI calls to keep cost under control, and falls back to the
        rules-based result if the cap is hit or no API key is configured.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {EXAMPLE_REQUESTS.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => setText(ex.text)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-ink-muted hover:border-accent hover:text-accent"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the request as it was received..."
        rows={5}
        maxLength={2000}
        className="mt-4 w-full rounded-md border border-border bg-surface p-4 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:outline-none"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={useAI}
            onChange={(e) => setUseAI(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <Sparkles size={14} className="text-accent" />
          Also run AI-assisted triage (Claude)
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Triaging...' : 'Triage this request'}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <ResultCard result={response.result} note={response.aiNote} />
          {response.aiRequested && response.rulesResult && response.result.source === 'llm' && (
            <ResultCard result={response.rulesResult} />
          )}
        </div>
      )}
    </main>
  )
}
