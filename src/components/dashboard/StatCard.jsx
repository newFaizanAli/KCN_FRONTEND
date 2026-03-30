
// StatCard
const StatCard = ({ label, value, change, up, color }) => {
    const c = {
        cyan: { ring: "ring-cyan-500/20", text: "text-cyan-400", bg: "bg-cyan-500/10" },
        violet: { ring: "ring-violet-500/20", text: "text-violet-400", bg: "bg-violet-500/10" },
        emerald: { ring: "ring-emerald-500/20", text: "text-emerald-400", bg: "bg-emerald-500/10" },
        amber: { ring: "ring-amber-500/20", text: "text-amber-400", bg: "bg-amber-500/10" },
    }[color];
    return (
        <Card className={`p-5 ring-1 ${c.ring} hover:border-slate-600/60 transition-all fade-in`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs uppercase tracking-widest">{label}</span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}><Ic size={14} /></div>
            </div>
            <div className="text-2xl font-bold text-white mono">{value}</div>
            <div className={`flex items-center gap-1 mt-1 text-xs mono ${up ? "text-emerald-400" : "text-red-400"}`}>
                {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{change} vs last month
            </div>
        </Card>
    );
};

export default StatCard;