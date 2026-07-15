# AegisFlow Final Audit

**Audit date:** 2026-07-15  
**Audited branch:** `pfe-final-hardening` (created before modification)  
**Scope:** repository, application, local infrastructure, CI/CD configuration, security controls, evidence, Word reports, and presentation assets.  
**Evidence rule:** this audit distinguishes *Planned*, *Configured*, *Implemented*, *Executed*, and *Verified with evidence*. A configuration file alone is not execution evidence.

## 1. Executive assessment

The repository is a substantial PFE DevSecOps prototype: SecureTrack is a React/Vite SPA backed by Express, Prisma, and PostgreSQL; Docker Compose runs the local stack; GitHub Actions defines CI controls; and Prometheus/Grafana support monitoring. The hardened codebase already includes valuable controls such as Helmet, CORS restriction, bcrypt, JWT expiry, login limiting, non-root containers, health checks, Prisma migrations, and test suites.

The project is **not ready to be represented as a completed, production-grade DevSecOps delivery**. The most serious implementation defect is broken object-level authorization: a valid reporter token can list, read, edit, and obtain statistics for all incidents. CI controls also contain fail-open paths, DAST is not an executable release validation, only the backend image is fully covered by the configured supply-chain controls, and key evidence remains absent. The PFE reports contain incompatible claims and references to deleted repository assets.

## 2. Repository and application architecture

```text
Browser -> React/Vite SPA -> nginx reverse proxy -> Express API -> Prisma -> PostgreSQL
                                                   |                |
                                                   +-> /api/metrics  +-> schema/migration/seed
                                                           |
Prometheus <----------------------------------------------+
      |
Grafana   Pushgateway <- intended CI metric push

GitHub Actions: install/lint/tests -> source security controls -> gate 1 ->
Docker build/lint/image scan/policy/SBOM -> gate 2 -> backend image sign/push
```

The data model currently has `User` and `Incident` only. It does **not** implement the audit-event or DevSecOps-artifact entities described in the PFE report and some diagrams.

## 3. Exact repository state observed

- Branch before audit: `main`; current hardening branch: `pfe-final-hardening`.
- The pre-existing worktree was dirty: **88 modified, deleted, or untracked paths**.
- `infrastructure/terraform/` is deleted in the working tree although historical commits track it.
- `.github/workflows/cd-deploy.yml` is deleted/absent, while the runbook and PFE report say it exists.
- A timestamped backup was made before changes: `docs/PFE_Report.backup-2026-07-15.docx`.
- `git diff --check` reports one extra blank line at the end of `.gitignore`.

## 4. Tooling and versions

| Tool/control | Repository reference | Status | Version evidence |
| --- | --- | --- | --- |
| Node.js | backend/frontend engines and CI env | Configured | Node `>=20`; CI uses `20` |
| Express | backend package lock/manifest | Implemented | manifest `^4.21.2` |
| Prisma | backend package lock/manifest | Implemented | manifest `^5.10.0` |
| React/Vite | frontend package lock/manifest | Implemented | React `^18.2.0`; Vite `^8.0.13` |
| PostgreSQL | Compose | Configured | `postgres:16-alpine` |
| Gitleaks | action/config | Configured | action tag `v2`; scanner binary version not evidenced |
| Semgrep | container/config | Configured | `semgrep/semgrep` unpinned; binary version not evidenced |
| Trivy | action/config | Configured | action is `@master`; version not reproducible |
| Hadolint | action | Configured | action `v3.1.0`; binary version not evidenced |
| OPA/Conftest | Rego/workflow | Configured | workflow downloads dynamic `latest`; not reproducible |
| Syft | SBOM action | Configured | `anchore/sbom-action@v0`; binary version not evidenced |
| Cosign | workflow | Configured | installer `v3`; execution evidence absent |
| OWASP ZAP | workflow/config | Configured | action `v0.12.0`; execution evidence absent |
| Prometheus/Grafana/Pushgateway | Compose | Configured | images use mutable `latest` tags |

## 5. CI/CD workflow architecture

`ci-pipeline.yml` defines these 17 jobs: `install`, `lint`, `test-backend`, `test-frontend`, `secret-scan`, `sast`, `sonar`, `dependency-scan`, `security-gate-1`, `build-image`, `hadolint`, `image-scan`, `sbom`, `policy-check`, `security-gate-2`, `sign-and-push`, and `pipeline-summary`.

`dast-scan.yml` defines a separate `zap-scan` job and a scheduled placeholder job. It is not part of the main release dependency graph.

### Actual gates

| Gate | Actual inputs | Current status |
| --- | --- | --- |
| Security Gate 1 | Gitleaks output count, Semgrep warning/error count, Trivy critical count, lint/tests; Sonar is informational | Implemented but **not fail closed** |
| Security Gate 2 | backend image critical count and backend Conftest violations; Hadolint/SBOM job state | Implemented but incomplete scope |
| DAST gate | None | Not implemented |

## 6. Evidence-status matrix

| Control | Intended purpose | Current status | Evidence available | Evidence missing | Required action | Report wording allowed |
| --- | --- | --- | --- | --- | --- | --- |
| Backend/front-end tests | Functional regression checks | Executed | 2026-07-13 command output: 34 backend and 21 frontend tests passed | Current coverage artefacts | Run coverage and preserve reports | “Tests were executed locally; exact output is retained.” |
| Lint/build | Code quality/buildability | Executed | Backend/frontend lint and frontend build output | CI run evidence | Preserve current output in evidence | “Validated locally.” |
| Docker Compose | Local runtime | Verified with evidence (historical) | `E03-local-stack-verification.md`, dated 2026-06-26 | Fresh reproducible command output for current SHA | Re-run after hardening | “Verified for the identified local run only.” |
| Gitleaks | Detect committed secrets | Configured | Baseline narrative only | Sanitized raw current/history report and tool version | Execute, save JSON/SARIF and result metadata | “Configured” until executed evidence exists. |
| Semgrep | SAST/custom rules | Configured | Baseline narrative only | Rule test corpus, current SARIF/JSON, version | Add tests; execute and save reports | “Configured” until evidence exists. |
| Trivy/npm audit | SCA | Partly executed historically | Local audit statement in E03 | Raw backend and frontend scans for same commit | Run both and retain outputs | “Locally audited” only when output is retained. |
| Hadolint/Conftest | Dockerfile/policy checks | Configured | Policy tests exist | Current command reports and tool versions | Run locally/CI and retain output | “Configured” until reports exist. |
| ZAP | Dynamic testing | Configured | No completed ZAP report | Running isolated target and machine-readable report | Implement executable local/CI procedure | “DAST workflow configured; execution pending.” |
| SBOM | Component inventory | Configured | No SBOM artefact | SPDX/CycloneDX tied to digest | Generate and store artifact | “SBOM generation configured; not yet evidenced.” |
| Cosign/GHCR | Publish, sign, verify image | Configured | No digest/signature/verification output | Workflow run, image digest, verification output | Run authorised main-branch publication | “Configured; external execution blocked pending repository access.” |
| SonarCloud | Quality analysis | Configured, non-blocking | Configuration file | Successful analysis/gate result | Choose blocking or explicit advisory stance | “Optional advisory analysis” only. |
| Monitoring | Observability | Configured | Dashboards/config files | Live target/dashboard/alert evidence | Start stack and capture evidence | “Configured locally; runtime validation pending.” |

## 7. Findings and remediation priorities

### BLOCKER — Unsupported completion claims in the PFE reports

`docs/PFE_Report.docx` claims completed green runs, a 17-stage/2-gate pipeline, a 22-stage/5-gate pipeline, all 15 vulnerabilities detected, and exact CVE/pipeline-duration/cost figures while the repository evidence index marks major evidence E1, E2, E4–E15 as TODO. `defense/Rapport_PFE_AegisFlow.docx` makes still stronger 22-stage/5-gate and “every risk” claims. Neither document may be submitted unchanged.

**Action:** rewrite around the evidence-status matrix and only cite retained outputs. External execution claims must be marked “Configured” or “Blocked pending authorised GitHub Actions/GHCR access.”

### CRITICAL — Broken authorization / IDOR

`incidentRoutes.js` applies authentication but no ownership/role authorization. `incidentService.js` lists, reads, updates, and computes statistics without `req.user.id` or `req.user.role` constraints. The report/threat model claim RBAC and auditability that do not exist.

**Action:** implement an explicit ownership and ADMIN authorization policy; add two-user and admin regression tests; document the actual role model.

### HIGH — Fail-open CI checks and incomplete gates

Semgrep uses `continue-on-error`; a missing JSON report is converted into zero findings. `npm audit` uses `|| true` and is never evaluated. Trivy gates critical findings only while requesting high findings too. Sonar is intentionally non-blocking. The gates scan/policy/SBOM/sign only the backend image.

**Action:** remove fail-open logic; fail if a required report is absent; define and implement explicit high/critical exception handling; cover both images; make Sonar either required with evidence or clearly advisory.

### HIGH — DAST is not runnable as a release validation

The manual ZAP workflow defaults to `localhost` on an ephemeral GitHub runner where no application starts. The scheduled workflow is a placeholder. A deleted CD workflow is still documented.

**Action:** create an isolated Compose-based DAST job/procedure, wait for health, run ZAP, retain reports, and gate the relevant severity. Restrict manual target URLs.

### HIGH — Unsafe demo defaults in deployment configuration

Compose defaults a database password and JWT secret, exposes PostgreSQL on the host, uses static seeded credentials, and defaults Grafana to `admin/admin`.

**Action:** split demo and production profiles; require secrets for non-demo use; bind the database internally; disable/guard seed operations; publish a complete `.env.example` with no real secret.

### MEDIUM — Incomplete runtime hardening

The backend returns raw error messages, health exposes database exception text, metrics are public, Compose lacks resource limits/read-only filesystem/capability restrictions, and migrations/seeding run at each backend start.

**Action:** use generic external errors, restrict metrics, move migrations to a one-shot operation, and add suitable Compose security/runtime settings.

### MEDIUM — Tests do not validate claimed integration or key security cases

The “integration” tests mock Prisma. The expired-token test schedules an unawaited callback. Tests lack role/ownership denial, real database migration, error-disclosure, metrics, and security-header coverage.

**Action:** add a PostgreSQL-backed test profile and security regression suite; preserve exact coverage outputs.

### MEDIUM — Supply-chain reproducibility weaknesses

`trivy-action@master`, mutable `latest` container tags, and an unverified dynamic Conftest download undermine repeatability. No digest-pinned evidence exists.

**Action:** pin actions and images to immutable versions/SHAs/digests; checksum-verify standalone binaries; record tool version, digest, SHA, and timestamp with each artefact.

### LOW — Documentation, diagram, and repository consistency

Documentation references deleted CD and Terraform files, uses inconsistent stage/gate/tool/test numbers, and contains encoding corruption (`â€¦`). The Word report has placeholders, a manual TOC instruction, unsupported citations/statistics, and model/feature descriptions absent from code.

**Action:** reconcile docs with the current branch, replace unsupported data with status labels, normalize UTF-8, regenerate editable diagrams, and revise the report/presentation from the final evidence index.

## 8. Vulnerability V1–V15 audit status

The baseline and hardened summaries describe a historic, intentionally vulnerable state, but the current hardened branch does not contain all vulnerable behaviours and the repository does not contain raw scanner results for every claimed detection. Therefore no vulnerability is currently “Verified with evidence” solely from the narrative reports.

| IDs | Current conclusion |
| --- | --- |
| V1–V2 | Historical baseline claim; current source uses environment variables. Raw baseline/current Gitleaks evidence required. |
| V3–V4 | Historical baseline claim; current source uses Prisma and React escaping. Registry-rule execution evidence required. |
| V5–V6, V15 | Historical dependency/base-image claims. Exact scan requires a fixed lockfile/image digest and current scanner report. |
| V7–V8 | Current Dockerfile visibly uses non-root and HEALTHCHECK; policy execution evidence required. |
| V9–V14 | Current code includes partial fixes. Need focused tests and current scanner/DAST evidence; V10 cannot be credited to ZAP until an actual ZAP report exists. |

## 9. Required report and presentation corrections

1. Replace “production-grade,” “all vulnerabilities,” “all stages passed,” “five gates,” “22 stages,” exact CVE totals, exact pipeline duration, cost figures, signing, SBOM, GHCR, and ZAP assertions unless corresponding retained evidence exists.
2. Remove placeholders for supervisor/institution/student data only after the user supplies approved values; do not invent them.
3. Rebuild the table of contents, figure/table lists, references, methodology/evaluation/threats-to-validity sections, and the results chapter after evidence exists.
4. Retain the report’s existing French/English convention only if required by the institution; otherwise settle on one documented structure and citation style.
5. Build the defense around verified local results, configured-but-unexecuted controls, blocked external items, and the remediation plan. It must not claim certification, full compliance, or complete production readiness.

## 10. Prioritized implementation plan

1. Preserve the baseline (branch + report backup complete), add this audit, and normalise documentation status language.
2. Fix authorization, validation, safe errors/metrics, seed/migration separation, deployment defaults, and regression tests.
3. Rework CI into explicit fail-closed PR validation and restricted main-branch publication; pin supply-chain dependencies and cover both images.
4. Implement reproducible local scanner/policy/DAST/evidence commands. Record anything requiring GitHub, GHCR, SonarCloud, or registry credentials as blocked with manual steps.
5. Re-run feasible local checks from a clean installation and capture raw evidence tied to the branch SHA.
6. Generate final metrics only from same-SHA artifacts.
7. Rewrite and render-verify the report, then create/render-verify the presentation and final delivery summary.

## 11. Immediate blockers requiring user-controlled systems

- GitHub Actions workflow execution and run URLs: repository access and runner execution.
- GHCR publication, OIDC Cosign signing, and verification: GitHub repository/package permissions and public/private package access.
- SonarCloud analysis: a valid `SONAR_TOKEN` and project configuration, if it is to be required.
- Final institution, supervisor, and student identity fields for the PFE document.

These blockers will be documented precisely rather than simulated.
