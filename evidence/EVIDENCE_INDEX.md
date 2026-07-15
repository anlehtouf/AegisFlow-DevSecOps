# AegisFlow Evidence Index

**Project:** AegisFlow — DevSecOps with a built-in shield
**Repository:** https://github.com/anlehtouf/AegisFlow-DevSecOps
**Application:** SecureTrack incident reporting platform
**Purpose:** Collect proof for the PFE defense — red pipeline, green pipeline, signed artifacts, deployment, observability.

---

## Status convention

Each control is labelled **Planned**, **Configured**, **Implemented**, **Executed**, or **Verified with evidence**. Configuration and narrative reports alone do not constitute execution evidence. The current vulnerability status is maintained in [`vulnerability-traceability-matrix.md`](./vulnerability-traceability-matrix.md).

## Local hardening evidence

| ID | Control | Status | Command/result | Artifact |
| --- | --- | --- | --- | --- |
| E01 | Backend/frontend tests and coverage | Verified with evidence | `npm run test:coverage`: backend 41/41, frontend 21/21 | [`tests/E01-local-coverage-2026-07-15.md`](./tests/E01-local-coverage-2026-07-15.md) |

## 1. Evidence Folder Map

| Folder | What to place here | Why it matters |
|---|---|---|
| `evidence/screenshots/01-red-baseline/` | Failed CI run screenshots (vulnerable branch) | Proves gates block vulnerable code |
| `evidence/screenshots/02-green-hardened/` | Successful CI run screenshots (hardened branch) | Proves remediation works |
| `evidence/screenshots/03-deployment/` | `docker compose ps`, `/api/health` 200, app screenshots | Proves the hardened release actually runs |
| `evidence/screenshots/04-supply-chain/` | SBOM excerpts, `cosign sign` log, `cosign verify` output, Rekor entry | Pending CI supply-chain provenance evidence |
| `evidence/screenshots/05-observability/` | Grafana security dashboard, Prometheus targets, alert rules | Proves continuous visibility |
| `evidence/artifacts/` | Small exported reports safe to commit (`.json`, `.spdx.json`, `.sarif`) | Keeps defense evidence reproducible |

---

## 2. Required Defense Evidence

| # | Evidence | Source | Status |
|---|---|---|---|
| E1 | Failed baseline CI run | GitHub Actions on `vulnerable` branch | TODO |
| E2 | Successful hardened CI run | GitHub Actions on `main` | TODO |
| E3 | Local stack healthy | `docker compose ps` + `/api/health` + frontend 200 | DONE - `evidence/artifacts/E03-local-stack-verification.md` |
| E4 | Backend SBOM | workflow artifact | TODO |
| E5 | Frontend SBOM | workflow artifact | TODO |
| E6 | Cosign backend verify | local terminal | TODO |
| E7 | Cosign frontend verify | local terminal | TODO |
| E8 | Rekor transparency log entry | rekor-cli lookup screenshot | TODO |
| E9 | ZAP baseline report | workflow artifact | TODO |
| E10 | Custom Semgrep rule blocking V14 | PR check screenshot | TODO |
| E11 | Grafana security dashboard | local screenshot | TODO |
| E12 | Conftest policy failures (red) and passes (green) | terminal screenshot | TODO |
| E13 | Trivy image scan summary (before vs after) | terminal screenshot | TODO |
| E14 | Branch protection rules on `main` and `develop` | GitHub settings screenshot | TODO |
| E15 | Pipeline runtime metric (`< 15 min` claim) | GitHub Actions run summary | TODO |

---

## 3. Screenshot Naming Convention

Use this format so the report is easy to assemble:

```text
E01-red-baseline-ci-failed.png
E02-green-hardened-ci-passed.png
E03-docker-compose-ps-healthy.png
E04-cosign-verify-backend.png
E05-sbom-backend-spdx.png
E06-rekor-transparency-log.png
E07-zap-baseline-report.png
E08-semgrep-v14-blocked.png
E09-grafana-security-dashboard.png
E10-branch-protection-main.png
```

---

## 4. What To Say In The Defense

AegisFlow is evaluated through evidence, not claims. Every security control in
the architecture has a matching artifact: scanner report, local stack artifact, or pending signed image/SBOM item,
deployment log, or observability screenshot. This makes the project auditable
and reproducible on any laptop in under 30 minutes.
