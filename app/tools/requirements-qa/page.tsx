'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { EXAMPLE_REQUIREMENTS } from '@/lib/requirements/examples'
import type { RequirementAnalysisResult } from '@/lib/requirements/types'

const SEVERITY_STYLES: Record<string, string> = {
  blocker: 'bg-status-progress/10 text-status-progress border-status-progress/30',
  warning: 'bg-accent-soft text-accent border-accent/30',
  suggestion: 'bg-ink/5 text-ink-muted border-border',
}

const FORMAT_LABELS: Record<string, string> = {
  'user-story': 'User story',
  'plain-requirement': 'Plain requirement',
  unrecognized: 'Unrecognized format',
}

function ResultCard({ result }: { result: RequirementAnalysisResult }) {
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          {FORMAT_LABELS[result.format] ?? result.format}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink">
          Quality score: {result.qualityScore}/100
        </span>
      </div>

      {result.needsHumanReview && (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-status-concept/30 bg-ink/5 py-2 px-3 text-xs font-medium text-ink">
          <AlertTriangle size={14} className="flex-shrink-0" />
          Flagged for human review (confidence {Math.round(result.confidence * 100)}%)
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Issues found ({result.issues.length})
        </p>
        {result.issues.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">None flagged.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {result.issues.map((issue, i) => (
              <li key={i} className="rounded-md border border-border p-3 text-sm">
                <span
                  className={`mr-2 rounded-full border px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[issue.severity]}`}
                >
                  {issue.severity}
                </span>
                <span className="text-ink">{issue.message}</span>
                {issue.excerpt && (
                  <p className="mt-1 text-xs italic text-ink-muted">&ldquo;{issue.excerpt}&rdquo;</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Acceptance criteria</p>
          <p className="mt-1 text-ink">
            {result.hasAcceptanceCriteria
              ? `${result.acceptanceCriteriaCount} found (${result.untestableCriteriaCount} untestable)`
              : 'None found'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Confidence</p>
          <p className="mt-1 text-ink">{Math.round(result.confidence * 100)}%</p>
        </div>
      </div>

      {result.suggestedQuestions.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Suggested clarifying questions
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {result.suggestedQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 border-t border-border pt-4 text-xs italic text-ink-muted">{result.rationale}</p>
    </div>
  )
}

export default function RequirementsQaTool() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RequirementAnalysisResult | null>(null)

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.')
      } else {
        setResult(data.result)
      }
    } catch {
      setError('Could not reach the requirements QA service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/requirements-qa" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Try the Requirements QA tool
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Paste a user story or requirement below, or load one of the synthetic examples. The
        rules-based engine checks for ambiguous language, missing or untestable acceptance
        criteria, and incomplete user-story structure, then suggests clarifying questions a
        business analyst could ask the stakeholder.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {EXAMPLE_REQUIREMENTS.map((ex) => (
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
        placeholder="Paste a user story or requirement..."
        rows={6}
        maxLength={4000}
        className="mt-4 w-full rounded-md border border-border bg-surface p-4 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:outline-none"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Reviewing...' : 'Review this requirement'}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-status-progress/40 bg-status-progress/5 p-4 text-sm text-ink">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <ResultCard result={result} />
        </div>
      )}
    </main>
  )
}
