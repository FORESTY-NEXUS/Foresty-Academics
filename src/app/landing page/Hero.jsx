"use client";

import Link from "next/link";

const StatPill = ({ number, label, delay }) => (
  <div
    className="flex flex-col items-center px-5 py-3 rounded-2xl card-glass opacity-0 animate-fade-up"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <span className="font-display text-2xl font-semibold text-gold-400">
      {number}
    </span>
    <span className="font-body text-xs text-ivory-100/50 mt-0.5">{label}</span>
  </div>
);

const DashboardMockup = () => (
  <div className="relative w-full max-w-lg mx-auto">
    <div className="absolute inset-0 bg-forest-500/20 rounded-3xl blur-3xl scale-90" />

    <div
      className="relative rounded-2xl overflow-hidden border border-gold-500/15 shadow-2xl shadow-forest-950/60 animate-float"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,41,18,0.95) 0%, rgba(10,26,12,0.98) 100%)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gold-500/10">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="flex-1 ml-2 h-5 rounded-full bg-forest-800/80 flex items-center px-3">
          <span className="font-mono text-[10px] text-ivory-100/30">
            foresty.academics/teacher/dashboard
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-xs text-ivory-100/50">
              Class 10-A Dashboard
            </p>
            <p className="font-mono text-[10px] text-ivory-100/30 mt-1">
              Welcome, Teacher
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-forest-500/30 border border-forest-400/20">
            <span className="font-mono text-[10px] text-forest-300">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total", value: "38", color: "text-forest-300" },
            { label: "Paid", value: "21", color: "text-sky-400" },
            { label: "Partial", value: "9", color: "text-gold-400" },
            { label: "Unpaid", value: "8", color: "text-red-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-2.5 bg-forest-800/60 border border-gold-500/8"
            >
              <div
                className={`font-display text-base font-semibold ${stat.color}`}
              >
                {stat.value}
              </div>
              <div className="font-body text-[9px] text-ivory-100/40 mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl p-3 bg-forest-800/40 border border-gold-500/8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[10px] text-ivory-100/50">
                Assigned Classes
              </span>
              <span className="font-mono text-[9px] text-gold-400">
                2 classes
              </span>
            </div>
            <div className="space-y-1.5">
              {[
                { name: "Class 10-A", year: "2026", students: 38 },
                { name: "Class 9-B", year: "2026", students: 32 },
              ].map((cls) => (
                <div
                  key={cls.name}
                  className="rounded-lg border border-gold-500/8 bg-forest-900/60 px-2 py-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[10px] text-ivory-100/75">
                      {cls.name}
                    </span>
                    <span className="font-mono text-[9px] text-sky-300">
                      {cls.students} students
                    </span>
                  </div>
                  <p className="font-mono text-[8px] text-ivory-100/30 mt-0.5">
                    Year: {cls.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-forest-800/40 border border-gold-500/8">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[10px] text-ivory-100/50">
                Current Class Students
              </span>
              <span className="font-mono text-[9px] text-forest-300">10-A</span>
            </div>
            <div className="space-y-1.5">
              {[
                { name: "Aisha ", roll: "1012", status: "PAID" },
                { name: "Sufyan", roll: "1018", status: "PARTIAL" },
                { name: "Yaseen", roll: "1024", status: "UNPAID" },
              ].map((student) => (
                <div
                  key={student.name}
                  className="flex items-center gap-2 rounded-lg border border-gold-500/6 bg-forest-900/50 px-2 py-1.5"
                >
                  <div className="w-6 h-6 rounded-full bg-forest-700/60 flex items-center justify-center font-mono text-[9px] text-ivory-100/70">
                    {student.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-[10px] text-ivory-100/75">
                      {student.name}
                    </p>
                    <p className="font-mono text-[8px] text-ivory-100/35">
                      Roll: {student.roll}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[8px] px-1.5 py-0.5 rounded-full ${
                      student.status === "PAID"
                        ? "bg-forest-500/20 text-forest-300"
                        : student.status === "PARTIAL"
                          ? "bg-gold-500/20 text-gold-300"
                          : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-2xl card-glass border border-gold-500/20 shadow-xl animate-float"
      style={{ animationDelay: "2s" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gold-500/20 flex items-center justify-center text-sm">
          OK
        </div>
        <div>
          <div className="font-body text-xs font-medium text-ivory-100">
            Attendance marked
          </div>
          <div className="font-mono text-[10px] text-gold-400">
            32 students - just now
          </div>
        </div>
      </div>
    </div>

    <div
      className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl card-glass border border-forest-400/20 shadow-xl animate-float"
      style={{ animationDelay: "1s" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-forest-500/20 flex items-center justify-center text-sm">
          R
        </div>
        <div>
          <div className="font-body text-xs font-medium text-ivory-100">
            Report ready
          </div>
          <div className="font-mono text-[10px] text-forest-300">
            Monthly summary
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-grid-forest opacity-10" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] opacity-15"
        style={{
          background: "radial-gradient(ellipse, #276b2f 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[100px] opacity-10"
        style={{
          background: "radial-gradient(ellipse, #c9a84c 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-1/3 left-0 w-full h-px glow-line opacity-20" />
      <div className="absolute bottom-1/4 left-0 w-full h-px glow-line opacity-10" />

      <div className="relative mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(520px,620px)] lg:justify-between lg:gap-20">
          <div className="max-w-2xl space-y-8 justify-self-start">

            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] text-white text-balance">
                Run Your Institute{" "}
                <span
                  className="italic text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #4ade80, #16a34a, #86efac)",
                  }}
                >
                  Without the Chaos
                </span>
              </h1>
            </div>

            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              <p className="font-body text-lg text-white/50 leading-relaxed max-w-lg">
                Foresty Academics gives institute owners a complete command
                center - track attendance in real time, manage students, record
                fees, and generate insightful reports from a single dashboard.
              </p>
            </div>

            <div
              className="opacity-0 animate-fade-up flex flex-wrap gap-3"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:-translate-y-[1.5px] hover:shadow-[0_6px_24px_rgba(22,163,74,0.45)]"
                style={{
                  background: "linear-gradient(135deg,#16a34a,#15803d)",
                  boxShadow:
                    "0 2px 14px rgba(22,163,74,0.3), 0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%)",
                  }}
                />
                Create Your Institute - Free
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="#how-it-works"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-medium text-white/60 border border-white/10 bg-white/[0.04] hover:text-white hover:border-green-500/30 hover:bg-green-500/[0.07] transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6.5 6C6.5 6 7 5 8 5s1.5.5 1.5 1.5c0 1.5-1.5 1.5-1.5 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="12" r="0.75" fill="currentColor" />
                </svg>
                See How It Works
              </Link>
            </div>

            
          </div>

          <div
            className="opacity-0 animate-fade-up hidden justify-self-end lg:block"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <DashboardMockup />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 pt-12 border-t border-gold-500/10">
          <StatPill number="Fast" label="Daily Attendance" delay={600} />
          <StatPill number="Simple" label="Fee Records" delay={700} />
          <StatPill number="Clean" label="Student Profiles" delay={800} />
          <StatPill number="Clear" label="Reports" delay={900} />
        </div>
      </div>
    </section>
  );
}
