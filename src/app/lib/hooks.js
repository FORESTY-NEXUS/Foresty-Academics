import { useContext, createContext } from "react";

// Create the contexts
export const AuthCtx = createContext(null);
export const AppCtx = createContext(null);

// Hook for authentication
export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Hook for app state
export function useApp() {
  const context = useContext(AppCtx);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// Utility: Calculate attendance percentage
export function attendancePct(records) {
  if (!records.length) return 0;
  return Math.round((records.filter(r => r.status === "Present").length / records.length) * 100);
}

// Custom hook: Get teacher's class and students
export function useTeacherClass() {
  const { db } = useApp();
  const { user } = useAuth();
  const cls = db?.classes?.find(c => c.id === user?.classId);
  const students = db?.students?.filter(s => s.classId === cls?.id) || [];
  return { cls, students };
}
