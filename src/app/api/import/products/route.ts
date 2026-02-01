import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    const body = await request.json();
    const rows: any[] = body.rows || [];

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        // ensure we have a shop to attach to
        const { data: shops } = await supabase.from("shops").select("id").limit(1);
        const shopId = shops && shops[0] ? shops[0].id : null;

        if (!shopId) {
            const { data: newShop } = await supabase.from("shops").insert([{ name: "Imported Shop", currency: "USD" }]).select().single();
            // @ts-ignore
            shopId = newShop.id;
        }

        const inserted: any[] = [];

        for (const row of rows) {
            const categoryName = row.category_name || "Uncategorized";
            // find or create category
            const { data: catData } = await supabase
                .from("categories")
                .select("id")
                .eq("name", categoryName)
                .limit(1);

            let categoryId = catData && catData[0] ? catData[0].id : null;
            if (!categoryId) {
                const { data: newCat } = await supabase.from("categories").insert([{ name: categoryName, shop_id: shopId }]).select().single();
                // @ts-ignore
                categoryId = newCat.id;
            }

            const productPayload: any = {
                shop_id: shopId,
                category_id: categoryId,
                name: row.name,
                sku: row.sku,
                price: row.price ?? 0,
                cost_price: row.cost_price ?? 0,
                stock_quantity: row.stock_quantity ?? 0,
                expiry_date: row.expiry_date || null,
                lot_number: row.lot_number || null,
                image_url: row.image_url || null,
            };

            const { data: insertedProduct, error: insertErr } = await supabase.from("products").insert([productPayload]).select().single();
            if (insertErr) {
                // continue and record error for this row
                inserted.push({ row, error: insertErr.message });
                continue;
            }

            inserted.push({ row, product: insertedProduct });
        }

        return NextResponse.json({ inserted }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
    }
}
