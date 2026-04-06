"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UpcomingTrains from "@/components/UpcomingTrains";
import LiveTracker from "@/components/LiveTracker";
import DelayPrediction from "@/components/DelayPrediction";
import StatusCards from "@/components/StatusCards";
import PerformanceChart from "@/components/PerformanceChart";
import SmartAlerts from "@/components/SmartAlerts";
import SearchBar from "@/components/SearchBar";
import AlertModal from "@/components/AlertModal";
import ToastContainer from "@/components/ToastContainer";
import AuthModal from "@/components/AuthModal";

import { useAlerts, useAlertChecker } from "@/hooks/useAlerts";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { getTrainStatus, getDelayPrediction, type TrainStatus, type TrainSearchResult, type TriggeredAlert } from "@/services/api";
import type { DelayPrediction as PredictionType } from "@/lib/types";

export default function DashboardPage() {
  const [selectedTrainData, setSelectedTrainData] = useState<TrainStatus | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionType | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFetchingTrain, setIsFetchingTrain] = useState(false);

  // Custom Hooks
  const { alerts, addAlert, removeAlert } = useAlerts();
  const { toasts, addToast, removeToast } = useToast();
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  // Auto-checker for Smart Alerts
  useAlertChecker((triggeredAlerts: TriggeredAlert[]) => {
    triggeredAlerts.forEach((alert) => {
      addToast(
        alert.current_delay > 0 ? "warning" : "info",
        `Alert Triggered: ${alert.train_name}`,
        alert.message
      );
    });
  });

  // Handle train search selection
  const handleTrainSelect = async (train: TrainSearchResult) => {
    setIsFetchingTrain(true);
    addToast("info", "Fetching Live Status", `Fetching data for ${train.name}...`);
    try {
      const [data, prediction] = await Promise.all([
        getTrainStatus(train.number),
        getDelayPrediction(train.number).catch(() => null) // fail gracefully
      ]);
      setSelectedTrainData(data);
      setPredictionData(prediction as PredictionType | null);
    } catch (err) {
      addToast("error", "Failed to Fetch", `Could not get status for ${train.name}`);
    } finally {
      setIsFetchingTrain(false);
    }
  };

  // Handle new alert save
  const handleSaveAlert = async (trainQuery: string, condition: string) => {
    await addAlert(trainQuery, condition);
    addToast("success", "Alert Created", `Monitoring ${trainQuery} for: ${condition}`);
  };

  const handeCreateAlertClick = () => {
    if (isGuest) {
      addToast("warning", "Auth Required", "Please login to save smart alerts.");
      setShowAuthModal(true);
      return;
    }
    setIsAlertModalOpen(true);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

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
        <Navbar onLoginClick={() => setShowAuthModal(true)} />

        <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Real-time train monitoring & AI-powered predictions
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-2xl xl:ml-auto">
               <SearchBar onSelect={handleTrainSelect} />
            </div>
          </div>

          {/* Status Cards Row */}
          <StatusCards trainData={selectedTrainData} activeAlertsCount={alerts.length} />

          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
             {isFetchingTrain && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-2xl">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
             )}

            {/* Left - Upcoming Trains */}
            <div className="lg:col-span-3">
              <UpcomingTrains />
            </div>

            {/* Center - Live Tracker */}
            <div className="lg:col-span-5">
              <LiveTracker trainData={selectedTrainData} />
            </div>

            {/* Right - Delay Prediction */}
            <div className="lg:col-span-4">
              <DelayPrediction data={predictionData} isLoading={isFetchingTrain} />
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
              <SmartAlerts 
                dbAlerts={alerts} 
                onAddAlert={handeCreateAlertClick}
                onRemoveAlert={removeAlert}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 text-xs text-slate-600 border-t border-white/[0.04]">
            <p>
              © 2026 AI Train Status & Smart Alerts — Powered by AI •
              Built with Next.js & FastAPI
            </p>
          </footer>
        </main>
      </div>

      {/* Modals & Overlays */}
      <AuthModal 
        isOpen={showAuthModal || (!isAuthenticated && !isGuest)} 
        onClose={isGuest || isAuthenticated ? () => setShowAuthModal(false) : undefined} 
      />

      <AlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)} 
        onSave={handleSaveAlert} 
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
