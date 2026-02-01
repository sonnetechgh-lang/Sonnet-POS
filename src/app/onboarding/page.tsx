"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Settings2,
    MapPin,
    Globe,
    CheckCircle,
    Image as ImageIcon,
    DollarSign,
    Receipt,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalSteps = 3;

    const nextStep = () => {
        if (step < totalSteps) setStep(step + 1);
        else {
            setLoading(true);
            setTimeout(() => window.location.href = "/", 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background-app flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-3xl font-black text-primary tracking-tight">Setup Your Shop</h1>
                            <p className="text-text-secondary font-medium mt-1">Let's configure <strong>Sonnet POS</strong> for your business needs.</p>
                        </div>
                        <p className="text-sm font-black text-secondary uppercase tracking-widest">Step {step} of {totalSteps}</p>
                    </div>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-secondary"
                            initial={{ width: "33%" }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Main Configuration Card */}
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-border overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-secondary">
                                    <div className="p-3 rounded-2xl bg-secondary/10">
                                        <Building2 size={24} />
                                    </div>
                                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Basic Profile</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">Business Name</label>
                                        <input type="text" placeholder="Sonnet Pharmacy Ltd." className="onboarding-input" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">Contact Email</label>
                                        <input type="email" placeholder="contact@sonnet.com" className="onboarding-input" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">Business Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-4 text-text-disabled" size={18} />
                                        <textarea placeholder="e.g. No. 12 Liberation Rd, Accra" rows={3} className="onboarding-input pl-12 pt-3" />
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-background-app flex items-center gap-6 border border-dashed border-border group hover:border-secondary transition-all cursor-pointer">
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-text-disabled border border-border group-hover:bg-secondary/5 group-hover:text-secondary transition-all">
                                        <ImageIcon size={28} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary">Business Logo</p>
                                        <p className="text-xs text-text-secondary">This will appear on all your digital receipts.</p>
                                    </div>
                                    <button className="ml-auto text-xs font-black text-secondary uppercase tracking-widest bg-white px-4 py-2 rounded-xl shadow-sm border border-border group-hover:border-secondary">Upload</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-secondary">
                                    <div className="p-3 rounded-2xl bg-secondary/10">
                                        <DollarSign size={24} />
                                    </div>
                                    <h2 className="text-xl font-black text-primary uppercase tracking-tight">Finances & Taxes</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">Currency</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 rounded-2xl border-2 border-secondary bg-secondary/5 text-secondary flex items-center justify-center font-black">GHS (₵)</div>
                                            <div className="p-4 rounded-2xl border-2 border-border text-text-secondary flex items-center justify-center font-black opacity-50 cursor-not-allowed">USD ($)</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-widest ml-1">Default Tax Rate (%)</label>
                                        <input type="number" defaultValue="0" className="onboarding-input font-black text-lg" />
                                        <p className="text-[10px] text-text-secondary">You can adjust this per item later.</p>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[32px] bg-primary text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="text-secondary" />
                                        <h4 className="font-bold tracking-tight">Compliance Tracking</h4>
                                    </div>
                                    <p className="text-sm text-blue-100/70 leading-relaxed">
                                        We automatically handle GRA reporting format requirements and financial logging for your audits.
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 text-center py-4">
                                <div className="flex justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white shadow-2xl shadow-accent/20"
                                    >
                                        <CheckCircle size={48} />
                                    </motion.div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-black text-primary tracking-tight">Configuration Complete!</h2>
                                    <p className="text-text-secondary font-medium mt-2 max-w-md mx-auto">
                                        Your shop is ready to go. You can start adding products and processing sales immediately.
                                    </p>
                                </div>

                                <div className="space-y-4 max-w-sm mx-auto pt-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-background-app text-sm">
                                        <div className="flex items-center gap-3 font-bold text-primary">
                                            <Receipt size={18} className="text-secondary" />
                                            Receipt Layout
                                        </div>
                                        <span className="text-xs font-bold text-accent uppercase tracking-widest">Optimized</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-background-app text-sm">
                                        <div className="flex items-center gap-3 font-bold text-primary">
                                            <Globe size={18} className="text-secondary" />
                                            Cloud Sync
                                        </div>
                                        <span className="text-xs font-bold text-accent uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex gap-4">
                            {step > 1 && step < 3 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="px-8 py-4 border border-border rounded-2xl font-bold text-text-secondary hover:bg-gray-50 transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={nextStep}
                                disabled={loading}
                                className="flex-1 py-5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                {loading ? "Launching Dashboard..." : step === 3 ? "Access My Dashboard" : "Save & Continue"}
                                {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Support */}
                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-text-secondary">
                        Need help setting up? <button className="text-secondary font-black hover:underline">Contact Sonnet Support</button>
                    </p>
                </div>
            </div>

            <style jsx>{`
        .onboarding-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #F9FAFB;
          border: 1px solid #E0E6ED;
          border-radius: 20px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .onboarding-input:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(46, 196, 182, 0.1);
          border-color: #2EC4B6;
          background-color: white;
        }
      `}</style>
        </div>
    );
}
