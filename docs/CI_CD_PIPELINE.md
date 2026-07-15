# CI/CD pipeline

## Current architecture

`ci-pipeline.yml` defines 17 jobs from dependency installation through tests, source scanning, two gates, backend-image build/scanning, SBOM generation, signing/push configuration, and summary publication. `dast-scan.yml` is a separate scheduled/manual workflow against a configured staging URL.

## Pull-request versus publication behavior

- Pull requests run validation jobs; they must not publish images or receive elevated package/OIDC permissions.
- `sign-and-push` is limited to push events and has `packages: write` and `id-token: write` only within that job.
- The pipeline must use immutable image tags/digests for any evidence or deployment record.

## Known limitations

- Several third-party actions and runtime images remain tag-pinned rather than SHA/digest-pinned.
- Gate 2 is backend-focused and requires completion for the frontend image.
- DAST is configured but no retained current-run report exists.
- SBOM, GHCR publication, Cosign signing, and signature verification require GitHub/GHCR execution permissions and are not verified by the YAML files alone.

These limitations must remain visible in the report and defense until evidence closes them.
