import GlassCard from "./ui/GlassCard";
import { delayPrediction } from "@/lib/data";
import { BrainCircuit, TrendingUp, CloudLightning } from "lucide-react";

export default function DelayPrediction() {
  const data = delayPrediction;

  return (
    <GlassCard className="p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-400" />
          AI Delay Prediction
        </h2>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <TrendingUp size={12} />
          {data.confidence}% confidence
        </span>
      </div>

      {/* Main Prediction */}
      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-500/[0.08] to-orange-500/[0.06] border border-red-500/[0.12] mb-4">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
          Expected Delay
        </p>
        <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          {data.expectedDelayMin}–{data.expectedDelayMax}
        </p>
        <p className="text-sm text-slate-400 mt-1">minutes</p>
      </div>

      {/* Weather */}
      <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/[0.1] mb-4 flex items-center gap-3">
        <div className="text-3xl">{data.weatherIcon}</div>
        <div>
          <p className="text-sm font-medium text-amber-400 flex items-center gap-1">
            <CloudLightning size={14} />
            {data.weatherCondition}
          </p>
          <p className="text-xs text-slate-400">
            Affecting train operations
          </p>
        </div>
      </div>

      {/* Factors */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">
          Contributing Factors
        </p>
        <div className="space-y-2">
          {data.factors.map((factor, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
              {factor}
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Model Confidence</span>
          <span className="text-xs font-medium text-purple-400">
            {data.confidence}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${data.confidence}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
