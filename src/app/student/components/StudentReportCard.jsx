"use client";

import { BookMarked, Printer } from "lucide-react";
import PageHeader from "../../admin/PageHeader";

function attendancePct(records) {
  if (!Array.isArray(records) || !records.length) return 0;
  const present = records.filter((r) => r.status === "Present").length;
  return Math.round((present / records.length) * 100);
}

function gradeLetter(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

function gradeColor(pct) {
  if (pct >= 90) return "#16a34a";
  if (pct >= 70) return "#2563eb";
  if (pct >= 50) return "#d97706";
  return "#dc2626";
}

export default function StudentReportCard({ onMenu, data }) {
  const user = data?.user || { name: "Student" };
  const student = data?.student || null;
  const cls = data?.cls || null;
  const teacher = data?.teacher || null;
  const marks = data?.marks || [];
  const attendance = data?.attendance || [];

  const pct = attendancePct(attendance);
  const total = marks.reduce((sum, m) => sum + m.obtained, 0);
  const maxTotal = marks.reduce((sum, m) => sum + m.total, 0);
  const avg = maxTotal ? Math.round((total / maxTotal) * 100) : 0;

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader
        title="Report Card"
        subtitle="Academic report"
        onMenuClick={onMenu}
        actions={
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Printer size={15} /> Print
          </button>
        }
      />

      <div className="mt-4 max-w-3xl rounded-2xl border-2 border-green-200 bg-white p-4 sm:p-6 lg:p-8 dark:border-green-800 dark:bg-gray-900" id="report-card">
        <div className="mb-5 border-b-2 border-green-700 pb-5 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <BookMarked size={28} className="text-green-700" />
            <div>
              <h1 className="text-xl font-black text-green-900 sm:text-2xl dark:text-green-600">FORESTY ACADEMICS</h1>
              <p className="text-sm text-gray-500">Progress Report</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            {[
              ["Name", user.name],
              ["Class", cls?.name],
              ["Roll No.", student?.roll],
              ["Year", cls?.year],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2 text-sm">
                <span className="w-20 shrink-0 text-gray-400 sm:w-24">{label}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{value || "-"}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              ["Father", student?.fatherName],
              ["Contact", student?.contact],
              ["Teacher", teacher?.name],
              ["Date", new Date().toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2 text-sm">
                <span className="w-20 shrink-0 text-gray-400 sm:w-24">{label}:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{value || "-"}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">Academic Performance</h3>
        <div className="mb-5 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[560px] text-xs sm:text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                {["Subject", "Total", "Obtained", "Percentage", "Grade"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 text-left text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marks.map((m, idx) => {
                const p = m.total ? Math.round((m.obtained / m.total) * 100) : 0;
                return (
                  <tr key={m.id || `${m.subject}-${idx}`} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                    <td className="px-3 py-2 font-medium">{m.subject}</td>
                    <td className="whitespace-nowrap px-3 py-2">{m.total}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-bold">{m.obtained}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-bold" style={{ color: gradeColor(p) }}>
                      {p}%
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-bold">{gradeLetter(p)}</td>
                  </tr>
                );
              })}
              <tr className="bg-green-50 font-bold dark:bg-green-900/20">
                <td className="px-3 py-2">TOTAL</td>
                <td className="whitespace-nowrap px-3 py-2">{maxTotal}</td>
                <td className="whitespace-nowrap px-3 py-2">{total}</td>
                <td className="whitespace-nowrap px-3 py-2" style={{ color: gradeColor(avg) }}>
                  {avg}%
                </td>
                <td className="whitespace-nowrap px-3 py-2">{gradeLetter(avg)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Overall Grade", gradeLetter(avg), gradeColor(avg)],
            ["Percentage", `${avg}%`, gradeColor(avg)],
            ["Attendance", `${pct}%`, pct >= 75 ? "#16a34a" : "#d97706"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
              <p className="mb-1 text-xs text-gray-400">{label}</p>
              <p className="text-2xl font-black" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <span>Generated: {new Date().toLocaleString()}</span>
          <span>Foresty Academics Management System</span>
        </div>
      </div>
    </div>
  );
}
