import GlassCard from "./ui/GlassCard";
import Badge from "./ui/Badge";
import { smartAlerts } from "@/lib/data";
import type { SmartAlert } from "@/lib/types";
import {
  Clock,
  CloudLightning,
  Construction,
  ShieldAlert,
  Info,
  AlertTriangle,
} from "lucide-react";

const typeIcons: Record<
  SmartAlert["type"],
  React.FC<{ size?: number; className?: string }>
> = {
  delay: Clock,
  weather: CloudLightning,
  track: Construction,
  safety: ShieldAlert,
  info: Info,
};

const typeIconColors: Record<SmartAlert["type"], string> = {
  delay: "text-red-400 bg-red-500/10 border-red-500/20",
  weather: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  track: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  safety: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  info: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

const severityVariant: Record<
  SmartAlert["severity"],
  "danger" | "warning" | "info" | "neutral"
> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

export default function SmartAlerts() {
  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          Smart Alerts
        </h2>
        <span className="text-xs text-slate-500">
          {smartAlerts.filter((a) => !a.read).length} unread
        </span>
      </div>

      <div className="space-y-3">
        {smartAlerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          const iconColor = typeIconColors[alert.type];

          return (
            <div
              key={alert.id}
              className={`
                group flex items-start gap-3 p-3.5 rounded-xl
                border transition-all duration-200
                ${
                  !alert.read
                    ? "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]"
                    : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]"
                }
              `}
            >
              <div
                className={`p-2 rounded-lg border shrink-0 ${iconColor}`}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className={`text-sm font-medium truncate ${
                      !alert.read ? "text-slate-200" : "text-slate-400"
                    }`}
                  >
                    {alert.title}
                  </p>
                  <Badge variant={severityVariant[alert.severity]} className="shrink-0">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {alert.description}
                </p>
                <p className="text-[10px] text-slate-600 mt-1.5">
                  {alert.timestamp}
                </p>
              </div>

              {!alert.read && (
                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
