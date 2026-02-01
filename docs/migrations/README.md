# Migrations Runbook 🧭

This document describes how to run migrations locally and via CI for SONNET-POS.

Important: Treat production migrations with caution. Always create a backup before applying SQL.

Local (manual) steps

1. Create a backup

   ```bash
   TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
   mkdir -p backups
   pg_dump "$DATABASE_URL" -Fc -f "backups/sonnet-prod-${TIMESTAMP}.dump"
   ```

2. Apply migrations

   ```bash
   psql "$DATABASE_URL" -f migrations/2026-02-01-add-suppliers-stock-audit.sql
   ```

3. (Optional) Re-seed example data

   ```bash
   psql "$DATABASE_URL" -f docs/seed.sql
   ```

GitHub Actions (recommended for production)

- A workflow `.github/workflows/run-migrations.yml` has been added to this repo.
- To run it against production, add a repository secret `DATABASE_URL` (Postgres connection string).
- Trigger it manually from the Actions tab (recommended) or push to `main`.

Rollback strategy

- If anything goes wrong, restore from the most recent backup:

  ```bash
  pg_restore --clean --no-owner --dbname=$DATABASE_URL backups/sonnet-prod-<timestamp>.dump
  ```

Notes & Safety

- The migration SQL is written to be idempotent (`IF NOT EXISTS`) where possible.
- If you prefer not to allow an automated workflow to run on push to `main`, restrict the workflow and use `workflow_dispatch` with manual approval.
