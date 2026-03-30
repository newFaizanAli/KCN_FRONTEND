import { Pencil, Trash2 } from "lucide-react";

// DataTable
const DataTable = ({ columns, data, onEdit, onDelete, rowKey = "id" }: {
    columns?: { key: string, label: string, render?: (value: any, row: any) => React.ReactNode }[],
    data?: any[],
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void,
    rowKey?: string
}) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-slate-700/50">
                    {columns?.map(col => (
                        <th key={col.key} className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider font-medium whitespace-nowrap">{col.label}</th>
                    ))}
                    {(onEdit || onDelete) && <th className="px-4 py-3 text-slate-500 text-xs uppercase text-right">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data?.map((row, i) => (
                    <tr key={row[rowKey] ?? i} className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                        {columns?.map(col => (
                            <td key={col.key} className="px-4 py-3 text-slate-300 whitespace-nowrap">
                                {col.render ? col.render(row[col.key], row) : row[col.key]}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    {onEdit && <button onClick={() => onEdit(row)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"><Pencil size={12} /></button>}
                                    {onDelete && <button onClick={() => onDelete(row)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={12} /></button>}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                {data?.length === 0 && <tr><td colSpan={99} className="py-12 text-center text-slate-600 text-sm">No records found</td></tr>}
            </tbody>
        </table>
    </div>
);

export default DataTable;