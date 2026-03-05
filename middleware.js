import { NextResponse } from "next/server";

function base64UrlToUint8Array(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(parts[1]));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

async function verifyHs256Jwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlToUint8Array(signatureB64);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify("HMAC", key, signature, data);
  if (!valid) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // exp is seconds since epoch in JWT spec.
  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return payload;
}

function unauthorized(request, message = "Unauthorized", status = 401) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ success: false, message }, { status });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const jwtSecret = process.env.JWT_SECRET;

  const isPublicAuthRoute =
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/register" ||
    pathname === "/api/teacher/login" ||
    pathname === "/api/student/login";

  if (isPublicAuthRoute) {
    return NextResponse.next();
  }

  if (!jwtSecret) {
    return unauthorized(request, "JWT secret is not configured", 500);
  }

  const isAdminRoute =
    pathname.startsWith("/admin/") ||
    pathname === "/admin" ||
    pathname.startsWith("/api/admin/");

  const isTeacherRoute =
    pathname.startsWith("/teacher/") ||
    pathname === "/teacher" ||
    pathname.startsWith("/api/teacher/");
  const isTeacherApiRoute = pathname.startsWith("/api/teacher/");

  const isStudentRoute =
    pathname.startsWith("/student/") ||
    pathname === "/student" ||
    pathname.startsWith("/api/student/");

  if (isAdminRoute) {
    const token = request.cookies.get("adminToken")?.value;
    if (!token) return unauthorized(request);

    const payload = await verifyHs256Jwt(token, jwtSecret);
    if (!payload) return unauthorized(request, "Invalid or expired token");

    if (payload.role !== "admin") {
      return unauthorized(request, "Forbidden", 403);
    }
  }

  if (isTeacherRoute) {
    const teacherToken = request.cookies.get("teacherToken")?.value;
    const adminToken = request.cookies.get("adminToken")?.value;

    if (teacherToken) {
      const payload = await verifyHs256Jwt(teacherToken, jwtSecret);
      if (!payload) return unauthorized(request, "Invalid or expired token");

      if (payload.role !== "teacher") {
        return unauthorized(request, "Forbidden", 403);
      }
    } else if (!isTeacherApiRoute && adminToken) {
      const payload = await verifyHs256Jwt(adminToken, jwtSecret);
      if (!payload) return unauthorized(request, "Invalid or expired token");

      if (payload.role !== "admin") {
        return unauthorized(request, "Forbidden", 403);
      }
    } else {
      return unauthorized(request);
    }
  }

  if (isStudentRoute) {
    const token = request.cookies.get("studentToken")?.value;
    if (!token) return unauthorized(request);

    const payload = await verifyHs256Jwt(token, jwtSecret);
    if (!payload) return unauthorized(request, "Invalid or expired token");

    if (payload.role !== "student") {
      return unauthorized(request, "Forbidden", 403);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/teacher/:path*",
    "/api/student/:path*",
  ],
};
