"use client";

import { useState } from "react";
import { X, Bell, Plus, Loader2 } from "lucide-react";
import SearchBar from "./SearchBar";
import type { TrainSearchResult } from "@/services/api";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainQuery: string, condition: string) => Promise<void>;
}

const CONDITION_PRESETS = [
  { label: "Delay > 10 min", value: "delay > 10" },
  { label: "Delay > 15 min", value: "delay > 15" },
  { label: "Delay > 30 min", value: "delay > 30" },
  { label: "Delay > 60 min", value: "delay > 60" },
  { label: "Status = Delayed", value: "status = Delayed" },
  { label: "Speed < 30 km/h", value: "speed < 30" },
];

export default function AlertModal({ isOpen, onClose, onSave }: AlertModalProps) {
  const [selectedTrain, setSelectedTrain] = useState<TrainSearchResult | null>(null);
  const [condition, setCondition] = useState("");
  const [customCondition, setCustomCondition] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const finalCondition = condition === "custom" ? customCondition : condition;

  const handleSave = async () => {
    if (!selectedTrain) {
      setError("Please select a train");
      return;
    }
    if (!finalCondition.trim()) {
      setError("Please select or enter a condition");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await onSave(selectedTrain.name, finalCondition);
      // Reset and close
      setSelectedTrain(null);
      setCondition("");
      setCustomCondition("");
      onClose();
    } catch {
      setError("Failed to save alert");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl animate-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Bell size={18} className="text-blue-400" />
            Create Smart Alert
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Train selection */}
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
              Select Train
            </label>
            {selectedTrain ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/[0.12]">
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {selectedTrain.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    #{selectedTrain.number} • {selectedTrain.from_station} → {selectedTrain.to_station}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTrain(null)}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <SearchBar
                onSelect={(train) => {
                  setSelectedTrain(train);
                  setError(null);
                }}
                placeholder="Search for a train..."
              />
            )}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">
              Alert Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITION_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setCondition(preset.value);
                    setError(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                    condition === preset.value
                      ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                      : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom condition */}
            <button
              onClick={() => setCondition("custom")}
              className={`mt-2 w-full px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 cursor-pointer ${
                condition === "custom"
                  ? "bg-purple-500/15 text-purple-400 border-purple-500/25"
                  : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              Custom Condition
            </button>

            {condition === "custom" && (
              <input
                type="text"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                placeholder='e.g. delay > 20 or status = Delayed'
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
              />
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/[0.06] border border-red-500/[0.1] rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/25 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            Save Alert
          </button>
        </div>
      </div>
    </div>
  );
}
