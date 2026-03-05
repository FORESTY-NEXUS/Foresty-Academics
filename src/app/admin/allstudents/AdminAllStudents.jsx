"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, Users, Wallet } from "lucide-react";
import PageHeader from "../PageHeader";
import Badge from "../Badge";
import DataTable from "../DataTable";

export default function AdminAllStudents({ onMenu }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchStudents = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/students");
      if (!response.ok) throw new Error("Failed to fetch students");

      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch students");

      setStudents(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

    const intervalId = setInterval(() => {
      fetchStudents({ silent: true });
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;

    return students.filter((student) => {
      const fullName = (student.fullName || "").toLowerCase();
      const rollNumber = (student.rollNumber || "").toLowerCase();
      const fatherName = (student.fatherName || "").toLowerCase();
      return fullName.includes(q) || rollNumber.includes(q) || fatherName.includes(q);
    });
  }, [students, search]);

  const totalStudents = students.length;
  const paidCount = students.filter((s) => s.feesStatus === "paid").length;
  const pendingAmount = students.reduce((sum, s) => sum + (s.pendingFees || 0), 0);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading students...</p>
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
            onClick={() => fetchStudents()}
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
        title="All Students"
        subtitle="Live data from your institute database"
        onMenuClick={onMenu}
        actions={
          <button
            onClick={() => fetchStudents()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Paid Students</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{paidCount}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Pending Fees</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">Rs {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none ring-green-500 transition focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Search by name, roll, father"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Badge text={`${filteredStudents.length} results`} color="gray" />
        </div>

        <DataTable
          columns={[
            { key: "rollNumber", label: "Roll Number" },
            { key: "fullName", label: "Name" },
            { key: "fatherName", label: "Father Name" },
            { key: "phoneNumber", label: "Contact" },
            {
              key: "feesStatus",
              label: "Fee Status",
              render: (row) => {
                const status = (row.feesStatus || "unpaid").toLowerCase();
                const color = status === "paid" ? "green" : status === "partial" ? "amber" : "red";
                return <Badge text={status.toUpperCase()} color={color} />;
              },
            },
            {
              key: "pendingFees",
              label: "Pending Fees",
              render: (row) => `Rs ${(row.pendingFees || 0).toLocaleString()}`,
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
          data={filteredStudents}
          emptyMsg="No students found"
        />
      </div>
    </div>
  );
}
