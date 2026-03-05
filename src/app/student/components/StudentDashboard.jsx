"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Award, GraduationCap, MapPin, Phone, Printer, User, UserCheck, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../../admin/PageHeader";
import StatCard from "../../admin/StatCard";

function attendancePct(records) {
  if (!Array.isArray(records) || !records.length) return 0;
  const present = records.filter((r) => r.status === "Present").length;
  return Math.round((present / records.length) * 100);
}

function ProgressBar({ value, color }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <div className="h-full rounded-full transition-all" style={{ width: `${safe}%`, backgroundColor: color }} />
    </div>
  );
}

export default function StudentDashboard({ onMenu, onNav, onPhotoSaved, data }) {
  const fileInputRef = useRef(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const user = data?.user || { name: "Student" };
  const student = data?.student || null;
  const cls = data?.cls || null;
  const teacher = data?.teacher || null;
  const marks = data?.marks || [];
  const attendance = data?.attendance || [];
  const fee = data?.fee || null;

  const pct = attendancePct(attendance);
  const avgM = marks.length
    ? Math.round(marks.reduce((sum, m) => sum + (m.total ? (m.obtained / m.total) * 100 : 0), 0) / marks.length)
    : 0;

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const onPickPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setPhotoError("");

    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);

    try {
      setUploadingPhoto(true);

      const payload = new FormData();
      payload.append("profilePhoto", file);

      const response = await fetch("/api/student/dashboard", {
        method: "PATCH",
        credentials: "include",
        body: payload,
      });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.message || "Failed to upload profile photo");
      }

      const savedUrl = json?.data?.profilePhoto || "";
      onPhotoSaved?.(savedUrl);

      setLocalPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } catch (error) {
      setPhotoError(error?.message || "Failed to upload profile photo");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const previewUrl = localPreviewUrl || student?.profilePhoto || "";

  return (
    <div className="w-full min-w-0 overflow-x-hidden px-4 py-4 sm:px-5 lg:px-6 lg:py-3 xl:px-8">
      <PageHeader title="My Dashboard" subtitle="Academic Overview" onMenuClick={onMenu} />

      <div className="mb-6 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-green-700 to-green-900 p-6 text-white ">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickPhoto} className="hidden" />
          <div className="mb-5 flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/20 text-3xl font-black ring-2 ring-white/30"
              title="Choose profile photo"
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Profile preview" fill unoptimized className="object-cover" />
              ) : (
                <span>{user.name?.[0] || "S"}</span>
              )}
            </button>
            <div className="space-y-1">
              <h2 className="text-xl font-black">{user.name}</h2>
              <p className="text-sm text-green-200">{cls?.name || "Class not assigned"}</p>
            </div>
          </div>
          <p className="-mt-2 mb-2 text-xs text-green-100/80">
            {uploadingPhoto ? "Uploading photo..." : "Tap photo to upload profile image"}
          </p>
          {photoError && <p className="-mt-1 mb-2 text-xs text-red-200">{photoError}</p>}
          <div className="mt-5 space-y-3 text-sm text-green-100 ">
            {student && (
              <>
                <div className="flex items-center gap-2">
                  <User size={13} /> Roll: <strong>{student.roll}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} /> {student.contact || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} /> {student.address || "-"}
                </div>
                {teacher && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={13} />Class Teacher: <strong>{teacher.name}</strong>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => onNav?.("report")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 py-2 text-sm font-semibold hover:bg-white/30"
          >
            <Printer size={14} /> View Report Card
          </button>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={UserCheck} label="Attendance" value={`${pct}%`} color={pct >= 75 ? "green" : pct >= 50 ? "amber" : "red"} />
            <StatCard icon={Award} label="Avg Marks" value={`${avgM}%`} color="blue" />
            <StatCard icon={Wallet} label="Fee" value={fee?.status || "-"} color={fee?.status === "Paid" ? "green" : "amber"} />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">Attendance Progress</h3>
            <ProgressBar value={pct} color={pct >= 75 ? "#16a34a" : pct >= 50 ? "#f59e0b" : "#ef4444"} />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>{attendance.filter((a) => a.status === "Present").length} Present</span>
              <span>{attendance.filter((a) => a.status === "Absent").length} Absent</span>
              <span>{attendance.length} Total</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-3 text-sm font-bold text-gray-700 dark:text-gray-300">Performance by Subject</h3>
            {marks.length ? (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={marks.map((m) => ({
                    subject: String(m.subject || "").slice(0, 6),
                    pct: m.total ? Math.round((m.obtained / m.total) * 100) : 0,
                  }))}
                  barSize={28}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Bar dataKey="pct" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-4 text-center text-sm text-gray-400">No marks recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
