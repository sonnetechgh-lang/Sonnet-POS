"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import ProductSelect from "@/components/ui/ProductSelect";
import { listPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } from "@/lib/services/suppliers";
import { listSuppliers } from "@/lib/services/suppliers";
import { getProducts } from "@/lib/services/inventory";

export default function PurchaseOrdersPage() {
    const [pos, setPos] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [poPayload, setPoPayload] = useState({ supplier_id: "", items: [{ product_id: "", quantity: 1, unit_price: 0 }] });
    const [status, setStatus] = useState<string | null>(null);

    async function fetchData() {
        setLoading(true);
        try {
            const [poData, supplierData, productData] = await Promise.all([listPurchaseOrders(), listSuppliers(), getProducts()]);
            setPos(poData || []);
            setSuppliers(supplierData || []);
            setProducts(productData || []);
        } catch (err: any) {
            setStatus(err.message || String(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleCreate() {
        setCreating(true);
        setStatus(null);
        try {
            if (!poPayload.supplier_id) {
                setStatus("Please select a supplier");
                return;
            }
            if (!poPayload.items || poPayload.items.length === 0) {
                setStatus("Add at least one item to the PO");
                return;
            }
            for (const it of poPayload.items) {
                if (!it.product_id) { setStatus("Each item must have a product selected"); return; }
                if (!it.quantity || Number(it.quantity) <= 0) { setStatus("Quantity must be greater than 0"); return; }
            }

            const po = { shop_id: undefined, supplier_id: poPayload.supplier_id, status: "ordered", total_amount: 0 };
            const items = (poPayload.items || []).map((it: any) => ({ product_id: it.product_id, quantity: Number(it.quantity), unit_price: Number(it.unit_price), total_price: Number(it.unit_price) * Number(it.quantity) }));
            await createPurchaseOrder(po, items);
            setShowCreate(false);
            setPoPayload({ supplier_id: "", items: [{ product_id: "", quantity: 1, unit_price: 0 }] });
            await fetchData();
            setStatus("Purchase order created");
        } catch (err: any) {
            setStatus(err.message || String(err));
        } finally {
            setCreating(false);
        }
    }

    async function handleReceive(poId: string) {
        setStatus(null);
        try {
            await receivePurchaseOrder(poId);
            setStatus("Purchase order received and stock updated");
            await fetchData();
        } catch (err: any) {
            setStatus(err.message || String(err));
        }
    }

    function updateItem(idx: number, key: string, value: any) {
        const items = [...(poPayload.items as any[])];
        items[idx] = { ...items[idx], [key]: value };
        setPoPayload({ ...poPayload, items });
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Purchase Orders</h1>
                <button onClick={() => setShowCreate(true)} className="px-3 py-2 bg-primary text-white rounded">Create PO</button>
            </div>

            {status && <p className="mb-4 text-sm">{status}</p>}

            <div className="bg-white border rounded shadow-sm p-4">
                {loading ? (
                    <p>Loading…</p>
                ) : pos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No purchase orders.</p>
                ) : (
                    <ul className="space-y-2">
                        {pos.map((p) => (
                            <li key={p.id} className="flex items-center justify-between border-b pb-2 pt-2">
                                <div>
                                    <div className="font-medium">PO • {p.id}</div>
                                    <div className="text-xs text-muted-foreground">Supplier: {p.suppliers?.name ?? p.supplier_id} • Status: {p.status}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {p.status !== "received" && <button onClick={() => handleReceive(p.id)} className="px-3 py-1 bg-green-600 text-white rounded">Receive</button>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <Modal open={showCreate} onOpenChange={setShowCreate} title="Create Purchase Order">
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Supplier</label>
                        <select value={poPayload.supplier_id} onChange={(e) => setPoPayload({ ...poPayload, supplier_id: e.target.value })} className="mt-1 w-full border rounded px-2 py-2">
                            <option value="">Select supplier</option>
                            {suppliers.map((s) => (
                                <option value={s.id} key={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Items</label>
                        <div className="space-y-2">
                            {(poPayload.items || []).map((it: any, idx: number) => (
                                <div className="grid grid-cols-3 gap-2" key={idx}>
                                    <ProductSelect products={products} value={it.product_id} onChange={(v: any) => updateItem(idx, "product_id", v)} />
                                    <input placeholder="quantity" type="number" value={it.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} className="border rounded px-2 py-2" />
                                    <input placeholder="unit price" type="number" value={it.unit_price} onChange={(e) => updateItem(idx, "unit_price", e.target.value)} className="border rounded px-2 py-2" />
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setPoPayload({ ...poPayload, items: [...(poPayload.items || []), { product_id: "", quantity: 1, unit_price: 0 }] })} className="px-2 py-1 border rounded">Add item</button>
                            </div>
                        </div>


                    </div>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowCreate(false)} className="px-3 py-2 border rounded">Cancel</button>
                        <button onClick={handleCreate} disabled={creating} className="px-3 py-2 bg-primary text-white rounded">{creating ? "Creating..." : "Create"}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
