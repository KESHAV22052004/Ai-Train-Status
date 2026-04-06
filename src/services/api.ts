/**
 * api.ts — Centralized API client
 *
 * All backend calls go through here.
 * Base URL defaults to Next.js proxy (/api → FastAPI).
 */

const API_BASE = "/api";

interface FetchOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
  timeout?: number;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, signal, timeout = 10000 } = options;

  const controller = new AbortController();
  const combinedSignal = signal || controller.signal;

  // Timeout
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(
        errBody.detail || `Request failed (${res.status})`,
        res.status
      );
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out", 408);
    }
    throw new ApiError("Network error", 0);
  } finally {
    clearTimeout(timeoutId);
  }
}

// ===== Train API =====

export interface TrainSearchResult {
  number: string;
  name: string;
  from_station: string;
  to_station: string;
}

export interface TrainStatus {
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  status: "On Time" | "Delayed";
  delay: number;
  speed: number;
  max_speed: number;
  current_station: string;
  next_station: string;
  eta: string;
  distance_covered: number;
  total_distance: number;
  weather: { condition: string; icon: string };
  delay_reason: string | null;
  route_stations: string[];
  last_updated: string;
}

export interface AlertRule {
  id: string;
  user_id: string;
  train_query: string;
  condition: string;
  created_at: string;
}

export interface TriggeredAlert {
  alert_id: string;
  train_query: string;
  condition: string;
  train_name: string;
  train_number: string;
  current_status: string;
  current_delay: number;
  current_speed: number;
  message: string;
}

export async function searchTrains(
  query: string,
  signal?: AbortSignal
): Promise<TrainSearchResult[]> {
  const data = await apiFetch<{ results: TrainSearchResult[] }>(
    `/trains/search?q=${encodeURIComponent(query)}`,
    { signal }
  );
  return data.results;
}

export async function getTrainStatus(query: string): Promise<TrainStatus> {
  return apiFetch<TrainStatus>(
    `/train?query=${encodeURIComponent(query)}`
  );
}

export async function createAlert(
  trainQuery: string,
  condition: string
): Promise<AlertRule> {
  const data = await apiFetch<{ alert: AlertRule }>("/alerts", {
    method: "POST",
    body: { train_query: trainQuery, condition },
  });
  return data.alert;
}

export async function fetchAlerts(): Promise<AlertRule[]> {
  const data = await apiFetch<{ alerts: AlertRule[] }>("/alerts");
  return data.alerts;
}

export async function deleteAlert(alertId: string): Promise<void> {
  await apiFetch(`/alerts/${alertId}`, { method: "DELETE" });
}

export async function checkAlerts(): Promise<{
  triggered_alerts: TriggeredAlert[];
  total_checked: number;
  total_triggered: number;
}> {
  return apiFetch("/check-alerts", { method: "POST" });
}

import type { DelayPrediction } from "@/lib/types";

export async function getDelayPrediction(query: string): Promise<DelayPrediction> {
  return apiFetch<DelayPrediction>(
    `/predict-delay?query=${encodeURIComponent(query)}`
  );
}
