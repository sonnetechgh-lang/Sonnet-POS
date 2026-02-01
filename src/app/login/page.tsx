"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShoppingCart, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth for UI verification
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background-app flex flex-col md:flex-row">
            {/* Branding Side - Hidden on small screens */}
            <div className="hidden md:flex md:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 text-center max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-secondary rounded-[32px] flex items-center justify-center mb-6 shadow-2xl shadow-secondary/30">
                            <ShoppingCart className="text-white" size={40} />
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-4">SONNET POS</h1>
                        <p className="text-xl text-blue-100/70 font-medium">Your business, elevated to the cloud. Secure, efficient, and effortless.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-12 grid grid-cols-2 gap-4 text-left"
                    >
                        <FeatureItem title="Offline First" description="Sell even when the internet goes out." />
                        <FeatureItem title="Realtime Insights" description="Track every cedi from anywhere." />
                        <FeatureItem title="Inventory Alerts" description="Never run out of your best sellers." />
                        <FeatureItem title="Multi-branch" description="Manage all your shops in one place." />
                    </motion.div>
                </div>
            </div>

            {/* Login Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 block md:hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                                <ShoppingCart className="text-white" size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-primary tracking-tight">SONNET POS</h2>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-primary tracking-tight mb-2">Welcome Back</h3>
                        <p className="text-text-secondary font-medium">Please enter your details to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-primary ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@sonnet.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Password</label>
                                <Link href="#" className="text-xs font-bold text-secondary hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary" />
                            <label htmlFor="remember" className="text-sm text-text-secondary font-medium cursor-pointer">Stay signed in for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-[20px] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-text-secondary font-medium">
                            Don't have a shop registered yet? <br />
                            <Link href="/signup" className="text-secondary font-black hover:underline inline-flex items-center gap-1 mt-2">
                                Get Started with Sonnet POS <Sparkles size={14} />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <h4 className="text-sm font-bold text-secondary mb-1">{title}</h4>
            <p className="text-xs text-blue-100/50 leading-relaxed font-normal">{description}</p>
        </div>
    );
}
