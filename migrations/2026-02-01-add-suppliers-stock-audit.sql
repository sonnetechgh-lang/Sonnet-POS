-- Migration: Add suppliers, purchase orders, stock audits and product metadata
-- Timestamp: 2026-02-01

-- Add columns to products (idempotent)
ALTER TABLE IF EXISTS products
  ADD COLUMN IF NOT EXISTS expiry_date DATE,
  ADD COLUMN IF NOT EXISTS lot_number TEXT;

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('draft','ordered','received','cancelled')) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL
);

-- Stock audits
CREATE TABLE IF NOT EXISTS stock_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    performed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stock_audit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_audit_id UUID REFERENCES stock_audits(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    recorded_quantity INT NOT NULL,
    previous_quantity INT NOT NULL,
    adjustment INT NOT NULL
);

-- Ensure sales has customer_id (idempotent)
ALTER TABLE IF EXISTS sales
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;

-- Ensure decrement_stock function exists (replaceable)
CREATE OR REPLACE FUNCTION decrement_stock(row_id UUID, count INT)
RETURNS void AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - count,
        updated_at = NOW()
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Safety: grant minimal privileges to function caller as needed (leave default)

-- Done
