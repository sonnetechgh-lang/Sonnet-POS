"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toast, useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { getProducts } from "@/lib/services/inventory";
import { createSale } from "@/lib/services/sales";
import { getCustomers } from "@/lib/services/customers";
import {
    ShoppingCart,
    Search,
    Filter,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Smartphone,
    Receipt,
    ChevronRight,
    Loader2,
    Package,
    CheckCircle2,
    Printer,
    X,
    Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function POSPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [lastSale, setLastSale] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [pData, cData] = await Promise.all([getProducts(), getCustomers()]);
                setProducts(pData || []);
                setCustomers(cData || []);
            } catch (err: any) {
                showToast("Data load failed.", "info");
            } finally {
                setLoading(false);
            }
        }
        loadData();
        if (searchInputRef.current) searchInputRef.current.focus();
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "F1") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === "F2") {
                e.preventDefault();
                if (cart.length > 0) handleCheckout();
            }
            if (e.key === "Escape") {
                setCart([]);
                setSelectedCustomer(null);
                setDiscountValue(0);
            }
        };
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [cart, selectedCustomer, discountValue]);

    // Barcode / Search Logic
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);

        // Check if the input matches a SKU exactly (simulation of barcode scan)
        const matchedProduct = products.find(p => p.sku === val);
        if (matchedProduct) {
            addToCart(matchedProduct);
            setSearchQuery(""); // Clear for next scan
        }
    };

    const addToCart = (product: any) => {
        if (product.stock_quantity <= 0) {
            showToast(`${product.name} is out of stock!`, "error");
            return;
        }
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock_quantity) {
                    showToast(`Only ${product.stock_quantity} in stock.`, "info");
                    return prev;
                }
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
    const adjustQuantity = (item: any, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === item.id) {
                const newQty = Math.max(1, p.quantity + delta);
                if (newQty > item.stock_quantity) return p;
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.05;
    const total = taxableAmount + tax;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setCheckoutLoading(true);
        try {
            const sale = {
                total_amount: total,
                subtotal: subtotal,
                tax_amount: tax,
                discount_amount: discountAmount,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id || null,
                status: 'completed'
            };
            const result = await createSale(sale, cart);
            setLastSale(result);
            setIsSuccessModalOpen(true);
            setCart([]);
            setSelectedCustomer(null);
            setDiscountValue(0);
            const freshProducts = await getProducts();
            setProducts(freshProducts || []);
        } catch (err: any) {
            showToast("Checkout failed", "error");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary overflow-hidden h-screen print:bg-white">
            <div className="print:hidden h-full flex w-full">
                <Sidebar />

                <main className="flex-1 flex flex-col min-w-0">
                    <div className="flex flex-1 overflow-hidden">

                        {/* Product Grid */}
                        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
                            <header className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black text-primary tracking-tight">Terminal 01</h2>
                                    <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Speed Mode Active</p>
                                </div>
                                <div className="relative w-96 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary transition-colors" size={20} />
                                    <input
                                        ref={searchInputRef}
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        type="text"
                                        placeholder="Search name or scan barcode..."
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                                    />
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {loading ? (
                                    Array(8).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-[28px] animate-pulse h-48" />)
                                ) : (
                                    filteredProducts.map(product => (
                                        <POSProductCard key={product.id} product={product} onClick={() => addToCart(product)} />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="w-[420px] bg-white border-l border-border flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-primary text-white"><ShoppingCart size={20} /></div><h3 className="text-xl font-black text-primary">Cart</h3></div>
                                <span className="text-xs font-black px-3 py-1 bg-secondary text-white rounded-full">{cart.length}</span>
                            </div>

                            {/* Customer & Discount Controls */}
                            <div className="px-6 py-4 bg-background-app/50 border-b border-border space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative group">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={16} />
                                        <select
                                            value={selectedCustomer?.id || ""}
                                            onChange={(e) => {
                                                const cust = customers.find(c => c.id === e.target.value);
                                                setSelectedCustomer(cust || null);
                                            }}
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-xs font-bold focus:ring-4 focus:ring-secondary/5 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Walk-in Customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.full_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setDiscountValue(prev => prev === 0 ? 5 : 0)}
                                        className={`p-2 rounded-xl border transition-all ${discountValue > 0 ? 'bg-secondary text-white border-secondary' : 'bg-white text-text-secondary border-border'}`}
                                        title="Quick 5% Discount"
                                    >
                                        <div className="text-[10px] font-black leading-none">%</div>
                                    </button>
                                </div>
                                {discountValue > 0 && (
                                    <div className="flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
                                        <div className="flex-1 flex bg-white border border-border rounded-xl overflow-hidden shadow-inner">
                                            <button
                                                onClick={() => setDiscountType("flat")}
                                                className={`px-3 py-1.5 text-[10px] font-black uppercase ${discountType === 'flat' ? 'bg-primary text-white' : 'text-text-disabled hover:bg-gray-50'}`}
                                            >
                                                Flat (₵)
                                            </button>
                                            <button
                                                onClick={() => setDiscountType("percent")}
                                                className={`px-3 py-1.5 text-[10px] font-black uppercase ${discountType === 'percent' ? 'bg-primary text-white' : 'text-text-disabled hover:bg-gray-50'}`}
                                            >
                                                Percent (%)
                                            </button>
                                            <input
                                                type="number"
                                                value={discountValue}
                                                onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                                                className="flex-1 px-3 py-1.5 text-right font-black text-xs text-primary focus:outline-none"
                                            />
                                        </div>
                                        <button onClick={() => setDiscountValue(0)} className="p-2 text-text-disabled hover:text-error transition-all"><X size={14} /></button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {cart.map((item) => (
                                        <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-2xl bg-background-app hover:bg-white border border-transparent hover:border-border transition-all shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-sm font-black text-primary truncate max-w-[200px]">{item.name}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-text-disabled hover:text-error transition-all"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-1 bg-white border border-border rounded-xl p-1 shadow-inner">
                                                    <button onClick={() => adjustQuantity(item, -1)} className="p-1.5 hover:bg-background-app rounded-lg"><Minus size={14} /></button>
                                                    <span className="w-10 text-center font-black text-xs">{item.quantity}</span>
                                                    <button onClick={() => adjustQuantity(item, 1)} className="p-1.5 hover:bg-background-app rounded-lg"><Plus size={14} /></button>
                                                </div>
                                                <span className="font-black text-primary">₵{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="p-8 bg-gray-50 border-t border-border space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-black text-text-secondary"><span>Subtotal</span><span>₵{subtotal.toFixed(2)}</span></div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-sm font-black text-accent mt-1">
                                            <span className="flex items-center gap-1 italic opacity-80">Discount {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
                                            <span>-₵{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-black text-text-secondary"><span>VAT (5%)</span><span>₵{tax.toFixed(2)}</span></div>
                                    <div className="pt-3 border-t border-border flex justify-between items-end">
                                        <span className="text-sm font-black text-text-secondary uppercase">Total Payable</span>
                                        <span className="text-3xl font-black text-primary tracking-tight font-mono leading-none">₵{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <PaymentCard icon={<Banknote />} label="Cash" active={paymentMethod === 'cash'} onClick={() => setPaymentMethod('cash')} />
                                    <PaymentCard icon={<Smartphone />} label="MoMo" active={paymentMethod === 'momo'} onClick={() => setPaymentMethod('momo')} />
                                    <PaymentCard icon={<CreditCard />} label="Card" active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} />
                                </div>
                                <button onClick={handleCheckout} disabled={checkoutLoading || cart.length === 0} className="w-full py-5 bg-secondary hover:bg-secondary-dark text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50">
                                    {checkoutLoading ? <Loader2 className="animate-spin" /> : <Receipt size={22} />}
                                    {checkoutLoading ? "Processing..." : "Complete Checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* SUCCESS MODAL & RECEIPT PREVIEW */}
            <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title="Transaction Complete">
                <div className="text-center py-6 space-y-6">
                    <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto animate-bounce"><CheckCircle2 size={48} /></div>
                    <div><h4 className="text-3xl font-black text-primary uppercase">Paid In Full</h4><p className="text-text-secondary font-medium italic">Amount Received: ₵{total.toFixed(2)}</p></div>
                    <div className="flex gap-4">
                        <button onClick={handlePrint} className="flex-1 py-4 bg-background-app border border-border text-primary font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100">
                            <Printer size={20} /> Print Receipt
                        </button>
                        <button onClick={() => setIsSuccessModalOpen(false)} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl">New Sale</button>
                    </div>
                </div>
            </Modal>

            {/* PROFESSIONAL THERMAL RECEIPT */}
            <div className="hidden print:block fixed inset-0 bg-white p-6 font-mono text-[11px] leading-tight text-black max-w-[80mm] mx-auto animate-in fade-in duration-500">
                <div className="text-center mb-6">
                    <h1 className="text-lg font-black tracking-tighter uppercase mb-1">SONNET POS</h1>
                    <p className="font-bold opacity-80">PHARMACY & WELLNESS CENTER</p>
                    <p>Accra Mall, GZ-012, Ghana</p>
                    <p>Tel: +233 (0) 555 987 654</p>
                    <div className="border-t border-dashed my-3 border-black/30"></div>
                    <div className="flex justify-between px-2">
                        <span>SALE #: {lastSale?.id?.slice(0, 8).toUpperCase() || "---"}</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-1.5 mb-6 px-1">
                    <div className="flex justify-between font-black border-b border-black pb-1 mb-2">
                        <span className="flex-1">DESCRIPTION</span>
                        <span className="w-8 text-center px-1">QTY</span>
                        <span className="w-20 text-right">TOTAL</span>
                    </div>
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-start gap-2">
                            <span className="flex-1 uppercase font-bold">{item.name}</span>
                            <span className="w-8 text-center">x{item.quantity}</span>
                            <span className="w-20 text-right">{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 border-t border-dashed pt-3 border-black/30 px-1">
                    <div className="flex justify-between"><span>SUBTOTAL</span><span>{subtotal.toFixed(2)}</span></div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between italic"><span>DISCOUNT</span><span>-{discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between"><span>VAT (5%)</span><span>{tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-base font-black pt-2 mt-1 border-t border-black">
                        <span>TOTAL GHS</span>
                        <span>{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-black/20 text-center space-y-2">
                    {selectedCustomer && (
                        <div className="border border-black/10 py-2 rounded mb-2">
                            <p className="font-black">CUSTOMER: {selectedCustomer.full_name}</p>
                            <p className="text-[9px]">LOYALTY PIN: {selectedCustomer.phone?.slice(-4)}</p>
                        </div>
                    )}
                    <p className="font-black uppercase tracking-widest bg-black text-white py-1">Paid via {paymentMethod?.toUpperCase()}</p>
                    <p className="mt-4 font-bold text-xs">*** THANK YOU ***</p>
                    <p className="text-[8px] opacity-40">VAT Registered: GH-123456789-A</p>
                    <p className="text-[8px] opacity-40">System: SONNET CLOUD V1.0</p>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={hideToast} />}
        </div>
    );
}

function POSProductCard({ product, onClick }: any) {
    const isOutOfStock = product.stock_quantity <= 0;
    return (
        <button onClick={onClick} disabled={isOutOfStock} className="bg-white p-4 rounded-[28px] border border-border hover:border-secondary transition-all text-left flex flex-col group disabled:opacity-50 active:scale-95">
            <div className={`w-full aspect-square rounded-2xl mb-4 flex items-center justify-center ${isOutOfStock ? 'bg-red-50 text-error' : 'bg-background-app text-text-disabled group-hover:bg-secondary group-hover:text-white transition-all'}`}>
                <Plus size={32} />
            </div>
            <div className="flex-1"><h4 className="text-sm font-black text-primary line-clamp-2 h-10 leading-tight">{product.name}</h4><div className="mt-2 flex justify-between items-end"><div><p className={`text-[10px] font-bold uppercase ${isOutOfStock ? 'text-error' : 'text-text-secondary'}`}>Stock: {product.stock_quantity}</p><p className="text-base font-black text-primary">₵{product.price.toFixed(2)}</p></div><div className="w-8 h-8 rounded-xl bg-secondary/10 group-hover:bg-secondary text-secondary group-hover:text-white flex items-center justify-center transition-all"><Plus size={18} /></div></div></div>
        </button>
    );
}

function PaymentCard({ icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${active ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-border text-text-secondary hover:border-secondary'}`}>{icon}<span className="text-[10px] font-black uppercase">{label}</span></button>
    );
}
