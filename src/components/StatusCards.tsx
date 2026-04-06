import GlassCard from "./ui/GlassCard";
import { statusCards as defaultCards } from "@/lib/data";
import type { TrainStatus } from "@/services/api";
import {
  Clock,
  MapPin,
  CloudLightning,
  Bell,
  CheckCircle,
} from "lucide-react";

interface StatusCardsProps {
  trainData?: TrainStatus | null;
  activeAlertsCount?: number;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  clock: Clock,
  "map-pin": MapPin,
  "cloud-lightning": CloudLightning,
  bell: Bell,
  "check-circle": CheckCircle,
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

export default function StatusCards({ trainData, activeAlertsCount = 0 }: StatusCardsProps) {
  let cards = defaultCards;

  // Use dynamic data if available
  if (trainData) {
    cards = [
      {
        id: "s1",
        title: "Current Status",
        value: trainData.status,
        subtitle: trainData.delay > 0 ? `${trainData.delay} min behind schedule` : "Running on schedule",
        icon: trainData.delay > 0 ? "clock" : "check-circle",
        color: trainData.delay > 0 ? "red" : "green",
      },
      {
        id: "s2",
        title: "Next Station",
        value: trainData.next_station,
        subtitle: `ETA: ${trainData.eta}`,
        icon: "map-pin",
        color: "blue",
      },
      {
        id: "s3",
        title: "Weather At Train",
        value: trainData.weather.condition,
        subtitle: trainData.delay_reason || "Normal condition",
        // Using emoji from the API instead of lucide component here, but default to icon map
        icon: "cloud-lightning",
        color: "amber",
      },
      {
        id: "s4",
        title: "Active Alerts",
        value: `${activeAlertsCount} Alerts`,
        subtitle: "Monitored automatically",
        icon: "bell",
        color: "purple",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = iconMap[card.icon as keyof typeof iconMap] || Clock;
        const colors = colorMap[card.color as keyof typeof colorMap] || colorMap.blue;

        return (
          <GlassCard key={card.id} className="p-4">
            <div className={`flex items-start gap-3 relative overflow-hidden`}>
              {/* Background gradient accent */}
              <div
                className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${colors.gradient} blur-2xl opacity-60`}
              />

              <div
                className={`relative p-2.5 rounded-xl bg-gradient-to-br ${colors.gradient} ${colors.border} border`}
              >
                {/* if it's weather card, we can show weather icon from dynamic data too if we wanted, but we stick to icon map for shape consistency */}
                <Icon size={18} className={colors.icon} />
              </div>

              <div className="relative flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {(trainData && card.title === "Weather At Train") && (
                     <span className="text-lg">{trainData.weather.icon}</span>
                  )}
                  <p className={`text-lg font-bold ${colors.text} truncate`}>
                    {card.value}
                  </p>
                </div>
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
