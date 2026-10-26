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

function FailedCaseCard({ f }: { f: ReturnType<typeof runRealWorldEvaluation>['failedCases'][number] }) {
  return (
    <div className="card p-4">
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
  )
}

export default function TriageRealEvalReport() {
  const report = runRealWorldEvaluation()

  const representativeIds = ['RW2', 'RW29', 'RW40']
  const representativeCases = representativeIds
    .map((id) => report.failedCases.find((f) => f.case.id === id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined)
  const representativeLabels = ['Vocabulary gap', 'Ambiguous / overlapping vocabulary', 'Native label hard to infer from text']
  const remainingCount = report.failedCases.length - representativeCases.length

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/projects/ai-ops-triage-copilot" className="text-sm text-accent hover:underline">
        ← Back to case study
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-ink sm:text-4xl">
        Triage Copilot: real-world evaluation report
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        These numbers are computed live by running the same rules-based triage engine against{' '}
        {report.totalCases} real (anonymised) IT service desk tickets from the{' '}
        <strong>{report.source.name}</strong> ({report.source.author}, {report.source.license}),
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
          Performance varies sharply by category. Real tickets are far more terse and implicit
          than the synthetic set, and this breaks down exactly where that bites hardest.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          <strong>What the department labels mean: </strong>
          department accuracy is scored against the dataset&apos;s own category for each ticket
          (e.g. &ldquo;HR Support&rdquo;, &ldquo;Hardware&rdquo;), which reflects how the business
          actually routed that ticket, not necessarily what topic the text itself suggests. Case
          RW40 below, for example, is labelled HR Support in the source data even though its text
          is a plain software installation error with no HR-specific vocabulary at all. That gap
          between native label and surface text is a genuine limitation of using routing labels
          as ground truth, not a scoring bug, and it puts a ceiling on department accuracy that
          no amount of keyword tuning can fully close.
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
        <h2 className="font-serif text-lg font-semibold text-ink">
          Failed cases ({report.failedCases.length} of {report.totalCases})
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Shown in full, not cherry-picked. The source text below is reproduced exactly as
          published: already lowercased, punctuation-stripped and stopword-reduced by the
          dataset, not by this tool. Three representative failures are highlighted first, each
          illustrating a different kind of limitation; the remaining {remainingCount} are in the
          expandable list below.
        </p>
        <div className="mt-4 space-y-4">
          {representativeCases.map((f, i) => (
            <div key={f.case.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {representativeLabels[i]}
              </p>
              <div className="mt-2">
                <FailedCaseCard f={f} />
              </div>
            </div>
          ))}
        </div>
        <details className="mt-6 rounded-md border border-border">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-ink">
            View all {report.failedCases.length} failed cases
          </summary>
          <div className="space-y-4 p-4 pt-0">
            {report.failedCases.map((f) => (
              <FailedCaseCard key={f.case.id} f={f} />
            ))}
          </div>
        </details>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Confidence analysis (exploratory)</h2>
        <p className="mt-2 text-sm text-ink-muted">
          This is an exploratory look at whether the engine&apos;s confidence score tracks actual
          correctness on this dataset, not a validated calibration claim. The lowest band behaves
          as hoped (most cases, low accuracy), but the 0.6 – 0.8 band shows the opposite of what
          calibration would predict: 6 cases there, yet only 16.7% are jointly correct on both
          department and issue type, worse than the lowest band. The two highest bands have only
          four cases combined, too few to draw a conclusion from. Read this table as a direction
          to investigate further, not as a probability the score can currently be trusted to
          report.
        </p>
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
                  <td className="py-2 text-ink">{b.accuracy === null ? 'N/A' : `${b.accuracy}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
