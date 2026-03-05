"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, CheckCircle, RefreshCw, Users, XCircle } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import StatCard from "../../../admin/StatCard";
import Badge from "../../../admin/Badge";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TeacherAttendance({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(todayStr());
  const [attState, setAttState] = useState({});

  const loadAttendance = async (classId = selectedClassId, selectedDate = date) => {
    try {
      setLoading(true);
      setError("");
      const qs = new URLSearchParams();
      if (classId) qs.set("classId", classId);
      if (selectedDate) qs.set("date", selectedDate);
      const response = await fetch(`/api/teacher/attendance?${qs.toString()}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load attendance");

      const payload = json.data;
      setData(payload);
      setSelectedClassId(payload?.currentClass?._id || "");
      setDate(payload?.date || todayStr());

      const state = {};
      for (const student of payload.students || []) state[student._id] = "Present";
      for (const rec of payload.records || []) state[String(rec.studentId)] = rec.status;
      setAttState(state);
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const presentCount = useMemo(
    () => Object.values(attState).filter((s) => s === "Present").length,
    [attState]
  );
  const totalCount = data?.students?.length || 0;
  const absentCount = totalCount - presentCount;

  const saveAttendance = async () => {
    if (!selectedClassId) return;
    try {
      setSaving(true);
      const records = (data?.students || []).map((s) => ({
        studentId: s._id,
        status: attState[s._id] || "Present",
      }));
      const response = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId: selectedClassId, date, records }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to save attendance");
      await loadAttendance(selectedClassId, date);
    } catch (err) {
      setError(err.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading attendance...</p>
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
            onClick={() => loadAttendance()}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader
        title="Attendance"
        subtitle={data?.currentClass ? `${data.currentClass.name} (${data.currentClass.year})` : "No class assigned"}
        onMenuClick={onMenu}
        actions={
          <div className="inline-flex items-center gap-2">
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                loadAttendance(e.target.value, date);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              {(data?.assignedClasses || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.year})
                </option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => {
                setDate(e.target.value);
                loadAttendance(selectedClassId, e.target.value);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        }
      />

      {!data?.currentClass ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-700 dark:bg-amber-900/20">
          <AlertCircle className="mx-auto mb-2 text-amber-500" size={32} />
          <p className="font-semibold text-amber-700 dark:text-amber-300">No class assigned to you yet</p>
        </div>
      ) : (
        <>
          <div className="mt-4 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard icon={Users} label="Total Students" value={totalCount} color="blue" />
            <StatCard icon={CheckCircle} label="Present" value={presentCount} color="green" />
            <StatCard icon={XCircle} label="Absent" value={absentCount} color="red" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Mark Attendance</h3>
                <button
                  onClick={saveAttendance}
                  disabled={saving}
                  className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>

              <div className="mb-3 flex gap-2">
                <button onClick={() => setAttState(Object.fromEntries((data.students || []).map((s) => [s._id, "Present"])))} className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-700">
                  All Present
                </button>
                <button onClick={() => setAttState(Object.fromEntries((data.students || []).map((s) => [s._id, "Absent"])))} className="rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-700">
                  All Absent
                </button>
              </div>

              <div className="space-y-2">
                {(data.students || []).map((student) => (
                  <div key={student._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{student.fullName}</p>
                      <p className="text-xs text-gray-500">Roll: {student.rollNumber}</p>
                    </div>
                    <div className="inline-flex gap-2">
                      {["Present", "Absent"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setAttState((prev) => ({ ...prev, [student._id]: status }))}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            attState[student._id] === status
                              ? status === "Present"
                                ? "bg-green-600 text-white"
                                : "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Attendance Summary</h3>
              <div className="space-y-2">
                {(data.summary || []).map((row) => (
                  <div key={row.studentId} className="flex items-center justify-between border-b border-gray-50 py-2 text-sm dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300">{row.fullName}</p>
                      <p className="text-xs text-gray-500">Roll: {row.rollNumber}</p>
                    </div>
                    <Badge text={`${row.percentage}% (${row.totalDays} days)`} color={row.percentage >= 75 ? "green" : row.percentage >= 50 ? "amber" : "red"} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">Present Students Today</h3>
              <div className="space-y-2">
                {(data?.presentToday || []).map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-gray-800">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{student.fullName}</span>
                    <Badge text={`Roll ${student.rollNumber}`} color="green" />
                  </div>
                ))}
                {!data?.presentToday?.length && <p className="text-sm text-gray-500">No student marked present today.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                Monthly Attendance Graph ({data?.monthKey || "Current Month"})
              </h3>
              <div className="space-y-3">
                {(data?.monthSummary || []).map((row) => (
                  <div key={row.studentId}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{row.fullName}</span>
                      <span className="text-gray-500">
                        {row.percentage}% ({row.presentDays}/{row.totalDays || 0})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${row.percentage}%`,
                          backgroundColor: row.percentage >= 75 ? "#16a34a" : row.percentage >= 50 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                ))}
                {!data?.monthSummary?.length && <p className="text-sm text-gray-500">No monthly attendance data yet.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
