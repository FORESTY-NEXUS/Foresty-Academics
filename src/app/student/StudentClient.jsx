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

const POLL_MS = 15000;

export default function StudentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("tab") || "dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

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

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      await loadStudentData();
    };
    bootstrap();

    const id = setInterval(async () => {
      if (!cancelled) {
        await loadStudentData({ silent: true });
      }
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const handleNav = useCallback((tab) => {
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
    if (currentPage === "report") return <StudentReportCard onMenu={openMenu} data={data} />;
    return <StudentDashboard onMenu={openMenu} onNav={handleNav} onPhotoSaved={handlePhotoSaved} data={data} />;
  }, [currentPage, data, handleNav, handlePhotoSaved]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgba(15,20,35,0.95)] text-gray-300">
        <p className="text-sm font-medium">Loading student dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgba(15,20,35,0.95)] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-300 bg-white p-6 text-center">
          <p className="mb-3 text-sm text-red-600">{error}</p>
          <button
            onClick={() => loadStudentData()}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[rgba(15,20,35,0.95)]">
      
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
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-hidden">{content}</main>

    </div>
  );
}
