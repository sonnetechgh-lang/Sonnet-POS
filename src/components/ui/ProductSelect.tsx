import React from 'react';
"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductSelect({ products = [], value, onChange, placeholder = "Search product by name or SKU" }: any) {
    const [inputValue, setInputValue] = useState(""); // immediate input
    const [query, setQuery] = useState(""); // debounced query used for filtering
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const [typeBuffer, setTypeBuffer] = useState("");
    const [typeBufferAt, setTypeBufferAt] = useState<number | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const debounceRef = useRef<number | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!(e.target instanceof Node)) return;
            if (!ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", handle);
        return () => document.removeEventListener("click", handle);
    }, []);

    // Update display when value prop changes
    useEffect(() => {
        if (value) {
            const sel = products.find((p: any) => p.id === value);
            if (sel) {
                setInputValue(`${sel.name}${sel.sku ? ` (${sel.sku})` : ""}`);
                setQuery(`${sel.name}${sel.sku ? ` (${sel.sku})` : ""}`);
            }
        }
    }, [value, products]);

    // Debounce the input -> query for typeahead
    useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            setQuery(inputValue);
            setHighlight(-1);
        }, 200) as unknown as number;
        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
        };
    }, [inputValue]);

    const filtered = (products || [])
        .filter((p: any) => `${p.name} ${(p.sku || "")}`.toLowerCase().includes((query || "").toLowerCase()))
        .slice(0, 10);

    // Typeahead buffer: type characters to jump to matching option
    const TYPE_RESET_MS = 700;
    const [typeCycleIndex, setTypeCycleIndex] = useState(0);

    function handleTypeChar(ch: string) {
        const now = Date.now();
        const wasStale = !typeBufferAt || now - (typeBufferAt || 0) > TYPE_RESET_MS;

        if (wasStale) {
            // fresh buffer: set to this char and highlight first match
            const newBuf = ch;
            setTypeBuffer(newBuf);
            setTypeBufferAt(now);
            setTypeCycleIndex(0);

            const idx = filtered.findIndex((p: any) => `${p.name} ${p.sku || ""}`.toLowerCase().startsWith(newBuf.toLowerCase()));
            if (idx >= 0) setHighlight(idx);
            return;
        }

        // within buffering window
        if (typeBuffer === ch) {
            // repeated same character -> cycle through matches that start with that char
            const matches: number[] = [];
            filtered.forEach((p: any, i: number) => {
                if (`${p.name} ${p.sku || ""}`.toLowerCase().startsWith(ch.toLowerCase())) matches.push(i);
            });
            if (matches.length > 0) {
                const next = (typeCycleIndex + 1) % matches.length;
                setTypeCycleIndex(next);
                setHighlight(matches[next]);
            }
            setTypeBufferAt(now);
            return;
        }

        // otherwise append to the buffer and try a multi-char prefix match
        const newBuf = typeBuffer + ch;
        setTypeBuffer(newBuf);
        setTypeBufferAt(now);
        setTypeCycleIndex(0);
        const idx = filtered.findIndex((p: any) => `${p.name} ${p.sku || ""}`.toLowerCase().startsWith(newBuf.toLowerCase()));
        if (idx >= 0) setHighlight(idx);
    }

    // Keyboard navigation
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

        if (isPrintable) {
            handleTypeChar(e.key);
            return;
        }

        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            setHighlight(0);
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
        } else if (e.key === "Enter") {
            if (open && filtered[highlight]) {
                const p = filtered[highlight];
                selectProduct(p);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    function selectProduct(p: any) {
        onChange && onChange(p.id);
        setInputValue(`${p.name}${p.sku ? ` (${p.sku})` : ""}`);
        setQuery(`${p.name}${p.sku ? ` (${p.sku})` : ""}`);
        setOpen(false);
        setHighlight(-1);
    }

    return (
        <div className="relative" ref={ref}>
            <input
                className="border rounded px-2 py-2 w-full"
                placeholder={placeholder}
                value={inputValue}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setOpen(true);
                    onChange && onChange(""); // clear selection while typing
                }}
                aria-autocomplete="list"
                aria-expanded={open}
            />

            {open && filtered.length > 0 && (
                <ul role="listbox" className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded shadow max-h-56 overflow-auto">
                    {filtered.map((p: any, idx: number) => (
                        <li
                            id={`product-option-${p.id}`}
                            role="option"
                            aria-selected={highlight === idx}
                            key={p.id}
                            className={`px-3 py-2 cursor-pointer ${highlight === idx ? "bg-indigo-50" : "hover:bg-gray-100"}`}
                            onMouseEnter={() => setHighlight(idx)}
                            onMouseLeave={() => setHighlight(-1)}
                            onClick={() => selectProduct(p)}
                        >
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.sku}</div>
                        </li>
                    ))}
                </ul>
            )}

            {open && filtered.length === 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded shadow p-3 text-sm text-muted-foreground">No products found</div>
            )}
        </div>
    );
}
