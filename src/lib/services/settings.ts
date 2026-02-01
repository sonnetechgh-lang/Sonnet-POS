import { createClient } from "@/lib/supabase/client";

export async function getShopDetails() {
    const supabase = createClient();

    try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.warn("Auth check warning:", authError);
        }

        // In a multi-tenant app, we'd filter by the current user's shop_id.
        // For this build, we'll fetch the first shop record.
        let { data, error } = await supabase
            .from("shops")
            .select("*")
            .maybeSingle();

        if (error) {
            console.error("Error fetching shops:", error);
            throw new Error(`Failed to fetch shop details: ${error.message}`);
        }

        // If no shop exists, create a default one (fallback for local dev/seed)
        if (!data) {
            console.log("No shop found, creating default shop...");
            
            // Attempt to create the shop with minimal required data
            const { data: newShop, error: createError } = await supabase
                .from("shops")
                .insert([{ 
                    name: "Sonnet POS Branch", 
                    currency: "GHS",
                    address: "",
                    phone: ""
                }])
                .select()
                .single();

            if (createError) {
                console.error("Error creating shop:", createError);
                
                // If create fails, try fetching again in case another process created it
                const { data: retryData, error: retryError } = await supabase
                    .from("shops")
                    .select("*")
                    .maybeSingle();
                
                if (retryError) {
                    throw new Error(`Failed to create default shop: ${createError.message}`);
                }
                
                if (retryData) {
                    console.log("Shop found after retry");
                    return retryData;
                }
                
                throw new Error(`Failed to create default shop: ${createError.message}`);
            }
            
            if (!newShop) {
                throw new Error("Failed to create shop - no data returned");
            }
            
            return newShop;
        }

        return data;
    } catch (err: any) {
        console.error("getShopDetails error:", err);
        throw err;
    }
}

export async function updateShopDetails(id: string, updates: any) {
    const supabase = createClient();
    
    try {
        const { data, error } = await supabase
            .from("shops")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Error updating shop:", error);
            throw new Error(`Failed to update shop details: ${error.message}`);
        }

        if (!data) {
            throw new Error("Failed to update shop - no data returned");
        }

        return data;
    } catch (err: any) {
        console.error("updateShopDetails error:", err);
        throw err;
    }
}
