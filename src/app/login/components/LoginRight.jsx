"use client"
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

const LoginRight = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const tabs = ["Admin", "Teacher", "Student"];
  const router = useRouter();

  useEffect(() => {
    fetch("/api/db-check").catch(() => {});
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setInfo("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password.trim()) {
      setError(activeTab === "Student" ? "Roll number and password are required." : "Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const isTeacherLogin = activeTab === "Teacher";
      const isStudentLogin = activeTab === "Student";
      const endpoint = isStudentLogin ? "/api/student/login" : isTeacherLogin ? "/api/teacher/login" : "/api/admin/login";
      const payload = isStudentLogin
        ? { rollNumber: email.trim(), password: password.trim() }
        : { email: email.trim(), password: password.trim() };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
      }

      if (!response.ok) {
        setError(data?.message || data?.error || "Login failed.");
        return;
      }

      setInfo("Login successful");
      if (isStudentLogin) {
        await router.push("/student");
      } else if (isTeacherLogin) {
        await router.push("/teacher");
      } else {
        await router.push("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full md:w-1/2 flex justify-center items-center">
      <div className="
        border-2 border-white
        shadow-2xl rounded-xl p-8
        w-[90vw] md:w-[400px]
        flex flex-col justify-center items-center gap-5
        backdrop-blur-xl bg-gray-800 text-white
      ">
        <div className="text-center">
          <h1 className="text-2xl font-bold poppins-bold">Welcome Back</h1>
          <p className="opacity-60 text-sm mt-1">Sign in to access your account</p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-4 w-full">
          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  flex-1 border-2 border-green-600 px-4 py-1 rounded
                  cursor-pointer transition-all duration-200 text-sm font-medium
                  ${activeTab === tab
                    ? "bg-green-600 text-white"
                    : "bg-transparent text-white hover:bg-green-600/40"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-3 w-full">
            <input
              type={activeTab === "Student" ? "text" : "email"}
              autoFocus
          
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === "Student" ? "Enter your Roll Number" : "Enter your Email"}
              className="
                w-full rounded border border-gray-600
                bg-gray-700 text-white placeholder-gray-400
                outline-none py-2 px-4
                focus:border-green-500 focus:ring-1 focus:ring-green-500
                transition-all duration-200
              "
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="
                  w-full rounded border border-gray-600
                  bg-gray-700 text-white placeholder-gray-400
                  outline-none py-2 pl-4 pr-10
                  focus:border-green-500 focus:ring-1 focus:ring-green-500
                  transition-all duration-200
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 text-gray-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Feedback messages */}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {info && <p className="text-green-400 text-sm">{info}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="
                bg-green-600 px-6 py-2 w-full rounded font-semibold
                hover:bg-green-700 active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRight;
