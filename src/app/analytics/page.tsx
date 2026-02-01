"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getAdvancedAnalytics } from "@/lib/services/analytics";
import {
    TrendingUp,
    Users,
    Package,
    Clock,
    Award,
    Flame,
    PieChart,
    ArrowUpRight,
    Loader2,
    Target,
    Zap,
    Calendar,
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("all");

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                let startDate: string | undefined;
                const now = new Date();

                if (range === "today") {
                    startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                } else if (range === "7d") {
                    startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
                } else if (range === "30d") {
                    startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
                }

                const result = await getAdvancedAnalytics(startDate);
                setData(result);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [range]);

    if (!data && loading) {
        return (
            <div className="flex bg-background-app min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={48} />
            </div>
        );
    }

    const { hourlySales, topProducts, topCustomers, categoryMix, retentionRate } = data || {
        hourlySales: [], topProducts: [], topCustomers: [], categoryMix: [], retentionRate: 0
    };

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pl-14 md:pl-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white border-b border-border px-4 md:px-8 py-4">
                    <Header title="Advanced Intelligence" />
                    <div className="flex flex-wrap items-center gap-2 bg-background-app p-1.5 rounded-2xl border border-border w-full sm:w-auto">
                        {[
                            { id: "all", label: "All Time" },
                            { id: "today", label: "Today" },
                            { id: "7d", label: "Last 7D" },
                            { id: "30d", label: "Last 30D" }
                        ].map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRange(r.id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === r.id
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-text-disabled hover:bg-white hover:text-primary"
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full relative">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-background-app/50 backdrop-blur-[2px] flex items-center justify-center"
                            >
                                <Loader2 className="animate-spin text-secondary" size={32} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Peak Hour Hero */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-2xl md:rounded-[40px] p-4 md:p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Operations Insight</span>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase bg-secondary px-3 py-1.5 rounded-full text-white">
                                        <Zap size={12} /> Live Processing
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mt-4 md:mt-6 tracking-tight text-white">Peak Performance</h3>
                                <p className="text-blue-100/60 mt-2 font-medium max-w-md italic">
                                    Viewing activity distribution for <span className="text-secondary font-black">{range.toUpperCase()}</span> period.
                                </p>

                                <div className="mt-10 flex items-end gap-2 h-32">
                                    {hourlySales.length === 0 ? (
                                        <div className="w-full flex items-center justify-center text-white/20 font-black uppercase tracking-widest">No Activity Records</div>
                                    ) : (
                                        hourlySales.map((h: any, i: number) => {
                                            const maxRevenue = Math.max(...hourlySales.map((d: any) => d.revenue)) || 1;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${(h.revenue / maxRevenue * 100) || 5}%` }}
                                                        className="w-full bg-secondary/80 rounded-t-lg group-hover:bg-secondary transition-colors"
                                                    />
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-primary text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₵{h.revenue.toFixed(0)}</div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="flex justify-between mt-4 text-[8px] font-black text-white/40 uppercase tracking-widest px-1">
                                    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                                </div>
                            </div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-2xl md:rounded-[40px] border border-border p-4 md:p-8 shadow-sm flex flex-col justify-between overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-amber-50 text-warning rounded-2xl flex items-center justify-center mb-6">
                                    <Target size={24} />
                                </div>
                                <h4 className="text-xl font-black text-primary uppercase tracking-tight">Retention Key</h4>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary">{retentionRate.toFixed(1)}%</span>
                                    <span className="text-[10px] font-bold text-text-secondary uppercase">Return Rate</span>
                                </div>
                                <p className="text-[11px] text-text-secondary font-medium mt-4">Percentage of unique customers who have completed more than one transaction in this period.</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border relative z-10">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-disabled">
                                    <span>Top Spender</span>
                                    <span className="text-primary truncate max-w-[120px]">{topCustomers[0]?.name || 'N/A'}</span>
                                </div>
                                <div className="h-1.5 w-full bg-background-app rounded-full mt-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (topCustomers[0]?.spend / 1000) * 100)}%` }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Products */}
                        <div className="bg-white rounded-2xl md:rounded-[40px] border border-border shadow-sm overflow-hidden flex flex-col">
                            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <Flame size={20} className="text-error" />
                                    <h3 className="text-lg font-black text-primary uppercase tracking-tight">Inventory Leaders</h3>
                                </div>
                                <span className="text-xs font-bold text-text-disabled uppercase">Revenue Breakdown</span>
                            </div>
                            <div className="flex-1 p-4 space-y-2">
                                {topProducts.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-text-disabled/40 grayscale opacity-50">
                                        <Package size={48} className="mb-4" />
                                        <span className="font-black uppercase text-xs tracking-widest">No Sales Recorded</span>
                                    </div>
                                ) : (
                                    topProducts.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-background-app flex items-center justify-center text-primary font-black border border-border group-hover:border-secondary transition-colors text-xs">
                                                    #{i + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-primary">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest">{p.volume} units sold</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-accent">₵{p.revenue.toFixed(2)}</p>
                                                <div className="flex items-center justify-end gap-1 text-[8px] font-black text-green-600 uppercase">
                                                    <ArrowUpRight size={10} /> {((p.revenue / (hourlySales.reduce((a: any, b: any) => a + b.revenue, 0) || 1)) * 100).toFixed(1)}% Share
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Category Mix */}
                        <div className="bg-white rounded-2xl md:rounded-[40px] border border-border shadow-sm overflow-hidden flex flex-col">
                            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-border bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <PieChart size={20} className="text-secondary" />
                                    <h3 className="text-lg font-black text-primary uppercase tracking-tight">Category Contribution</h3>
                                </div>
                            </div>
                            <div className="flex-1 p-8 flex flex-col justify-center">
                                <div className="space-y-6">
                                    {categoryMix.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center py-10 text-text-disabled/40 grayscale opacity-50">
                                            <PieChart size={48} className="mb-4" />
                                            <span className="font-black uppercase text-xs tracking-widest">No Categorized Data</span>
                                        </div>
                                    ) : (
                                        categoryMix.sort((a: any, b: any) => b.revenue - a.revenue).map((cat: any, i: number) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-black text-primary uppercase tracking-widest">{cat.name}</span>
                                                    <span className="text-xs font-bold text-text-secondary">₵{cat.revenue.toFixed(0)}</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-background-app rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(cat.revenue / (categoryMix.reduce((a: any, b: any) => a + Number(b.revenue), 0) || 1)) * 100}%` }}
                                                        className={`h-full ${i === 0 ? 'bg-secondary' : i === 1 ? 'bg-error' : i === 2 ? 'bg-warning' : 'bg-primary'} rounded-full`}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-6 md:mt-12 p-4 md:p-8 bg-primary/5 rounded-2xl md:rounded-[32px] border border-primary/10 relative overflow-hidden">
                                    <div className="relative z-10 flex items-center gap-5">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"><Award size={32} className="text-warning" /></div>
                                        <div>
                                            <p className="text-sm font-black text-primary uppercase tracking-wide">Business Health</p>
                                            <p className="text-[11px] font-medium text-text-secondary mt-1 leading-relaxed">
                                                {categoryMix.length > 0
                                                    ? `Your revenue is spread across ${categoryMix.length} categories. ${categoryMix[0]?.name} is your dominant sector currently.`
                                                    : "Complete some sales to see how your categories are performing relative to each other."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
