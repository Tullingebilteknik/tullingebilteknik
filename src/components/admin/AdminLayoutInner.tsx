"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminSidebar } from "./AdminSidebar";

const authRoutes = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: true },
        },
      })
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="admin-theme flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
