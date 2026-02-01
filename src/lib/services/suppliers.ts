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

    // fetch purchase order (to get shop_id)
    const { data: poRows, error: poFetchErr } = await supabase
        .from("purchase_orders")
        .select("*")
        .eq("id", poId)
        .limit(1);

    if (poFetchErr) throw poFetchErr;

    const poRow = poRows && poRows[0] ? poRows[0] : null;

    // fetch items
    const { data: items, error: itemsError } = await supabase
        .from("purchase_order_items")
        .select("*")
        .eq("purchase_order_id", poId);

    if (itemsError) throw itemsError;

    // prepare audit items array
    const auditItems: any[] = [];

    // update product stock quantities (read-modify-write)
    for (const it of items) {
        const { data: prodData, error: prodErr } = await supabase
            .from("products")
            .select("stock_quantity")
            .eq("id", it.product_id)
            .single();
        if (prodErr) throw prodErr;

        const previousQty = prodData?.stock_quantity ?? 0;
        const newQty = previousQty + it.quantity;
        const { error: updErr } = await supabase
            .from("products")
            .update({ stock_quantity: newQty })
            .eq("id", it.product_id);
        if (updErr) throw updErr;

        auditItems.push({
            product_id: it.product_id,
            recorded_quantity: newQty,
            previous_quantity: previousQty,
            adjustment: it.quantity,
        });
    }

    // mark PO as received
    const { data: poData, error: poError } = await supabase
        .from("purchase_orders")
        .update({ status: "received", updated_at: new Date().toISOString() })
        .eq("id", poId)
        .select();

    if (poError) throw poError;

    // create a stock_audit record if we have audit items
    if (auditItems.length > 0) {
        const auditPayload: any = {
            shop_id: poRow?.shop_id ?? null,
            performed_by: null,
            notes: `Received PO ${poId}`,
        };
        const { data: auditData, error: auditErr } = await supabase
            .from("stock_audits")
            .insert([auditPayload])
            .select()
            .single();
        if (auditErr) throw auditErr;

        const auditId = auditData.id;
        const itemsWithAudit = auditItems.map((it) => ({ ...it, stock_audit_id: auditId }));
        const { error: auditItemsErr } = await supabase
            .from("stock_audit_items")
            .insert(itemsWithAudit);
        if (auditItemsErr) throw auditItemsErr;
    }

    return poData;
}
