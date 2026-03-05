"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./adminDashboard";
import AdminTeachers from "./all teachers/AdminTeachers";
import AdminClasses from "./Allclases/AdminClasses";
import AdminAllStudents from "./allstudents/AdminAllStudents";

function ComingSoon({ title, onMenu }) {
  return (
    <div className="w-full min-h-[60vh] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
        <button
          onClick={onMenu}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          Menu
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">This section is not implemented yet.</p>
    </div>
  );
}

export default function AdminClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("tab") || "dashboard";
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMenu = () => setMobileOpen(true);
  const handleNav = (tab) => {
    router.push(`/admin?tab=${tab}`);
    setMobileOpen(false);
  };

  const content = useMemo(() => {
    if (currentPage === "dashboard") return <AdminDashboard onMenu={openMenu} />;
    if (currentPage === "teachers") return <AdminTeachers onMenu={openMenu} />;
    if (currentPage === "classes") return <AdminClasses onMenu={openMenu} />;
    if (currentPage === "students") return <AdminAllStudents onMenu={openMenu} />;
    return <AdminDashboard onMenu={openMenu} />;
  }, [currentPage]);

  return (
    <div className="flex min-h-dvh w-full overflow-x-hidden bg-[rgba(15,20,35,0.95)]">
      <AdminSidebar
        currentPage={currentPage}
        onNav={handleNav}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden lg:pl-64">{content}</main>
    </div>
  );
}
