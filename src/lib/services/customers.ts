import { createClient } from "@/lib/supabase/client";

export async function getCustomers() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function createCustomer(customer: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateCustomer(id: string, updates: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("customers")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
