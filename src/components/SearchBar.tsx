"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, MapPin, ArrowRight, Clock } from "lucide-react";
import { useTrainSearch } from "@/hooks/useTrainSearch";
import type { TrainSearchResult } from "@/services/api";

interface SearchBarProps {
  onSelect: (train: TrainSearchResult) => void;
  placeholder?: string;
}

const RECENT_KEY = "aitrain_recent_searches";
const MAX_RECENT = 5;

function getRecentSearches(): TrainSearchResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(train: TrainSearchResult) {
  const recent = getRecentSearches().filter((r) => r.number !== train.number);
  recent.unshift(train);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export default function SearchBar({ onSelect, placeholder }: SearchBarProps) {
  const { query, results, isLoading, error, search, clearSearch } = useTrainSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<TrainSearchResult[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recents on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Reset highlight when results change
  useEffect(() => {
    setHighlightIdx(-1);
  }, [results]);

  const handleSelect = useCallback(
    (train: TrainSearchResult) => {
      saveRecentSearch(train);
      setRecentSearches(getRecentSearches());
      onSelect(train);
      clearSearch();
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect, clearSearch]
  );

  const displayItems = query.trim() ? results : recentSearches;
  const showRecents = !query.trim() && recentSearches.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < displayItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : displayItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < displayItems.length) {
          handleSelect(displayItems[highlightIdx]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-blue-400 font-semibold">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-blue-400 animate-spin" />
          ) : (
            <Search
              size={18}
              className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
            />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            search(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search trains by name or number..."}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl
            bg-white/[0.04] backdrop-blur-xl
            border border-white/[0.08]
            text-sm text-slate-200 placeholder-slate-500
            focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06]
            focus:shadow-[0_0_30px_rgba(59,130,246,0.08)]
            transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => {
              clearSearch();
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (displayItems.length > 0 || error || (query.trim() && !isLoading)) && (
        <div className="absolute z-50 w-full mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden animate-in">
          {/* Recent searches header */}
          {showRecents && (
            <div className="px-4 py-2 border-b border-white/[0.06]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={10} />
                Recent Searches
              </p>
            </div>
          )}

          {/* Results */}
          {displayItems.length > 0 ? (
            <div className="max-h-72 overflow-y-auto custom-scrollbar">
              {displayItems.map((train, idx) => (
                <button
                  key={train.number}
                  onClick={() => handleSelect(train)}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                    idx === highlightIdx
                      ? "bg-blue-500/[0.08] border-l-2 border-l-blue-500"
                      : "border-l-2 border-l-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">
                      {highlightMatch(train.name, query)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="text-slate-400 font-mono">
                        #{train.number}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {train.from_station}
                        <ArrowRight size={8} />
                        {train.to_station}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : error ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : query.trim() && !isLoading ? (
            <div className="px-4 py-6 text-center">
              <Search size={24} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm text-slate-500">
                No trains found for &quot;{query}&quot;
              </p>
            </div>
          ) : null}

          {/* Keyboard hint */}
          {displayItems.length > 0 && (
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-3 text-[10px] text-slate-600">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
