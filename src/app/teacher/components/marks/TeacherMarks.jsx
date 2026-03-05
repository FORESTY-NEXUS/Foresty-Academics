"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Edit, Plus, RefreshCw, Trash2, X } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import Badge from "../../../admin/Badge";

function gradeColor(pct) {
  if (pct >= 90) return "green";
  if (pct >= 70) return "blue";
  if (pct >= 50) return "amber";
  return "red";
}

function gradeLetter(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export default function TeacherMarks({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMarkId, setEditingMarkId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [form, setForm] = useState({ subject: "", total: 100, obtained: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMarks = async (classId = selectedClassId) => {
    try {
      setLoading(true);
      setError("");
      const qs = classId ? `?classId=${classId}` : "";
      const response = await fetch(`/api/teacher/marks${qs}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load marks");
      setData(json.data);
      setSelectedClassId(json.data?.currentClass?._id || "");
    } catch (err) {
      setError(err.message || "Failed to load marks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarks();
  }, []);

  const marksByStudent = useMemo(() => {
    const rows = new Map();
    for (const student of data?.students || []) rows.set(String(student._id), []);
    for (const mark of data?.marks || []) {
      const key = String(mark.studentId);
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(mark);
    }
    return rows;
  }, [data]);

  const openCreate = (studentId) => {
    setEditingMarkId(null);
    setSelectedStudentId(studentId);
    setForm({ subject: "", total: 100, obtained: "" });
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (mark) => {
    setEditingMarkId(mark._id);
    setSelectedStudentId(String(mark.studentId));
    setForm({ subject: mark.subject, total: mark.total, obtained: mark.obtained });
    setFormError("");
    setModalOpen(true);
  };

  const saveMark = async () => {
    if (!selectedClassId || !selectedStudentId || !form.subject.trim()) {
      setFormError("Student and subject are required");
      return;
    }
    const total = Number(form.total);
    const obtained = Number(form.obtained);
    if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(obtained) || obtained < 0 || obtained > total) {
      setFormError("Enter valid total and obtained marks");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const endpoint = "/api/teacher/marks";
      const method = editingMarkId ? "PATCH" : "POST";
      const payload = editingMarkId
        ? { markId: editingMarkId, subject: form.subject.trim(), total, obtained }
        : { classId: selectedClassId, studentId: selectedStudentId, subject: form.subject.trim(), total, obtained };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to save mark");

      setModalOpen(false);
      await loadMarks(selectedClassId);
    } catch (err) {
      setFormError(err.message || "Failed to save mark");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMark = async (markId) => {
    if (!window.confirm("Delete this mark?")) return;
    try {
      const response = await fetch(`/api/teacher/marks?markId=${markId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to delete mark");
      await loadMarks(selectedClassId);
    } catch (err) {
      setError(err.message || "Failed to delete mark");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading marks...</p>
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
            onClick={() => loadMarks(selectedClassId)}
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
        title="Marks"
        subtitle={data?.currentClass ? `${data.currentClass.name} (${data.currentClass.year})` : "No class assigned"}
        onMenuClick={onMenu}
        actions={
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              loadMarks(e.target.value);
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
        <div className="mt-4 space-y-4">
          {(data?.students || []).map((student) => {
            const marks = marksByStudent.get(String(student._id)) || [];
            const avg = marks.length
              ? Math.round(marks.reduce((sum, m) => sum + (m.obtained / m.total) * 100, 0) / marks.length)
              : 0;

            return (
              <div key={student._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{student.fullName}</p>
                    <p className="text-xs text-gray-500">Roll: {student.rollNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge text={`AVG ${avg}% (${gradeLetter(avg)})`} color={gradeColor(avg)} />
                    <button
                      onClick={() => openCreate(student._id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-800">
                        <th className="px-2 py-2 text-left">Subject</th>
                        <th className="px-2 py-2 text-left">Total</th>
                        <th className="px-2 py-2 text-left">Obtained</th>
                        <th className="px-2 py-2 text-left">Percentage</th>
                        <th className="px-2 py-2 text-left">Grade</th>
                        <th className="px-2 py-2 text-left" />
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((mark) => {
                        const pct = Math.round((mark.obtained / mark.total) * 100);
                        return (
                          <tr key={mark._id} className="border-b border-gray-50 dark:border-gray-800">
                            <td className="px-2 py-2">{mark.subject}</td>
                            <td className="px-2 py-2">{mark.total}</td>
                            <td className="px-2 py-2">{mark.obtained}</td>
                            <td className="px-2 py-2">{pct}%</td>
                            <td className="px-2 py-2">
                              <Badge text={gradeLetter(pct)} color={gradeColor(pct)} />
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(mark)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-500 dark:hover:bg-gray-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteMark(mark._id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {!marks.length && (
                        <tr>
                          <td colSpan={6} className="px-2 py-4 text-center text-gray-500">
                            No marks yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{editingMarkId ? "Edit Marks" : "Add Marks"}</h3>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <X className="h-4 w-4" />
              </button>
            </div>

            {!editingMarkId && (
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="mb-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                <option value="">Select student</option>
                {(data?.students || []).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.fullName} ({s.rollNumber})
                  </option>
                ))}
              </select>
            )}

            <div className="space-y-3">
              <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Subject" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input type="number" value={form.total} onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))} placeholder="Total marks" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
              <input type="number" value={form.obtained} onChange={(e) => setForm((f) => ({ ...f, obtained: e.target.value }))} placeholder="Obtained marks" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800" />
            </div>

            {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800" disabled={submitting}>
                Cancel
              </button>
              <button onClick={saveMark} className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

