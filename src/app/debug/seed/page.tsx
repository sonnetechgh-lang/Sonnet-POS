"use client";

import { useState } from "react";
import { seedDatabase } from "@/lib/services/seed";
import { Database, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeedPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    const handleSeed = async () => {
        setStatus("loading");
        try {
            await seedDatabase();
            setStatus("success");
        } catch (err: any) {
            setError(err.message || "Failed to seed database");
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-background-app flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-border p-10 text-center space-y-8">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto">
                    <Database size={40} />
                </div>

                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight">Database Seeder</h1>
                    <p className="text-text-secondary font-medium mt-2">Initialize your system with premium sample pharmacy data.</p>
                </div>

                {status === "idle" && (
                    <button
                        onClick={handleSeed}
                        className="w-full py-5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        Generate Sample Data
                    </button>
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <Loader2 className="animate-spin text-secondary" size={40} />
                        <p className="text-sm font-bold text-text-secondary animate-pulse uppercase tracking-widest">Populating Tables...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center gap-2 text-accent">
                            <CheckCircle size={48} />
                            <p className="font-black text-xl">Success!</p>
                        </div>
                        <p className="text-sm text-text-secondary font-medium italic">Your database is now ready for testing. You can view your products in the inventory or start selling in the POS terminal.</p>
                        <Link href="/" className="flex items-center justify-center gap-2 text-primary font-black uppercase text-xs hover:underline">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-2 text-error">
                            <AlertCircle size={48} />
                            <p className="font-black text-xl">Error</p>
                        </div>
                        <p className="text-sm text-error bg-error/5 p-4 rounded-xl border border-error/10 font-medium">{error}</p>
                        <button onClick={() => setStatus("idle")} className="text-primary font-black uppercase text-xs hover:underline">Try Again</button>
                    </div>
                )}

                <div className="pt-4 border-t border-border">
                    <p className="text-[10px] text-text-disabled font-bold uppercase tracking-widest">Debug Mode Only</p>
                </div>
            </div>
        </div>
    );
}
