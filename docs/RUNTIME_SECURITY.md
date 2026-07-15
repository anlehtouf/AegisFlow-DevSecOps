# Runtime security

## Compose profiles

`infrastructure/docker-compose.yml` remains the local demonstration stack and contains clearly labelled convenience defaults. It is not a production deployment definition.

For a production-oriented local deployment, copy `infrastructure/.env.example` to `infrastructure/.env`, set unique secrets, and run:

```bash
docker compose -f infrastructure/docker-compose.yml -f infrastructure/docker-compose.production.yml up -d
```

The overlay removes the database host port, binds HTTP services to loopback, disables seeding, uses read-only filesystems with required temporary paths, drops Linux capabilities, prevents privilege escalation, and enables restart policies.

## Migration and seed policy

Migrations are enabled by default in the current entrypoint for the single-replica local stack. Seed data must be disabled outside demonstrations (`RUN_SEED=false`); the production overlay enforces this. A multi-replica deployment should run migrations once as a dedicated release job before starting application replicas.

## Status

The overlay is **implemented**. It is not yet verified on a target host; a successful Compose run, health response, and container inspection are required before it is described as verified with evidence.
