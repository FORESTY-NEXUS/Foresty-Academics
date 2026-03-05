 "use client";

import React, { useState } from "react";
import {
  BookMarked,
  Home,
  BookOpen,
  GraduationCap,
  LogOut,
  Users,
  X,
} from "lucide-react";

const DEFAULT_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "classes", label: "Classes", icon: BookOpen },
  { key: "teachers", label: "Teachers", icon: GraduationCap },
  { key: "students", label: "All Students", icon: Users },
];

const NOOP = () => {};

const AdminSidebar = ({
  items = DEFAULT_ITEMS,
  currentPage = "dashboard",
  onNav = NOOP,
  user = { name: "Admin", role: "admin" },
  onLogout = NOOP,
  mobileOpen: mobileOpenProp,
  setMobileOpen: setMobileOpenProp,
}) => {
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen = mobileOpenProp ?? internalMobileOpen;
  const setMobileOpen = setMobileOpenProp ?? setInternalMobileOpen;
  const userInitial = user?.name?.[0]?.toUpperCase() ?? "A";

  return (
  <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}/>}
      <aside className={`fixed top-0 left-0 h-screen w-64 z-40 flex flex-col bg-green-900 text-white
        transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-green-800/60">
          <div className="w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center">
            <BookMarked size={20} className="text-green-300"/>
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Foresty</p>
            <p className="text-green-400 text-xs">Academics</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-green-400"><X size={18}/></button>
        </div>

        {/* User pill */}
        <div className="mx-3 mt-4 p-3 rounded-xl bg-green-800/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name ?? "Admin"}</p>
            <p className="text-green-400 text-xs capitalize">{user?.role ?? "admin"}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
          {items.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { onNav(key); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${currentPage === key ? "bg-green-600 text-white" : "text-green-200 hover:bg-green-800/50 hover:text-white"}`}>
              <Icon size={17}/>{label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-green-800/60">
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all">
            <LogOut size={16}/>Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
