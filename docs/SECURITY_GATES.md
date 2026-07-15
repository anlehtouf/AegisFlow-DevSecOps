# Security gates

## Gate 1 - source and dependency checks

Gate 1 runs after installation and requires successful linting and backend tests. It blocks when any of the following is true:

- Gitleaks reports one or more secrets.
- Semgrep emits an ERROR or WARNING finding, or its JSON report is absent.
- Trivy filesystem scanning reports any HIGH or CRITICAL dependency finding.
- `npm audit` reports any HIGH or CRITICAL dependency finding.

SonarCloud is currently **advisory** because there is no retained successful authenticated quality-gate run. It must not be described as a mandatory or blocking control until that status changes and evidence is captured.

## Gate 2 - container checks

Gate 2 currently evaluates backend-image critical CVEs, backend Dockerfile policy violations, Hadolint job status, and SBOM job completion. It is implemented but incomplete: frontend image scanning, SBOM, signing, and digest verification still need equivalent fail-closed coverage.

## Evidence requirements

For any successful or failed gate, retain the workflow run URL/ID, commit SHA, command/tool version, machine-readable report, timestamp, configured threshold, and job result in `evidence/EVIDENCE_INDEX.md`. Configuration alone is not verification evidence.
