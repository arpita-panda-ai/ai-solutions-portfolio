# Requirements & User Story QA

Catch requirement gaps before they become sprint problems.

A lightweight requirements checker that flags ambiguous language, missing or untestable acceptance criteria, and incomplete user stories, helping business analysts and product owners spot issues before work enters a sprint.

**Status:** In progress
**Focus:** Requirements engineering · QA automation · Rules-based pattern matching

## The problem

Vague or incomplete requirements ("make it user-friendly", "handle errors appropriately") routinely pass review, then surface later as rework, disputes about what "done" means, or untestable acceptance criteria discovered mid-sprint.

Requirements-engineering literature (INCOSE's Guide for Writing Requirements, NASA's requirements guidance) maintains well-known lists of ambiguous terms and testability criteria precisely because this is a recurring, named problem in practice. A first-pass, consistent check for ambiguity and testability, before a human reviewer spends time on it, catches a meaningful share of this early.

## The solution

A rules-based engine, clearly labelled as pattern matching rather than an LLM, reads a user story or plain requirement and returns:

- Detected format (user story vs. plain requirement)
- A list of specific issues (ambiguous terms, compound/bundled requirements, missing or untestable acceptance criteria, missing role or benefit for user stories, too-brief fragments), each with a severity rating and an excerpt
- A quality score
- A set of clarifying questions a BA could ask the stakeholder

Low-confidence or blocker-level outputs are explicitly flagged for human review rather than silently scored.

## How I approached the design

1. **Frame the decision.** I focused the tool on the specific moment a BA or product owner reviews a requirement before it enters a sprint, not on rewriting or "fixing" requirements automatically.
2. **Build the rule set.** I curated an ambiguous-term list and a set of testability and structure checks from standard requirements-engineering references, rather than inventing ad hoc heuristics.
3. **Design the evaluation.** I built a 19-case synthetic, hand-labelled test set (8 clear, 3 ambiguous, 4 missing-information, 4 adversarial) scored on four dimensions: format detection, acceptance-criteria detection, the human-review flag, and whether expected issue types were found without false positives.
4. **Fix what testing surfaced.** Tracing the engine's own rules against each case caught a genuine bug: a single line of ordinary prose starting with "When" was being misread as a one-line Gherkin acceptance-criteria block, swallowing the entire requirement and hiding it from every other check. I fixed this by restricting that heuristic to inputs with more than one line, before recording the final numbers below.

## My contribution

Problem framing, the ambiguity/testability rule set, the evaluation test-set design and scoring, and the UI. Built with Claude Code; I directed the architecture, requirements and decisions.

## Evaluation and limitations

Ground-truth labels were derived by tracing the engine's own rules against each case rather than from independent domain judgement, so this is closer to a thorough logic/regression check than a fully blind evaluation.

Current results: 100% format accuracy, 100% acceptance-criteria detection accuracy, 100% review-flag accuracy, 100% issue-type accuracy, against a 57.9% baseline of always flagging everything for human review.

Because the test set was built by tracing the engine's logic rather than independent blind labelling, these scores mainly confirm the rules behave as designed, not that the design itself is complete. Several deliberate, disclosed gaps remain:

- The curated ambiguous-term list (29 terms from standard requirements-engineering checklists) will miss vague words outside that list (e.g. "better", "nicer").
- Acceptance-criteria lines written in Given/When/Then form are always treated as testable regardless of content, so a vague Gherkin step can still slip through.
- The compound-requirement check is a blunt "and"-counting smell detector: it flags legitimately well-specified multi-clause requirements and repetitive noise text alike, with no real parsing of whether the clauses are actually independent.
- An incomplete user-story fragment (e.g. "As a user" with no "I want") is not recognised as a user story at all.

None of this is hidden; it is the honest ceiling of a keyword/pattern-based v1, not a trained model.

## What I'd explore next

- Expand the ambiguous-term list and test set beyond the current curated scope.
- Add real parsing for compound requirements instead of "and"-counting.
- Test content quality within Given/When/Then acceptance criteria, not just their presence.
- Evaluate against real-world requirements or user stories, not only the synthetic set.

## Tools and methods

Next.js · TypeScript · Rules-based NLP-lite pattern matching · Evaluation harness · Claude Code
