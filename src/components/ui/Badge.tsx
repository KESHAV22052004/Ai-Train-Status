import type { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  danger:
    "bg-red-500/15 text-red-400 border-red-500/25",
  warning:
    "bg-amber-500/15 text-amber-400 border-amber-500/25",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  neutral:
    "bg-slate-500/15 text-slate-400 border-slate-500/25",
};

export default function Badge({
  variant = "neutral",
  children,
  pulse = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold border
        transition-colors duration-200
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "success"
                ? "bg-emerald-400"
                : variant === "danger"
                ? "bg-red-400"
                : variant === "warning"
                ? "bg-amber-400"
                : variant === "info"
                ? "bg-blue-400"
                : "bg-slate-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "success"
                ? "bg-emerald-500"
                : variant === "danger"
                ? "bg-red-500"
                : variant === "warning"
                ? "bg-amber-500"
                : variant === "info"
                ? "bg-blue-500"
                : "bg-slate-500"
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
