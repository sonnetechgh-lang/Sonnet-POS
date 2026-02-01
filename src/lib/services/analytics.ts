import { createClient } from "@/lib/supabase/client";

export async function getSalesSummary() {
    const supabase = createClient();

    // 1. Get all completed sales
    const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("id, total_amount, created_at, discount_amount")
        .eq('status', 'completed');

    if (salesError) throw salesError;

    // 2. Get all sale items for COGS
    const { data: saleItems, error: itemsError } = await supabase
        .from("sale_items")
        .select("quantity, cost_price");

    if (itemsError) throw itemsError;

    // 3. Get all expenses
    const { data: expenses, error: expensesError } = await supabase
        .from("expenses")
        .select("amount");

    if (expensesError) throw expensesError;

    // 4. Get Inventory Valuation
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("stock_quantity, cost_price");

    if (productsError) throw productsError;

    const totalRevenue = (sales || []).reduce((sum, s) => sum + Number(s.total_amount), 0);
    const totalCOGS = (saleItems || []).reduce((sum, item) => sum + (Number(item.cost_price || 0) * Number(item.quantity || 0)), 0);
    const totalExpenses = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
    const stockValue = (products || []).reduce((sum, p) => sum + (Number(p.stock_quantity || 0) * Number(p.cost_price || 0)), 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;

    // 5. Calculate Daily Trends (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const dailyTrends = last7Days.map(date => {
        const daySales = (sales || []).filter(s => s.created_at?.startsWith(date));
        return {
            date,
            revenue: daySales.reduce((sum, s) => sum + Number(s.total_amount), 0)
        };
    });

    return {
        totalSales: totalRevenue,
        totalExpenses,
        grossProfit,
        netProfit,
        dailyTrends,
        stockValue,
        salesCount: (sales || []).length,
        recentSales: (sales || []).slice(-10).reverse()
    };
}

export async function getExpenses() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

    return data;
}

export async function getAdvancedAnalytics(startDate?: string) {
    const supabase = createClient();

    let query = supabase
        .from("sales")
        .select(`
            id, 
            total_amount, 
            created_at, 
            customer_id,
            customer_name,
            sale_items (
                product_id,
                quantity,
                total_price,
                products (
                    name,
                    categories (name)
                )
            ),
            customers (full_name)
        `)
        .eq('status', 'completed');

    if (startDate) {
        query = query.gte('created_at', startDate);
    }

    const { data: sales, error: salesError } = await query;

    if (salesError) throw salesError;

    // 2. Calculate Hourly Heatmap (24 hours)
    const hourlySales = Array(24).fill(0).map((_, hour) => ({
        hour,
        revenue: 0,
        count: 0
    }));

    sales?.forEach(sale => {
        const hour = new Date(sale.created_at).getHours();
        hourlySales[hour].revenue += Number(sale.total_amount);
        hourlySales[hour].count += 1;
    });

    // 3. Product Performance (Top 10)
    const productStats: Record<string, { name: string, revenue: number, volume: number }> = {};
    sales?.forEach(sale => {
        sale.sale_items?.forEach((item: any) => {
            const pid = item.product_id;
            if (!productStats[pid]) {
                productStats[pid] = { name: item.products?.name || 'Unknown', revenue: 0, volume: 0 };
            }
            productStats[pid].revenue += Number(item.total_price);
            productStats[pid].volume += Number(item.quantity);
        });
    });

    const topProducts = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    // 4. Customer Leaderboard (Top 10 by Spend)
    const customerStats: Record<string, { name: string, spend: number, visits: number }> = {};
    sales?.forEach(sale => {
        if (sale.customer_id) {
            const cid = sale.customer_id;
            if (!customerStats[cid]) {
                // Get customer name from the relationship or use customer_name or default to 'Guest'
                const customerName = sale.customers && Array.isArray(sale.customers) && sale.customers.length > 0
                    ? (sale.customers[0] as any)?.full_name
                    : sale.customer_name || 'Guest';
                customerStats[cid] = { name: customerName, spend: 0, visits: 0 };
            }
            customerStats[cid].spend += Number(sale.total_amount);
            customerStats[cid].visits += 1;
        }
    });

    const topCustomers = Object.values(customerStats)
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 10);

    // 5. Category Mix
    const categoryStats: Record<string, number> = {};
    sales?.forEach(sale => {
        sale.sale_items?.forEach((item: any) => {
            const catName = item.products?.categories?.name || 'Uncategorized';
            categoryStats[catName] = (categoryStats[catName] || 0) + Number(item.total_price);
        });
    });

    const categoryMix = Object.entries(categoryStats).map(([name, revenue]) => ({ name, revenue }));

    // 6. Customer Retention Rate
    const totalCustomers = Object.keys(customerStats).length;
    const repeatCustomers = Object.values(customerStats).filter(c => c.visits > 1).length;
    const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    return {
        hourlySales,
        topProducts,
        topCustomers,
        categoryMix,
        retentionRate
    };
}

export async function createExpense(expense: any) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("expenses")
        .insert([expense])
        .select()
        .single();

    if (error) throw error;
    return data;
}
