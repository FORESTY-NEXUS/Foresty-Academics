"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import StudentSidebar from "./components/StudentSidebar";
import StudentDashboard from "./components/StudentDashboard";
import StudentAttendancePage from "./components/StudentAttendancePage";
import StudentMarks from "./components/StudentMarks";
import StudentFees from "./components/StudentFees";
import StudentReportCard from "./components/StudentReportCard";
import StudentNotifications from "./components/StudentNotifications";
import StudentApplications from "./components/StudentApplications";
import StudentAssignments from "./components/StudentAssignments";

const POLL_MS = 15000;

export default function StudentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("tab") || "dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const openMenu = () => setMobileOpen(true);

  const loadStudentData = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");

      const response = await fetch("/api/student/dashboard", { credentials: "include" });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.message || "Failed to load student dashboard");
      }

      setData(json.data);
    } catch (err) {
      setError(err?.message || "Failed to load student dashboard");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadNotificationsCount = async () => {
    try {
      const response = await fetch("/api/student/notifications?count=1", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json?.success) return;
      const total = Number(json?.data?.total || 0);
      if (Number.isFinite(total)) setNotificationsCount(total);
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      await loadStudentData();
      await loadNotificationsCount();
    };
    bootstrap();

    const id = setInterval(async () => {
      if (!cancelled) {
        await loadStudentData({ silent: true });
        await loadNotificationsCount();
      }
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const handleNav = useCallback((tab) => {
    if (tab === "notifications") {
      setNotificationsCount(0);
    }
    router.push(`/student?tab=${tab}`);
    setMobileOpen(false);
  }, [router]);

  const handlePhotoSaved = useCallback((url) => {
    setData((prev) => {
      if (!prev?.student) return prev;
      return {
        ...prev,
        student: {
          ...prev.student,
          profilePhoto: url || "",
        },
      };
    });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {
      // no-op
    } finally {
      router.push("/login");
    }
  };

  const content = useMemo(() => {
    if (currentPage === "dashboard") return <StudentDashboard onMenu={openMenu} onNav={handleNav} onPhotoSaved={handlePhotoSaved} data={data} />;
    if (currentPage === "attendance") return <StudentAttendancePage onMenu={openMenu} data={data} />;
    if (currentPage === "marks") return <StudentMarks onMenu={openMenu} data={data} />;
    if (currentPage === "fees") return <StudentFees onMenu={openMenu} data={data} />;
    if (currentPage === "assignments") return <StudentAssignments onMenu={openMenu} />;
    if (currentPage === "report") return <StudentReportCard onMenu={openMenu} data={data} />;
    if (currentPage === "notifications") {
      return <StudentNotifications onMenu={openMenu} onSeen={loadNotificationsCount} />;
    }
    if (currentPage === "applications") return <StudentApplications onMenu={openMenu} />;
    return <StudentDashboard onMenu={openMenu} onNav={handleNav} onPhotoSaved={handlePhotoSaved} data={data} />;
  }, [currentPage, data, handleNav, handlePhotoSaved]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-300">
        <p className="text-sm font-medium">Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-gray-950 px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-900/40 bg-gray-900 p-6 text-center shadow-lg">
          <p className="text-sm font-medium text-gray-300">{error}</p>
          <button
            onClick={() => loadStudentData()}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-gray-950">
      
      {/* Mobile Menu Button */}
      {/* <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg  p-3 text-white shadow-lg hover:bg-green-600 transition-colors lg:hidden"
        aria-label={mobileOpen ? "Close student menu" : "Open student menu"}
      >
       
      </button> */}

      {/* Sidebar */}
      <StudentSidebar
        currentPage={currentPage}
        onNav={handleNav}
        onLogout={handleLogout}
        user={data?.user || { name: "Student", role: "student" }}
        notificationsCount={notificationsCount}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main 
        className="min-w-0 flex-1 overflow-x-hidden bg-cover bg-center bg-no-repeat bg-fixed relative"
        style={{ backgroundImage: `url('/dashboard.png')` }}
      >
        <div className="min-h-full w-full bg-gray-50/80 dark:bg-gray-950/50 backdrop-blur-[2px]">
          {content}
        </div>
      </main>

    </div>
  );
}
