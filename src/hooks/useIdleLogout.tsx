"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

// Hook: signs out the user after a period of inactivity (default 30 minutes)
export function useIdleLogout(timeout = 1000 * 60 * 30) {
    const timer = useRef<number | undefined>(undefined);
    const supabase = createClient();

    const reset = () => {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(async () => {
            try {
                await supabase.auth.signOut();
            } finally {
                // Redirect to login page after sign out
                if (typeof window !== "undefined") window.location.href = "/login";
            }
        }, timeout);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "mousedown", "touchstart"];
        events.forEach((ev) => window.addEventListener(ev, reset));
        reset();
        return () => {
            events.forEach((ev) => window.removeEventListener(ev, reset));
            if (timer.current) window.clearTimeout(timer.current);
        };
    }, []);
}
