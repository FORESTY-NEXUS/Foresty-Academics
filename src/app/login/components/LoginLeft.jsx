"use client"
import Script from "next/script";
import React from "react";

const LoginLeft = () => {
  return (
    <div className="h-screen not-lg:hidden w-1/2 flex flex-col justify-center items-center gap-4 text-start  ">
      <Script src="https://cdn.lordicon.com/lordicon.js" strategy="afterInteractive" />
      <div>
        <h1 className="text-4xl  poppins-extrabold text-white">FORESTY ACADEMICS</h1>
        <p className="text-green-600 ">Institute Management System</p>
      </div>
      <div className="mt-4">
        <h1 className="text-3xl  poppins-extrabold">Digitalizing Management</h1>
        <h1 className="text-green-600 text-2xl poppins-extrabold">
          Simplifying Management
        </h1>
        <p className="text-white opacity-70 text-start">
          A platform for Admins,Teachers and Students to<br></br> track their
          progress and achieve their excellence
        </p>
      </div>

      <div className="flex gap-4">
        <div className="admin ">
          <lord-icon
            src="https://cdn.lordicon.com/kdduutaw.json"
            trigger="hover"
            stroke="bold"
            colors="primary:#FFF,secondary:#109121"
            style={{ width: "120px", height: "120px" }}
          ></lord-icon>
          <h1 className="text-center font-bold text-lg text-green-600">ADMIN</h1>
          <p className="text-center">
            full controls<br></br> and analytics
          </p>
        </div>
        <div className="teacher mt-3 ">
          <lord-icon
    src="https://cdn.lordicon.com/rrbmabsx.json"
    trigger="hover"
    stroke="regular"
    colors="primary:#FFF,secondary:#109121"
    style={{ width: "110px", height: "110px" }}>
</lord-icon>
          <h1 className="text-center font-bold text-lg text-green-600">TEACHER</h1>
          <p className="text-center">
            Manage your<br></br> class
          </p>
        </div>
        <div className="student   ">
          <lord-icon
    src="https://cdn.lordicon.com/vvyxyrur.json"
    trigger="hover"
    stroke="bold"
    colors="primary:#FFF,secondary:#109121"
     style={{ width: "120px", height: "120px" }}
   >
</lord-icon>
          <h1 className="text-center font-bold text-lg text-green-600">STUDENT</h1>
          <p className="text-center">
            Track your<br></br> progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeft;
