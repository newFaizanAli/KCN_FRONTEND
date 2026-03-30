import { AlertCircle, LucideIcon } from "lucide-react";
import { FieldValues, RegisterOptions, UseFormRegister } from "react-hook-form";

type FormTextareaProps<T extends FieldValues> = {
    label: string;
    error?: string;
    rows?: number;
    name: keyof T;
    icon?: LucideIcon;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>; // to allow extra props

const FormTextarea = <T extends FieldValues>({
    label,
    error,
    rows = 3,
    icon: Ic,
    register,
    name,
    rules,
    ...rest
}: FormTextareaProps<T>) => (
    <div className="space-y-1.5">
        {label && <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>}
        <div className="relative">
            {Ic && <Ic size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
            <textarea
                rows={rows}
                {...(register ? register(name as any, rules) : {})} // optional "as any" cast for TS
                {...rest}
                className={`w-full bg-slate-800/80 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all resize-none focus:border-cyan-500/60 ${error ? "border-red-500/50" : "border-slate-700/50"}`}
            />
            {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} /> {error}
                </p>
            )}
        </div>

    </div>
);

export default FormTextarea;