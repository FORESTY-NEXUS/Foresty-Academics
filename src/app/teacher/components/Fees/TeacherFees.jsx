"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Edit, RefreshCw, Wallet, X } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import StatCard from "../../../admin/StatCard";
import Badge from "../../../admin/Badge";
import DataTable from "../../../admin/DataTable";

export default function TeacherFees({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feesStatus, setFeesStatus] = useState("unpaid");
  const [pendingFees, setPendingFees] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadFees = async (classId = selectedClassId) => {
    try {
      setLoading(true);
      setError("");
      const qs = classId ? `?classId=${classId}` : "";
      const response = await fetch(`/api/teacher/fees${qs}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load fees");
      setData(json.data);
      setSelectedClassId(json.data?.currentClass?._id || "");
    } catch (err) {
      setError(err.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

  const openEdit = (student) => {
    setSelectedStudent(student);
    setFeesStatus(student.feesStatus || "unpaid");
    setPendingFees(student.pendingFees || 0);
    setFormError("");
    setModalOpen(true);
  };

  const saveFees = async () => {
    if (!selectedStudent?._id) return;
    try {
      setSaving(true);
      setFormError("");
      const response = await fetch("/api/teacher/fees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: selectedStudent._id,
          feesStatus,
          pendingFees: Number(pendingFees) || 0,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to update fees");
      setModalOpen(false);
      await loadFees(selectedClassId);
    } catch (err) {
      setFormError(err.message || "Failed to update fees");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading fees...</p>
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
            onClick={() => loadFees(selectedClassId)}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = data?.summary || { paid: 0, partial: 0, unpaid: 0 };
  const total = (data?.students || []).length;

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader
        title="Fees"
        subtitle={data?.currentClass ? `${data.currentClass.name} (${data.currentClass.year})` : "No class assigned"}
        onMenuClick={onMenu}
        actions={
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              loadFees(e.target.value);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {(data?.assignedClasses || []).map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.year})
              </option>
            ))}
          </select>
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
            <StatCard icon={CheckCircle} label="Paid" value={`${summary.paid}/${total}`} color="green" />
            <StatCard icon={Wallet} label="Partial" value={`${summary.partial}/${total}`} color="blue" />
            <StatCard icon={AlertCircle} label="Unpaid" value={`${summary.unpaid}/${total}`} color="amber" />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
            <DataTable
              columns={[
                { key: "rollNumber", label: "Roll Number" },
                { key: "fullName", label: "Student" },
                {
                  key: "feesStatus",
                  label: "Status",
                  render: (row) => <Badge text={(row.feesStatus || "unpaid").toUpperCase()} color={row.feesStatus === "paid" ? "green" : row.feesStatus === "partial" ? "blue" : "amber"} />,
                },
                {
                  key: "pendingFees",
                  label: "Pending Fees",
                  render: (row) => `Rs ${Number(row.pendingFees || 0).toLocaleString()}`,
                },
                {
                  key: "actions",
                  label: "",
                  render: (row) => (
                    <button
                      onClick={() => openEdit(row)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Edit className="h-3 w-3" /> Update
                    </button>
                  ),
                },
              ]}
              data={data?.students || []}
              emptyMsg="No students found"
            />
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Update Fee Status</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{selectedStudent?.fullName}</p>
            <div className="space-y-3">
              <select value={feesStatus} onChange={(e) => setFeesStatus(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <input type="number" value={pendingFees} onChange={(e) => setPendingFees(e.target.value)} placeholder="Pending fees amount" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800" disabled={saving}>
                Cancel
              </button>
              <button onClick={saveFees} className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

