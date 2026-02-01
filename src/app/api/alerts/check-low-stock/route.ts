import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, stock_quantity, low_stock_threshold, shop_id");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const low = (data || []).filter((p: any) => (p.stock_quantity ?? 0) <= (p.low_stock_threshold ?? 0));

    // It returns the low stock products. In production, you would integrate with an email/SMS service here.
    return NextResponse.json({ low_stock: low });
}
