import { createClient } from "@/lib/supabase/client";

export async function listSuppliers() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function createSupplier(supplier: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("suppliers")
        .insert([supplier])
        .select();

    if (error) throw error;
    return data;
}

export async function createPurchaseOrder(po: any, items: any[]) {
    const supabase = createClient();
    // Use a transaction-like pattern: insert PO then items
    const { data: poData, error: poError } = await supabase
        .from("purchase_orders")
        .insert([po])
        .select()
        .single();

    if (poError) throw poError;

    const poId = poData.id;
    const itemsWithPo = items.map((it) => ({ ...it, purchase_order_id: poId }));
    const { data: itemsData, error: itemsError } = await supabase
        .from("purchase_order_items")
        .insert(itemsWithPo)
        .select();

    if (itemsError) throw itemsError;

    return { po: poData, items: itemsData };
}

export async function listPurchaseOrders() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("purchase_orders")
        .select("*, suppliers(*)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function receivePurchaseOrder(poId: string) {
    const supabase = createClient();

    // fetch items
    const { data: items, error: itemsError } = await supabase
        .from("purchase_order_items")
        .select("*")
        .eq("purchase_order_id", poId);

    if (itemsError) throw itemsError;

    // update product stock quantities (read-modify-write)
    for (const it of items) {
        const { data: prodData, error: prodErr } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", it.product_id)
            .single();
        if (prodErr) throw prodErr;

        const newQty = (prodData?.stock_quantity ?? 0) + it.quantity;
        const { error: updErr } = await supabase
            .from("products")
            .update({ stock_quantity: newQty })
            .eq("id", it.product_id);
        if (updErr) throw updErr;
    }

    // mark PO as received
    const { data: poData, error: poError } = await supabase
        .from("purchase_orders")
        .update({ status: "received", updated_at: new Date().toISOString() })
        .eq("id", poId)
        .select();

    if (poError) throw poError;

    return poData;
}
