import { Bell, Search, User } from "lucide-react";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-black/[0.02]">
            <div>
                <h2 className="text-xl font-bold text-primary tracking-tight">{title}</h2>
                <p className="text-xs text-text-secondary mt-0.5">Welcome back, here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex relative items-center group">
                    <Search className="absolute left-3 text-text-disabled group-focus-within:text-secondary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="pl-10 pr-4 py-2 bg-background-app/50 border border-border rounded-xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-background-app text-text-secondary hover:text-primary hover:bg-gray-100 transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-border mx-2"></div>

                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-105">
                            AD
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-primary leading-none">Admin</p>
                            <p className="text-[10px] text-text-secondary font-medium mt-1">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
