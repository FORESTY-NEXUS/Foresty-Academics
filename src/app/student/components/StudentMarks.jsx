"use client";

import { Award, BarChart2, ClipboardList, TrendingUp } from "lucide-react";
import PageHeader from "../../admin/PageHeader";
import StatCard from "../../admin/StatCard";
import DataTable from "../../admin/DataTable";
import Badge from "../../admin/Badge";

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

export default function StudentMarks({ onMenu, data }) {
  const marks = data?.marks || [];
  const total = marks.reduce((sum, m) => sum + m.obtained, 0);
  const maxTotal = marks.reduce((sum, m) => sum + m.total, 0);
  const avg = maxTotal ? Math.round((total / maxTotal) * 100) : 0;

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader title="My Marks" subtitle="Subject-wise performance" onMenuClick={onMenu} />

      {marks.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Award size={48} className="mx-auto mb-3 opacity-30" />
          <p>No marks recorded yet</p>
        </div>
      ) : (
        <>
          <div className="mb-6 mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon={Award} label="Overall Average" value={`${avg}%`} color="green" />
            <StatCard icon={ClipboardList} label="Subjects" value={marks.length} color="blue" />
            <StatCard
              icon={TrendingUp}
              label="Highest"
              value={`${Math.max(...marks.map((m) => (m.total ? Math.round((m.obtained / m.total) * 100) : 0)))}%`}
              color="purple"
            />
            <StatCard icon={BarChart2} label="Grade" value={gradeLetter(avg)} color={avg >= 75 ? "green" : avg >= 50 ? "amber" : "red"} />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <DataTable
              columns={[
                {
                  key: "subject",
                  label: "Subject",
                  render: (row) => <span className="font-semibold text-gray-800 dark:text-white">{row.subject}</span>,
                },
                { key: "total", label: "Total Marks" },
                { key: "obtained", label: "Obtained", render: (row) => <span className="font-bold">{row.obtained}</span> },
                {
                  key: "pct",
                  label: "Percentage",
                  render: (row) => {
                    const pct = row.total ? Math.round((row.obtained / row.total) * 100) : 0;
                    return (
                      <span style={{ color: gradeColor(pct) }} className="font-bold">
                        {pct}%
                      </span>
                    );
                  },
                },
                {
                  key: "grade",
                  label: "Grade",
                  render: (row) => {
                    const pct = row.total ? Math.round((row.obtained / row.total) * 100) : 0;
                    const badgeColor = pct >= 90 ? "green" : pct >= 70 ? "blue" : pct >= 50 ? "amber" : "red";
                    return <Badge text={gradeLetter(pct)} color={badgeColor} />;
                  },
                },
              ]}
              data={marks}
            />
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
              <span className="text-gray-500">
                Total:{" "}
                <strong>
                  {total}/{maxTotal}
                </strong>
              </span>
              <span className="text-gray-500">
                Overall:{" "}
                <strong style={{ color: gradeColor(avg) }}>
                  {avg}% - {gradeLetter(avg)}
                </strong>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
