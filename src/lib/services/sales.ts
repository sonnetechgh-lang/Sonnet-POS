import { createClient } from "@/lib/supabase/client";

/** Normalize Supabase/Postgrest errors to a clear string for the UI */
function toErrorMessage(err: unknown): string {
    if (err == null) return "Checkout failed.";
    const obj = err as { message?: string; details?: string; hint?: string; code?: string };
    const msg = obj?.message ?? obj?.details ?? String(err);
    return msg.trim() || "Checkout failed.";
}

export async function createSale(sale: any, items: any[]) {
    const supabase = createClient();

    // Attach staff_id and shop_id from the authenticated user/profile to satisfy RLS and audit needs
    try {
        const { data: sessionUser } = await supabase.auth.getUser();
        const userId = sessionUser?.user?.id;

        if (userId) {
            sale.staff_id = sale.staff_id || userId;
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('shop_id')
                .eq('id', userId)
                .single();

            if (!profileError && profile?.shop_id) {
                sale.shop_id = sale.shop_id || profile.shop_id;
            }
            // When user is logged in but profile has no shop_id, use first shop so RLS can pass
            if (!sale.shop_id) {
                const { data: firstShop } = await supabase
                    .from('shops')
                    .select('id')
                    .limit(1)
                    .maybeSingle();
                if (firstShop?.id) {
                    sale.shop_id = firstShop.id;
                }
            }
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('createSale: failed to fetch user/profile/shop context', e);
    }

    // 1. Create the sale record
    let saleData: any = null;
    let saleError: any = null;

    ({ data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single());

    if (saleError) {
        const msg = String(saleError?.message ?? saleError?.details ?? saleError).toLowerCase();
        if (msg.includes('schema cache') || msg.includes("could not find")) {
            const { data: minimalData, error: minimalError } = await supabase
                .from('sales')
                .insert([sale])
                .select('id')
                .single();

            if (minimalError) {
                throw new Error(
                    `Database schema mismatch. Run migrations in docs/schema.sql and docs/seed.sql. ${toErrorMessage(minimalError)}`
                );
            }
            saleData = minimalData;
        } else {
            throw new Error(toErrorMessage(saleError));
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

    if (itemsError) throw new Error(toErrorMessage(itemsError));

    // 3. Update inventory levels via RPC
    for (const item of items) {
        const { error: rpcError } = await supabase.rpc('decrement_stock', {
            row_id: item.id,
            count: item.quantity
        });
        if (rpcError) {
            throw new Error(
                rpcError.message?.includes('decrement_stock')
                    ? `Stock update failed. Ensure the database has the decrement_stock function (see docs/schema.sql). ${toErrorMessage(rpcError)}`
                    : toErrorMessage(rpcError)
            );
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
