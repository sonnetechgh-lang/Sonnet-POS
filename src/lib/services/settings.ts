import { createClient } from "@/lib/supabase/client";

export async function getShopDetails() {
    const supabase = createClient();

    try {
        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.warn("Auth check warning:", authError);
        }

        // Fetch the first shop record - use limit(1) to ensure only one row
        const { data: shops, error } = await supabase
            .from("shops")
            .select("*")
            .limit(1);

        if (error) {
            console.error("Error fetching shops:", error);
            throw new Error(`Failed to fetch shop details: ${error.message}`);
        }

        let shop = shops && shops.length > 0 ? shops[0] : null;

        // If no shop exists, create a default one (fallback for local dev/seed)
        if (!shop) {
            console.log("No shop found, creating default shop...");
            
            // Attempt to create the shop with minimal required data
            const { data: createResult, error: createError } = await supabase
                .from("shops")
                .insert([{ 
                    name: "Sonnet POS Branch", 
                    currency: "GHS",
                    address: "",
                    phone: ""
                }])
                .select();

            if (createError) {
                console.error("Error creating shop:", createError);
                
                // If create fails, try fetching again in case another process created it
                const { data: retryShops, error: retryError } = await supabase
                    .from("shops")
                    .select("*")
                    .limit(1);
                
                if (retryError) {
                    throw new Error(`Failed to create default shop: ${createError.message}`);
                }
                
                if (retryShops && retryShops.length > 0) {
                    console.log("Shop found after retry");
                    return retryShops[0];
                }
                
                throw new Error(`Failed to create default shop: ${createError.message}`);
            }
            
            if (!createResult || createResult.length === 0) {
                throw new Error("Failed to create shop - no data returned");
            }
            
            return createResult[0];
        }

        return shop;
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
            .select();

        if (error) {
            console.error("Error updating shop:", error);
            throw new Error(`Failed to update shop details: ${error.message}`);
        }

        if (!data || data.length === 0) {
            throw new Error("Failed to update shop - no data returned");
        }

        return data[0];
    } catch (err: any) {
        console.error("updateShopDetails error:", err);
        throw err;
    }
}
