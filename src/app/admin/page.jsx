import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

const AdminPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token || !process.env.JWT_SECRET) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded !== "object" || decoded?.role !== "admin") {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }

  return (
    <AdminClient />
  );
};

export default AdminPage;
