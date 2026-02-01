import { createClient } from "@/lib/supabase/client";

export async function getProducts() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function createProduct(product: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select();

    if (error) throw error;
    return data;
}

export async function updateProduct(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data;
}

export async function deleteProduct(id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
}

export async function getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw error;
    return data;
}
