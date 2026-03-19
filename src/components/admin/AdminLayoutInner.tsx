"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";

const authRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-theme flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
