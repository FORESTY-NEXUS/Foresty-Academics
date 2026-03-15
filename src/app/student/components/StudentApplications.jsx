"use client";

import { useEffect, useState } from "react";
import { FileText, RefreshCw } from "lucide-react";
import PageHeader from "../../admin/PageHeader";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function statusColor(status) {
  if (status === "Approved") return "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-900/20";
  if (status === "Rejected") return "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-900/20";
  return "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/20";
}

export default function StudentApplications({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [form, setForm] = useState({
    type: "Leave",
    subject: "",
    message: "",
    startDate: "",
    endDate: "",
    attachment: null,
  });

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/student/applications", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load applications");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      if (!form.subject.trim()) {
        setFormError("Subject is required.");
        return;
      }
      if (!form.message.trim()) {
        setFormError("Message is required.");
        return;
      }

      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("subject", form.subject.trim());
      formData.append("message", form.message.trim());
      if (form.startDate) formData.append("startDate", form.startDate);
      if (form.endDate) formData.append("endDate", form.endDate);
      if (form.attachment) formData.append("attachment", form.attachment);

      const response = await fetch("/api/student/applications", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to submit application");

      setFormSuccess("Application submitted successfully.");
      setForm((prev) => ({ ...prev, subject: "", message: "", startDate: "", endDate: "", attachment: null }));
      await loadApplications();
    } catch (err) {
      setFormError(err?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-200 bg-white p-6 text-center dark:border-red-900/40 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => loadApplications()}
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
        title="Applications"
        subtitle="Submit formal requests to your teacher"
        onMenuClick={onMenu}
        actions={
          <button
            onClick={() => {
              setOpen(true);
              setFormError("");
              setFormSuccess("");
            }}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            New Application
          </button>
        }
      />

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Applications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track status and replies from your teacher.</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 p-4 shadow-sm dark:border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.subject}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Type: {item.type}</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {item.startDate && <span>Start: {item.startDate}</span>}
                {item.endDate && <span>End: {item.endDate}</span>}
                <span>Submitted: {formatDate(item.createdAt)}</span>
              </div>
              {item.replyMessage && (
                <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200">
                  Reply: {item.replyMessage}
                </div>
              )}
            </div>
          ))}
          {!items.length && (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
              No applications yet. Submit a new request to get started.
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">New Application</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Application Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  {[
                    "Leave",
                    "Fee Extension",
                    "Class Change",
                    "Exam Recheck",
                    "General Request",
                    "Other",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Subject/Title</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Message / Explanation</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-500">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Attachment (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((prev) => ({ ...prev, attachment: e.target.files?.[0] || null }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
              </div>

              {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
              {formSuccess && <p className="text-xs font-medium text-green-600 dark:text-green-400">{formSuccess}</p>}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
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
