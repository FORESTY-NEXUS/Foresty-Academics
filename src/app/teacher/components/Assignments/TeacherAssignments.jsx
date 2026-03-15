"use client";

import { useEffect, useState } from "react";
import { PlusCircle, RefreshCw, AlertCircle, Paperclip } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import Badge from "../../../admin/Badge";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function TeacherAssignments({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ assignedClasses: [], currentClass: null, assignments: [] });
  const [selectedClassId, setSelectedClassId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [submissionsOpenId, setSubmissionsOpenId] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    note: "",
    dueAt: "",
    attachments: [],
  });

  const loadAssignments = async (classId = selectedClassId) => {
    try {
      setLoading(true);
      setError("");
      const qs = new URLSearchParams();
      if (classId) qs.set("classId", classId);
      const response = await fetch(`/api/teacher/assignments?${qs.toString()}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load assignments");
      setData(json.data);
      setSelectedClassId(json.data?.currentClass?._id || "");
    } catch (err) {
      setError(err?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async () => {
    try {
      setFormError("");
      if (!form.title.trim()) {
        setFormError("Title is required.");
        return;
      }
      if (!selectedClassId) {
        setFormError("Select a class.");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("note", form.note.trim());
      if (form.dueAt) formData.append("dueAt", form.dueAt);
      formData.append("classId", selectedClassId);
      for (const file of form.attachments) {
        formData.append("attachments", file);
      }

      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to create assignment");

      setForm({ title: "", description: "", note: "", dueAt: "", attachments: [] });
      setCreateOpen(false);
      await loadAssignments(selectedClassId);
    } catch (err) {
      setFormError(err?.message || "Failed to create assignment");
    }
  };

  const loadSubmissions = async (assignmentId) => {
    try {
      setLoadingSubs(true);
      const qs = new URLSearchParams();
      qs.set("assignmentId", assignmentId);
      const response = await fetch(`/api/teacher/assignments/submissions?${qs.toString()}`, { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load submissions");
      setSubmissions(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load submissions");
    } finally {
      setLoadingSubs(false);
    }
  };

  const gradeSubmission = async (submissionId, grade, feedback) => {
    const response = await fetch("/api/teacher/assignments/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ submissionId, grade, feedback }),
    });
    const json = await response.json();
    if (!response.ok || !json.success) throw new Error(json?.message || "Failed to review submission");
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading assignments...</p>
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
            onClick={() => loadAssignments()}
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
        title="Assignments"
        subtitle="Create and manage class work"
        onMenuClick={onMenu}
        actions={
          <div className="inline-flex items-center gap-2">
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                loadAssignments(e.target.value);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              {(data?.assignedClasses || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.year})
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setCreateOpen(true);
                setFormError("");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <PlusCircle size={16} /> New Assignment
            </button>
            <button
              onClick={() => loadAssignments(selectedClassId)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        {data.assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{assignment.title}</p>
                <p className="text-xs text-gray-500">Due: {formatDate(assignment.dueAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge text={`${assignment.submissionsCount} submissions`} color="blue" />
                <button
                  onClick={() => {
                    setSubmissionsOpenId(assignment.id);
                    loadSubmissions(assignment.id);
                  }}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
                >
                  View Submissions
                </button>
              </div>
            </div>
            {assignment.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{assignment.description}</p>}
            {assignment.note && <p className="mt-2 text-xs text-amber-600">Note: {assignment.note}</p>}
            {assignment.attachments?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {assignment.attachments.map((file) => (
                  <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-gray-600 dark:border-gray-700 dark:text-gray-200">
                    <Paperclip size={12} /> {file.name || "Attachment"}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {!data.assignments.length && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            No assignments yet. Create your first assignment.
          </div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">New Assignment</h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">General Note</label>
                <input
                  value={form.note}
                  onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.dueAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueAt: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setForm((prev) => ({ ...prev, attachments: Array.from(e.target.files || []) }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>
              {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCreateOpen(false)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={createAssignment}
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {submissionsOpenId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Submissions</h3>
              <button
                onClick={() => setSubmissionsOpenId("")}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Close
              </button>
            </div>

            {loadingSubs ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw size={14} className="animate-spin" /> Loading submissions...
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {submissions.map((sub) => (
                  <SubmissionCard key={sub.id} submission={sub} onGrade={gradeSubmission} />
                ))}
                {!submissions.length && <p className="text-sm text-gray-500">No submissions yet.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission, onGrade }) {
  const [grade, setGrade] = useState(submission.grade ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saveReview = async () => {
    try {
      setSaving(true);
      setError("");
      await onGrade(submission.id, grade, feedback);
    } catch (err) {
      setError(err?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {submission.studentName} {submission.rollNumber ? `(${submission.rollNumber})` : ""}
        </p>
        <Badge text={submission.status} color={submission.status === "Reviewed" ? "green" : submission.status === "Late" ? "red" : "blue"} />
      </div>
      {submission.textResponse && <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{submission.textResponse}</p>}
      {submission.attachments?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {submission.attachments.map((file) => (
            <a key={file.url} href={file.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-gray-600 dark:border-gray-700 dark:text-gray-200">
              <Paperclip size={12} /> {file.name || "File"}
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
        <input
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          onClick={saveReview}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Review"}
        </button>
      </div>
    </div>
  );
}
