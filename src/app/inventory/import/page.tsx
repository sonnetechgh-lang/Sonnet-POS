"use client";

import { useState } from "react";

function parseCSV(text: string) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        const obj: any = {};
        headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
        return obj;
    });
    return rows;
}

export default function ImportPage() {
    const [preview, setPreview] = useState<any[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        setFileName(f.name);
        const text = await f.text();
        const rows = parseCSV(text);
        setPreview(rows.slice(0, 200));
    }

    async function handleImport() {
        setStatus("Importing...");
        try {
            const res = await fetch("/api/import/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows: preview }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Import failed");
            setStatus(`Imported ${data.inserted?.length ?? 0} rows.`);
        } catch (err: any) {
            setStatus(err.message || String(err));
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">CSV Product Import</h1>
            <p className="mb-4 text-sm text-muted-foreground">Expect a CSV with a header row. Example headers: name,sku,price,cost_price,stock_quantity,category_name,expiry_date,lot_number</p>
            <input type="file" accept=".csv" onChange={handleFile} className="mb-4" />
            {fileName && <p className="mb-2">Selected: {fileName}</p>}
            {preview.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-medium mb-2">Preview (first {preview.length} rows)</h2>
                    <div className="overflow-auto max-h-64 border rounded p-2 bg-white">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    {Object.keys(preview[0]).map((h) => (
                                        <th key={h} className="text-left pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.map((r, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50">
                                        {Object.values(r).map((v, c) => (
                                            <td key={c} className="pr-4">{v}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <button onClick={handleImport} className="px-4 py-2 bg-blue-600 text-white rounded">Import</button>
                <button onClick={() => { setPreview([]); setFileName(null); setStatus(null); }} className="px-4 py-2 border rounded">Clear</button>
                {status && <p className="ml-4 text-sm">{status}</p>}
            </div>
        </div>
    );
}
