Migration: Add suppliers, purchase_orders, and stock audit tables

Applied: 2026-02-01

Files changed:
- `docs/schema.sql` (adds `suppliers`, `purchase_orders`, `purchase_order_items`, `stock_audits`, `stock_audit_items`, and adds `expiry_date` & `lot_number` to `products`)
- `docs/seed.sql` (creates demo shop, sample supplier, PO, and stock audit)
- `src/lib/services/suppliers.ts` (service layer for suppliers and PO management)
- `src/app/api/import/products/route.ts` (server import endpoint; requires `SUPABASE_SERVICE_ROLE_KEY`)
- `src/app/inventory/import/page.tsx` (client CSV import UI)
- `src/app/api/alerts/check-low-stock/route.ts` (low-stock checker endpoint)
- `docs/rls.sql` (added RLS policies for suppliers, purchase orders, and stock audits)

Instructions:
1. In Supabase SQL editor, run `docs/schema.sql` to apply schema changes.
2. Run `docs/seed.sql` to add demo data for testing.
3. Ensure your deployment has `SUPABASE_SERVICE_ROLE_KEY` set (server env) to allow the import and low-stock endpoints to run.
4. Optionally wire `/api/alerts/check-low-stock` to a cron job or serverless scheduler for automated alerts and integrate with an email/SMS provider.

Notes:
- The import endpoint is intentionally simple (JSON body with `rows`) and expects small batches. For large imports, consider multipart uploads or background job processing.
- Review and adapt RLS policies for your exact tenant model before enabling in production.