// ===== Train Types =====
export interface Train {
  id: string;
  number: string;
  name: string;
  departure: string;
  arrival: string;
  from: string;
  to: string;
  status: "on-time" | "delayed" | "cancelled";
  delayMinutes?: number;
  platform?: number;
}

// ===== Live Tracker Types =====
export interface LiveTrackerData {
  trainNumber: string;
  trainName: string;
  currentSpeed: number;
  maxSpeed: number;
  delayMinutes: number;
  currentStation: string;
  nextStation: string;
  distanceCovered: number;
  totalDistance: number;
  routeStations: RouteStation[];
  lastUpdated: string;
}

export interface RouteStation {
  name: string;
  code: string;
  arrived: boolean;
  current: boolean;
  scheduledTime: string;
  actualTime?: string;
  distanceFromStart: number;
}

// ===== Delay Prediction Types =====
export interface DelayPrediction {
  expectedDelayMin: number;
  expectedDelayMax: number;
  confidence: number;
  weatherCondition: string;
  weatherIcon: string;
  factors: string[];
}

// ===== Status Card Types =====
export interface StatusCard {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: "red" | "blue" | "amber" | "green" | "purple";
}

// ===== Chart Data Types =====
export interface PerformanceDataPoint {
  time: string;
  speed: number;
  delay: number;
}

// ===== Alert Types =====
export interface SmartAlert {
  id: string;
  type: "delay" | "weather" | "track" | "safety" | "info";
  title: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  read: boolean;
}

// ===== Notification Types =====
export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}
