# DAST execution

## Status

**Configured. Not yet executed for the current hardening branch.** No ZAP result may be cited until the JSON report created by this procedure is retained with its command output, commit SHA, image digest, and timestamp.

## Scope and safety

The target must be a local, authorised SecureTrack Compose environment. OWASP ZAP baseline scanning is non-destructive; it is not a substitute for an authorised penetration test.

## Local procedure

1. Start the stack with `docker compose -f infrastructure/docker-compose.yml up -d --build`.
2. Wait for `http://127.0.0.1:5000/api/health` and `http://127.0.0.1:3000/` to return success.
3. Run ZAP against `http://127.0.0.1:3000` using the checked-in `security/zap/zap-baseline.conf`.
4. Retain HTML, JSON, and XML reports under `evidence/zap/`.
5. Record the commit SHA, ZAP image digest, timestamp, command, threshold, and result in `evidence/EVIDENCE_INDEX.md`.

## GitHub Actions limitation

The current `dast-scan.yml` must not be described as an executed release gate. It targets a URL but does not start the application in the runner. Until it is replaced with an isolated-stack workflow and a report is retained, the report wording is: “OWASP ZAP baseline scanning is configured; execution evidence is pending.”
