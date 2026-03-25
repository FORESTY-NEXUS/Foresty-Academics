import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../../../../Backend/lib/models/Admin";

export function getAdminContext(req) {
  if (!process.env.JWT_SECRET) {
    return { error: "JWT secret is not configured", status: 500 };
  }

  const token = req.cookies.get("adminToken")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return { error: "Invalid or expired token", status: 401 };
  }

  if (!payload?.id || payload.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  const adminId = typeof payload.id === "string" ? payload.id : payload.id?.toString?.();
  const instituteId =
    typeof payload.instituteId === "string"
      ? payload.instituteId
      : payload.instituteId?.toString?.();

  if (!adminId || !instituteId) {
    return { error: "Invalid admin token context", status: 401 };
  }

  if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(instituteId)) {
    return { error: "Invalid admin token context", status: 401 };
  }

  return {
    adminObjectId: new mongoose.Types.ObjectId(adminId),
    instituteObjectId: new mongoose.Types.ObjectId(instituteId),
  };
}

export async function getAdmin(auth) {
  const admin = await Admin.findOne({
    _id: auth.adminObjectId,
    instituteId: auth.instituteObjectId,
    isActive: true,
  })
    .select("-password")
    .lean();

  if (!admin) {
    return { error: "Admin not found", status: 404 };
  }

  return { admin };
}
