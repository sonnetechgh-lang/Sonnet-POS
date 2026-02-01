"use client";

import { useEffect, useState } from "react";
import SupplierForm from "@/components/ui/SupplierForm";
import Modal from "@/components/ui/Modal";
import { listSuppliers, createSupplier } from "@/lib/services/suppliers";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    async function fetchSuppliers() {
        setLoading(true);
        try {
            const data = await listSuppliers();
            setSuppliers(data || []);
        } catch (err: any) {
            setStatus(err.message || String(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSuppliers();
    }, []);

    async function handleCreate(payload: any) {
        setStatus(null);
        try {
            await createSupplier({ ...payload });
            setShowCreate(false);
            await fetchSuppliers();
            setStatus("Supplier created");
        } catch (err: any) {
            setStatus(err.message || String(err));
        }
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Suppliers</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-primary text-white rounded">Add supplier</button>
                </div>
            </div>

            {status && <p className="mb-4 text-sm">{status}</p>}

            <div className="bg-white border rounded shadow-sm p-4">
                {loading ? (
                    <p>Loading…</p>
                ) : suppliers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No suppliers found.</p>
                ) : (
                    <ul className="space-y-2">
                        {suppliers.map((s) => (
                            <li key={s.id} className="flex items-center justify-between border-b pb-2 pt-2">
                                <div>
                                    <div className="font-medium">{s.name}</div>
                                    <div className="text-xs text-muted-foreground">{s.contact_person} • {s.phone} • {s.email}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">Created</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Modal open={showCreate} onOpenChange={setShowCreate} title="Create supplier">
                <SupplierForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
            </Modal>
        </div>
    );
}
