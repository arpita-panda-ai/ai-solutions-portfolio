import Link from 'next/link'
import type { Metadata } from 'next'
import { runRealWorldEvaluation } from '@/lib/triage/evaluate-real'

export const metadata: Metadata = {
  title: 'Triage Copilot Real-World Evaluation Report | Arpita Panda',
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

export default function TriageRealEvalReport() {
  const report = runRealWorldEvaluation()

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-ops-triage-copilot" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Triage Copilot — real-world evaluation report
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        These numbers are computed live by running the same rules-based triage engine against{' '}
        {report.totalCases} real (anonymised) IT service desk tickets from the{' '}
        <strong>{report.source.name}</strong> ({report.source.author}, {report.source.license}) —
        not synthetic text. This is a separate, harder test than the main{' '}
        <Link href="/tools/triage-eval-report" className="text-accent hover:underline">
          synthetic evaluation
        </Link>
        , deliberately kept apart rather than blended into one number.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Sampling: {report.source.samplingMethod}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Scope note: {report.source.preprocessingCaveat}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard label="Department accuracy" value={`${report.overallDepartmentAccuracy}%`} />
        <MetricCard label="Issue type accuracy" value={`${report.overallIssueTypeAccuracy}%`} />
        <MetricCard label="Total cases" value={`${report.totalCases}`} sub={`of ${report.source.totalRows.toLocaleString()} source rows`} />
        <MetricCard
          label="Department baseline"
          value={`${report.baselineDepartmentAccuracy}%`}
          sub={`Always guessing "${report.baselineDepartment}"`}
        />
        <MetricCard
          label="Issue type baseline"
          value={`${report.baselineIssueTypeAccuracy}%`}
          sub={`Always guessing "${report.baselineIssueType}"`}
        />
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Accuracy by source category</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Performance varies sharply by category — real tickets are far more terse and implicit
          than the synthetic set, and this breaks down exactly where that bites hardest.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Source category</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2 pr-4">Department accuracy</th>
                <th className="py-2">Issue type accuracy</th>
              </tr>
            </thead>
            <tbody>
              {report.bySourceCategory.map((c) => (
                <tr key={c.sourceCategory} className="border-b border-border/60">
                  <td className="py-2 pr-4 text-ink">{c.sourceCategory}</td>
                  <td className="py-2 pr-4 text-ink-muted">{c.count}</td>
                  <td className="py-2 pr-4 text-ink">{c.departmentAccuracy}%</td>
                  <td className="py-2 text-ink">{c.issueTypeAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Confidence calibration</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
                <th className="py-2 pr-4">Confidence band</th>
                <th className="py-2 pr-4">Cases</th>
                <th className="py-2">Accuracy (department &amp; issue type both correct)</th>
              </tr>
            </thead>
            <tbody>
              {report.confidenceCalibration.map((b) => (
                <tr key={b.range} className="border-b border-border/60">
                  <td className="py-2 pr-4 text-ink">{b.range}</td>
                  <td className="py-2 pr-4 text-ink-muted">{b.count}</td>
                  <td className="py-2 text-ink">{b.accuracy === null ? '—' : `${b.accuracy}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Failed cases ({report.failedCases.length} of {report.totalCases})
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Shown in full, not cherry-picked. The source text below is reproduced exactly as
          published — already lowercased, punctuation-stripped and stopword-reduced by the
          dataset, not by this tool.
        </p>
        <div className="mt-4 space-y-4">
          {report.failedCases.map((f) => (
            <div key={f.case.id} className="card p-4">
              <p className="text-xs font-mono uppercase tracking-wide text-ink-muted">
                {f.case.id} · {f.case.sourceCategory}
              </p>
              <p className="mt-1 text-sm text-ink">&ldquo;{f.case.text}&rdquo;</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-ink-muted">Expected: </span>
                  <span className="text-ink">{f.case.expectedDepartment} / {f.case.expectedIssueType}</span>
                </div>
                <div>
                  <span className="text-ink-muted">Actual: </span>
                  <span className="text-ink">{f.actual.department} / {f.actual.issueType} (confidence {f.actual.confidence})</span>
                </div>
              </div>
              {f.case.note && <p className="mt-2 text-xs italic text-ink-muted">{f.case.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
