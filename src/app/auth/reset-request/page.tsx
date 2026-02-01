"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetRequestPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/auth/reset"
            });
            if (error) throw error;
            setMessage("Password reset email sent. Check your inbox.");
        } catch (err: any) {
            setMessage(err.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-app flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-black mb-2">Reset password</h2>
                <p className="text-sm text-text-secondary mb-4">Enter the email used for your account and we'll send a reset link.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 border border-border rounded-xl"
                    />
                    <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold">
                        {loading ? "Sending..." : "Send reset email"}
                    </button>
                </form>
                {message && <p className="mt-4 text-sm text-center">{message}</p>}
            </div>
        </div>
    );
}
