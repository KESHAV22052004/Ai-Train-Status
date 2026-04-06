import GlassCard from "./ui/GlassCard";
import Badge from "./ui/Badge";
import { smartAlerts as mockAlerts } from "@/lib/data";
import type { AlertRule } from "@/services/api";
import {
  Clock,
  CloudLightning,
  Construction,
  ShieldAlert,
  Info,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";

interface SmartAlertsProps {
  dbAlerts?: AlertRule[];
  onAddAlert?: () => void;
  onRemoveAlert?: (id: string) => void;
}

const typeIconColors: Record<string, string> = {
  delay: "text-red-400 bg-red-500/10 border-red-500/20",
  weather: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  track: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  safety: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  info: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default function SmartAlerts({ dbAlerts = [], onAddAlert, onRemoveAlert }: SmartAlertsProps) {
  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          Smart Alerts
        </h2>
        {onAddAlert && (
          <button
            onClick={onAddAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Create Alert
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-2">
        {/* DB ALERTS */}
        {dbAlerts.map((alert) => (
          <div
            key={alert.id}
            className="group flex items-start gap-3 p-3.5 rounded-xl bg-purple-500/[0.04] border border-purple-500/[0.12] hover:bg-purple-500/[0.06] transition-all duration-200"
          >
            <div className="p-2 rounded-lg border shrink-0 text-purple-400 bg-purple-500/10 border-purple-500/20">
              <Bell size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-slate-200 truncate">
                  Auto-Check: {alert.train_query}
                </p>
                <Badge variant="warning" className="shrink-0 bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed truncate">
                Condition: {alert.condition}
              </p>
            </div>
            
            {onRemoveAlert && (
              <button
                onClick={() => onRemoveAlert(alert.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                title="Delete alert"
              >
                <Trash2 size={14} />
              </button>
            )}
            
            <span className="mt-1 w-2 h-2 rounded-full bg-purple-500 shrink-0" />
          </div>
        ))}
      
        {/* MOCK ALERTS (Fallback or History) */}
        {mockAlerts.map((alert) => {
          // Just use clock icon for simplicity since we lost type Icons map in rewrite
          const Icon = Clock;
          const iconColor = typeIconColors[alert.type] || typeIconColors.info;

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
                  <Badge variant={alert.severity === "critical" ? "danger" : "neutral"} className="shrink-0">
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

// We need Bell here
import { Bell } from "lucide-react";
