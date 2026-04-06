import type {
  Train,
  LiveTrackerData,
  DelayPrediction,
  StatusCard,
  PerformanceDataPoint,
  SmartAlert,
  Notification,
} from "./types";

// ===== Upcoming Trains =====
export const upcomingTrains: Train[] = [
  {
    id: "t1",
    number: "12301",
    name: "Rajdhani Express",
    departure: "06:00 AM",
    arrival: "02:30 PM",
    from: "New Delhi",
    to: "Howrah Jn",
    status: "on-time",
    platform: 3,
  },
  {
    id: "t2",
    number: "12951",
    name: "Mumbai Rajdhani",
    departure: "04:25 PM",
    arrival: "08:15 AM",
    from: "New Delhi",
    to: "Mumbai Central",
    status: "delayed",
    delayMinutes: 22,
    platform: 5,
  },
  {
    id: "t3",
    number: "12002",
    name: "Shatabdi Express",
    departure: "06:15 AM",
    arrival: "12:10 PM",
    from: "New Delhi",
    to: "Bhopal Jn",
    status: "on-time",
    platform: 1,
  },
  {
    id: "t4",
    number: "12259",
    name: "Duronto Express",
    departure: "08:30 PM",
    arrival: "06:45 AM",
    from: "Sealdah",
    to: "New Delhi",
    status: "delayed",
    delayMinutes: 45,
    platform: 8,
  },
  {
    id: "t5",
    number: "12627",
    name: "Karnataka Express",
    departure: "11:15 PM",
    arrival: "06:20 AM",
    from: "New Delhi",
    to: "Bangalore",
    status: "on-time",
    platform: 12,
  },
  {
    id: "t6",
    number: "12431",
    name: "Trivandrum Rajdhani",
    departure: "10:55 AM",
    arrival: "05:10 AM",
    from: "New Delhi",
    to: "Trivandrum",
    status: "delayed",
    delayMinutes: 15,
    platform: 6,
  },
];

// ===== Live Tracker =====
export const liveTrackerData: LiveTrackerData = {
  trainNumber: "12951",
  trainName: "Mumbai Rajdhani Express",
  currentSpeed: 42,
  maxSpeed: 130,
  delayMinutes: 15,
  currentStation: "Mathura Jn",
  nextStation: "Agra Cantt",
  distanceCovered: 141,
  totalDistance: 1384,
  lastUpdated: "2 min ago",
  routeStations: [
    {
      name: "New Delhi",
      code: "NDLS",
      arrived: true,
      current: false,
      scheduledTime: "04:25 PM",
      actualTime: "04:25 PM",
      distanceFromStart: 0,
    },
    {
      name: "Mathura Jn",
      code: "MTJ",
      arrived: true,
      current: true,
      scheduledTime: "06:42 PM",
      actualTime: "06:57 PM",
      distanceFromStart: 141,
    },
    {
      name: "Agra Cantt",
      code: "AGC",
      arrived: false,
      current: false,
      scheduledTime: "07:15 PM",
      distanceFromStart: 188,
    },
    {
      name: "Kota Jn",
      code: "KOTA",
      arrived: false,
      current: false,
      scheduledTime: "10:20 PM",
      distanceFromStart: 465,
    },
    {
      name: "Ratlam Jn",
      code: "RTM",
      arrived: false,
      current: false,
      scheduledTime: "01:05 AM",
      distanceFromStart: 703,
    },
    {
      name: "Vadodara Jn",
      code: "BRC",
      arrived: false,
      current: false,
      scheduledTime: "03:45 AM",
      distanceFromStart: 949,
    },
    {
      name: "Surat",
      code: "ST",
      arrived: false,
      current: false,
      scheduledTime: "05:30 AM",
      distanceFromStart: 1089,
    },
    {
      name: "Mumbai Central",
      code: "BCT",
      arrived: false,
      current: false,
      scheduledTime: "08:15 AM",
      distanceFromStart: 1384,
    },
  ],
};

// ===== Delay Prediction =====
export const delayPrediction: DelayPrediction = {
  expectedDelayMin: 18,
  expectedDelayMax: 22,
  confidence: 87,
  weatherCondition: "Stormy",
  weatherIcon: "⛈️",
  factors: [
    "Heavy rainfall near Agra",
    "Signal failure at Kota Jn",
    "Track maintenance ahead",
    "Peak hour congestion",
  ],
};

// ===== Status Cards =====
export const statusCards: StatusCard[] = [
  {
    id: "s1",
    title: "Current Status",
    value: "Delayed",
    subtitle: "15 min behind schedule",
    icon: "clock",
    color: "red",
  },
  {
    id: "s2",
    title: "Next Station",
    value: "Agra Cantt",
    subtitle: "ETA: 7:30 PM",
    icon: "map-pin",
    color: "blue",
  },
  {
    id: "s3",
    title: "Weather Alert",
    value: "Stormy",
    subtitle: "Heavy rain expected",
    icon: "cloud-lightning",
    color: "amber",
  },
  {
    id: "s4",
    title: "Passenger Alerts",
    value: "3 Active",
    subtitle: "1 critical alert",
    icon: "bell",
    color: "purple",
  },
];

// ===== Performance Chart Data =====
export const performanceData: PerformanceDataPoint[] = [
  { time: "4 PM", speed: 0, delay: 0 },
  { time: "4:30", speed: 85, delay: 2 },
  { time: "5 PM", speed: 120, delay: 3 },
  { time: "5:30", speed: 110, delay: 5 },
  { time: "6 PM", speed: 95, delay: 8 },
  { time: "6:30", speed: 42, delay: 12 },
  { time: "7 PM", speed: 68, delay: 15 },
  { time: "7:30", speed: 105, delay: 14 },
  { time: "8 PM", speed: 115, delay: 12 },
  { time: "8:30", speed: 125, delay: 10 },
  { time: "9 PM", speed: 130, delay: 8 },
  { time: "9:30", speed: 118, delay: 9 },
];

// ===== Smart Alerts =====
export const smartAlerts: SmartAlert[] = [
  {
    id: "a1",
    type: "delay",
    title: "Delay Alert — Rajdhani Express",
    description:
      "Train 12951 is running 15 minutes late due to signal failure near Mathura Junction. Expected to recover by Kota.",
    timestamp: "2 min ago",
    severity: "high",
    read: false,
  },
  {
    id: "a2",
    type: "weather",
    title: "Severe Weather Warning",
    description:
      "Heavy thunderstorm expected between Agra and Kota sector. Wind speeds up to 60 km/h. Speed restrictions may apply.",
    timestamp: "18 min ago",
    severity: "critical",
    read: false,
  },
  {
    id: "a3",
    type: "track",
    title: "Track Maintenance Update",
    description:
      "Scheduled track maintenance on the Down line between Ratlam and Vadodara. Trains may be diverted via alternate route.",
    timestamp: "45 min ago",
    severity: "medium",
    read: true,
  },
  {
    id: "a4",
    type: "safety",
    title: "Platform Change Notice",
    description:
      "Train 12301 Rajdhani Express arrival platform changed from 3 to 7 at New Delhi station.",
    timestamp: "1 hr ago",
    severity: "low",
    read: true,
  },
  {
    id: "a5",
    type: "info",
    title: "Speed Restriction Lifted",
    description:
      "Speed restriction between Surat and Mumbai Central has been lifted. Trains can now operate at normal speed.",
    timestamp: "2 hrs ago",
    severity: "low",
    read: true,
  },
];

// ===== Notifications =====
export const notifications: Notification[] = [
  { id: "n1", message: "Rajdhani Express is 15 min delayed", time: "2m ago", read: false },
  { id: "n2", message: "Severe weather warning for Agra sector", time: "18m ago", read: false },
  { id: "n3", message: "Platform changed for Train 12301", time: "1h ago", read: true },
  { id: "n4", message: "Track maintenance scheduled tonight", time: "2h ago", read: true },
];
