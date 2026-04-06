"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Radio,
  AlertTriangle,
  FileBarChart,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { notifications } from "@/lib/data";

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Live Status", icon: Radio, href: "#" },
  { label: "Alerts", icon: AlertTriangle, href: "#" },
  { label: "Reports", icon: FileBarChart, href: "#" },
];

export default function Navbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/70 border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚆</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Train
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeLink === link.label;
              return (
                <button
                  key={link.label}
                  onClick={() => setActiveLink(link.label)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <Icon size={16} />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  setUserOpen(false);
                }}
                className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-slate-200">
                      Notifications
                    </h3>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                          !notif.read ? "bg-blue-500/[0.04]" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.read && (
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                          <div className={!notif.read ? "" : "ml-5"}>
                            <p className="text-sm text-slate-300">
                              {notif.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 text-center border-t border-white/[0.06]">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Dropdown */}
            <div ref={userRef} className="relative">
              <button
                onClick={() => {
                  setUserOpen(!userOpen);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/[0.05] transition-all duration-200 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  R
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-semibold text-slate-200">
                      Raghav
                    </p>
                    <p className="text-xs text-slate-500">raghav@aitrain.io</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: "Profile" },
                      { icon: Settings, label: "Settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors cursor-pointer"
                      >
                        <item.icon size={15} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] py-1">
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.05] transition-colors cursor-pointer">
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
