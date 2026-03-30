import { Lock } from "lucide-react";
import { Badge } from "../../components/ui";


const AccessDenied = () => (
    <div className="flex items-center justify-center h-screen py-24 px-6 fade-in bg-slate-900">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4"><Lock size={24} className="text-red-400" /></div>
        <h2 className="text-white font-bold mono mb-1">Access Restricted</h2>
        <p className="text-slate-500 text-sm text-center max-w-xs mb-3">You don't have permission to view this page.</p>
        <Badge variant="danger" size="md">admin only</Badge>
    </div>
);

export default AccessDenied;
