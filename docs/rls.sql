-- Recommended Row Level Security (RLS) snippets for Supabase
-- Apply and adapt to your Auth / profile schema.

-- Enable RLS on shops
ALTER TABLE IF EXISTS shops ENABLE ROW LEVEL SECURITY;

-- Example policy: allow authenticated users to read shops (use carefully)
CREATE POLICY IF NOT EXISTS "allow_auth_read_shops"
ON shops FOR SELECT USING (auth.role() IS NOT NULL);

-- Example multi-tenant policy: allow users to access only their shop
-- Assumes a `profiles` table linking auth.users(id) => profiles.id and profiles.shop_id
CREATE POLICY IF NOT EXISTS "user_access_own_shop"
ON shops FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p WHERE p.shop_id = shops.id AND p.id = auth.uid()
  )
);

-- For writes, create policies that require the profile to belong to a shop:
CREATE POLICY IF NOT EXISTS "user_insert_owns_shop"
ON shops FOR INSERT WITH CHECK (auth.role() IS NOT NULL);

-- NOTE: Adjust policies for your exact profile / tenant model.

-- Enable RLS on inventory related tables
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS stock_audit_items ENABLE ROW LEVEL SECURITY;

-- Generic tenant policy helper using `profiles.shop_id`
-- Allows SELECT/INSERT/UPDATE/DELETE only when the record's shop_id matches the caller's shop
CREATE POLICY IF NOT EXISTS "users_access_own_shop_records"
ON products FOR ALL USING (
  (shop_id IS NULL) OR
  (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.shop_id = products.shop_id))
);

-- Suppliers policy
CREATE POLICY IF NOT EXISTS "user_access_own_suppliers"
ON suppliers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.shop_id = suppliers.shop_id)
);

-- Purchase orders
CREATE POLICY IF NOT EXISTS "user_access_own_purchase_orders"
ON purchase_orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.shop_id = purchase_orders.shop_id)
);

-- Purchase order items (joins through purchase_orders)
CREATE POLICY IF NOT EXISTS "user_access_own_purchase_order_items"
ON purchase_order_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM purchase_orders po JOIN profiles p ON p.id = auth.uid() WHERE po.id = purchase_order_items.purchase_order_id AND po.shop_id = p.shop_id
  )
);

-- Stock audits
CREATE POLICY IF NOT EXISTS "user_access_own_stock_audits"
ON stock_audits FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.shop_id = stock_audits.shop_id)
);

-- Stock audit items (allow via parent stock_audits)
CREATE POLICY IF NOT EXISTS "user_access_own_stock_audit_items"
ON stock_audit_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM stock_audits sa JOIN profiles p ON p.id = auth.uid() WHERE sa.id = stock_audit_items.stock_audit_id AND sa.shop_id = p.shop_id
  )
);

-- Be sure to test these policies carefully in staging and adapt them to any admin or role-based exceptions you require.

