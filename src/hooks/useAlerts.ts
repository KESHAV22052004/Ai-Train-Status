"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  createAlert as apiCreateAlert,
  fetchAlerts as apiFetchAlerts,
  deleteAlert as apiDeleteAlert,
  checkAlerts as apiCheckAlerts,
  type AlertRule,
  type TriggeredAlert,
} from "@/services/api";

const CHECK_INTERVAL_MS = 30_000; // 30 seconds

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiFetchAlerts();
      setAlerts(data);
    } catch {
      // silent fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAlert = useCallback(async (trainQuery: string, condition: string) => {
    const alert = await apiCreateAlert(trainQuery, condition);
    setAlerts((prev) => [alert, ...prev]);
    return alert;
  }, []);

  const removeAlert = useCallback(async (alertId: string) => {
    await apiDeleteAlert(alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  return { alerts, isLoading, addAlert, removeAlert, loadAlerts };
}

export function useAlertChecker(
  onTriggered: (alerts: TriggeredAlert[]) => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTriggeredRef = useRef(onTriggered);
  onTriggeredRef.current = onTriggered;

  useEffect(() => {
    const check = async () => {
      try {
        const result = await apiCheckAlerts();
        if (result.triggered_alerts.length > 0) {
          onTriggeredRef.current(result.triggered_alerts);
        }
      } catch {
        // silent fail
      }
    };

    // Initial check after 5 seconds
    const initialTimeout = setTimeout(check, 5000);

    // Then every 30s
    intervalRef.current = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
