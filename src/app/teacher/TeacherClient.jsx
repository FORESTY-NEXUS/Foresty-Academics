"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TeacherSidebar from "./components/dashboard/sidebar/TeacherSidebar";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import TeacherStudents from "./components/Students/TeacherStudents";
import TeacherAttendance from "./components/Attendence/TeacherAttendance";
import TeacherMarks from "./components/marks/TeacherMarks";
import TeacherFees from "./components/Fees/TeacherFees";

export default function TeacherClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("tab") || "dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [teacherUser, setTeacherUser] = useState({ name: "Teacher", role: "teacher" });

  const openMenu = () => setMobileOpen(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTeacher() {
      try {
        const response = await fetch("/api/teacher/dashboard", { credentials: "include" });
        const json = await response.json();
        if (!cancelled && response.ok && json?.success && json?.data?.teacher?.fullName) {
          setTeacherUser({ name: json.data.teacher.fullName, role: "teacher" });
        }
      } catch {
        // keep fallback label when fetch fails
      }
    }

    loadTeacher();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNav = (tab) => {
    router.push(`/teacher?tab=${tab}`);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // no-op: route fallback still redirects user to login
    } finally {
      router.push("/login");
    }
  };

  const content = useMemo(() => {
    if (currentPage === "dashboard") return <TeacherDashboard onMenu={openMenu} />;
    if (currentPage === "students") return <TeacherStudents onMenu={openMenu} />;
    if (currentPage === "attendance") return <TeacherAttendance onMenu={openMenu} />;
    if (currentPage === "marks") return <TeacherMarks onMenu={openMenu} />;
    if (currentPage === "fees") return <TeacherFees onMenu={openMenu} />;
    return <TeacherDashboard onMenu={openMenu} />;
  }, [currentPage]);

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[rgba(15,20,35,0.95)]">
      <TeacherSidebar
        currentPage={currentPage}
        onNav={handleNav}
        onLogout={handleLogout}
        user={teacherUser}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden lg:pl-64">{content}</main>
    </div>
  );
}
