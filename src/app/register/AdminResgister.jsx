"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import bgImg from "../images/bg-image.png";

/* ─── constants ─── */
const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  instituteName: "",
  phone: "",
  location: "",
};

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 60;
const OTP_EXPIRY_S = 10 * 60; // 10 minutes

/* ─── helpers ─── */
function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email";
  if (!form.password) errors.password = "Password is required";
  if (form.password && form.password.length < 8)
    errors.password = "Password must be at least 8 characters";
  if (!form.confirmPassword) errors.confirmPassword = "Confirm your password";
  if (form.confirmPassword && form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  if (!form.instituteName.trim())
    errors.instituteName = "Institute name is required";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone))
    errors.phone = "Enter a valid phone";
  if (!form.location.trim()) errors.location = "Location is required";
  return errors;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ─── background wrapper ─── */
function BgShell({ children }) {
  return (
    <div className="relative min-h-dvh flex items-center justify-center px-4 py-10">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
      <div className="pointer-events-none absolute -top-16 left-1/2 z-0 h-48 w-48 -translate-x-1/2 rounded-full bg-green-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-6 z-0 h-64 w-64 rounded-[32%] bg-emerald-300/15 blur-3xl rotate-12" />
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[520px] w-[520px] rounded-full bg-green-500/10 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════ */
export default function ForestryAdminRegister() {
  const router = useRouter();

  /* ─── form state ─── */
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ─── flow state: "form" → "otp" → "done" ─── */
  const [step, setStep] = useState("form");

  /* ─── OTP state ─── */
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const [otpError, setOtpError] = useState("");

  /* ─── loading flags ─── */
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  /* ─── generic error ─── */
  const [submitError, setSubmitError] = useState("");

  /* ─── countdown timers ─── */
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiry, setOtpExpiry] = useState(0);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(
      () => setResendCooldown((p) => Math.max(0, p - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [resendCooldown]);

  // OTP expiry ticker
  useEffect(() => {
    if (otpExpiry <= 0) return;
    const id = setInterval(() => setOtpExpiry((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [otpExpiry]);

  /* ─── field setter ─── */
  const setField = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (submitError) setSubmitError("");
  };

  /* ─── Send OTP ─── */
  const sendOtp = useCallback(
    async (isResend = false) => {
      if (!isResend) {
        const nextErrors = validate(form);
        if (Object.keys(nextErrors).length) {
          setErrors(nextErrors);
          return;
        }
      }

      setSendingOtp(true);
      setSubmitError("");
      setOtpError("");

      try {
        const res = await fetch("/api/admin/register/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || json?.message || "Failed to send OTP");
        }

        setStep("otp");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        setResendCooldown(RESEND_COOLDOWN_S);
        setOtpExpiry(OTP_EXPIRY_S);

        // Auto-focus first input after transition
        setTimeout(() => inputRefs.current[0]?.focus(), 120);
      } catch (err) {
        setSubmitError(err?.message || "Failed to send OTP");
      } finally {
        setSendingOtp(false);
      }
    },
    [form],
  );

  /* ─── OTP digit input handlers ─── */
  const handleOtpChange = (index, value) => {
    if (otpError) setOtpError("");
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    setOtpDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      return next;
    });
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const otpValue = otpDigits.join("");
  const otpComplete = otpValue.length === OTP_LENGTH;

  /* ─── Verify OTP + Register ─── */
  const verifyAndRegister = useCallback(async () => {
    if (!otpComplete) {
      setOtpError("Please enter the full 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");
    setSubmitError("");

    try {
      // Step 1: Verify OTP
      const verifyRes = await fetch("/api/admin/register/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          otp: otpValue,
        }),
      });
      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyJson?.message || "OTP verification failed");
      }

      // Step 2: Create account
      setVerifyingOtp(false);
      setRegistering(true);

      const regRes = await fetch("/api/admin/register", {
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
      const regJson = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regJson?.message || "Failed to create account");
      }

      setStep("done");
    } catch (err) {
      setOtpError(err?.message || "Verification failed");
    } finally {
      setVerifyingOtp(false);
      setRegistering(false);
    }
  }, [form, otpValue, otpComplete]);

  /* ═════════════════════════════════
     Step 3 — Success
     ═════════════════════════════════ */
  if (step === "done") {
    return (
      <BgShell>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-green-100 bg-white p-7 shadow-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900">
            Admin account created
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Registration completed for{" "}
            <span className="font-semibold">{form.email}</span>.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </BgShell>
    );
  }

  /* ═════════════════════════════════
     Step 2 — OTP Verification
     ═════════════════════════════════ */
  if (step === "otp") {
    return (
      <BgShell>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-green-900 bg-gray-800/0 p-6 sm:p-8 shadow-2xl text-white backdrop-blur-md animate-fade-up">
          {/* Back button */}
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setOtpDigits(Array(OTP_LENGTH).fill(""));
              setOtpError("");
              setSubmitError("");
            }}
            className="mb-4 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to form
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-700/30 border border-green-500/30">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-400">
              Verify Your Email
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-white">{form.email}</span>
            </p>
          </div>

          {/* OTP Inputs */}
          <div
            className="flex justify-center gap-2 sm:gap-3 mb-2"
            onPaste={handleOtpPaste}
          >
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`
                  h-13 w-11 sm:h-14 sm:w-12 rounded-xl border text-center text-xl font-bold
                  bg-white/10 text-white outline-none transition-all
                  focus:border-green-400 focus:ring-2 focus:ring-green-300/40
                  ${otpError ? "border-red-400/60" : "border-white/15"}
                `}
              />
            ))}
          </div>

          {/* Error */}
          {otpError && (
            <p className="text-center text-xs text-red-400 mt-2">{otpError}</p>
          )}

          {/* Expiry countdown */}
          {otpExpiry > 0 && (
            <p className="text-center text-xs text-gray-500 mt-3">
              Code expires in{" "}
              <span className="font-semibold text-yellow-400">
                {fmtTime(otpExpiry)}
              </span>
            </p>
          )}
          {otpExpiry === 0 && step === "otp" && (
            <p className="text-center text-xs text-red-400 mt-3">
              OTP expired. Please resend.
            </p>
          )}

          {/* Verify button */}
          <button
            type="button"
            onClick={verifyAndRegister}
            disabled={
              !otpComplete || verifyingOtp || registering || otpExpiry === 0
            }
            className="mt-5 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {verifyingOtp
              ? "Verifying..."
              : registering
                ? "Creating account..."
                : "Verify & Create Account"}
          </button>

          {/* Resend */}
          <div className="mt-4 text-center">
            {resendCooldown > 0 ? (
              <p className="text-xs text-gray-500">
                Resend OTP in{" "}
                <span className="font-semibold text-gray-300">
                  {resendCooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => sendOtp(true)}
                disabled={sendingOtp}
                className="text-xs font-semibold text-green-400 hover:text-green-300 transition-colors disabled:opacity-60"
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </BgShell>
    );
  }

  /* ═════════════════════════════════
     Step 1 — Registration Form
     ═════════════════════════════════ */
  return (
    <BgShell>
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-green-900 bg-gray-800/0 p-6 sm:p-8 shadow-2xl text-white backdrop-blur-md animate-fade-up">
        <h1 className="text-2xl font-bold text-green-700">
          Admin Registration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create your institute admin account
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Full Name
            </span>
            <input
              value={form.fullName}
              onChange={setField("fullName")}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={setField("email")}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
              placeholder="admin@institute.edu"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Password
            </span>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={setField("password")}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 pr-10 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Confirm Password
            </span>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 pr-10 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Institute Name
            </span>
            <input
              value={form.instituteName}
              onChange={setField("instituteName")}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
              placeholder="Institute name"
            />
            {errors.instituteName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.instituteName}
              </p>
            )}
          </label>

          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Phone
            </span>
            <input
              value={form.phone}
              onChange={setField("phone")}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
              placeholder="+92 000 000000"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">
              City / Country
            </span>
            <input
              value={form.location}
              onChange={setField("location")}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/60 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-300/40"
              placeholder="City / Country"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </label>
        </div>

        {submitError && (
          <p className="mt-4 text-sm text-red-600">{submitError}</p>
        )}

        <button
          type="button"
          onClick={() => sendOtp(false)}
          disabled={sendingOtp}
          className="mt-5 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {sendingOtp ? "Sending OTP..." : "Send OTP & Continue"}
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-green-700 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </BgShell>
  );
}
