"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import bgImg from '../images/bg-image.png'

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  instituteName: "",
  phone: "",
  location: "",
};

function validate(form, otpVerified) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!otpVerified) errors.otp = "Verify your email with OTP";
  if (!form.password) errors.password = "Password is required";
  if (form.password && form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (!form.confirmPassword) errors.confirmPassword = "Confirm your password";
  if (form.confirmPassword && form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match";
  if (!form.instituteName.trim()) errors.instituteName = "Institute name is required";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone)) errors.phone = "Enter a valid phone";
  if (!form.location.trim()) errors.location = "Location is required";

  return errors;
}

export default function ForestryAdminRegister() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const canSubmit = useMemo(() => !submitting, [submitting]);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (key === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode("");
      setOtpError("");
      if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
    }
    if (submitError) setSubmitError("");
  };

  const sendOtp = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email first" }));
      return;
    }

    setSendingOtp(true);
    setOtpError("");
    try {
      const response = await fetch("/api/admin/register/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.message || "Failed to send OTP");
      }
      setOtpSent(true);
      setOtpVerified(false);
      setOtpCode("");
      setCountdown(60);
    } catch (error) {
      setOtpError(error?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setOtpError("Enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");
    try {
      const response = await fetch("/api/admin/register/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          otp: otpCode,
        }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.message || "Failed to verify OTP");
      }
      setOtpVerified(true);
      setErrors((prev) => ({ ...prev, otp: "" }));
    } catch (error) {
      setOtpVerified(false);
      setOtpError(error?.message || "Failed to verify OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onSubmit = async () => {
    const nextErrors = validate(form, otpVerified);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          instituteName: form.instituteName.trim(),
          phone: form.phone.trim(),
          location: form.location.trim(),
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.message || "Failed to register admin");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error?.message || "Failed to register admin");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4 py-10" style={{ backgroundImage: `url(${bgImg.src})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-7 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900">Admin account created</h2>
          <p className="mt-2 text-sm text-gray-600">
            Registration completed for <span className="font-semibold">{form.email}</span>.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-8" style={{ backgroundImage: `url(${bgImg.src})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="w-full max-w-xl rounded-3xl border border-green-100 bg-white p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-green-900">Admin Registration</h1>
        <p className="mt-1 text-sm text-gray-500">Create your institute admin account</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Full Name</span>
            <input value={form.fullName} onChange={setField("fullName")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Your full name" />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Email</span>
            <div className="flex gap-2">
              <input type="email" value={form.email} onChange={setField("email")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="admin@institute.edu" />
              <button type="button" onClick={sendOtp} disabled={sendingOtp || otpVerified || countdown > 0} className="rounded-xl bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed">
                {sendingOtp ? "Sending..." : otpVerified ? "Verified" : countdown > 0 ? `${countdown}s` : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </label>

          {otpSent && !otpVerified && (
            <label className="sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">OTP</span>
              <div className="flex gap-2">
                <input value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm tracking-[0.3em] outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="000000" />
                <button type="button" onClick={verifyOtp} disabled={verifyingOtp || otpCode.length !== 6} className="rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-60 disabled:cursor-not-allowed">
                  {verifyingOtp ? "Verifying..." : "Verify"}
                </button>
              </div>
              {otpError && <p className="mt-1 text-xs text-red-500">{otpError}</p>}
              {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
            </label>
          )}

          {otpVerified && (
            <div className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 font-medium">
              Email verified successfully.
            </div>
          )}

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</span>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={form.password} onChange={setField("password")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{showPass ? "Hide" : "Show"}</button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Confirm Password</span>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={setField("confirmPassword")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Repeat password" />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{showConfirm ? "Hide" : "Show"}</button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Institute Name</span>
            <input value={form.instituteName} onChange={setField("instituteName")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="Institute name" />
            {errors.instituteName && <p className="mt-1 text-xs text-red-500">{errors.instituteName}</p>}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Phone</span>
            <input value={form.phone} onChange={setField("phone")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="+92 000 000000" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">City / Country</span>
            <input value={form.location} onChange={setField("location")} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" placeholder="City / Country" />
            {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
          </label>
        </div>

        {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="mt-5 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating account..." : "Create Admin Account"}
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-green-700 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
