"use client";

import { CheckCircle, GraduationCap, XCircle } from "lucide-react";
import PageHeader from "../../admin/PageHeader";
import StatCard from "../../admin/StatCard";
import Badge from "../../admin/Badge";
import DataTable from "../../admin/DataTable";

function attendancePct(records) {
  if (!Array.isArray(records) || !records.length) return 0;
  const present = records.filter((r) => r.status === "Present").length;
  return Math.round((present / records.length) * 100);
}

export default function StudentAttendancePage({ onMenu, data }) {
  const attendance = data?.attendance || [];
  const presentCount = attendance.filter((r) => r.status === "Present").length;
  const absentCount = attendance.filter((r) => r.status === "Absent").length;
  const pct = attendancePct(attendance);

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader title="Attendance" subtitle="Your attendance record" onMenuClick={onMenu} />

      <div className="mb-6 mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={GraduationCap} label="Overall" value={`${pct}%`} color={pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"} />
        <StatCard icon={CheckCircle} label="Present" value={presentCount} color="green" />
        <StatCard icon={XCircle} label="Absent" value={absentCount} color="red" />
        <StatCard icon={GraduationCap} label="Total Days" value={attendance.length} color="blue" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Recent Attendance</h3>
        <DataTable
          columns={[
            { key: "date", label: "Date" },
            {
              key: "status",
              label: "Status",
              render: (row) => <Badge text={row.status} color={row.status === "Present" ? "green" : "red"} />,
            },
          ]}
          data={attendance}
          emptyMsg="No attendance record found"
        />
      </div>
    </div>
  );
}
