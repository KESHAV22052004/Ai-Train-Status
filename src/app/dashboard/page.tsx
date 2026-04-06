import Navbar from "@/components/Navbar";
import UpcomingTrains from "@/components/UpcomingTrains";
import LiveTracker from "@/components/LiveTracker";
import DelayPrediction from "@/components/DelayPrediction";
import StatusCards from "@/components/StatusCards";
import PerformanceChart from "@/components/PerformanceChart";
import SmartAlerts from "@/components/SmartAlerts";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.05] blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-600/[0.04] blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Real-time train monitoring & AI-powered predictions
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live • Last updated 2 min ago
            </div>
          </div>

          {/* Status Cards Row */}
          <StatusCards />

          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left - Upcoming Trains */}
            <div className="lg:col-span-3">
              <UpcomingTrains />
            </div>

            {/* Center - Live Tracker */}
            <div className="lg:col-span-5">
              <LiveTracker />
            </div>

            {/* Right - Delay Prediction */}
            <div className="lg:col-span-4">
              <DelayPrediction />
            </div>
          </div>

          {/* Chart + Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart */}
            <div className="lg:col-span-7">
              <PerformanceChart />
            </div>

            {/* Alert Panel */}
            <div className="lg:col-span-5">
              <SmartAlerts />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 text-xs text-slate-600 border-t border-white/[0.04]">
            <p>
              © 2026 AI Train Status & Smart Alerts — Powered by AI •
              Built with Next.js
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
