"use client";

import { useState } from "react";
import {
  BookMarked,
  Home,
  ClipboardCheck,
  GraduationCap,
  Wallet,
  FileText,
  FileSignature,
  Bell,
  LogOut,
  X,
} from "lucide-react";

const ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "attendance", label: "Attendance", icon: GraduationCap },
  { key: "marks", label: "Marks", icon: ClipboardCheck },
  { key: "fees", label: "Fees", icon: Wallet },
  { key: "assignments", label: "Assignments", icon: FileText },
  { key: "applications", label: "Applications", icon: FileSignature },
  { key: "report", label: "Report Card", icon: FileText },
];

const NOOP = () => {};

export default function StudentSidebar({
  currentPage = "dashboard",
  onNav = NOOP,
  onLogout = NOOP,
  user = { name: "Student", role: "student" },
  notificationsCount = 0,
  mobileOpen: mobileOpenProp,
  setMobileOpen: setMobileOpenProp,
}) {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const mobileOpen = mobileOpenProp ?? internalMobileOpen;
  const setMobileOpen = setMobileOpenProp ?? setInternalMobileOpen;

  const userInitial = user?.name?.[0]?.toUpperCase() ?? "S";

  return (
    <>
      {/* Overlay (mobile only) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40
          h-screen w-64 flex flex-col
          bg-gray-900 text-white
          transition-transform duration-300 ease-in-out

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-green-800/60 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-400/20">
            <BookMarked size={20} className="text-green-300" />
          </div>

          <div>
            <p className="text-sm font-bold leading-none">Foresty</p>
            <p className="text-xs text-green-300">Student Portal</p>
          </div>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-green-300 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
    

        {/* User Info */}
        <div className="mx-3 mt-4 flex items-center gap-3 rounded-xl bg-green-800/40 p-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
            {userInitial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name ?? "Student"}
            </p>
            <p className="text-xs capitalize text-green-300">
              {user?.role ?? "student"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto px-3 space-y-1 no-scrollbar-mobile">
          {ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                onNav(key);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                currentPage === key
                  ? "bg-green-600 text-white"
                  : "text-green-100 hover:bg-green-800/50 hover:text-white"
              }`}
            >
              <Icon size={17} />
              <span className="flex-1 text-left">{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-green-800/60 px-3 py-4 space-y-2">
          <button
            onClick={() => {
              onNav("notifications");
              setMobileOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              currentPage === "notifications"
                ? "bg-green-600 text-white"
                : "text-green-100 hover:bg-green-800/50 hover:text-white"
            }`}
          >
            <Bell size={16} />
            <span className="flex-1 text-left">Notifications</span>
            {notificationsCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-red-200">
                {notificationsCount}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition-all hover:bg-red-900/30 hover:text-red-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
