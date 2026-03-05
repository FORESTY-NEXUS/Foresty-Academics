"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Plus, RefreshCw, Search, UserCheck, Users, X } from "lucide-react";
import PageHeader from "../PageHeader";
import Badge from "../Badge";
import DataTable from "../DataTable";

export default function AdminClasses({ onMenu }) {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", year: "2025", teacherId: "" });

  const fetchClasses = async () => {
    const response = await fetch("/api/admin/classes");
    if (!response.ok) throw new Error("Failed to fetch classes");

    const json = await response.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch classes");

    return Array.isArray(json.data) ? json.data : [];
  };

  const fetchTeachers = async () => {
    const response = await fetch("/api/admin/teachers");
    if (!response.ok) throw new Error("Failed to fetch teachers");

    const json = await response.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch teachers");

    return Array.isArray(json.data) ? json.data : [];
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [classData, teacherData] = await Promise.all([fetchClasses(), fetchTeachers()]);
      setClasses(classData);
      setTeachers(teacherData);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return classes;

    return classes.filter((cls) => {
      const name = (cls.name || "").toLowerCase();
      const year = String(cls.year || "").toLowerCase();
      const teacherName = (cls.teacherName || "").toLowerCase();
      return name.includes(q) || year.includes(q) || teacherName.includes(q);
    });
  }, [classes, search]);

  const totalClasses = classes.length;
  const assignedClasses = classes.filter((c) => c.teacherId).length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  const openCreate = () => {
    setForm({ name: "", year: "2025", teacherId: "" });
    setFormError("");
    setCreateOpen(true);
  };

  const createClass = async () => {
    if (!form.name.trim()) {
      setFormError("Class name is required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const response = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          year: form.year.trim() || "2025",
          teacherId: form.teacherId || null,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to create class");
      }

      setCreateOpen(false);
      await refreshData();
    } catch (err) {
      setFormError(err.message || "Failed to create class");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading classes...</p>
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
            onClick={refreshData}
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
        title="All Classes"
        subtitle="Only admins can create classes and assign teachers"
        onMenuClick={onMenu}
        actions={
          <div className="inline-flex items-center gap-2">
            <button
              onClick={refreshData}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" /> New Class
            </button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Classes</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClasses}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <UserCheck className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Assigned Teacher</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{assignedClasses}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Students</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none ring-green-500 transition focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Search by class, year, teacher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Badge text={`${filteredClasses.length} classes`} color="gray" />
        </div>

        <DataTable
          columns={[
            { key: "name", label: "Class Name" },
            { key: "year", label: "Year" },
            {
              key: "teacher",
              label: "Assigned Teacher",
              render: (row) => (row.teacherName ? row.teacherName : <Badge text="Unassigned" color="amber" />),
            },
            {
              key: "students",
              label: "Students",
              render: (row) => <Badge text={`${row.studentCount || 0} students`} color="blue" />,
            },
            {
              key: "status",
              label: "Status",
              render: (row) => <Badge text={row.isActive ? "ACTIVE" : "INACTIVE"} color={row.isActive ? "green" : "amber"} />,
            },
            {
              key: "createdAt",
              label: "Created",
              render: (row) => {
                if (!row.createdAt) return "-";
                const date = new Date(row.createdAt);
                return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
              },
            },
          ]}
          data={filteredClasses}
          emptyMsg="No classes found"
        />
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Class</h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Class Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Grade 9-A"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none ring-green-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Academic Year</label>
                <input
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="2025"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none ring-green-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Assign Teacher</label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm((f) => ({ ...f, teacherId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none ring-green-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="">No teacher assigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={createClass}
                className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
