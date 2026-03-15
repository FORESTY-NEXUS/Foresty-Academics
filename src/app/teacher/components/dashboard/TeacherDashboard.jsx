"use client";

import { useEffect, useState } from "react";
import { Users, Wallet, AlertCircle, RefreshCw, MessageSquare, FileText } from "lucide-react";
import PageHeader from "../../../admin/PageHeader";
import StatCard from "../../../admin/StatCard";
import Badge from "../../../admin/Badge";

function TeacherDashboard({ onMenu }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [feeQueries, setFeeQueries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [actionError, setActionError] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [appReplyDrafts, setAppReplyDrafts] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [sendingApp, setSendingApp] = useState({});

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/teacher/dashboard", { credentials: "include" });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json?.message || "Failed to load dashboard");
      }

      setData(json.data);
      await Promise.all([loadFeeQueries(), loadApplications()]);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadFeeQueries = async () => {
    try {
      const response = await fetch("/api/teacher/fee-queries", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load fee queries");
      setFeeQueries(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setActionError(err?.message || "Failed to load fee queries");
    }
  };

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/teacher/applications", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load applications");
      setApplications(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setActionError(err?.message || "Failed to load applications");
    }
  };

  const sendFeeReply = async (queryId) => {
    const replyMessage = (replyDrafts[queryId] || "").trim();
    if (!replyMessage) {
      setActionError("Please enter a reply message.");
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
      await loadFeeQueries();
    } catch (err) {
      setActionError(err?.message || "Failed to reply");
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
      await loadApplications();
    } catch (err) {
      setActionError(err?.message || "Failed to update application");
    } finally {
      setSendingApp((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cls = data?.currentClass || null;
  const students = data?.students || [];
  const stats = data?.stats || {
    totalStudents: 0,
    feesPaid: 0,
    feesPartial: 0,
    feesUnpaid: 0,
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading dashboard...</p>
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
            onClick={loadDashboard}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-85 dark:bg-white dark:text-gray-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="mx-4  p-3">
      <PageHeader
        title={cls ? `${cls.name} Dashboard` : "Dashboard"}
        className='m-4'
        subtitle={`Welcome, ${data?.teacher?.fullName ?? "Teacher"}`}
        onMenuClick={onMenu}
        actions={
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />
      </div>

      {!cls && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-700 dark:bg-amber-900/20">
          <AlertCircle className="mx-auto mb-2 text-amber-500" size={32} />
          <p className="font-semibold text-amber-700 dark:text-amber-300">No class assigned to you yet</p>
          <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Contact admin to get a class assigned.</p>
        </div>
      )}

      {cls && (
        <>
          <div className="mb-6 mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 m-4">
            <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="green" />
            <StatCard icon={Wallet} label="Fees Paid" value={stats.feesPaid} color="blue" />
            <StatCard icon={Wallet} label="Fees Partial" value={stats.feesPartial} color="purple" />
            <StatCard icon={Wallet} label="Fees Unpaid" value={stats.feesUnpaid} color="amber" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mx-3">
            <div className="rounded-2xl border border-gray-100/50 bg-white/50 p-5 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/40">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Assigned Classes</h3>
              <div className="space-y-3">
                {data?.assignedClasses?.map((classItem) => (
                  <div key={classItem._id} className="flex items-center justify-between rounded-xl border border-gray-100/50 bg-white/40 px-3 py-2 dark:border-gray-800/50 dark:bg-gray-800/40">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{classItem.name}</p>
                      <p className="text-xs text-gray-500">Year: {classItem.year}</p>
                    </div>
                    <Badge text={`${classItem.studentCount} students`} color="blue" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-2 rounded-2xl border border-gray-100/50 bg-white/50 p-5 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/40">
              <h3 className="mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Students In Current Class</h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center justify-between border-b border-gray-50/50 py-1.5 dark:border-gray-800/50">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{student.fullName}</p>
                      <p className="text-xs text-gray-400">Roll No: {student.rollNumber}</p>
                    </div>
                    <Badge
                      text={(student.feesStatus || "unpaid").toUpperCase()}
                      color={student.feesStatus === "paid" ? "green" : student.feesStatus === "partial" ? "amber" : "red"}
                    />
                  </div>
                ))}
                {!students.length && <p className="text-sm text-gray-500">No students in this class yet.</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 mx-3">
            <div className="rounded-2xl border border-gray-100/50 bg-white/50 p-5 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/40">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Fee Queries</h3>
                </div>
                <button
                  onClick={loadFeeQueries}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Refresh
                </button>
              </div>

              {actionError && <p className="mb-3 text-xs text-red-500">{actionError}</p>}

              <div className="space-y-3">
                {feeQueries.map((query) => (
                  <div key={query.id} className="rounded-xl border border-gray-100/50 bg-white/60 p-3 dark:border-gray-800/50 dark:bg-gray-800/40">
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

            <div className="rounded-2xl border border-gray-100/50 bg-white/50 p-5 shadow-sm backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-900/40">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Applications</h3>
                </div>
                <button
                  onClick={loadApplications}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Refresh
                </button>
              </div>

              {actionError && <p className="mb-3 text-xs text-red-500">{actionError}</p>}

              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="rounded-xl border border-gray-100/50 bg-white/60 p-3 dark:border-gray-800/50 dark:bg-gray-800/40">
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
        </>
      )}
    </div>
  );
}

export default TeacherDashboard;

