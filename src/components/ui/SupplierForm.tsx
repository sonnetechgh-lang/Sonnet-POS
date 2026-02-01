"use client";

import { useState } from "react";

export default function SupplierForm({ initial = {}, onSubmit, onCancel }: any) {
    const [name, setName] = useState(initial.name || "");
    const [contactPerson, setContactPerson] = useState(initial.contact_person || "");
    const [phone, setPhone] = useState(initial.phone || "");
    const [email, setEmail] = useState(initial.email || "");
    const [address, setAddress] = useState(initial.address || "");
    const [loading, setLoading] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ name, contact_person: contactPerson, phone, email, address });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div>
                <label className="block text-sm font-medium">Supplier name</label>
                <input className="mt-1 w-full border rounded px-2 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label className="block text-sm font-medium">Contact person</label>
                <input className="mt-1 w-full border rounded px-2 py-2" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input className="mt-1 w-full border rounded px-2 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input className="mt-1 w-full border rounded px-2 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea rows={2} className="mt-1 w-full border rounded px-2 py-2" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded">
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
}
