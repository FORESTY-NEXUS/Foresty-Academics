"use client";

import { useEffect, useState } from "react";
import { MessageSquare, FileText, RefreshCw, AlertCircle } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import Badge from "../../../admin/Badge";

export default function TeacherInbox({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feeQueries, setFeeQueries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [appReplyDrafts, setAppReplyDrafts] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [sendingApp, setSendingApp] = useState({});

  const loadInbox = async () => {
    try {
      setLoading(true);
      setError("");
      const [feeRes, appRes] = await Promise.all([
        fetch("/api/teacher/fee-queries", { credentials: "include" }),
        fetch("/api/teacher/applications", { credentials: "include" }),
      ]);

      const feeJson = await feeRes.json();
      const appJson = await appRes.json();

      if (!feeRes.ok || !feeJson.success) throw new Error(feeJson?.message || "Failed to load fee queries");
      if (!appRes.ok || !appJson.success) throw new Error(appJson?.message || "Failed to load applications");

      setFeeQueries(Array.isArray(feeJson.data) ? feeJson.data : []);
      setApplications(Array.isArray(appJson.data) ? appJson.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load inbox");
    } finally {
      setLoading(false);
    }
  };

  const sendFeeReply = async (queryId) => {
    const replyMessage = (replyDrafts[queryId] || "").trim();
    if (!replyMessage) {
      setError("Please enter a reply message.");
      return;
    }
    try {
      setSendingReply((prev) => ({ ...prev, [queryId]: true }));
      const response = await fetch("/api/teacher/fee-queries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ queryId, replyMessage }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to reply");
      setReplyDrafts((prev) => ({ ...prev, [queryId]: "" }));
      await loadInbox();
    } catch (err) {
      setError(err?.message || "Failed to reply");
    } finally {
      setSendingReply((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  const updateApplication = async (applicationId, status) => {
    const replyMessage = (appReplyDrafts[applicationId] || "").trim();
    try {
      setSendingApp((prev) => ({ ...prev, [applicationId]: true }));
      const response = await fetch("/api/teacher/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicationId, status, replyMessage }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to update application");
      await loadInbox();
    } catch (err) {
      setError(err?.message || "Failed to update application");
    } finally {
      setSendingApp((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading inbox...</p>
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
            onClick={loadInbox}
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
        title="Inbox"
        subtitle="Fee queries and student applications"
        onMenuClick={onMenu}
        actions={
          <button
            onClick={loadInbox}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Fee Queries</h3>
          </div>

          <div className="space-y-3">
            {feeQueries.map((query) => (
              <div key={query.id} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {query.studentName} {query.rollNumber ? `(${query.rollNumber})` : ""}
                  </p>
                  <Badge text={query.status} color={query.status === "Replied" ? "green" : "amber"} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{query.classLabel}</p>
                <p className="mt-2 text-xs font-semibold text-gray-600">{query.category}</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{query.message}</p>
                {query.attachmentUrl && (
                  <a className="mt-2 block text-xs text-blue-600 hover:underline" href={query.attachmentUrl} target="_blank" rel="noreferrer">
                    View Attachment
                  </a>
                )}
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={replyDrafts[query.id] ?? query.replyMessage ?? ""}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [query.id]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    placeholder="Write a reply..."
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => sendFeeReply(query.id)}
                      disabled={sendingReply[query.id]}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sendingReply[query.id] ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!feeQueries.length && <p className="text-sm text-gray-500">No fee queries yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Applications</h3>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {app.studentName} {app.rollNumber ? `(${app.rollNumber})` : ""}
                  </p>
                  <Badge text={app.status} color={app.status === "Approved" ? "green" : app.status === "Rejected" ? "red" : "amber"} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{app.classLabel}</p>
                <p className="mt-2 text-xs font-semibold text-gray-600">{app.type}</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">{app.subject}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{app.message}</p>
                {app.attachmentUrl && (
                  <a className="mt-2 block text-xs text-blue-600 hover:underline" href={app.attachmentUrl} target="_blank" rel="noreferrer">
                    View Attachment
                  </a>
                )}
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={2}
                    value={appReplyDrafts[app.id] ?? app.replyMessage ?? ""}
                    onChange={(e) => setAppReplyDrafts((prev) => ({ ...prev, [app.id]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    placeholder="Optional reply message..."
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => updateApplication(app.id, "Approved")}
                      disabled={sendingApp[app.id]}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateApplication(app.id, "Rejected")}
                      disabled={sendingApp[app.id]}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!applications.length && <p className="text-sm text-gray-500">No applications yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
