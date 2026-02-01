"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getSalesSummary } from "@/lib/services/analytics";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    ExternalLink,
    Loader2,
    CheckCircle2,
    DollarSign,
    Package,
    TrendingUp
} from "lucide-react";
import { exportToCSV } from "@/lib/utils/export";

export default function ReportsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getSalesSummary();
                setSummary(data);
            } catch (err) {
                console.error("Reports load failed", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex bg-background-app min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={48} />
            </div>
        );
    }

    const stats = summary || {
        totalSales: 0,
        totalExpenses: 0,
        grossProfit: 0,
        netProfit: 0,
        dailyTrends: [],
        stockValue: 0,
        salesCount: 0,
        recentSales: []
    };

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 pl-14 md:pl-0 overflow-hidden">
                <Header title="Business Intelligence & Reports" />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                    {/* Top Bar / Filters */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:justify-between sm:items-center bg-white p-4 rounded-2xl md:rounded-3xl border border-border shadow-sm">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-background-app rounded-xl text-xs sm:text-sm font-bold border border-border">
                                <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                                This Month
                            </div>
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-background-app rounded-xl text-xs sm:text-sm font-bold border border-border">
                                <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
                                All Categories
                            </div>
                        </div>
                        <button
                            onClick={() => exportToCSV(stats.recentSales, "Sonnet_POS_Sales_History")}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-dark transition-all disabled:opacity-50 w-full sm:w-auto"
                            disabled={!summary}
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ReportSummaryCard icon={<TrendingUp />} label="Gross Profit (Month)" value={`₵${(stats.grossProfit || 0).toFixed(2)}`} color="teal" />
                        <ReportSummaryCard icon={<Package />} label="Inventory Valuation" value={`₵${(stats.stockValue || 0).toFixed(2)}`} color="blue" />
                        <ReportSummaryCard icon={<FileText />} label="Tax Liability (GHS)" value={`₵${(stats.totalSales * 0.05).toFixed(2)}`} color="amber" />
                        <ReportSummaryCard icon={<DollarSign />} label="Net Monthly Profit" value={`₵${(stats.netProfit || 0).toFixed(2)}`} color="accent" />
                    </div>

                    {/* Detailed Transaction History */}
                    <div className="bg-white rounded-2xl md:rounded-[40px] border border-border shadow-sm overflow-hidden min-h-[400px]">
                        <div className="px-4 md:px-8 py-4 md:py-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50/50">
                            <h3 className="text-lg md:text-xl font-black text-primary">Full Sales History</h3>
                            <span className="text-[10px] md:text-xs font-black text-text-secondary uppercase tracking-widest">{stats.salesCount} RECORDS</span>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full min-w-[640px] text-left">
                                <thead>
                                    <tr className="bg-background-app/50 text-[10px] uppercase font-black tracking-wider text-text-secondary border-b border-border">
                                        <th className="px-4 md:px-8 py-3 md:py-4">Transaction ID</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4">Date & Time</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4">Status</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4">Method</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4 text-right">Net Amount</th>
                                        <th className="px-4 md:px-8 py-3 md:py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {stats.recentSales.length === 0 ? (
                                        <tr><td colSpan={6} className="py-16 md:py-20 text-center font-bold text-text-disabled uppercase text-xs md:text-sm">{!summary ? 'Error loading sales history' : 'No sales history found'}</td></tr>
                                    ) : (
                                        stats.recentSales.map((sale: any, i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-4 md:px-8 py-4 md:py-5 text-xs sm:text-sm font-black text-primary uppercase">#{(sale.id || '---').slice(0, 8)}</td>
                                                <td className="px-4 md:px-8 py-4 md:py-5 text-[10px] sm:text-xs font-bold text-text-secondary whitespace-nowrap">{new Date(sale.created_at).toLocaleString()}</td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="px-2 sm:px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-tighter">Completed</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5">
                                                    <span className="px-2 sm:px-3 py-1 bg-background-app text-text-secondary rounded-full text-[10px] font-black uppercase tracking-widest border border-border">{sale.payment_method || 'CASH'}</span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-5 text-right font-black text-primary text-sm">₵{(sale.total_amount || 0).toFixed(2)}</td>
                                                <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                                                    <button className="p-2 text-text-disabled hover:text-secondary rounded-xl transition-all"><ExternalLink size={18} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ReportSummaryCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        teal: "bg-teal-50 text-secondary",
        accent: "bg-accent/10 text-accent",
        amber: "bg-amber-50 text-warning"
    };
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm flex items-center gap-3 md:gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</p>
                <p className="text-xl font-black text-primary mt-0.5">{value}</p>
            </div>
        </div>
    );
}
