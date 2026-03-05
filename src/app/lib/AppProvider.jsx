"use client";

import { useState, useCallback } from "react";
import { AuthCtx, AppCtx } from "./hooks";

// Example mock database structure
const SEED_DB = {
  users: [],
  classes: [],
  students: [],
  teachers: [],
  attendance: [],
  fees: [],
  marks: [],
};

const uid = () => `id_${Math.random().toString(36).substr(2, 8)}`;

function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg text-white font-medium shadow-lg ${
            t.type === "success" ? "bg-green-500" : t.type === "error" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function AppProvider({ children }) {
  const [db, setDb] = useState(SEED_DB);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [toasts, setToasts] = useState([]);

  function login(identifier, password) {
    const found = db.users.find(u =>
      (u.email === identifier || u.username === identifier) && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  function toggleDark() {
    setDark(d => !d);
  }

  function showToast(message, type = "success") {
    const id = uid();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      <AppCtx.Provider value={{ db, setDb, dark, toggleDark, showToast }}>
        {children}
        <ToastContainer toasts={toasts} />
      </AppCtx.Provider>
    </AuthCtx.Provider>
  );
}
