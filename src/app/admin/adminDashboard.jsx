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

/* ─── Inline sub-components (replace with your own if you prefer) ─── */

function StatCard({ icon: Icon, label, value, sub, color = "blue", large }) {
  const palette = {
    green:  { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-800" },
    blue:   { bg: "bg-blue-50   dark:bg-blue-900/20",   icon: "text-blue-600   dark:text-blue-400",   ring: "ring-blue-200   dark:ring-blue-800"   },
    amber:  { bg: "bg-amber-50  dark:bg-amber-900/20",  icon: "text-amber-600  dark:text-amber-400",  ring: "ring-amber-200  dark:ring-amber-800"  },
    red:    { bg: "bg-red-50    dark:bg-red-900/20",    icon: "text-red-600    dark:text-red-400",    ring: "ring-red-200    dark:ring-red-800"    },
  };
  const c = palette[color] ?? palette.blue;

  return (
    <div
      className={`group relative rounded-2xl bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800 shadow-sm 
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        p-3 sm:p-4 xl:p-3 flex items-start gap-2.5 sm:gap-3`}
    >
      {/* subtle background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 blur-2xl ${c.bg}`} />

      <div className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${c.bg} ${c.ring} ring-1
        flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className={`font-bold text-gray-900 dark:text-white leading-tight mt-0.5
          ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* custom bar tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200">{label}</p>
        <p className="text-gray-500 dark:text-gray-400">
          Students: <span className="font-bold text-gray-800 dark:text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/* progress bar helper */
function ProgressBar({ pct, color }) {
  return (
    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full ">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Main component ─── */
export default function AdminDashboard({ onMenu }) {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalPending: 0,
    totalPaid: 0,
    paidStudents: 0,
    unpaidStudents: 0,
    partialStudents: 0,
    students: [],
    teachers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const json = await response.json();
      if (json.success) setDashboardData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
            <p className="font-semibold text-gray-800 dark:text-white">Something went wrong</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
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
    totalStudents, totalTeachers,
    totalPending, totalPaid,
    paidStudents, unpaidStudents, partialStudents,
  } = dashboardData;

  const collectionRate = totalStudents > 0
    ? Math.round((paidStudents / totalStudents) * 100) : 0;

  const feeBreakdownData = [
    { name: "Paid",    count: paidStudents,    fill: "#16a34a" },
    { name: "Unpaid",  count: unpaidStudents,  fill: "#ef4444" },
    { name: "Partial", count: partialStudents, fill: "#f59e0b" },
  ];

  const feeStats = [
    { label: "Paid",    count: paidStudents,    pct: totalStudents ? Math.round((paidStudents    / totalStudents) * 100) : 0, bar: "bg-emerald-500", dot: "bg-emerald-500" },
    { label: "Unpaid",  count: unpaidStudents,  pct: totalStudents ? Math.round((unpaidStudents  / totalStudents) * 100) : 0, bar: "bg-red-500",     dot: "bg-red-500"     },
    { label: "Partial", count: partialStudents, pct: totalStudents ? Math.round((partialStudents / totalStudents) * 100) : 0, bar: "bg-amber-400",   dot: "bg-amber-400"   },
  ];

  return (
    <div className="w-full min-w-0 bg-gray-50 dark:bg-gray-950 lg:h-screen">
      <div className="h-full w-full px-4 py-4 sm:px-5 lg:px-6 xl:px-8 lg:py-3 grid gap-3 sm:gap-4 lg:gap-3 lg:grid-rows-[auto_auto_auto_1fr] overflow-y-auto ">

        {/* ── Header ── */}
        <PageHeader
          title="Admin Dashboard"
          subtitle="Academic year 2025 overview"
          onMenuClick={onMenu}
        />

        {/* ── KPI row: top 4 ── */}
       <section className="w-full ">
  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
    Overview
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
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
      icon={DollarSign}
      label="Pending Fees"
      value={`₨ ${totalPending.toLocaleString()}`}
      color="amber"
      large
      className="w-full"
    />

    <StatCard
      icon={Wallet}
      label="Fees Collected"
      value={`₨ ${totalPaid.toLocaleString()}`}
      color="green"
      large
      className="w-full"
    />
  </div>
</section>

        {/* ── Fee status row ── */}
        <section className="min-w-0">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Fee Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <StatCard icon={Wallet}     label="Paid Students"    value={paidStudents}    sub="Fee cleared"       color="green" />
            <StatCard icon={UserCheck}  label="Unpaid Students"  value={unpaidStudents}  sub="Pending payment"   color="red"   />
            <StatCard icon={TrendingUp} label="Partial Payment"  value={partialStudents} sub="Partial fee paid"  color="amber" />
          </div>
        </section>

        {/* ── Charts / Stats ── */}
     <section className="w-full">
  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
    Analytics
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

    {/* Bar chart — spans 3/5 */}
    <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-4 lg:p-5
      border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
          Fee Status Distribution
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">by student count</span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={feeBreakdownData} barSize={40} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
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
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-4 lg:p-5
      border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between gap-3 h-[350px]">

      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-4">
          Quick Stats
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Students</span>
            <span className="font-bold text-gray-800 dark:text-white">{totalStudents}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Active Teachers</span>
            <span className="font-bold text-gray-800 dark:text-white">{totalTeachers}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Collection Rate</span>
            <span className={`font-bold text-lg ${
              collectionRate >= 75 ? "text-emerald-600" :
              collectionRate >= 40 ? "text-amber-500" : "text-red-500"
            }`}>{collectionRate}%</span>
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
                {count} <span className="text-gray-300 dark:text-gray-600">·</span> {pct}%
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
    </div>
  );
}
