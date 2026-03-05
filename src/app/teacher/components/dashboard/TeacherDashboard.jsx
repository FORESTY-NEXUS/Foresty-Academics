"use client";

import { useEffect, useState } from "react";
import { Users, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import StatCard from "../../../admin/StatCard";
import Badge from "../../../admin/Badge";

function TeacherDashboard({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/teacher/dashboard", { credentials: "include" });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json?.message || "Failed to load dashboard");
      }

      setData(json.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cls = data?.currentClass || null;
  const students = data?.students || [];
  const stats = data?.stats || {
    totalStudents: 0,
    feesPaid: 0,
    feesPartial: 0,
    feesUnpaid: 0,
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-900/40 dark:bg-gray-900">
          <AlertCircle className="h-7 w-7 text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={loadDashboard}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="mx-4 my-3">
      <PageHeader
        title={cls ? `${cls.name} Dashboard` : "Dashboard"}
        className='m-4'
        subtitle={`Welcome, ${data?.teacher?.fullName ?? "Teacher"}`}
        onMenuClick={onMenu}
        actions={
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />
      </div>

      {!cls && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-700 dark:bg-amber-900/20">
          <AlertCircle className="mx-auto mb-2 text-amber-500" size={32} />
          <p className="font-semibold text-amber-700 dark:text-amber-300">No class assigned to you yet</p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Contact admin to get a class assigned.</p>
        </div>
      )}

      {cls && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 m-4">
            <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="green" />
            <StatCard icon={Wallet} label="Fees Paid" value={stats.feesPaid} color="blue" />
            <StatCard icon={Wallet} label="Fees Partial" value={stats.feesPartial} color="purple" />
            <StatCard icon={Wallet} label="Fees Unpaid" value={stats.feesUnpaid} color="amber" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mx-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Assigned Classes</h3>
              <div className="space-y-3">
                {data?.assignedClasses?.map((classItem) => (
                  <div key={classItem._id} className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{classItem.name}</p>
                      <p className="text-xs text-gray-500">Year: {classItem.year}</p>
                    </div>
                    <Badge text={`${classItem.studentCount} students`} color="blue" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl mx-2 border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Students In Current Class</h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center justify-between border-b border-gray-50 py-1.5 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{student.fullName}</p>
                      <p className="text-xs text-gray-400">Roll No: {student.rollNumber}</p>
                    </div>
                    <Badge
                      text={(student.feesStatus || "unpaid").toUpperCase()}
                      color={student.feesStatus === "paid" ? "green" : student.feesStatus === "partial" ? "amber" : "red"}
                    />
                  </div>
                ))}
                {!students.length && <p className="text-sm text-gray-500">No students in this class yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherDashboard;

