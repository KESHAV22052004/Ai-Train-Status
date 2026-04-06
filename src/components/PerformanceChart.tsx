"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import GlassCard from "./ui/GlassCard";
import { performanceData } from "@/lib/data";
import { Activity } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="text-white font-semibold">
            {entry.value}
            {entry.name === "Speed" ? " km/h" : " min"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart() {
  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" />
          Live Train Performance
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Speed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-red-400" />
            <span className="text-slate-400">Delay</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              dx={-8}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                paddingTop: "16px",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            />

            <Line
              type="monotone"
              dataKey="speed"
              name="Speed"
              stroke="#22d3ee"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#22d3ee",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
            />

            <Line
              type="monotone"
              dataKey="delay"
              name="Delay"
              stroke="#f87171"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#f87171",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
