"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Paperclip } from "lucide-react";
import PageHeader from "../../admin/PageHeader";
import Badge from "../../admin/Badge";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function statusColor(status) {
  if (status === "Reviewed") return "green";
  if (status === "Late") return "red";
  if (status === "Submitted") return "blue";
  return "amber";
}

export default function StudentAssignments({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ textResponse: "", attachments: [] });

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/student/assignments", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load assignments");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (assignmentId) => {
    try {
      setSubmitting(true);
      setFormError("");

      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("textResponse", form.textResponse.trim());
      for (const file of form.attachments) {
        formData.append("attachments", file);
      }

      const response = await fetch("/api/student/assignments", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to submit assignment");

      setForm({ textResponse: "", attachments: [] });
      setOpenId("");
      await loadAssignments();
    } catch (err) {
      setFormError(err?.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
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
        subtitle="Submit your homework online"
        onMenuClick={onMenu}
        actions={
          <button
            onClick={loadAssignments}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4">
        {items.map((assignment) => (
          <div key={assignment.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{assignment.title}</p>
                <p className="text-xs text-gray-500">Due: {formatDate(assignment.dueAt)}</p>
              </div>
              <Badge text={assignment.status} color={statusColor(assignment.status)} />
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
            {assignment.submission && (
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200">
                <p>Submitted: {formatDate(assignment.submission.submittedAt)}</p>
                {assignment.submission.grade !== null && <p>Grade: {assignment.submission.grade}</p>}
                {assignment.submission.feedback && <p>Feedback: {assignment.submission.feedback}</p>}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setOpenId(assignment.id);
                  setFormError("");
                }}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
              >
                {assignment.submission ? "Update Submission" : "Submit Homework"}
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            No assignments yet.
          </div>
        )}
      </div>

      {openId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Submit Homework</h3>
              <button
                onClick={() => setOpenId("")}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Written Response</label>
                <textarea
                  rows={4}
                  value={form.textResponse}
                  onChange={(e) => setForm((prev) => ({ ...prev, textResponse: e.target.value }))}
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
                onClick={() => setOpenId("")}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => submitAssignment(openId)}
                disabled={submitting}
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
