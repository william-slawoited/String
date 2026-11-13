import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session && isAdminEmail(session.user.email) ? session : null;
}
