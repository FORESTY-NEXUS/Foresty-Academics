"use client";

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
        </div>
      )}
    </div>
  );
}
