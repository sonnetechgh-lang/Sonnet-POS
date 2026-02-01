-- SONNET POS: Comprehensive Seeding Script
-- Paste this into your Supabase SQL Editor

-- 1. Insert Sample Categories
INSERT INTO categories (name, description) VALUES
('Medicine', 'Prescription and over-the-counter medications'),
('Wellness', 'Supplements, vitamins, and health products'),
('First Aid', 'Bandages, antiseptics, and emergency supplies'),
('Personal Care', 'Hygiene and skin care products');

-- 2. Insert Sample Products
-- Replace 'DEFAULT' if you have a specific shop_id, otherwise this assumes a single-tenant or default shop logic for testing.
INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'Panadol Extra', 'Fast relief for pain and fever', 'PAN-001', 15.50, 8.00, 5, id FROM categories WHERE name = 'Medicine';

INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'Vitamin C 1000mg', 'Immune system support', 'VIT-001', 45.00, 25.00, 50, id FROM categories WHERE name = 'Wellness';

INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'C-Zin Lozenges', 'Throat relief with Zinc', 'CZ-001', 12.00, 6.00, 12, id FROM categories WHERE name = 'Medicine';

INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'Amoxicillin 500mg', 'Systemic antibiotic', 'AMX-001', 25.00, 15.00, 0, id FROM categories WHERE name = 'Medicine';

INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'Digital Thermometer', 'High precision body temp reader', 'THM-001', 85.00, 50.00, 8, id FROM categories WHERE name = 'First Aid';

INSERT INTO products (name, description, sku, price, cost_price, stock_quantity, category_id)
SELECT 'Hand Sanitizer 500ml', '70% Alcohol base', 'HS-001', 35.00, 18.00, 20, id FROM categories WHERE name = 'Personal Care';

-- 3. Insert Sample Expenses
INSERT INTO expenses (description, amount, category, expense_date) VALUES
('Shop Electricity Bill - Jan', 450.00, 'Utilities', '2026-01-15'),
('Restocking Panadol & Vitamins', 1200.00, 'Restocking', '2026-01-20'),
('Marketing - Facebook Ads', 300.00, 'Marketing', '2026-01-25');

-- 4. Insert Sample Sales (Recent Transactions)
-- This creates some historical data for the dashboard
DO $$
DECLARE
    sale_id UUID;
    v_product_id UUID;
BEGIN
    -- Sale 1
    INSERT INTO sales (total_amount, subtotal, tax_amount, payment_method, status)
    VALUES (76.50, 72.85, 3.65, 'cash', 'completed')
    RETURNING id INTO sale_id;

    SELECT id INTO v_product_id FROM products WHERE sku = 'PAN-001' LIMIT 1;
    INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
    VALUES (sale_id, v_product_id, 2, 15.50, 31.00);

    -- Sale 2
    INSERT INTO sales (total_amount, subtotal, tax_amount, payment_method, status)
    VALUES (45.00, 42.85, 2.15, 'momo', 'completed')
    RETURNING id INTO sale_id;

    SELECT id INTO v_product_id FROM products WHERE sku = 'VIT-001' LIMIT 1;
    INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
    VALUES (sale_id, v_product_id, 1, 45.00, 45.00);
END $$;
