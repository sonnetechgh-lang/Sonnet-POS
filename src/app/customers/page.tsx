"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Toast, useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { getCustomers, createCustomer } from "@/lib/services/customers";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Mail,
    Phone,
    MapPin,
    Star,
    Loader2,
    MoreVertical,
    History
} from "lucide-react";
import { motion } from "framer-motion";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast, showToast, hideToast } = useToast();

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await getCustomers();
            setCustomers(data || []);
        } catch (err: any) {
            showToast("Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex bg-background-app min-h-screen text-text-primary">
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header title="Customer Relationship Management" />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
                    {/* Action Bar */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div>
                            <h3 className="text-xl font-black text-primary tracking-tight">Community Directory</h3>
                            <p className="text-xs text-text-secondary font-medium uppercase tracking-widest mt-1">Manage your regulars and loyalty programs.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white hover:bg-secondary-dark rounded-2xl font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/20"
                        >
                            <UserPlus size={18} />
                            Register New Customer
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <CRMStat label="Total Customers" value={customers.length.toString()} icon={<Users size={20} />} color="blue" />
                        <CRMStat label="Active Members" value={customers.length.toString()} icon={<Star size={20} />} color="amber" />
                        <CRMStat label="Avg. Visits" value="4.2" icon={<History size={20} />} color="teal" />
                        <CRMStat label="Loyalty Points" value={customers.reduce((s, c) => s + (c.loyalty_points || 0), 0).toString()} icon={<Star size={20} />} color="indigo" />
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-[32px] p-4 border border-border flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-secondary" size={18} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search by name, phone or email..."
                                className="w-full pl-12 pr-4 py-3 bg-background-app/50 border border-border rounded-xl text-sm focus:ring-4 focus:ring-secondary/5 focus:border-secondary transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-3 border border-border text-primary font-bold rounded-xl hover:bg-gray-50 transition-all">
                            <Filter size={18} />
                            Advanced Filters
                        </button>
                    </div>

                    {/* List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-50 rounded-[32px] h-64 animate-pulse" />)
                        ) : filteredCustomers.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-text-disabled uppercase font-black text-xs">No records found matching your search.</div>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <CustomerCard key={customer.id} customer={customer} />
                            ))
                        )}
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Customer">
                    <CustomerForm onSuccess={() => { setIsModalOpen(false); loadCustomers(); showToast("Customer registered!", "success"); }} />
                </Modal>

                {toast && <Toast message={toast.message} type={toast.type} isVisible={!!toast} onClose={hideToast} />}
            </main>
        </div>
    );
}

function CRMStat({ label, value, icon, color }: any) {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600",
        amber: "bg-amber-50 text-warning",
        teal: "bg-teal-50 text-secondary",
        indigo: "bg-indigo-50 text-indigo-600"
    };
    return (
        <div className="bg-white p-6 rounded-[32px] border border-border shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-primary mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function CustomerCard({ customer }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[32px] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-[100px] -translate-y-8 translate-x-8"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-background-app text-primary rounded-2xl flex items-center justify-center font-black text-xl border border-border shadow-inner">
                    {customer.full_name?.charAt(0)}
                </div>
                <button className="p-2 text-text-disabled hover:text-primary transition-all"><MoreVertical size={18} /></button>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-black text-primary tracking-tight leading-none mb-1">{customer.full_name}</h4>
                    <span className="text-[10px] font-black uppercase text-secondary tracking-widest bg-secondary/10 px-2 py-0.5 rounded-full">Classic Member</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                        <Phone size={14} className="text-text-disabled" />
                        {customer.phone || 'No phone'}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                        <Mail size={14} className="text-text-disabled" />
                        <span className="truncate">{customer.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
                        <MapPin size={14} className="text-text-disabled" />
                        <span className="truncate">{customer.address || 'No address'}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Loyalty Points</p>
                        <div className="flex items-center gap-1 text-warning font-black">
                            <Star size={14} fill="currentColor" />
                            {customer.loyalty_points || 0}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Spent</p>
                        <p className="font-black text-primary">₵{(customer.total_spent || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function CustomerForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        address: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCustomer(formData);
            onSuccess();
        } catch (err: any) {
            alert("Failed to register customer: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">Full Name</label>
                <input required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} type="text" placeholder="e.g. Ama Ghana" className="crm-input" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">Phone Number</label>
                    <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="text" placeholder="024 XXX XXXX" className="crm-input" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">Email Address</label>
                    <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="ama@email.com" className="crm-input" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary ml-1">Physical Address</label>
                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="e.g. Accra Central" className="crm-input min-h-[100px] resize-none py-4" />
            </div>

            <button disabled={loading} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                {loading ? "Registering..." : "Complete Registration"}
            </button>

            <style jsx>{`
         .crm-input {
           width: 100%;
           padding: 1rem 1.25rem;
           background-color: #F9FAFB;
           border: 1px solid #E0E6ED;
           border-radius: 18px;
           font-size: 0.875rem;
           transition: all 0.2s;
           font-weight: 600;
         }
         .crm-input:focus {
           outline: none;
           box-shadow: 0 0 0 4px rgba(11, 22, 102, 0.05);
           border-color: #0B1666;
           background-color: white;
         }
       `}</style>
        </form>
    );
}
