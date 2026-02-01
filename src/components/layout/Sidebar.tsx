"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    TrendingUp,
    LogOut,
    PieChart,
    Wallet,
    Menu,
    X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShoppingCart, label: "POS Terminal", href: "/pos" },
    { icon: Package, label: "Inventory", href: "/inventory" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: TrendingUp, label: "Reports", href: "/reports" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: Wallet, label: "Expenses", href: "/expenses" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Toggle - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden top-4 left-4 z-50 p-2 rounded-lg bg-primary text-white shadow-lg"
                aria-label="Toggle menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-primary text-white flex flex-col h-screen sticky top-0 flex-shrink-0 border-r border-primary-light/10",
                "fixed md:relative z-40 md:z-auto",
                "transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 md:p-8">
                    <h1 className="text-2xl font-bold tracking-tight text-secondary">SONNET POS</h1>
                    <p className="text-[10px] text-blue-200 uppercase tracking-widest opacity-60 mt-1 font-semibold">Cloud Edition v0.1</p>
                </div>

                <nav className="flex-1 mt-4 px-3 md:px-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                                    isActive
                                        ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                                        : "text-blue-100/70 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-transform duration-200 group-hover:scale-110 flex-shrink-0",
                                    isActive ? "text-white" : "text-secondary/60 group-hover:text-secondary"
                                )} />
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 md:p-4 mt-auto">
                    <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/10 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold ring-2 ring-secondary/20 flex-shrink-0">
                                A
                            </div>
                            <div className="overflow-hidden hidden sm:block">
                                <p className="text-sm font-semibold truncate">Admin User</p>
                                <p className="text-[10px] text-blue-200/50 truncate">Main Branch</p>
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center justify-center sm:justify-start gap-3 w-full px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 font-medium transition-all group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
