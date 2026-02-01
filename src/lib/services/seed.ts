import { createClient } from "@/lib/supabase/client";

export async function seedDatabase() {
    const supabase = createClient();

    // 0. Ensure Shop exists
    const { data: existingShop, error: shopCheckError } = await supabase
        .from("shops")
        .select("*")
        .maybeSingle();

    if (shopCheckError) throw shopCheckError;

    let shopId: string;
    if (!existingShop) {
        const { data: newShop, error: shopError } = await supabase
            .from("shops")
            .insert([{
                name: "Sonnet POS Branch",
                address: "Main Street, Accra",
                phone: "0300000000",
                currency: "GHS"
            }])
            .select()
            .single();

        if (shopError) throw shopError;
        if (!newShop) throw new Error("Failed to create shop");
        shopId = newShop.id;
    } else {
        shopId = existingShop.id;
    }

    // 1. Categories
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .upsert([
            { shop_id: shopId, name: "Medicine", description: "Prescription and OTC" },
            { shop_id: shopId, name: "Wellness", description: "Vitamins & Supplements" },
            { shop_id: shopId, name: "Personal Care", description: "Hygiene products" }
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
            { shop_id: shopId, name: "Panadol Advance", sku: "PAN-ADV", price: 12.00, cost_price: 6.00, stock_quantity: 45, category_id: medCat?.id },
            { shop_id: shopId, name: "Amoxicillin 500mg", sku: "AMX-500", price: 25.00, cost_price: 15.00, stock_quantity: 5, category_id: medCat?.id },
            { shop_id: shopId, name: "Vitamin C Chewable", sku: "VIT-C", price: 35.00, cost_price: 20.00, stock_quantity: 120, category_id: wellCat?.id },
            { shop_id: shopId, name: "Z-Flu Syrup", sku: "ZFL-01", price: 18.50, cost_price: 10.00, stock_quantity: 0, category_id: medCat?.id },
            { shop_id: shopId, name: "Hand Sanitizer 100ml", sku: "HS-100", price: 15.00, cost_price: 7.00, stock_quantity: 8, category_id: persCat?.id }
        ], { onConflict: 'sku' });

    if (prodError) throw prodError;

    // 3. Customers
    const { error: custError } = await supabase
        .from("customers")
        .upsert([
            { shop_id: shopId, full_name: "Ama Ghana", phone: "0240000001", email: "ama@ghana.com", address: "Accra Mall", loyalty_points: 120, total_spent: 450.00 },
            { shop_id: shopId, full_name: "Kojo Prince", phone: "0550000002", email: "kojo@prince.com", address: "Kumasi Junction", loyalty_points: 50, total_spent: 120.50 },
            { shop_id: shopId, full_name: "Efua Bio", phone: "0200000003", email: "efua@bio.com", address: "Takoradi Harbor", loyalty_points: 0, total_spent: 0.00 }
        ], { onConflict: 'phone' });

    if (custError) throw custError;

    // 4. Expenses
    const { error: expError } = await supabase
        .from("expenses")
        .insert([
            { shop_id: shopId, description: "Shop Electricity Jan", amount: 350.00, category: "Utilities", vendor: "ECG Ghana", expense_date: new Date().toISOString() },
            { shop_id: shopId, description: "Stock Delivery Fee", amount: 150.00, category: "Restocking", vendor: "FedEx Express", expense_date: new Date().toISOString() }
        ]);

    if (expError) throw expError;

    return { success: true, shopId };
}
