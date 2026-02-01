import { createClient } from "@/lib/supabase/client";

export async function createSale(sale: any, items: any[]) {
    const supabase = createClient();

    // Attach staff_id and shop_id from the authenticated user/profile to satisfy RLS and audit needs
    try {
        const { data: sessionUser } = await supabase.auth.getUser();
        const userId = sessionUser?.user?.id;

        if (userId) {
            sale.staff_id = sale.staff_id || userId;
            // try to fetch profile to get shop_id
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('shop_id')
                .eq('id', userId)
                .single();

            if (!profileError && profile?.shop_id) {
                sale.shop_id = sale.shop_id || profile.shop_id;
            }
        }
    } catch (e) {
        // non-fatal; continue but leave sale as-is
        // eslint-disable-next-line no-console
        console.warn('createSale: failed to fetch user/profile context', e);
    }

    // 1. Create the sale record
    let saleData: any = null;
    let saleError: any = null;

    // First attempt: insert and return the full row
    ({ data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single());

    // If the error mentions schema cache (common when DB migrations were not applied),
    // try a minimal insert (select only id) and return a clearer message if that fails.
    if (saleError) {
        const msg = String(saleError?.message || saleError);
        if (msg.toLowerCase().includes('schema cache') || msg.toLowerCase().includes("could not find")) {
            // Try a minimal insert to surface a more specific error or succeed without schema joins
            const { data: minimalData, error: minimalError } = await supabase
                .from('sales')
                .insert([sale])
                .select('id')
                .single();

            if (minimalError) {
                // Help developer: suggest running DB migrations/seeds
                throw new Error(
                    `Database schema mismatch: ${minimalError?.message || minimalError}. ` +
                    `Run the SQL migrations in docs/schema.sql and re-seed with docs/seed.sql, then restart Supabase.`
                );
            }

            // we got minimal data — but the full row isn't available; use the minimal id wrapper
            saleData = minimalData;
            saleError = null;
        } else {
            throw saleError;
        }
    }

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
        .from('sale_items')
        .insert(saleItems);

    if (itemsError) throw itemsError;

    // 3. Update inventory levels; check RPC errors explicitly
    for (const item of items) {
        const { data: rpcData, error: rpcError } = await supabase.rpc('decrement_stock', {
            row_id: item.id,
            count: item.quantity
        });
        if (rpcError) {
            // try to roll back by throwing; caller can retry or handle
            throw rpcError;
        }
    }

    // 4. Update customer loyalty if linked
    if (sale.customer_id) {
        const loyaltyEarned = Math.floor(sale.total_amount / 10);
        const { data: customer } = await supabase
            .from('customers')
            .select('total_spent, loyalty_points')
            .eq('id', sale.customer_id)
            .single();

        if (customer) {
            await supabase
                .from('customers')
                .update({
                    total_spent: Number(customer.total_spent) + Number(sale.total_amount),
                    loyalty_points: (customer.loyalty_points || 0) + loyaltyEarned,
                    updated_at: new Date().toISOString()
                })
                .eq('id', sale.customer_id);
        }
    }

    return saleData;
}
