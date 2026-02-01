"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const icons = {
        success: <CheckCircle2 className="text-accent" size={20} />,
        error: <AlertCircle className="text-error" size={20} />,
        info: <Info className="text-secondary" size={20} />,
    };

    const bgColors = {
        success: "bg-green-50 border-accent/20",
        error: "bg-red-50 border-error/20",
        info: "bg-blue-50 border-secondary/20",
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl ${bgColors[type]} backdrop-blur-md`}
                >
                    <div className="flex-shrink-0">{icons[type]}</div>
                    <p className="text-sm font-bold text-primary pr-4">{message}</p>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        <X size={16} className="text-text-secondary" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook for using the toast
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType = "success") => {
        setToast({ message, type });
    };

    const hideToast = () => setToast(null);

    return { toast, showToast, hideToast };
}
