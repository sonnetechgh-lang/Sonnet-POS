import { createClient } from "@/lib/supabase/client";

export async function seedDatabase() {
    const supabase = createClient();

    // 1. Categories
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .upsert([
            { name: "Medicine", description: "Prescription and OTC" },
            { name: "Wellness", description: "Vitamins & Supplements" },
            { name: "Personal Care", description: "Hygiene products" }
        ], { onConflict: 'name' })
        .select();

    if (catError) throw catError;

    const medCat = categories.find(c => c.name === "Medicine");
    const wellCat = categories.find(c => c.name === "Wellness");
    const persCat = categories.find(c => c.name === "Personal Care");

    // 2. Products
    const { error: prodError } = await supabase
        .from("products")
        .upsert([
            { name: "Panadol Advance", sku: "PAN-ADV", price: 12.00, cost_price: 6.00, stock_quantity: 45, category_id: medCat?.id },
            { name: "Amoxicillin 500mg", sku: "AMX-500", price: 25.00, cost_price: 15.00, stock_quantity: 5, category_id: medCat?.id },
            { name: "Vitamin C Chewable", sku: "VIT-C", price: 35.00, cost_price: 20.00, stock_quantity: 120, category_id: wellCat?.id },
            { name: "Z-Flu Syrup", sku: "ZFL-01", price: 18.50, cost_price: 10.00, stock_quantity: 0, category_id: medCat?.id },
            { name: "Hand Sanitizer 100ml", sku: "HS-100", price: 15.00, cost_price: 7.00, stock_quantity: 8, category_id: persCat?.id }
        ], { onConflict: 'sku' });

    if (prodError) throw prodError;

    // 3. Customers
    const { error: custError } = await supabase
        .from("customers")
        .upsert([
            { full_name: "Ama Ghana", phone: "0240000001", email: "ama@ghana.com", address: "Accra Mall", loyalty_points: 120, total_spent: 450.00 },
            { full_name: "Kojo Prince", phone: "0550000002", email: "kojo@prince.com", address: "Kumasi Junction", loyalty_points: 50, total_spent: 120.50 },
            { full_name: "Efua Bio", phone: "0200000003", email: "efua@bio.com", address: "Takoradi Harbor", loyalty_points: 0, total_spent: 0.00 }
        ], { onConflict: 'phone' });

    if (custError) throw custError;

    // 4. Expenses
    const { error: expError } = await supabase
        .from("expenses")
        .insert([
            { description: "Shop Electricity Jan", amount: 350.00, category: "Utilities", vendor: "ECG Ghana", expense_date: new Date().toISOString() },
            { description: "Stock Delivery Fee", amount: 150.00, category: "Restocking", vendor: "FedEx Express", expense_date: new Date().toISOString() }
        ]);

    if (expError) throw expError;

    return { success: true };
}
