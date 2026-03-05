import React from "react";
import LoginLeft from "./components/LoginLeft";
import LoginRight from "./components/LoginRight";
import bgImage from "../images/bg-image.png";

const LoginPage = () => {
  return (
    <div
      className="relative flex h-screen w-full bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex h-screen w-full">
      <LoginLeft />
   <div className="h-screen w-full md:w-1/2 flex flex-col justify-center items-center align-middle">
       <div className="block  md:hidden text-center">
        <h1 className="text-4xl  poppins-bold mt-10  text-white">FORESTY ACADEMICS</h1>
        <p className="text-green-600 ">Institute Management System</p>
      </div>
      <LoginRight />
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
