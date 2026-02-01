import { createClient } from "@/lib/supabase/client";

export async function createSale(sale: any, items: any[]) {
    const supabase = createClient();

    // 1. Create the sale record
    const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert([sale])
        .select()
        .single();

    if (saleError) throw saleError;

    // 2. Create the sale items
    const saleItems = items.map(item => ({
        sale_id: saleData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        cost_price: item.cost_price || 0,
        total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

    if (itemsError) throw itemsError;

    // 3. Update inventory levels
    for (const item of items) {
        await supabase.rpc('decrement_stock', {
            row_id: item.id,
            count: item.quantity
        });
    }

    // 4. Update customer loyalty if linked
    if (sale.customer_id) {
        const loyaltyEarned = Math.floor(sale.total_amount / 10);
        const { data: customer } = await supabase
            .from("customers")
            .select("total_spent, loyalty_points")
            .eq("id", sale.customer_id)
            .single();

        if (customer) {
            await supabase
                .from("customers")
                .update({
                    total_spent: Number(customer.total_spent) + Number(sale.total_amount),
                    loyalty_points: (customer.loyalty_points || 0) + loyaltyEarned,
                    updated_at: new Date().toISOString()
                })
                .eq("id", sale.customer_id);
        }
    }

    return saleData;
}
