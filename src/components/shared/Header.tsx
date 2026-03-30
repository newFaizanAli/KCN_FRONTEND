import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Search } from "lucide-react";
import { useAuthStore } from "../../store";
import { NAV_TREE } from "../../constants";
import { ROUTES_PATHS } from "../../routes/routes_path";


const Header = ({ activePage, notifOpen, setNotifOpen }: {
    activePage: string;
    notifOpen: boolean;
    setNotifOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const navigate = useNavigate();
    const { signOut } = useAuthStore();

    const title = NAV_TREE.flatMap(g => g.children).find(c => c.id === activePage)?.label || "Dashboard";

    const handleSignOut = () => {
        signOut();
        navigate(ROUTES_PATHS.AUTH.SIGNIN);
    }

    return (
        <header className="h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800/70 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2.5">
                <div className="text-white font-semibold text-sm">{title}</div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="text-slate-600 text-xs mono">ElectroCore</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 w-44">
                    <Search size={11} className="text-slate-600" />
                    <input placeholder="Search…" className="bg-transparent text-xs text-slate-300 placeholder-slate-700 outline-none flex-1 w-full" />
                </div>
                {/* Notif */}
                <div className="relative">
                    <button onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen); }}
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors relative">
                        <Bell size={13} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full pulse-dot" />
                    </button>
                    {notifOpen && (
                        <div className="absolute right-0 top-10 w-64 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl z-50 fade-in overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-slate-700/50 flex items-center justify-between">
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Notifications</span>
                                <span className="text-xs text-cyan-400 cursor-pointer">Mark all read</span>
                            </div>
                            {[
                                { msg: "New order #ORD-8821 received", time: "2m ago", dot: "bg-cyan-400" },
                                { msg: "Low stock: RTX 4090 (23 left)", time: "1h ago", dot: "bg-amber-400" },
                                { msg: "Payment failed: #ORD-8815", time: "3h ago", dot: "bg-red-400" },
                            ].map((n, i) => (
                                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 border-b border-slate-700/20 last:border-0 cursor-pointer">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                                    <div><div className="text-slate-200 text-xs">{n.msg}</div><div className="text-slate-600 text-xs mt-0.5 mono">{n.time}</div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Sign out */}
                <button onClick={() => handleSignOut()} title="Sign out"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors">
                    <LogOut size={13} />
                </button>
            </div>
        </header>
    );
}

export default Header;