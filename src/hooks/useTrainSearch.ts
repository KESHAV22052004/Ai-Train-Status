"use client";

import { useState, useRef, useCallback } from "react";
import { searchTrains, type TrainSearchResult } from "@/services/api";

const DEBOUNCE_MS = 300;

export function useTrainSearch() {
  const [results, setResults] = useState<TrainSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    setQuery(q);
    setError(null);

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Debounce
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await searchTrains(q, controller.signal);
        if (!controller.signal.aborted) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Search failed");
          setIsLoading(false);
          setResults([]);
        }
      }
    }, DEBOUNCE_MS);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setIsLoading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return { query, results, isLoading, error, search, clearSearch };
}
