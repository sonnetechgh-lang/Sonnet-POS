"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getShopDetails, updateShopDetails } from "@/lib/services/settings";
import { Toast, useToast } from "@/components/ui/Toast";
import {
    Store,
    MapPin,
    Phone,
    DollarSign,
    Save,
    Loader2,
    ShieldCheck,
    Bell,
    User,
    ChevronRight,
    HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        loadShop();
    }, []);

    const loadShop = async () => {
        try {
            setError(null);
            const data = await getShopDetails();
            setShop(data);
        } catch (err: any) {
            console.error("Settings load error:", err);
            const errorMsg = err.message || "Failed to load settings. Please check your database connection.";
            setError(errorMsg);
            showToast(errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateShopDetails(shop.id, {
                name: shop.name,
                address: shop.address,
                phone: shop.phone,
                currency: shop.currency
            });
            showToast("Settings updated successfully", "success");
        } catch (err: any) {
            showToast(err.message || "Failed to update settings", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-background-app min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-secondary" size={48} />
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="flex bg-background-app min-h-screen">
                <Sidebar />
                <main className="flex-1 flex flex-col min-w-0 pl-14 md:pl-0 overflow-hidden">
                    <Header title="System Settings" />
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin text-text-disabled" size={40} />
                                <p className="font-bold text-text-disabled uppercase tracking-widest text-sm">Loading shop configuration...</p>
                            </>
                        ) : (
                            <>
                                <HelpCircle className="text-error" size={48} />
                                <p className="font-bold text-text-primary uppercase tracking-widest text-sm text-center">Failed to retrieve shop configuration.</p>
                                {error && (
                                    <p className="text-xs text-text-secondary text-center max-w-md">{error}</p>
                                )}
                                <button
                                    onClick={loadShop}
                                    className="text-secondary font-black hover:underline uppercase text-xs mt-4"
                                >
                                    Retry Connection
                                </button>
                            </>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pl-14 md:pl-0">
                <Header title="System Settings" />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1200px] mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Sidebar Navigation for Settings */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase text-text-disabled tracking-widest ml-4 mb-4">Configuration</h3>
                            <SettingsNavButton icon={<Store />} label="Business Profile" active />
                            <SettingsNavButton icon={<ShieldCheck />} label="Security & Access" disabled />
                            <SettingsNavButton icon={<Bell />} label="Notifications" disabled />
                            <SettingsNavButton icon={<HelpCircle />} label="Support Center" disabled />
                        </div>

                        {/* Main Settings Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[40px] border border-border shadow-sm overflow-hidden"
                            >
                                <div className="p-4 md:p-8 border-b border-border bg-gray-50/30">
                                    <h2 className="text-lg md:text-xl font-black text-primary uppercase tracking-tight">Business Profile</h2>
                                    <p className="text-[10px] md:text-xs font-bold text-text-secondary mt-1">Configure how your shop appears on receipts and reports.</p>
                                </div>

                                <form onSubmit={handleSave} className="p-4 md:p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-text-primary ml-1">Shop Name</label>
                                                <div className="relative group">
                                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        value={shop.name}
                                                        onChange={(e) => setShop({ ...shop, name: e.target.value })}
                                                        required
                                                        className="w-full pl-12 pr-4 py-3 bg-background-app border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-text-primary ml-1">Business Phone</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        value={shop.phone || ''}
                                                        onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-background-app border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-text-primary ml-1">Physical Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 text-text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                                <textarea
                                                    value={shop.address || ''}
                                                    onChange={(e) => setShop({ ...shop, address: e.target.value })}
                                                    rows={3}
                                                    className="w-full pl-12 pr-4 py-4 bg-background-app border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-text-primary ml-1">Base Currency</label>
                                                <div className="relative group">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                                    <select
                                                        value={shop.currency || 'GHS'}
                                                        onChange={(e) => setShop({ ...shop, currency: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-background-app border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                                    >
                                                        <option value="GHS">GHS (₵)</option>
                                                        <option value="USD">USD ($)</option>
                                                        <option value="EUR">EUR (€)</option>
                                                        <option value="GBP">GBP (£)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white rounded-2xl font-black shadow-xl shadow-secondary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                            {saving ? "SAVING..." : "SAVE CHANGES"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>

                            <div className="mt-6 md:mt-8 p-4 md:p-8 bg-blue-50/50 rounded-2xl md:rounded-[40px] border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-primary uppercase">Multi-User Management</h4>
                                    <p className="text-[11px] font-medium text-text-secondary mt-1 leading-relaxed max-w-md">Role-based access control (RBAC) is managed per user account. You can configure staff permissions in the Security & Access tab (coming soon).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        isVisible={!!toast}
                        onClose={hideToast}
                    />
                )}
            </main>
        </div>
    );
}

function SettingsNavButton({ icon, label, active, disabled }: any) {
    return (
        <button
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${active
                ? 'bg-white border border-border shadow-sm text-primary font-black'
                : 'text-text-secondary hover:bg-white hover:text-primary opacity-60 hover:opacity-100'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
            disabled={disabled}
        >
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-secondary' : 'text-text-disabled group-hover:text-primary transition-colors'}`}>
                    {icon}
                </span>
                <span className="text-sm uppercase tracking-tight">{label}</span>
            </div>
            {!disabled && <ChevronRight size={16} className={`${active ? 'text-secondary' : 'text-text-disabled opacity-0 group-hover:opacity-100 transition-all'}`} />}
            {disabled && <span className="text-[8px] font-black uppercase text-text-disabled bg-background-app px-2 py-1 rounded-full">Soon</span>}
        </button>
    );
}
