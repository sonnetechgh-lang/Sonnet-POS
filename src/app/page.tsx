"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getSalesSummary } from "@/lib/services/analytics";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    ArrowRight,
    Loader2,
    Calendar,
    AlertCircle,
    Receipt
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSummary() {
            try {
                const data = await getSalesSummary();
                setSummary(data);
            } catch (err) {
                console.error("Dashboard load failed", err);
                // Keep summary null if it fails
            } finally {
                setLoading(false);
            }
        }
        loadSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-background-app min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={48} />
            </div>
        );
    }

    // Fallback data if summary is null (e.g. database error or not set up)
    const stats = summary || {
        totalSales: 0,
        grossProfit: 0,
        netProfit: 0,
        totalExpenses: 0,
        dailyTrends: Array(7).fill({ revenue: 0 }),
        salesCount: 0,
        recentSales: []
    };

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary flex-col md:flex-row">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title="Business Overview" />

                <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto w-full">
                    {/* Hero Sections / Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        <StatCard
                            label="Total Revenue"
                            value={`₵${stats.totalSales.toFixed(2)}`}
                            trend="+12.5%"
                            trendUp={true}
                            icon={<DollarSign size={20} />}
                            color="blue"
                        />
                        <StatCard
                            label="Gross Profit"
                            value={`₵${(stats.grossProfit || 0).toFixed(2)}`}
                            trend="+10.2%"
                            trendUp={true}
                            icon={<TrendingUp size={20} />}
                            color="teal"
                        />
                        <StatCard
                            label="Net Profit"
                            value={`₵${stats.netProfit.toFixed(2)}`}
                            trend="+8.2%"
                            trendUp={true}
                            icon={<TrendingUp size={20} />}
                            color="secondary"
                        />
                        <StatCard
                            label="Operating Expenses"
                            value={`₵${stats.totalExpenses.toFixed(2)}`}
                            trend="-2.4%"
                            trendUp={false}
                            icon={<TrendingDown size={20} />}
                            color="red"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Sales Chart Placeholder / Visual */}
                        <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-3xl lg:rounded-[40px] p-4 md:p-6 lg:p-8 border border-border shadow-sm flex flex-col">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">Revenue Performance</h3>
                                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">Last 7 Days vs Previous</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-background-app rounded-full text-[10px] font-bold">
                                        <div className="w-2 h-2 rounded-full bg-secondary"></div> Sales
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-background-app rounded-full text-[10px] font-bold">
                                        <div className="w-2 h-2 rounded-full bg-error"></div> Expenses
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64 px-2 md:px-4">
                                {stats.dailyTrends.map((day: any, i: number) => {
                                    const maxRevenue = Math.max(...stats.dailyTrends.map((d: any) => d.revenue)) || 1;
                                    const percentage = (day.revenue / maxRevenue) * 100;
                                    return (
                                        <ChartBar
                                            key={day.date}
                                            height={`${Math.max(5, percentage)}%`}
                                            color="bg-secondary"
                                            delay={i * 0.1}
                                        />
                                    );
                                })}
                            </div>

                            <div className="flex justify-between mt-4 md:mt-6 px-2 md:px-4 text-[10px] font-black text-text-disabled uppercase">
                                {stats.dailyTrends.map((day: any) => (
                                    <span key={day.date} className="flex-1 text-center">
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Terminal Quick Link */}
                        <div className="bg-primary rounded-2xl md:rounded-3xl lg:rounded-[40px] p-4 md:p-6 lg:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-primary/20">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="w-12 md:w-14 h-12 md:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 md:mb-6 border border-white/20">
                                    <ShoppingCart size={24} className="text-secondary" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3 md:mb-4">Ready to <br /> sell today?</h3>
                                <p className="text-sm md:text-base text-blue-100/60 font-medium mb-6 md:mb-8">Access the POS terminal to process sales and manage orders.</p>
                            </div>

                            <Link href="/pos" className="relative z-10 w-full py-3 md:py-4 bg-secondary hover:bg-secondary-dark text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all group active:scale-[0.98] text-sm md:text-base">
                                Open POS Terminal
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Recent Transactions */}
                        <div className="bg-white rounded-2xl md:rounded-3xl lg:rounded-[40px] border border-border shadow-sm overflow-hidden">
                            <div className="px-4 md:px-8 py-4 md:py-6 border-b border-border flex justify-between items-center bg-gray-50/30">
                                <h3 className="text-base md:text-lg font-black text-primary">Recent Transactions</h3>
                                <Link href="#" className="text-[10px] md:text-xs font-black text-secondary uppercase hover:underline">View All</Link>
                            </div>
                            <div className="p-2 md:p-3 max-h-96 overflow-y-auto">
                                {stats.recentSales.length === 0 ? (
                                    <div className="py-12 text-center text-text-disabled uppercase text-[10px] font-bold tracking-widest leading-relaxed">
                                        No transactions yet.<br />Start selling in the Terminal.
                                    </div>
                                ) : (
                                    stats.recentSales.map((sale: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 rounded-3xl transition-all">
                                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-background-app flex items-center justify-center text-primary border border-border flex-shrink-0">
                                                    <Receipt size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-primary truncate">Sale #{sale.id?.slice(0, 6) || '---'}</p>
                                                    <p className="text-[10px] font-bold text-text-disabled">{new Date(sale.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-2">
                                                <p className="text-sm font-black text-accent">₵{sale.total_amount.toFixed(2)}</p>
                                                <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest">Completed</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Stock Alerts */}
                        <div className="bg-white rounded-[40px] border border-border shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-gray-50/30">
                                <h3 className="text-lg font-black text-primary">Critical Stock Alerts</h3>
                                <span className="text-xs font-black px-3 py-1 bg-error/10 text-error rounded-full uppercase tracking-tighter">Action Required</span>
                            </div>
                            <div className="p-4 space-y-3">
                                <StockAlertItem title="Panadol Extra" status="Low Stock" count={5} />
                                <StockAlertItem title="Vitamin C Syrup" status="Out of Stock" count={0} warning />
                                <StockAlertItem title="C-Zin Lozenges" status="Low Stock" count={12} />
                            </div>
                            <div className="p-6 pt-0">
                                <Link href="/inventory" className="w-full py-4 bg-background-app text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                                    Restock Inventory
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, trend, trendUp, icon, color }: any) {
    const colorMap: any = {
        blue: "bg-blue-50 text-blue-600",
        teal: "bg-teal-50 text-teal-600",
        secondary: "bg-secondary/10 text-secondary",
        red: "bg-red-50 text-error",
        amber: "bg-amber-50 text-warning"
    };

    return (
        <div className="bg-white p-8 rounded-[40px] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colorMap[color]}`}>
                {icon}
            </div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{label}</p>
            <div className="mt-2 flex items-baseline justify-between">
                <h4 className="text-2xl font-black text-primary tracking-tight">{value}</h4>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-50 text-accent' : 'bg-red-50 text-error'}`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

function ChartBar({ height, color, delay }: any) {
    return (
        <div className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="flex-1 w-full bg-background-app rounded-full relative overflow-hidden">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height }}
                    transition={{ duration: 1, delay, ease: "easeOut" }}
                    className={`absolute bottom-0 left-0 w-full ${color} rounded-full group-hover:opacity-80 transition-opacity`}
                />
            </div>
        </div>
    );
}

function StockAlertItem({ title, status, count, warning }: any) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-3xl border ${warning ? 'bg-red-50/50 border-error/10' : 'bg-gray-50/50 border-border'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${warning ? 'bg-error text-white' : 'bg-warning text-white'}`}>
                    <AlertCircle size={18} />
                </div>
                <div>
                    <p className="text-sm font-black text-primary">{title}</p>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{status}</p>
                </div>
            </div>
            <span className={`text-lg font-black ${warning ? 'text-error' : 'text-warning'}`}>{count}</span>
        </div>
    );
}
