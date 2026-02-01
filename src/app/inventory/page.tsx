"use client";

import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import { ProductForm } from "@/components/ui/ProductForm";
import { Toast, useToast } from "@/components/ui/Toast";
import { getProducts, deleteProduct } from "@/lib/services/inventory";
import { exportToCSV } from "@/lib/utils/export";
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    QrCode,
    Download,
    Edit2,
    Trash2,
    Loader2
} from "lucide-react";

export default function InventoryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const { toast, showToast, hideToast } = useToast();

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (err: any) {
            showToast(err.message || "Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            showToast("Product deleted successfully", "success");
            loadProducts();
        } catch (err: any) {
            showToast(err.message || "Failed to delete product", "error");
        }
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        showToast(selectedProduct ? "Product updated" : "Product created", "success");
        loadProducts();
    };

    const stats = {
        total: products.length,
        lowStock: products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length,
        outOfStock: products.filter(p => p.stock_quantity === 0).length,
        withSku: products.filter(p => p.sku).length,
    };

    const handleExport = () => {
        const exportData = filteredProducts.map(p => ({
            Name: p.name,
            SKU: p.sku || "N/A",
            Category: p.categories?.name || "Uncategorized",
            Price: p.price,
            Cost: p.cost_price,
            Stock: p.stock_quantity,
            Status: p.stock_quantity === 0 ? "Out of Stock" : (p.stock_quantity <= p.low_stock_threshold ? "Low Stock" : "In Stock")
        }));
        exportToCSV(exportData, "Sonnet_Inventory_Report");
    };

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pl-14 md:pl-0">
                <Header title="Inventory Management" />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 sm:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleExport}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 border border-border bg-white rounded-2xl text-text-secondary hover:text-primary hover:bg-gray-50 transition-all font-bold text-sm"
                            >
                                <Download size={18} />
                                Export CSV
                            </button>
                            <button
                                onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-2xl font-bold text-sm shadow-lg shadow-secondary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Plus size={18} />
                                Add Product
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InventoryStat icon={<Package />} label="Total Items" value={stats.total.toString()} color="blue" />
                        <InventoryStat icon={<AlertCircle />} label="Low Stock" value={stats.lowStock.toString()} color="amber" border />
                        <InventoryStat icon={<QrCode />} label="With SKU" value={`${Math.round((stats.withSku / (stats.total || 1)) * 100)}%`} color="teal" />
                        <InventoryStat icon={<Trash2 />} label="Out of Stock" value={stats.outOfStock.toString()} color="red" border />
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-border overflow-hidden min-h-[400px] flex flex-col">
                        <div className="overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full min-w-[640px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-background-app/50 text-[10px] uppercase tracking-wider text-text-secondary font-bold border-b border-border">
                                        <th className="px-3 sm:px-6 py-3 md:py-4 font-black">Product Details</th>
                                        <th className="px-3 sm:px-6 py-3 md:py-4 font-black">Category</th>
                                        <th className="px-3 sm:px-6 py-3 md:py-4 font-black">Price (GHS)</th>
                                        <th className="px-3 sm:px-6 py-3 md:py-4 font-black">Stock</th>
                                        <th className="px-3 sm:px-6 py-3 md:py-4 font-black text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border relative">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <Loader2 className="animate-spin text-secondary mx-auto" size={40} />
                                            </td>
                                        </tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-text-disabled font-bold uppercase text-xs">No products found.</td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <ProductRow
                                                key={product.id}
                                                product={product}
                                                onDelete={() => handleDelete(product.id)}
                                                onEdit={() => handleEdit(product)}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
                    title={selectedProduct ? "Update Product" : "Add New Inventory Item"}
                >
                    <ProductForm
                        initialData={selectedProduct}
                        onSuccess={handleSuccess}
                        onCancel={() => { setIsModalOpen(false); setSelectedProduct(null); }}
                    />
                </Modal>

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        isVisible={!!toast}
                        onClose={hideToast}
                    />
                )}
            </main>
        </div>
    );
}

function InventoryStat({ icon, label, value, color, border }: any) {
    const colorClasses: any = {
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-warning border-l-4 border-l-warning",
        teal: "bg-teal-50 text-secondary",
        red: "bg-red-50 text-error border-l-4 border-l-error"
    };

    return (
        <div className={`bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 ${border ? colorClasses[color] : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black text-primary">{value}</p>
            </div>
        </div>
    );
}

function ProductRow({ product, onDelete, onEdit }: any) {
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;
    const isOutOfStock = product.stock_quantity === 0;

    return (
        <tr className="group hover:bg-secondary/[0.02] transition-colors">
            <td className="px-3 sm:px-6 py-4 md:py-5">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl md:rounded-2xl bg-background-app flex items-center justify-center text-text-secondary border border-border flex-shrink-0">
                        <Package size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-xs sm:text-sm font-black text-primary truncate max-w-[140px] sm:max-w-none">{product.name}</p>
                        <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest">{product.sku || 'NO SKU'}</p>
                    </div>
                </div>
            </td>
            <td className="px-3 sm:px-6 py-4 md:py-5">
                <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/5 text-primary-light rounded-lg md:rounded-xl whitespace-nowrap">
                    {product.categories?.name || 'Uncategorized'}
                </span>
            </td>
            <td className="px-3 sm:px-6 py-4 md:py-5 font-black text-xs sm:text-sm text-primary whitespace-nowrap">₵{product.price.toFixed(2)}</td>
            <td className="px-3 sm:px-6 py-4 md:py-5">
                <div className="flex flex-col gap-1">
                    <span className={`text-xs sm:text-sm font-black ${isOutOfStock ? 'text-error' : isLowStock ? 'text-warning' : 'text-primary'}`}>
                        {product.stock_quantity} units
                    </span>
                    {(isLowStock || isOutOfStock) && (
                        <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${isOutOfStock ? 'text-error' : 'text-warning'}`}>
                            <AlertCircle size={12} /> {isOutOfStock ? 'Empty' : 'Low'}
                        </div>
                    )}
                </div>
            </td>
            <td className="px-3 sm:px-6 py-4 md:py-5 text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <button onClick={onEdit} className="p-2 text-text-secondary hover:text-secondary rounded-xl transition-all"><Edit2 size={18} /></button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-text-secondary hover:text-error rounded-xl transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
