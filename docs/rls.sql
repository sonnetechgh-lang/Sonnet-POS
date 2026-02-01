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
