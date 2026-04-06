import GlassCard from "./ui/GlassCard";
import Badge from "./ui/Badge";
import { upcomingTrains } from "@/lib/data";
import { Clock, MapPin, ArrowRight } from "lucide-react";

export default function UpcomingTrains() {
  return (
    <GlassCard className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Clock size={16} className="text-blue-400" />
          Upcoming Trains
        </h2>
        <span className="text-xs text-slate-500">
          {upcomingTrains.length} trains
        </span>
      </div>

      <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {upcomingTrains.map((train) => (
          <div
            key={train.id}
            className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {train.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  #{train.number} • Platform {train.platform}
                </p>
              </div>
              <Badge
                variant={train.status === "on-time" ? "success" : "danger"}
                pulse={train.status === "delayed"}
              >
                {train.status === "on-time"
                  ? "On Time"
                  : `${train.delayMinutes}m Late`}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={12} className="text-slate-500" />
              <span>{train.from}</span>
              <ArrowRight size={10} className="text-slate-600" />
              <span>{train.to}</span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
              <span className="text-xs text-slate-500">
                Dep: {train.departure}
              </span>
              <span className="text-xs text-slate-500">
                Arr: {train.arrival}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
