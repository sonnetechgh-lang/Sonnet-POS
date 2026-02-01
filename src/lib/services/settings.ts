import { createClient } from "@/lib/supabase/client";

export async function getShopDetails() {
    const supabase = createClient();

    // In a multi-tenant app, we'd filter by the current user's shop_id.
    // For this build, we'll fetch the first shop record.
    let { data, error } = await supabase
        .from("shops")
        .select("*")
        .maybeSingle();

    if (error) throw error;

    // If no shop exists, create a default one (fallback for local dev/seed)
    if (!data) {
        const { data: newShop, error: createError } = await supabase
            .from("shops")
            .insert([{ name: "Sonnet POS Branch", currency: "GHS" }])
            .select()
            .single();

        if (createError) throw createError;
        return newShop;
    }

    return data;
}

export async function updateShopDetails(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("shops")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
