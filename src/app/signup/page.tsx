"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShoppingBag, ArrowRight, Loader2, Smartphone, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 2) setStep(step + 1);
        else {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background-app flex flex-col md:flex-row">
            {/* Visual Side */}
            <div className="hidden md:flex md:w-1/3 bg-secondary relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 text-white">
                    <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
                        <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 transition-transform group-hover:-translate-x-1">
                            <ArrowRight className="rotate-180" size={20} />
                        </div>
                        <span className="font-bold">Home</span>
                    </Link>

                    <h1 className="text-4xl font-black tracking-tight mb-6">Launch your <br /> cloud shop today.</h1>

                    <div className="space-y-6">
                        <StepIndicator num={1} text="Create account" active={step >= 1} />
                        <StepIndicator num={2} text="Setup shop details" active={step >= 2} />
                        <StepIndicator num={3} text="Manage inventory" active={false} />
                    </div>

                    <div className="mt-16 p-6 rounded-3xl bg-primary/10 border border-white/10 backdrop-blur-md">
                        <p className="text-sm italic opacity-80 leading-relaxed">
                            "Sonnet POS has transformed how we track sales at my pharmacy. No more messy papers, everything is just there on my phone."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-400"></div>
                            <div>
                                <p className="text-xs font-bold">Ama Serwaa</p>
                                <p className="text-[10px] opacity-60">Ama's Pharmacy, Kumasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-lg"
                >
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-primary tracking-tight mb-2">
                            {step === 1 ? "Start Your Journey" : "Tell us about your Shop"}
                        </h3>
                        <p className="text-text-secondary font-medium">
                            {step === 1 ? "Fill in your personal information to get started." : "This information will appear on your receipts."}
                        </p>
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">
                        {step === 1 ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary ml-1 uppercase">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                        <input type="text" required placeholder="John Boateng" className="input-style" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary ml-1 uppercase">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                        <input type="email" required placeholder="john@example.com" className="input-style" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-primary ml-1 uppercase">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                            <input type="password" required placeholder="••••••••" className="input-style" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-primary ml-1 uppercase">Confirm</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                            <input type="password" required placeholder="••••••••" className="input-style" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary ml-1 uppercase">Business Name</label>
                                    <div className="relative group">
                                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                        <input type="text" required placeholder="Sonnet Enterprise" className="input-style" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary ml-1 uppercase">Phone Number</label>
                                    <div className="relative group">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                                        <input type="tel" required placeholder="+233 XX XXX XXXX" className="input-style" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary ml-1 uppercase tracking-wider">Business Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <TypeButton label="Pharmacy" />
                                        <TypeButton label="Supermarket" />
                                        <TypeButton label="Boutique" />
                                        <TypeButton label="Other" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-4 flex gap-4">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-4 border border-border rounded-[20px] font-bold text-text-secondary hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-[20px] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {step === 1 ? "Next: Shop Details" : "Complete Registration"}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-text-secondary font-medium">
                            Already have an account? <Link href="/login" className="text-secondary font-black hover:underline">Sign In Instead</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
        .input-style {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: white;
          border: 1px solid #E0E6ED;
          border-radius: 20px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-style:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(46, 196, 182, 0.1);
          border-color: #2EC4B6;
        }
      `}</style>
        </div>
    );
}

function StepIndicator({ num, text, active }: { num: number; text: string; active: boolean }) {
    return (
        <div className={`flex items-center gap-4 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${active ? 'bg-white text-secondary' : 'bg-transparent border border-white/40 text-white'}`}>
                {active && num < 4 ? <CheckCircle2 size={16} /> : num}
            </div>
            <span className="font-bold text-sm tracking-wide">{text}</span>
        </div>
    );
}

function TypeButton({ label }: { label: string }) {
    const [selected, setSelected] = useState(false);
    return (
        <button
            type="button"
            onClick={() => setSelected(!selected)}
            className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${selected ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-white border-border text-text-secondary hover:border-text-disabled'
                }`}
        >
            {label}
        </button>
    );
}
