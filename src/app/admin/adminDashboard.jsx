"use client";

import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  DollarSign,
  UserCheck,
  Wallet,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PageHeader from "./PageHeader";
import DataTable from "./DataTable";
import Badge from "./Badge";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ─── Inline sub-components ─── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "blue",
  large,
  onClick,
}) {
  /* Soft pastel icon backgrounds with a matching accent and glow */
  const palette = {
    green: {
      container:
        "bg-emerald-100 dark:bg-emerald-900 shadow-emerald-500/40 dark:shadow-emerald-900/50",
      icon: "text-emerald-600 dark:text-emerald-400",
      ambient: "bg-emerald-400",
    },
    blue: {
      container:
        "bg-indigo-100 dark:bg-indigo-900 shadow-indigo-500/40 dark:shadow-indigo-900/50",
      icon: "text-indigo-600 dark:text-indigo-400",
      ambient: "bg-indigo-400",
    },
    amber: {
      container:
        "bg-amber-100 dark:bg-amber-900 shadow-amber-500/40 dark:shadow-amber-900/50",
      icon: "text-amber-600 dark:text-amber-400",
      ambient: "bg-amber-400",
    },
    red: {
      container:
        "bg-rose-100 dark:bg-rose-900 shadow-rose-500/40 dark:shadow-rose-900/50",
      icon: "text-rose-600 dark:text-rose-400",
      ambient: "bg-rose-400",
    },
    purple: {
      container:
        "bg-violet-100 dark:bg-violet-900 shadow-violet-500/40 dark:shadow-violet-900/50",
      icon: "text-violet-600 dark:text-violet-400",
      ambient: "bg-violet-400",
    },
  };
  const c = palette[color] ?? palette.purple;

  return (
    <div
      className={`group relative mt-7 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* ── Icon container — half overlapping the top edge ── */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-14 h-14 rounded-2xl ${c.container}
            flex items-center justify-center
            shadow-lg
            transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5`}
        >
          <Icon className={`w-6 h-6 ${c.icon}`} strokeWidth={2} />
        </div>
      </div>

      {/* ── Card body ── */}
      <div
        className="relative overflow-hidden rounded-tr-xl

        rounded-bl-xl
         bg-white dark:bg-gray-900/80
          border-2
           border-gray-100 dark:border-gray-800
           
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]
          transition-all duration-300
          px-5 pt-9 pb-5 text-center"
      >
        {/* Inner ambient glow radiating from top-left */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none ${c.ambient}`}
        />
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none ${c.ambient}`}
        />

        {/* Title / Label */}
        <p className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          {label}
        </p>

        {/* Subtitle / secondary info */}
        {sub && (
          <span
            className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full
            bg-gray-100 dark:bg-gray-800
            text-[11px] font-medium text-gray-500 dark:text-gray-400"
          >
            {sub}
          </span>
        )}

        {/* Primary value */}
        <p
          className={`font-extrabold text-gray-900 dark:text-white leading-none mt-3
          ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* custom bar tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        rounded-2xl px-4 py-2.5 shadow-xl text-sm"
      >
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          {label}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
          Students:{" "}
          <span className="font-bold text-gray-800 dark:text-white">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/* progress bar helper — thin & rounded */
function ProgressBar({ pct, color }) {
  return (
    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Main component ─── */
export default function AdminDashboard({ onMenu }) {
  const [showTotalFeesModal, setShowTotalFeesModal] = useState(false);
  const [totalFeesInput, setTotalFeesInput] = useState("");
  const [savingFees, setSavingFees] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalPending: 0,
    totalPaid: 0,
    totalFees: null,
    paidStudents: 0,
    unpaidStudents: 0,
    partialStudents: 0,
    students: [],
    teachers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const json = await response.json();
      if (json.success) {
        setDashboardData(json.data);
        if (json.data.totalFees === null || json.data.totalFees === undefined) {
          setShowTotalFeesModal(true);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditFees = () => {
    setTotalFeesInput(dashboardData.totalFees || "");
    setShowTotalFeesModal(true);
  };

  const handleSaveTotalFees = async () => {
    try {
      setSavingFees(true);
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalFees: totalFeesInput }),
      });
      if (res.ok) {
        setDashboardData((prev) => ({
          ...prev,
          totalFees: Number(totalFeesInput),
        }));
        setShowTotalFeesModal(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingFees(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col justify-center items-center gap-3 text-gray-400 dark:text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium text-center">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              Something went wrong
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {error}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900
              text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalStudents,
    totalTeachers,
    totalPending,
    totalPaid,
    totalFees,
    paidStudents,
    unpaidStudents,
    partialStudents,
  } = dashboardData;

  const collectionRate =
    totalStudents > 0 ? Math.round((paidStudents / totalStudents) * 100) : 0;

  const feeBreakdownData = [
    { name: "Paid", count: paidStudents, fill: "#16a34a" },
    { name: "Unpaid", count: unpaidStudents, fill: "#ef4444" },
    { name: "Partial", count: partialStudents, fill: "#f59e0b" },
  ];

  const feeStats = [
    {
      label: "Paid",
      count: paidStudents,
      pct: totalStudents ? Math.round((paidStudents / totalStudents) * 100) : 0,
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
    },
    {
      label: "Unpaid",
      count: unpaidStudents,
      pct: totalStudents
        ? Math.round((unpaidStudents / totalStudents) * 100)
        : 0,
      bar: "bg-red-500",
      dot: "bg-red-500",
    },
    {
      label: "Partial",
      count: partialStudents,
      pct: totalStudents
        ? Math.round((partialStudents / totalStudents) * 100)
        : 0,
      bar: "bg-amber-400",
      dot: "bg-amber-400",
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="h-full w-full px-4 py-4 sm:px-5 lg:px-6 xl:px-8 lg:py-3 grid gap-3 sm:gap-4 lg:gap-3 lg:grid-rows-[auto_auto_auto_1fr] overflow-y-auto">
      {/* Total Fees Modal */}
      {showTotalFeesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Configure Institution Fees
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please enter the total expected fees for your institution this
              year. This helps track your pending and collected revenue.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                  Total Fees (PKR)
                </label>
                <input
                  type="number"
                  value={totalFeesInput}
                  onChange={(e) => setTotalFeesInput(e.target.value)}
                  placeholder="e.g. 5000000"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div className="flex gap-3">
                {dashboardData.totalFees !== null && (
                  <button
                    onClick={() => setShowTotalFeesModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveTotalFees}
                  disabled={savingFees || !totalFeesInput}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {savingFees ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : null}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Academic year 2025 overview"
        onMenuClick={onMenu}
      />

      {/* ── KPI row: top cards ── */}
      <section className="w-full ">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          Overview
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full  ">
          <StatCard
            icon={Users}
            label="Total Students"
            value={totalStudents}
            color="green"
            large
            className="w-full"
          />

          <StatCard
            icon={GraduationCap}
            label="Total Teachers"
            value={totalTeachers}
            color="blue"
            large
            className="w-full"
          />

          <StatCard
            icon={Wallet}
            label="Total Fees"
            value={totalFees ? `₨ ${formatCurrency(totalFees)}` : "Not Set"}
            color="purple"
            large
            className="w-full"
            onClick={handleEditFees}
            sub="Click to edit"
          />

          <StatCard
            icon={DollarSign}
            label="Pending Fees"
            value={`₨ ${formatCurrency(totalPending)}`}
            color="amber"
            large
            className="w-full"
            onClick={handleEditFees}
            sub="Click to edit Total"
          />

          <StatCard
            icon={Wallet}
            label="Fees Collected"
            value={`₨ ${formatCurrency(totalPaid)}`}
            color="green"
            large
            className="w-full"
            onClick={handleEditFees}
            sub="Click to edit Total"
          />
        </div>
      </section>

      {/* ── Fee status row ── */}
      <section className="min-w-0">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Fee Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <StatCard
            icon={Wallet}
            label="Paid Students"
            value={paidStudents}
            sub="Fee cleared"
            color="green"
          />
          <StatCard
            icon={UserCheck}
            label="Unpaid Students"
            value={unpaidStudents}
            sub="Pending payment"
            color="red"
          />
          <StatCard
            icon={TrendingUp}
            label="Partial Payment"
            value={partialStudents}
            sub="Partial fee paid"
            color="amber"
          />
        </div>
      </section>

      {/* ── Charts / Stats ── */}
      <section className="w-full">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Bar chart — spans 3/5 */}
          <div
            className="lg:col-span-3 bg-white dark:bg-gray-900/80 rounded-3xl p-5 lg:p-6
      border border-gray-100 dark:border-gray-800
      shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-[350px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                Fee Status Distribution
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                by student count
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={feeBreakdownData}
                  barSize={40}
                  margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {feeBreakdownData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick stats panel — spans 2/5 */}
          <div
            className="lg:col-span-2 bg-white dark:bg-gray-900/80 rounded-3xl p-5 lg:p-6
      border border-gray-100 dark:border-gray-800
      shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-3 h-[350px]"
          >
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-4">
                Quick Stats
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Total Students
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {totalStudents}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Active Teachers
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {totalTeachers}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Collection Rate
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      collectionRate >= 75
                        ? "text-emerald-600"
                        : collectionRate >= 40
                          ? "text-amber-500"
                          : "text-red-500"
                    }`}
                  >
                    {collectionRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Fee breakdown with progress bars */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Breakdown
              </p>
              {feeStats.map(({ label, count, pct, bar, dot }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      {label}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {count}{" "}
                      <span className="text-gray-300 dark:text-gray-600">
                        ·
                      </span>{" "}
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar pct={pct} color={bar} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
