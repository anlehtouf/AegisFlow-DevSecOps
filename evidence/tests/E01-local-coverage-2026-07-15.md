# E01 - Local test and coverage execution

**Date:** 2026-07-15  
**Branch:** `pfe-final-hardening`  
**Purpose:** reproducible local quality evidence after authorization and error-handling hardening.

## Commands

```text
cd app/backend && npm run test:coverage
cd app/frontend && npm run test:coverage
```

## Results

| Area | Result | Statements | Branches | Functions | Lines |
| --- | --- | ---: | ---: | ---: | ---: |
| Backend | 5 suites, 41/41 tests passed | 88.65% | 75.43% | 96.42% | 93.18% |
| Frontend | 9 files, 21/21 tests passed | 89.36% | 75.75% | 94.44% | 88.54% |

Coverage output was generated in the ignored `app/backend/coverage/` and `app/frontend/coverage/` directories. These results are local evidence for this branch state only; rerun the commands after any source or dependency change.

## Limitation

The backend test files labelled as integration tests mock Prisma. These figures demonstrate route/service/component coverage, but do not by themselves demonstrate a PostgreSQL-backed migration or integration test.
