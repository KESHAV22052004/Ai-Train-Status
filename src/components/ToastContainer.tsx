"use client";

import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { Toast } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const toastStyles: Record<
  Toast["type"],
  { bg: string; border: string; icon: React.FC<{ size?: number; className?: string }> }
> = {
  success: {
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/20",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/20",
    icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/20",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-500/[0.08]",
    border: "border-blue-500/20",
    icon: Info,
  },
};

const iconColors: Record<Toast["type"], string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-xl
              backdrop-blur-xl border shadow-2xl
              animate-in
              ${style.bg} ${style.border}
            `}
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">
                {toast.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 p-0.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
