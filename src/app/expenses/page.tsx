"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toast, useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { getExpenses, createExpense } from "@/lib/services/analytics";
import {
    DollarSign,
    Plus,
    Receipt,
    Search,
    Filter,
    ArrowDownCircle,
    Calendar,
    Tag,
    Loader2,
    Trash2,
    Truck
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const loadExpenses = async () => {
        setLoading(true);
        try {
            const data = await getExpenses();
            setExpenses(data || []);
        } catch (err: any) {
            showToast("Failed to load expenses", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title="Expense Tracking" />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
                    {/* Action Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div>
                            <h3 className="text-xl font-black text-primary">Manage Costs</h3>
                            <p className="text-xs text-text-secondary font-medium">Keep track of your shop's overheads and bills.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-error/10 text-error hover:bg-error/20 border border-error/20 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus size={18} />
                            Record New Expense
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Monthly Burn</p>
                            <p className="text-2xl font-black text-primary mt-1">₵{totalExpense.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Transactions</p>
                            <p className="text-2xl font-black text-primary mt-1">{expenses.length}</p>
                        </div>
                        <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/10 text-white">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Financial Impact</p>
                            <p className="text-sm font-bold mt-1 opacity-70">Expenses represent {Math.min(100, (totalExpense / 1000) * 100).toFixed(1)}% of typical revenue</p>
                        </div>
                    </div>

                    {/* Expense List */}
                    <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden min-h-[400px]">
                        <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-gray-50/30">
                            <div className="relative group w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-error transition-colors" size={18} />
                                <input type="text" placeholder="Search expenses..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:ring-4 focus:ring-error/5 focus:border-error/30 transition-all" />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all border border-border bg-white"><Filter size={18} /></button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-background-app/50 text-[10px] uppercase font-black tracking-wider text-text-secondary border-b border-border">
                                        <th className="px-6 py-4">Expense Details</th>
                                        <th className="px-6 py-4">Vendor</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-error" /></td></tr>
                                    ) : expenses.length === 0 ? (
                                        <tr><td colSpan={5} className="py-20 text-center text-text-disabled font-bold uppercase text-xs">No expenses recorded.</td></tr>
                                    ) : (
                                        expenses.map((expense) => (
                                            <tr key={expense.id} className="hover:bg-error/[0.01] group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-red-50 text-error rounded-xl"><DollarSign size={18} /></div>
                                                        <span className="text-sm font-black text-primary">{expense.description || 'General Expense'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Truck size={14} className="text-text-disabled" />
                                                        <span className="text-xs font-bold text-text-secondary">{expense.vendor || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black uppercase px-3 py-1.5 bg-background-app rounded-xl border border-border">{expense.category}</span>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-bold text-text-secondary italic">{new Date(expense.expense_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-5 text-right font-black text-error italic">₵{expense.amount.toFixed(2)}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2 text-text-disabled hover:text-error rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Add Expense Modal */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Business Expense">
                    <ExpenseForm onSuccess={() => { setIsModalOpen(false); loadExpenses(); showToast("Expense recorded", "success"); }} />
                </Modal>

                {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={hideToast} />}
            </main>
        </div>
    );
}

function ExpenseForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        vendor: "",
        category: "Rent",
        expense_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createExpense({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onSuccess();
        } catch (err) {
            alert("Failed to save expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Reason / Description</label>
                    <div className="relative group">
                        <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-error" size={18} />
                        <input required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} type="text" placeholder="e.g. Shop Rent" className="expense-input pl-12" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Vendor / Supplier</label>
                    <div className="relative group">
                        <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-error" size={18} />
                        <input value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} type="text" placeholder="e.g. ECG" className="expense-input pl-12" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Amount (GHS)</label>
                    <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-error" size={18} />
                        <input required step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} type="number" placeholder="0.00" className="expense-input pl-12 font-black text-error" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Category</label>
                    <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="expense-input pl-12 appearance-none">
                            <option>Rent</option>
                            <option>Utilities</option>
                            <option>Restocking</option>
                            <option>Staff Salary</option>
                            <option>Marketing</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary ml-1">Expense Date</label>
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                    <input required value={formData.expense_date} onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })} type="date" className="expense-input pl-12" />
                </div>
            </div>

            <button disabled={loading} className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                {loading ? "Recording..." : "Save Expense Information"}
            </button>

            <style jsx>{`
         .expense-input {
           width: 100%;
           padding: 1rem;
           background-color: #F9FAFB;
           border: 1px solid #E0E6ED;
           border-radius: 20px;
           font-size: 0.875rem;
           transition: all 0.2s;
         }
         .expense-input:focus {
           outline: none;
           box-shadow: 0 0 0 4px rgba(198, 40, 40, 0.05);
           border-color: #C62828;
           background-color: white;
         }
       `}</style>
        </form>
    );
}
