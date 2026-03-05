"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Plus, RefreshCw, Search, Trash2, UserPlus, Users, X } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import Badge from "../../../admin/Badge";
import DataTable from "../../../admin/DataTable";

const INITIAL_FORM = {
  fullName: "",
  fatherName: "",
  phoneNumber: "",
  address: "",
  rollNumber: "",
  password: "",
  feesStatus: "unpaid",
  pendingFees: 1000,
};

export default function TeacherStudents({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const loadStudents = async (classId) => {
    try {
      setLoading(true);
      setError("");
      const qs = classId ? `?classId=${classId}` : "";
      const response = await fetch(`/api/teacher/students${qs}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json?.message || "Failed to load students");
      }
      setData(json.data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const students = data?.students || [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = (s.fullName || "").toLowerCase();
      const roll = (s.rollNumber || "").toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [students, search]);

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setProfilePhoto(null);
    setFormError("");
    setCreateOpen(true);
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setForm({
      fullName: student.fullName || "",
      fatherName: student.fatherName || "",
      phoneNumber: student.phoneNumber || "",
      address: student.address || "",
      rollNumber: student.rollNumber || "",
      password: "",
      feesStatus: student.feesStatus || "unpaid",
      pendingFees: student.pendingFees || 0,
    });
    setFormError("");
    setEditOpen(true);
  };

  const submitCreate = async () => {
    if (!form.fullName.trim() || !form.fatherName.trim() || !form.rollNumber.trim() || !form.password.trim()) {
      setFormError("Name, father name, roll number and password are required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const payload = new FormData();
      payload.append("classId", data?.currentClass?._id || "");
      payload.append("fullName", form.fullName.trim());
      payload.append("fatherName", form.fatherName.trim());
      payload.append("address", form.address.trim());
      payload.append("phoneNumber", form.phoneNumber.trim());
      payload.append("rollNumber", form.rollNumber.trim());
      payload.append("password", form.password);
      payload.append("feesStatus", form.feesStatus);
      payload.append("pendingFees", String(Number(form.pendingFees) || 0));
      if (profilePhoto) payload.append("profilePhoto", profilePhoto);

      const response = await fetch("/api/teacher/student/create", {
        method: "POST",
        credentials: "include",
        body: payload,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to create student");

      setCreateOpen(false);
      setProfilePhoto(null);
      await loadStudents(data?.currentClass?._id);
    } catch (err) {
      setFormError(err.message || "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedStudent?._id) return;
    if (!form.fullName.trim() || !form.fatherName.trim() || !form.rollNumber.trim()) {
      setFormError("Name, father name and roll number are required");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      const response = await fetch("/api/teacher/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: selectedStudent._id,
          fullName: form.fullName.trim(),
          fatherName: form.fatherName.trim(),
          rollNumber: form.rollNumber.trim(),
          phoneNumber: form.phoneNumber.trim(),
          address: form.address.trim(),
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to update student");

      setEditOpen(false);
      await loadStudents(data?.currentClass?._id);
    } catch (err) {
      setFormError(err.message || "Failed to update student");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Remove ${student.fullName}?`)) return;
    try {
      const response = await fetch(`/api/teacher/students?studentId=${student._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to delete student");
      await loadStudents(data?.currentClass?._id);
    } catch (err) {
      setError(err.message || "Failed to delete student");
    }
  };

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
            onClick={() => loadStudents(data?.currentClass?._id)}
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
        title="Students"
        subtitle={data?.currentClass ? `${data.currentClass.name} (${data.currentClass.year})` : "No class assigned"}
        onMenuClick={onMenu}
        actions={
          <div className="inline-flex items-center gap-2">
            <select
              value={data?.currentClass?._id || ""}
              onChange={(e) => loadStudents(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              {(data?.assignedClasses || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.year})
                </option>
              ))}
            </select>
            <button
              onClick={openCreate}
              disabled={!data?.currentClass}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" /> Add Student
            </button>
          </div>
        }
      />

      {!data?.currentClass ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-700 dark:bg-amber-900/20">
          <AlertCircle className="mx-auto mb-2 text-amber-500" size={32} />
          <p className="font-semibold text-amber-700 dark:text-amber-300">No class assigned to you yet</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none ring-green-500 transition focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Search by name or roll number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Badge text={`${filtered.length} students`} color="blue" />
          </div>

          <DataTable
            columns={[
              { key: "rollNumber", label: "Roll Number" },
              { key: "fullName", label: "Student" },
              { key: "fatherName", label: "Father Name" },
              { key: "phoneNumber", label: "Phone" },
              {
                key: "feesStatus",
                label: "Fees",
                render: (row) => <Badge text={(row.feesStatus || "unpaid").toUpperCase()} color={row.feesStatus === "paid" ? "green" : row.feesStatus === "partial" ? "amber" : "red"} />,
              },
              {
                key: "actions",
                label: "",
                render: (row) => (
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-500 dark:hover:bg-gray-800">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteStudent(row)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={filtered}
            emptyMsg="No students found"
          />
        </div>
      )}

      {(createOpen || editOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{createOpen ? "Add Student" : "Edit Student"}</h3>
              <button
                onClick={() => {
                  setCreateOpen(false);
                  setEditOpen(false);
                  setProfilePhoto(null);
                }}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="Full name" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input value={form.rollNumber} onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))} placeholder="Roll number (4 digits)" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input value={form.fatherName} onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))} placeholder="Father name" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} placeholder="Phone number" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Address" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 sm:col-span-2" />
              {createOpen && (
                <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 sm:col-span-2" />
              )}
              {createOpen && (
                <>
                  <select value={form.feesStatus} onChange={(e) => setForm((f) => ({ ...f, feesStatus: e.target.value }))} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <input type="number" value={form.pendingFees} onChange={(e) => setForm((f) => ({ ...f, pendingFees: e.target.value }))} placeholder="Pending fees" className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
                  <div className="sm:col-span-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1 file:text-white dark:border-gray-700 dark:bg-gray-800"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Optional profile photo (JPG, PNG, WEBP, GIF, max 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>

            {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  setCreateOpen(false);
                  setEditOpen(false);
                  setProfilePhoto(null);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={createOpen ? submitCreate : submitEdit}
                className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Saving..." : createOpen ? "Create Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
