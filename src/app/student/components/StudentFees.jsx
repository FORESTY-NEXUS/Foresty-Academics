"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Wallet } from "lucide-react";
import PageHeader from "../../admin/PageHeader";

function ProgressBar({ value, color }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <div className="h-full rounded-full transition-all" style={{ width: `${safe}%`, backgroundColor: color }} />
    </div>
  );
}

function toPercent(status) {
  if (status === "Paid") return 100;
  if (status === "Partial") return 50;
  return 0;
}

export default function StudentFees({ onMenu, data }) {
  const fee = data?.fee || null;
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [form, setForm] = useState({
    category: "Payment Issue",
    message: "",
    attachment: null,
  });

  const submitQuery = async () => {
    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");
      if (!form.message.trim()) {
        setFormError("Please enter your message.");
        return;
      }

      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("message", form.message.trim());
      if (form.attachment) formData.append("attachment", form.attachment);

      const response = await fetch("/api/student/fee-queries", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to send query");

      setFormSuccess("Your message has been sent to the teacher.");
      setForm((prev) => ({ ...prev, message: "", attachment: null }));
    } catch (err) {
      setFormError(err?.message || "Failed to send query");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader title="Fee Status" subtitle="Monthly fee information" onMenuClick={onMenu} />
      {!fee ? (
        <div className="py-16 text-center text-gray-400">
          <Wallet size={48} className="mx-auto mb-3 opacity-30" />
          <p>No fee record found</p>
        </div>
      ) : (
        <div className="mt-4 max-w-lg">
          <div
            className={`mb-4 rounded-2xl border p-6 ${
              fee.status === "Paid"
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : fee.status === "Partial"
                ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              {fee.status === "Paid" ? (
                <CheckCircle size={28} className="text-green-600" />
              ) : (
                <AlertCircle size={28} className={fee.status === "Partial" ? "text-blue-600" : "text-amber-600"} />
              )}
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <p
                  className={`text-2xl font-black ${
                    fee.status === "Paid"
                      ? "text-green-700 dark:text-green-400"
                      : fee.status === "Partial"
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {fee.status}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-black/5 py-2 dark:border-white/5">
                <span className="text-sm text-gray-500">Pending Amount</span>
                <span className="text-sm font-bold text-red-500">Rs {Number(fee.pending || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar value={toPercent(fee.status)} color={fee.status === "Paid" ? "#16a34a" : fee.status === "Partial" ? "#2563eb" : "#d97706"} />
              <p className="mt-2 text-right text-xs text-gray-400">{toPercent(fee.status)}% cleared</p>
            </div>
          </div>

          {fee.status !== "Paid" && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
              Please contact your class teacher to update payment status.
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => {
                setContactOpen(true);
                setFormError("");
                setFormSuccess("");
              }}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
            >
              Contact Teacher
            </button>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Contact Teacher</h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                >
                  {["Payment Issue", "Installment Request", "Fee Correction", "Other"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                />
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
                onClick={() => setContactOpen(false)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitQuery}
                disabled={submitting}
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
