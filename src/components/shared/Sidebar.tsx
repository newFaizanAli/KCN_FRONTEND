import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store";
import { ChevronDown, ChevronLeft, ChevronRight, Lock, Zap } from "lucide-react";
import { NAV_TREE } from "../../constants/index"
import { canAccess } from "../../utilities/allowed_access";
import { Badge } from "../ui";


interface SidebarProps {
  active: string,
  collapsed: boolean,
  setActive: React.Dispatch<React.SetStateAction<string>>,
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

interface SidebarItemProps {
  [key: string]: boolean;
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: SidebarProps) {

  const { current_user } = useAuthStore();

  const [open, setOpen] = useState<SidebarItemProps>({ overview: true, catalog: true, commerce: true, system: true });

  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }));

  return (
    <aside className={`h-screen bg-slate-950 border-r border-slate-800/70 flex flex-col transition-all duration-300 shrink-0 ${collapsed ? "w-14" : "w-56"}`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "px-4 gap-2.5"} h-14 border-b border-slate-800/70 shrink-0`}>
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && <span className="text-white font-bold text-sm tracking-widest mono">ELECTRO<span className="text-cyan-400">CORE</span></span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_TREE.filter(g => canAccess(g.allowed, current_user?.role || '')).map(group => {
          const kids = group.children.filter(c => canAccess(c.allowed, current_user?.role || ''));
          if (!kids.length) return null;
          const isOpen = open[group.id];
          return (
            <div key={group.id} className="mb-1">
              {/* Group header */}
              {!collapsed && (
                <button onClick={() => toggle(group.id)}
                  className="w-full flex items-center justify-between px-4 py-1.5 text-slate-600 hover:text-slate-400 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <group.icon size={10} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{group.label}</span>
                  </div>
                  {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                </button>
              )}
              {/* Items */}
              {(isOpen || collapsed) && kids.map(item => {
                const isActive = active === item.id;
                const locked = !canAccess(item.allowed, current_user?.role || '');


                return (
                  <NavLink to={item.route || ""} key={item.id} onClick={() => !locked && setActive(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center ${collapsed ? "justify-center" : "px-4 gap-2.5"} py-2 text-sm transition-all
                      ${isActive ? "text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-400"
                        : locked ? "text-slate-700 cursor-not-allowed"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}>
                    <item.icon size={15} />
                    {!collapsed && <span className="flex-1 text-left text-sm">{item.label}</span>}
                    {!collapsed && locked && <Lock size={9} className="text-slate-700" />}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-slate-800/70 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-3">
            {/* <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{current_user?.avatar}</div> */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{current_user?.name}</div>
              <Badge variant={current_user?.role === "admin" ? "admin" : "sub_admin"} size="xs">{current_user?.role}</Badge>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "px-4 gap-2"} py-2.5 text-slate-600 hover:text-slate-400 transition-colors text-xs`}>
          {collapsed ? <ChevronRight size={13} /> : <><ChevronLeft size={12} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar