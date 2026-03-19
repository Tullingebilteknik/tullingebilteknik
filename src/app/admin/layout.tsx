import type { Metadata } from "next";
import { AdminLayoutInner } from "@/components/admin/AdminLayoutInner";

export const metadata: Metadata = {
  title: "Admin | Tullinge Bilteknik",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}
