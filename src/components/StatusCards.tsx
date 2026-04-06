import GlassCard from "./ui/GlassCard";
import { statusCards } from "@/lib/data";
import {
  Clock,
  MapPin,
  CloudLightning,
  Bell,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> =
  {
    clock: Clock,
    "map-pin": MapPin,
    "cloud-lightning": CloudLightning,
    bell: Bell,
  };

const colorMap: Record<
  string,
  { gradient: string; border: string; icon: string; text: string }
> = {
  red: {
    gradient: "from-red-500/10 to-red-600/5",
    border: "border-red-500/15",
    icon: "text-red-400",
    text: "text-red-400",
  },
  blue: {
    gradient: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/15",
    icon: "text-blue-400",
    text: "text-blue-400",
  },
  amber: {
    gradient: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/15",
    icon: "text-amber-400",
    text: "text-amber-400",
  },
  purple: {
    gradient: "from-purple-500/10 to-purple-600/5",
    border: "border-purple-500/15",
    icon: "text-purple-400",
    text: "text-purple-400",
  },
  green: {
    gradient: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/15",
    icon: "text-emerald-400",
    text: "text-emerald-400",
  },
};

export default function StatusCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusCards.map((card) => {
        const Icon = iconMap[card.icon] || Clock;
        const colors = colorMap[card.color] || colorMap.blue;

        return (
          <GlassCard key={card.id} className="p-4">
            <div
              className={`flex items-start gap-3 relative overflow-hidden`}
            >
              {/* Background gradient accent */}
              <div
                className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} blur-2xl opacity-60`}
              />

              <div
                className={`relative p-2.5 rounded-xl bg-gradient-to-br ${colors.gradient} ${colors.border} border`}
              >
                <Icon size={18} className={colors.icon} />
              </div>

              <div className="relative flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p
                  className={`text-lg font-bold mt-0.5 ${colors.text}`}
                >
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
