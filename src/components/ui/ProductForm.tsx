"use client";

import { useState, useEffect } from "react";
import { Package, Barcode, DollarSign, Layers, Image as ImageIcon, Plus, Info, Loader2 } from "lucide-react";
import { createProduct, updateProduct, getCategories } from "@/lib/services/inventory";

interface ProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: any; // If provided, we are in EDIT mode
}

export function ProductForm({ onSuccess, onCancel, initialData }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        sku: initialData?.sku || "",
        category_id: initialData?.category_id || "",
        price: initialData?.price?.toString() || "",
        cost_price: initialData?.cost_price?.toString() || "",
        stock_quantity: initialData?.stock_quantity?.toString() || "",
        low_stock_threshold: initialData?.low_stock_threshold?.toString() || "5",
    });

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        }
        loadCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.name || !formData.price) {
                alert("Please fill in required fields (Name and Price)");
                setLoading(false);
                return;
            }

            const payload = {
                name: formData.name,
                sku: formData.sku || null,
                category_id: formData.category_id || null,
                price: parseFloat(formData.price),
                cost_price: parseFloat(formData.cost_price) || 0,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
            };

            if (initialData?.id) {
                await updateProduct(initialData.id, payload);
            } else {
                await createProduct(payload);
            }

            onSuccess();
        } catch (err: any) {
            console.error("Error saving product:", err);
            alert(err.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="space-y-4">
                <header className="flex items-center gap-2 text-secondary">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Basic Information</h4>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-bold text-text-primary ml-1">Product Name *</label>
                        <div className="relative group">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                required
                                placeholder="e.g., Cerave Facial Cleanser"
                                className="w-full pl-12 pr-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-primary ml-1">SKU / Barcode</label>
                        <div className="relative group">
                            <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                            <input
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g., CER-001"
                                className="w-full pl-12 pr-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-primary ml-1">Category</label>
                    <div className="relative group">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select a category...</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <header className="flex items-center gap-2 text-secondary">
                    <DollarSign size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Pricing & Stock</h4>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-primary ml-1">Selling Price (GHS) *</label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-primary ml-1">Cost Price (GHS)</label>
                        <input
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-primary ml-1">Stock Quantity</label>
                        <input
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            type="number"
                            placeholder="0"
                            className="w-full px-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-primary ml-1">Low Stock Warning At</label>
                        <input
                            name="low_stock_threshold"
                            value={formData.low_stock_threshold}
                            onChange={handleChange}
                            type="number"
                            className="w-full px-4 py-3 bg-background-app/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                        />
                    </div>
                </div>
            </section>

            <div className="pt-4 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 px-6 border border-border rounded-2xl font-bold text-text-secondary hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-4 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-2xl font-black shadow-xl shadow-secondary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    {loading ? "Saving..." : (initialData ? "Update Product" : "Save Product")}
                </button>
            </div>
        </form>
    );
}
