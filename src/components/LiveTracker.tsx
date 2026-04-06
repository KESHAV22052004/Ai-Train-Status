import GlassCard from "./ui/GlassCard";
import Badge from "./ui/Badge";
import { liveTrackerData as defaultData } from "@/lib/data";
import type { TrainStatus } from "@/services/api";
import { Gauge, Radio, MapPin, Train } from "lucide-react";

interface LiveTrackerProps {
  trainData?: TrainStatus | null;
}

export default function LiveTracker({ trainData }: LiveTrackerProps) {
  // Use mock data if no dynamic trainData is passed
  const isMock = !trainData;
  const data = trainData || defaultData;
  
  // Progress calculation
  const distanceCovered = isMock ? defaultData.distanceCovered : data.distance_covered;
  const totalDistance = isMock ? defaultData.totalDistance : data.total_distance;
  const progressPercent = totalDistance > 0 ? (distanceCovered / totalDistance) * 100 : 0;
  
  // Map fields from dynamic data or fallback
  const trainName = isMock ? defaultData.trainName : data.train_name;
  const trainNumber = isMock ? defaultData.trainNumber : data.train_number;
  const lastUpdated = isMock ? defaultData.lastUpdated : data.last_updated;
  const currentSpeed = isMock ? defaultData.currentSpeed : data.speed;
  const delayMin = isMock ? defaultData.delayMinutes : data.delay;
  
  // Format route stations
  const getStations = () => {
    if (isMock) return defaultData.routeStations;
    
    // Convert dynamic route_stations to format matching UI
    return data.route_stations.map((st, idx) => {
      const arrived = idx <= (data.route_stations.indexOf(data.current_station) || 0);
      const current = st === data.current_station;
      return {
        name: st,
        code: st.substring(0, 4).toUpperCase(),
        arrived,
        current,
        scheduledTime: "--:--", // Dynamic API currently lacks schedule times per station
      };
    });
  };
  
  const routeStations = getStations();

  return (
    <GlassCard className="p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Radio size={16} className="text-emerald-400" />
          Live Train Tracker
        </h2>
        <Badge variant="info" pulse>
          Live • {lastUpdated}
        </Badge>
      </div>

      {/* Train Info */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/[0.1]">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Train size={18} className="text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">
            {trainName}
          </p>
          <p className="text-xs text-slate-400">#{trainNumber}</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative mb-4 rounded-xl overflow-hidden h-36 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/[0.06]">
        {/* Simulated map background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }} />
        </div>

        {/* Route Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 flex items-center">
          <div className="w-full h-1 rounded-full bg-slate-700 relative">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Train icon on route */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-blue-500/20 rounded-full animate-ping" />
                <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Start and End labels */}
        {routeStations.length > 0 && (
          <>
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md">
              {routeStations[0].code}
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md">
              {routeStations[routeStations.length - 1].code}
            </div>
          </>
        )}
        <div className="absolute top-2 right-3 text-[10px] text-slate-500">
          {distanceCovered}/{totalDistance} km
        </div>
      </div>

      {/* Speed & Delay */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <Gauge size={16} className="text-cyan-400" />
        <span className="text-sm text-slate-300">
          Currently:{" "}
          <span className="font-semibold text-white">
            {currentSpeed} km/h
          </span>
        </span>
        <span className="text-slate-600 mx-1">•</span>
        <span className={`text-sm font-medium ${delayMin > 0 ? "text-red-400" : "text-emerald-400"}`}>
          {delayMin > 0 ? `${delayMin} min late` : "On Time"}
        </span>
      </div>

      {/* Route Stations */}
      <div className="space-y-0 max-h-48 overflow-y-auto custom-scrollbar pr-2">
        {routeStations.map((station, idx) => (
          <div key={station.code + idx} className="flex items-start gap-3">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                  station.current
                    ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/40"
                    : station.arrived
                    ? "bg-emerald-500 border-emerald-400"
                    : "bg-slate-700 border-slate-600"
                }`}
              />
              {idx < routeStations.length - 1 && (
                <div
                  className={`w-0.5 h-6 ${
                    station.arrived
                      ? "bg-emerald-500/40"
                      : "bg-slate-700/60"
                  }`}
                />
              )}
            </div>

            {/* Station Info */}
            <div className="flex-1 -mt-0.5 min-w-0 pb-2">
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs font-medium truncate ${
                    station.current
                      ? "text-blue-400"
                      : station.arrived
                      ? "text-slate-300"
                      : "text-slate-500"
                  }`}
                >
                  <MapPin size={10} className="inline mr-1" />
                  {station.name}
                  <span className="text-[10px] ml-1 text-slate-600">
                    ({station.code})
                  </span>
                </p>
                {station.scheduledTime !== "--:--" && (
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                    {station.scheduledTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
