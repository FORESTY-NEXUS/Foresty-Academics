import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  };

  response.cookies.set("adminToken", "", cookieOptions);
  response.cookies.set("teacherToken", "", cookieOptions);
  response.cookies.set("studentToken", "", cookieOptions);

  return response;
}

