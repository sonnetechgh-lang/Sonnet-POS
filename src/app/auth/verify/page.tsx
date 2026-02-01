"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function VerifyEmailPage() {
    const supabase = createClient();
    const search = useSearchParams();
    const router = useRouter();
    const email = search?.get("email") || "";

    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "verified">("idle");
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Try to detect verification if user returned via email link
        async function checkUser() {
            try {
                const { data } = await supabase.auth.getUser();
                const user = (data as any)?.user;
                const verified = user && (user.email_confirmed_at || user.confirmed_at || user.email_confirmed);
                if (verified) {
                    setStatus("verified");
                    setMessage("Email verified — redirecting to dashboard...");
                    setTimeout(() => router.push("/"), 1200);
                }
            } catch (err) {
                // ignore
            }
        }
        checkUser();
    }, [router, supabase]);

    const resendMagicLink = async () => {
        setStatus("sending");
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setStatus("sent");
            setMessage("Magic link sent. Check your inbox (and spam).");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Failed to send verification link");
        }
    };

    return (
        <div className="min-h-screen bg-background-app flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
                <h2 className="text-lg font-black mb-2">Verify your email</h2>
                <p className="text-sm text-text-secondary mb-4">We sent a verification link to <strong>{email}</strong>. Click the link to complete your account setup.</p>

                {message && <p className={`text-sm mb-4 ${status === 'error' ? 'text-error' : 'text-text-secondary'}`}>{message}</p>}

                {status === "verified" ? (
                    <p className="text-sm font-bold text-primary">Verified — Redirecting...</p>
                ) : (
                    <div className="space-y-4">
                        <button onClick={resendMagicLink} disabled={!email || status === "sending"} className="w-full py-3 bg-primary text-white rounded-xl font-bold">
                            {status === "sending" ? "Sending..." : "Resend verification link"}
                        </button>

                        <p className="text-xs text-text-secondary">If you didn't receive the email, check spam or try again. Still not working? <Link href="/contact" className="font-bold text-secondary">Contact support</Link>.</p>

                        <div className="pt-3">
                            <Link href="/login" className="text-xs text-secondary font-black hover:underline">Back to Sign in</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
