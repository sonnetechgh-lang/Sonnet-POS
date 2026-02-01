"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl md:rounded-[32px] shadow-2xl shadow-black/20 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="p-4 md:p-8 border-b border-border flex justify-between items-start md:items-center bg-gray-50/50 flex-shrink-0">
                    <div className="pr-4">
                        <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">{title}</h3>
                        <p className="text-[10px] md:text-xs text-text-secondary mt-1">Please fill in the details below.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-2xl hover:bg-white hover:shadow-lg text-text-secondary hover:text-primary transition-all active:scale-90 flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 md:p-8 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
