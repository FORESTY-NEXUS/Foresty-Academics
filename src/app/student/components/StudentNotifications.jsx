"use client";

import { useEffect, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import PageHeader from "../../admin/PageHeader";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function StudentNotifications({ onMenu, onSeen }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/student/notifications", { credentials: "include" });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json?.message || "Failed to load notifications");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const markSeen = async () => {
      try {
        await fetch("/api/student/notifications", {
          method: "PATCH",
          credentials: "include",
        });
        if (typeof onSeen === "function") await onSeen();
      } catch {
        // no-op
      }
    };

    markSeen();
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin" />
          <p className="text-sm font-medium">Loading notifications...</p>
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
            onClick={() => loadNotifications()}
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
      <PageHeader title="Notifications" subtitle="Messages from your teachers" onMenuClick={onMenu} />

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
            <Bell size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Notifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Keep track of absence warnings and teacher messages.</p>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 p-4 shadow-sm dark:border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                  {item.kind || "Notification"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.sentAt)}</p>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {item.teacherName && <span>Teacher: {item.teacherName}</span>}
                {item.contextLabel && (
                  <span>
                    {item.contextType ? `${item.contextType}:` : "Class:"} {item.contextLabel}
                  </span>
                )}
                {item.eventDate && <span>Date: {item.eventDate}</span>}
              </div>
            </div>
          ))}
          {!items.length && (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
              No notifications yet. You will see absence warnings and teacher messages here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
